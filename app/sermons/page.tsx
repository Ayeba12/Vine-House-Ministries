import { getSermons } from '@/lib/wordpress';
import { SermonsView } from './SermonsView';

export const revalidate = 300;

export default async function SermonsPage() {
  const sermons = await getSermons();
  return <SermonsView sermons={sermons} />;
}
