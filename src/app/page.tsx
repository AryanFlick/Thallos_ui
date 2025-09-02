import Hero from '@/components/Home/Hero';
import OverviewSection from '@/components/Home/OverviewSection';
import ThallosAgentSection from '@/components/Home/ThallosAgentSection';
import WhyGoBeyond from '@/components/WhyGoBeyond';
import StrategiesSection from '@/components/Home/StrategiesSection';
import BlogSection from '@/components/Home/BlogSection';
import FAQSection from '@/components/Home/FAQSection';
import CallToAction from '@/components/Home/CallToAction';
import Footer from '@/components/Home/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Why Go Beyond Section */}
      <WhyGoBeyond />

      {/* Overview Section */}
      <OverviewSection />

      {/* Thallos Agent Section */}
      <ThallosAgentSection />

      {/* Strategies Section */}
      <StrategiesSection />

      {/* Blog Section */}
      <BlogSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Call to Action */}
      <CallToAction />

      {/* Footer with Box Split Animation */}
      <Footer />
    </main>
  );
}
