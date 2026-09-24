import { getEvents } from '@/lib/wordpress';
import { EventsView } from './EventsView';

export const revalidate = 300;

export default async function EventsPage() {
  const events = await getEvents();
  return <EventsView events={events} />;
}
