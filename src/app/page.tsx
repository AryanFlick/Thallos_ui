import Hero from '@/components/Home/Hero';
import { BentoGridDemo } from '@/components/BentoGrid/BentoGridDemo';
import OnchainTradersSection from '@/components/Home/OnchainTradersSection';
import StrategiesSection from '@/components/Home/StrategiesSection';
import FAQSection from '@/components/Home/FAQSection';
import CallToAction from '@/components/Home/CallToAction';
import Footer from '@/components/Home/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Bento Grid Section */}
      <BentoGridDemo />

      {/* Onchain Traders Section */}
      <OnchainTradersSection />

      {/* Strategies Section */}
      <StrategiesSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Call to Action */}
      <CallToAction />

      {/* Footer with Box Split Animation */}
      <Footer />
    </main>
  );
}
