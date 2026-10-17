import Link from 'next/link';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import './not-found.css';

export const metadata = {
  title: 'Page not found',
  robots: { index: false },
};

const SUGGESTIONS = [
  { href: '/blog/how-to-stop-doom-scrolling', label: 'How to stop doomscrolling' },
  { href: '/focus-web', label: 'Focus Web: block Reels and Shorts' },
  { href: '/compare', label: 'Compare screen time apps' },
  { href: '/blog', label: 'All blog posts' },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="not-found">
        <img src="/images/spooli_point.png" alt="" width="120" height="120" />
        <h1>We couldn&apos;t find that page</h1>
        <p>The link may be old or mistyped. Here are some good places to start:</p>
        <ul>
          {SUGGESTIONS.map((s) => (
            <li key={s.href}>
              <Link href={s.href}>{s.label}</Link>
            </li>
          ))}
        </ul>
        <Link href="/" className="not-found-home">Back to the homepage</Link>
      </main>
      <Footer />
    </>
  );
}
