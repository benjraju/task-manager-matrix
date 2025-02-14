import Hero from './components/landing/Hero';
import Features from './components/landing/Features';
import Testimonials from './components/landing/Testimonials';

export default function Home() {
  return (
    <main className="bg-white">
      <Hero />
      <Features />
      <Testimonials />
    </main>
  );
}
