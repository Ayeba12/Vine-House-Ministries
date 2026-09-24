import { getEvents, getGatherings, getSermons, getSiteSettings, getTestimonials } from '@/lib/wordpress';
import { HomeView } from './HomeView';

export const revalidate = 300;

export default async function HomePage() {
  const [sermons, events, gatherings, testimonials, settings] = await Promise.all([
    getSermons(),
    getEvents(),
    getGatherings(),
    getTestimonials(),
    getSiteSettings(),
  ]);
  return <HomeView sermons={sermons} events={events} gatherings={gatherings} testimonials={testimonials} settings={settings} />;
}
