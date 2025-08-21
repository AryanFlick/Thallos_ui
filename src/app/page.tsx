import Hero from '@/components/Home/Hero';
import OverviewSection from '@/components/Home/OverviewSection';
import ThallosAgentSection from '@/components/Home/ThallosAgentSection';
import WhyGoBeyond from '@/components/WhyGoBeyond';
import AboutSection from '@/components/Home/AboutSection';
import StrategiesSection from '@/components/Home/StrategiesSection';
import CallToAction from '@/components/Home/CallToAction';

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

      {/* About Section */}
      <AboutSection />

      {/* Strategies Section */}
      <StrategiesSection />

      {/* Call to Action */}
      <CallToAction />
    </main>
  );
}
