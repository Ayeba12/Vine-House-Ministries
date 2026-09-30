<?php
/**
 * The designed email every attendee receives: the website's visual system in
 * the narrow grammar email clients allow.
 *
 * Tables for layout and inline styles throughout, because Gmail and Outlook
 * strip or ignore most of a stylesheet. Colours are the design tokens from
 * the site's globals.css, written as hex. The display face is Anton with
 * Impact behind it, the body face DM Sans with the system sans behind it;
 * clients that block web fonts fall back and the layout holds.
 *
 * A plain-text version of the same message always travels alongside, set as
 * the alternative body in Vine_Events_Mail.
 */

defined( 'ABSPATH' ) || exit;

final class Vine_Events_Email {

	// Design tokens (DESIGN.md §2.3), resolved to hex. Hairlines are the rgba tokens flattened onto their ground.
	private const SURFACE          = '#F9F7F2';
	private const SURFACE_RAISED   = '#FFFFFF';
	private const SURFACE_TINT     = '#F3EFE6';
	private const SURFACE_DARK     = '#2C3E2D';
	private const SURFACE_DEEP     = '#1E242B';
	private const INK              = '#1E242B';
	private const INK_STRONG       = '#2C3E2D';
	private const INK_MUTED        = '#5E6D5B';
	private const ACCENT           = '#9B6530';
	private const INK_ON_DARK      = '#F9F7F2';
	private const INK_ON_DARK_MUTE = '#B2BDB0';
	private const ACCENT_ON_DARK   = '#D4A373';
	private const HAIRLINE         = '#D2D6CC';
	private const HAIRLINE_DARK    = '#56573F';

	private const DISPLAY = "'Anton', Impact, 'Haettenschweiler', 'Arial Narrow Bold', sans-serif";
	private const BODY    = "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

	/**
	 * @param array{
	 *   preheader: string,
	 *   eyebrow: string,
	 *   heading: string,
	 *   greeting: string,
	 *   paragraphs: string[],
	 *   facts: array<string, string>,
	 *   pass?: array{code: string, corner: string, note: string, released?: bool}|null,
	 *   button?: array{label: string, url: string, intro: string}|null,
	 *   image?: string,
	 *   image_alt?: string,
	 *   site_url: string,
	 *   office_email: string,
	 *   charity_number?: string,
	 *   footer_note: string,
	 * } $m The message. Every string is plain text; this method escapes.
	 */
	public static function render( array $m ): string {
		$e    = static fn( string $s ): string => esc_html( $s );
		$site = rtrim( $m['site_url'], '/' );

		ob_start();
		?>
<!DOCTYPE html>
<html lang="en-GB" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title><?php echo $e( $m['heading'] ); ?></title>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
	body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
	img { border: 0; display: block; max-width: 100%; height: auto; }
	a { color: <?php echo self::INK_STRONG; ?>; }
	@media (max-width: 620px) {
		.vh-outer { padding: 0 !important; }
		.vh-card { border-radius: 0 !important; border-left: 0 !important; border-right: 0 !important; }
		.vh-pad { padding-left: 22px !important; padding-right: 22px !important; }
		.vh-heading { font-size: 32px !important; }
		.vh-code { font-size: 34px !important; }
	}
</style>
</head>
<body style="margin:0;padding:0;background:<?php echo self::SURFACE_TINT; ?>;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;"><?php echo $e( $m['preheader'] ); ?></div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:<?php echo self::SURFACE_TINT; ?>;">
<tr><td class="vh-outer" align="center" style="padding:28px 12px;">

	<table role="presentation" class="vh-card" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:<?php echo self::SURFACE; ?>;border:1px solid <?php echo self::HAIRLINE; ?>;border-radius:12px;overflow:hidden;">

		<?php // ---- masthead ------------------------------------------------ ?>
		<tr><td class="vh-pad" style="background:<?php echo self::SURFACE_DARK; ?>;padding:20px 32px;">
			<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
				<td style="padding-right:12px;vertical-align:middle;">
					<img src="<?php echo esc_url( $site . '/brand/vine-house-emblem-gold.png' ); ?>" width="34" height="34" alt="" style="width:34px;height:34px;">
				</td>
				<td style="vertical-align:middle;font-family:<?php echo self::DISPLAY; ?>;font-size:20px;line-height:1;letter-spacing:0.02em;text-transform:uppercase;color:<?php echo self::INK_ON_DARK; ?>;">
					<a href="<?php echo esc_url( $site . '/' ); ?>" style="color:<?php echo self::INK_ON_DARK; ?>;text-decoration:none;">Vine House Ministries</a>
				</td>
			</tr></table>
		</td></tr>

		<?php // ---- photograph ---------------------------------------------- ?>
		<?php if ( ! empty( $m['image'] ) ) : ?>
		<tr><td style="background:<?php echo self::SURFACE_DEEP; ?>;line-height:0;font-size:0;">
			<img src="<?php echo esc_url( $m['image'] ); ?>" width="600" alt="<?php echo esc_attr( $m['image_alt'] ?? '' ); ?>" style="width:100%;max-width:600px;height:auto;">
		</td></tr>
		<?php endif; ?>

		<?php // ---- the message --------------------------------------------- ?>
		<tr><td class="vh-pad" style="padding:36px 32px 8px;">
			<p style="margin:0;font-family:<?php echo self::BODY; ?>;font-size:12px;line-height:1.5;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:<?php echo self::ACCENT; ?>;">
				<span style="display:inline-block;width:28px;border-top:1px solid <?php echo self::ACCENT; ?>;vertical-align:middle;margin-right:10px;line-height:0;font-size:0;">&nbsp;</span><?php echo $e( $m['eyebrow'] ); ?>
			</p>
			<h1 class="vh-heading" style="margin:14px 0 0;font-family:<?php echo self::DISPLAY; ?>;font-weight:400;font-size:38px;line-height:1.08;color:<?php echo self::INK_STRONG; ?>;">
				<?php echo $e( $m['heading'] ); ?>
			</h1>
			<p style="margin:22px 0 0;font-family:<?php echo self::BODY; ?>;font-size:16px;line-height:1.6;color:<?php echo self::INK; ?>;">
				<?php echo $e( $m['greeting'] ); ?>
			</p>
			<?php foreach ( $m['paragraphs'] as $paragraph ) : ?>
			<p style="margin:12px 0 0;font-family:<?php echo self::BODY; ?>;font-size:16px;line-height:1.6;color:<?php echo self::INK; ?>;">
				<?php echo $e( $paragraph ); ?>
			</p>
			<?php endforeach; ?>
		</td></tr>

		<?php // ---- the pass, or the facts on a light tile ------------------ ?>
		<tr><td class="vh-pad" style="padding:22px 32px 0;">
			<?php if ( ! empty( $m['pass'] ) ) : ?>
			<?php $released = ! empty( $m['pass']['released'] ); ?>
			<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:<?php echo self::SURFACE_DARK; ?>;border-radius:12px;">
				<tr><td style="padding:24px 24px 0;">
					<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
						<td style="vertical-align:top;">
							<p style="margin:0;font-family:<?php echo self::DISPLAY; ?>;font-size:18px;line-height:1.2;color:<?php echo self::INK_ON_DARK; ?>;">Vine House Ministries</p>
							<p style="margin:2px 0 0;font-family:<?php echo self::BODY; ?>;font-size:13px;line-height:1.5;color:<?php echo self::INK_ON_DARK_MUTE; ?>;">Sanctuary pass</p>
						</td>
						<td align="right" style="vertical-align:top;font-family:<?php echo self::BODY; ?>;font-size:13px;line-height:1.5;color:<?php echo self::INK_ON_DARK_MUTE; ?>;white-space:nowrap;">
							<?php echo $e( $m['pass']['corner'] ); ?>
						</td>
					</tr></table>
				</td></tr>
				<tr><td style="padding:16px 24px 0;"><div style="border-top:1px solid <?php echo self::HAIRLINE_DARK; ?>;line-height:0;font-size:0;">&nbsp;</div></td></tr>
				<tr><td style="padding:18px 24px 0;">
					<p class="vh-code" style="margin:0;font-family:<?php echo self::DISPLAY; ?>;font-size:42px;line-height:1.1;letter-spacing:0.02em;color:<?php echo $released ? self::INK_ON_DARK_MUTE : self::ACCENT_ON_DARK; ?>;<?php echo $released ? 'text-decoration:line-through;' : ''; ?>">
						<?php echo $e( $m['pass']['code'] ); ?>
					</p>
				</td></tr>
				<tr><td style="padding:16px 24px 0;">
					<table role="presentation" cellpadding="0" cellspacing="0" border="0">
						<?php foreach ( $m['facts'] as $label => $value ) : ?>
						<tr>
							<td style="padding:2px 22px 2px 0;vertical-align:top;font-family:<?php echo self::BODY; ?>;font-size:13px;line-height:1.5;color:<?php echo self::INK_ON_DARK_MUTE; ?>;white-space:nowrap;"><?php echo $e( $label ); ?></td>
							<td style="padding:2px 0;vertical-align:top;font-family:<?php echo self::BODY; ?>;font-size:13px;line-height:1.5;color:<?php echo self::INK_ON_DARK; ?>;"><?php echo $e( $value ); ?></td>
						</tr>
						<?php endforeach; ?>
					</table>
				</td></tr>
				<tr><td style="padding:18px 24px 0;"><div style="border-top:1px solid <?php echo self::HAIRLINE_DARK; ?>;line-height:0;font-size:0;">&nbsp;</div></td></tr>
				<tr><td style="padding:14px 24px 22px;font-family:<?php echo self::BODY; ?>;font-size:13px;line-height:1.5;color:<?php echo self::INK_ON_DARK_MUTE; ?>;">
					<?php echo $e( $m['pass']['note'] ); ?>
				</td></tr>
			</table>
			<?php else : ?>
			<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:<?php echo self::SURFACE_RAISED; ?>;border:1px solid <?php echo self::HAIRLINE; ?>;border-radius:12px;">
				<tr><td style="padding:20px 24px;">
					<table role="presentation" cellpadding="0" cellspacing="0" border="0">
						<?php foreach ( $m['facts'] as $label => $value ) : ?>
						<tr>
							<td style="padding:3px 22px 3px 0;vertical-align:top;font-family:<?php echo self::BODY; ?>;font-size:13px;line-height:1.5;color:<?php echo self::INK_MUTED; ?>;white-space:nowrap;"><?php echo $e( $label ); ?></td>
							<td style="padding:3px 0;vertical-align:top;font-family:<?php echo self::BODY; ?>;font-size:13px;line-height:1.5;color:<?php echo self::INK; ?>;"><?php echo $e( $value ); ?></td>
						</tr>
						<?php endforeach; ?>
					</table>
				</td></tr>
			</table>
			<?php endif; ?>
		</td></tr>

		<?php // ---- the one action ------------------------------------------ ?>
		<?php if ( ! empty( $m['button'] ) ) : ?>
		<tr><td class="vh-pad" style="padding:26px 32px 0;">
			<p style="margin:0 0 14px;font-family:<?php echo self::BODY; ?>;font-size:16px;line-height:1.6;color:<?php echo self::INK; ?>;">
				<?php echo $e( $m['button']['intro'] ); ?>
			</p>
			<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
				<td style="background:<?php echo self::SURFACE_DARK; ?>;border-radius:12px;">
					<a href="<?php echo esc_url( $m['button']['url'] ); ?>" style="display:inline-block;padding:15px 24px;font-family:<?php echo self::BODY; ?>;font-size:13px;line-height:1;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;color:<?php echo self::INK_ON_DARK; ?>;">
						<?php echo $e( $m['button']['label'] ); ?> &nbsp;&#8599;
					</a>
				</td>
			</tr></table>
		</td></tr>
		<?php endif; ?>

		<?php // ---- sign-off ------------------------------------------------ ?>
		<tr><td class="vh-pad" style="padding:30px 32px 36px;">
			<p style="margin:0;font-family:<?php echo self::BODY; ?>;font-size:16px;line-height:1.6;color:<?php echo self::INK; ?>;">With every blessing,</p>
			<p style="margin:4px 0 0;font-family:<?php echo self::DISPLAY; ?>;font-size:20px;line-height:1.2;color:<?php echo self::INK_STRONG; ?>;">Vine House Ministries</p>
		</td></tr>

		<?php // ---- footer -------------------------------------------------- ?>
		<tr><td class="vh-pad" style="background:<?php echo self::SURFACE_DEEP; ?>;padding:24px 32px 26px;">
			<p style="margin:0;font-family:<?php echo self::BODY; ?>;font-size:12px;line-height:1.5;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:<?php echo self::ACCENT_ON_DARK; ?>;">The sanctuary</p>
			<p style="margin:8px 0 0;font-family:<?php echo self::BODY; ?>;font-size:13px;line-height:1.6;color:<?php echo self::INK_ON_DARK_MUTE; ?>;">
				<?php echo $e( $m['footer_note'] ); ?>
			</p>
			<p style="margin:12px 0 0;font-family:<?php echo self::BODY; ?>;font-size:13px;line-height:1.6;color:<?php echo self::INK_ON_DARK_MUTE; ?>;">
				<a href="mailto:<?php echo esc_attr( $m['office_email'] ); ?>" style="color:<?php echo self::INK_ON_DARK; ?>;text-decoration:underline;"><?php echo $e( $m['office_email'] ); ?></a>
				&nbsp;&middot;&nbsp;
				<a href="<?php echo esc_url( $site . '/events' ); ?>" style="color:<?php echo self::INK_ON_DARK; ?>;text-decoration:underline;">Upcoming events</a>
				&nbsp;&middot;&nbsp;
				<a href="<?php echo esc_url( $site . '/privacy' ); ?>" style="color:<?php echo self::INK_ON_DARK; ?>;text-decoration:underline;">Privacy</a>
			</p>
			<?php if ( ! empty( $m['charity_number'] ) ) : ?>
			<p style="margin:12px 0 0;font-family:<?php echo self::BODY; ?>;font-size:12px;line-height:1.5;color:<?php echo self::INK_ON_DARK_MUTE; ?>;">
				Registered charity no. <?php echo $e( $m['charity_number'] ); ?>, England &amp; Wales
			</p>
			<?php endif; ?>
		</td></tr>

	</table>

</td></tr>
</table>
</body>
</html>
		<?php
		return (string) ob_get_clean();
	}
}
