import { redirect } from 'next/navigation';

export default function Home() {
  // Always send visitors to the static homepage.
  redirect('/w1w-homepage-index.html');
}
