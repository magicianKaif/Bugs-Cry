import Header from '@/sections/Header';
import Hero from '@/sections/Hero';
import WhyUs from '@/sections/WhyUs';
import PipelineSection from '@/sections/PipelineSection';
import Analyzer from '@/sections/Analyzer';
import ReportSection from '@/sections/ReportSection';
import Footer from '@/sections/Footer';
import { usePipeline } from '@/hooks/usePipeline';

export default function Home() {
  const pipeline = usePipeline();
  return (
    <div className="min-h-screen bg-ink-900">
      <Header />
      <main>
        <Hero />
        <WhyUs />
        <PipelineSection />
        <Analyzer
          stages={pipeline.stages}
          log={pipeline.log}
          running={pipeline.running}
          error={pipeline.error}
          onRun={pipeline.run}
          onReset={pipeline.reset}
        />
        <ReportSection report={pipeline.report} running={pipeline.running} />
      </main>
      <Footer />
    </div>
  );
}
