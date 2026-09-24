import { notFound } from 'next/navigation';
import { getMessages } from '@/lib/wordpress';
import { MessageView } from './MessageView';

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const messages = await getMessages();
  return messages.map((message) => ({ slug: message.slug }));
}

export default async function MessagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const messages = await getMessages();
  const index = messages.findIndex((message) => message.slug === slug);
  if (index === -1) notFound();
  return (
    <MessageView
      post={messages[index]}
      newer={messages[index - 1]}
      older={messages[index + 1]}
      more={messages.filter((message) => message.slug !== slug).slice(0, 3)}
    />
  );
}
