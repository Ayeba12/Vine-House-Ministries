import { getMessages } from '@/lib/wordpress';
import { MessagesView } from './MessagesView';

export const revalidate = 300;

export default async function MessagesPage() {
  const messages = await getMessages();
  return <MessagesView messages={messages} />;
}
