<?php
/**
 * Plugin Name: Vine House Content
 * Description: Content model for the Vine House Ministries headless site — sermons, gatherings and testimonials, exposed through WPGraphQL. Events live in Vine House Events.
 * Version: 0.2.0
 * Requires at least: 6.4
 * Requires PHP: 8.1
 * Author: Vine House Ministries
 * License: GPL-2.0-or-later
 * Text Domain: vine-house-content
 */

defined( 'ABSPATH' ) || exit;

define( 'VINE_CONTENT_VERSION', '0.2.0' );
define( 'VINE_CONTENT_DIR', plugin_dir_path( __FILE__ ) );

/**
 * Post types.
 *
 * Every type is public so it can be queried, but has no single or archive
 * template of its own: the Next.js frontend owns every URL. `has_archive`
 * false and `publicly_queryable` false keep WordPress from serving HTML.
 */
function vine_content_register_post_types(): void {
	$shared = array(
		'public'             => true,
		'publicly_queryable' => false,
		'has_archive'        => false,
		'show_ui'            => true,
		'show_in_rest'       => true,
		'show_in_graphql'    => true,
		'menu_position'      => 20,
		'supports'           => array( 'title', 'editor', 'thumbnail', 'excerpt', 'revisions' ),
	);

	register_post_type(
		'sermon',
		array_merge(
			$shared,
			array(
				'label'               => __( 'Sermons', 'vine-house-content' ),
				'labels'              => array(
					'singular_name' => __( 'Sermon', 'vine-house-content' ),
					'add_new_item'  => __( 'Add New Sermon', 'vine-house-content' ),
				),
				'menu_icon'           => 'dashicons-microphone',
				'graphql_single_name' => 'sermon',
				'graphql_plural_name' => 'sermons',
				'taxonomies'          => array( 'sermon_series', 'sermon_topic' ),
			)
		)
	);

	register_post_type(
		'gathering',
		array_merge(
			$shared,
			array(
				'label'               => __( 'Gatherings', 'vine-house-content' ),
				'labels'              => array(
					'singular_name' => __( 'Gathering', 'vine-house-content' ),
					'add_new_item'  => __( 'Add New Gathering', 'vine-house-content' ),
				),
				'menu_icon'           => 'dashicons-groups',
				'graphql_single_name' => 'gathering',
				'graphql_plural_name' => 'gatherings',
				// The four pillars have a fixed order (01–04); menu_order carries it.
				'supports'            => array( 'title', 'editor', 'thumbnail', 'page-attributes', 'revisions' ),
			)
		)
	);

	register_post_type(
		'testimonial',
		array_merge(
			$shared,
			array(
				'label'               => __( 'Testimonials', 'vine-house-content' ),
				'labels'              => array(
					'singular_name' => __( 'Testimonial', 'vine-house-content' ),
					'add_new_item'  => __( 'Add New Testimonial', 'vine-house-content' ),
				),
				'menu_icon'           => 'dashicons-format-quote',
				'graphql_single_name' => 'testimonial',
				'graphql_plural_name' => 'testimonials',
				// Title = author, content = quote, thumbnail = avatar.
				'supports'            => array( 'title', 'editor', 'thumbnail', 'revisions' ),
			)
		)
	);
}
add_action( 'init', 'vine_content_register_post_types' );

/**
 * Taxonomies. Real taxonomies rather than free-text fields so the frontend
 * can filter in the GraphQL query instead of over a full fetch.
 */
function vine_content_register_taxonomies(): void {
	$shared = array(
		'public'             => true,
		'publicly_queryable' => false,
		'show_ui'            => true,
		'show_admin_column'  => true,
		'show_in_rest'       => true,
		'show_in_graphql'    => true,
	);

	register_taxonomy(
		'sermon_series',
		'sermon',
		array_merge(
			$shared,
			array(
				'label'               => __( 'Series', 'vine-house-content' ),
				'hierarchical'        => true,
				'graphql_single_name' => 'sermonSeries',
				'graphql_plural_name' => 'sermonSeriesList',
			)
		)
	);

	register_taxonomy(
		'sermon_topic',
		'sermon',
		array_merge(
			$shared,
			array(
				'label'               => __( 'Topics', 'vine-house-content' ),
				'hierarchical'        => false,
				'graphql_single_name' => 'sermonTopic',
				'graphql_plural_name' => 'sermonTopics',
			)
		)
	);
}
add_action( 'init', 'vine_content_register_taxonomies' );

function vine_content_activate(): void {
	vine_content_register_post_types();
	vine_content_register_taxonomies();
	flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'vine_content_activate' );
register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );

/**
 * ACF: keep field groups in this plugin as JSON so they are versioned with
 * the code and sync on any install, and register the site-wide options page
 * that carries the notice banner.
 */
add_filter(
	'acf/settings/load_json',
	function ( array $paths ): array {
		$paths[] = VINE_CONTENT_DIR . 'acf-json';
		return $paths;
	}
);

add_filter(
	'acf/settings/save_json',
	function ( string $path ): string {
		return VINE_CONTENT_DIR . 'acf-json';
	}
);

add_action(
	'acf/init',
	function (): void {
		if ( ! function_exists( 'acf_add_options_page' ) ) {
			return;
		}
		acf_add_options_page(
			array(
				'page_title'         => __( 'Site Settings', 'vine-house-content' ),
				'menu_title'         => __( 'Site Settings', 'vine-house-content' ),
				'menu_slug'          => 'vine-site-settings',
				'capability'         => 'manage_options',
				'icon_url'           => 'dashicons-admin-site-alt3',
				'position'           => 25,
				'show_in_graphql'    => true,
				'graphql_field_name' => 'siteSettings',
			)
		);
	}
);

/** Gatherings list in pillar order, so the editor sees what the site shows. */
add_action(
	'pre_get_posts',
	function ( WP_Query $query ): void {
		if ( ! is_admin() || ! $query->is_main_query() ) {
			return;
		}
		if ( 'gathering' === $query->get( 'post_type' ) && ! $query->get( 'orderby' ) ) {
			$query->set( 'orderby', 'menu_order' );
			$query->set( 'order', 'ASC' );
		}
	}
);
