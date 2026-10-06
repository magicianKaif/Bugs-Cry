"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
var Header_1 = require("@/sections/Header");
var Hero_1 = require("@/sections/Hero");
var WhyUs_1 = require("@/sections/WhyUs");
var PipelineSection_1 = require("@/sections/PipelineSection");
var Analyzer_1 = require("@/sections/Analyzer");
var ReportSection_1 = require("@/sections/ReportSection");
var Footer_1 = require("@/sections/Footer");
var usePipeline_1 = require("@/hooks/usePipeline");
function Home() {
    var pipeline = (0, usePipeline_1.usePipeline)();
    return (<div className="min-h-screen bg-ink-900">
      <Header_1.default />
      <main>
        <Hero_1.default />
        <WhyUs_1.default />
        <PipelineSection_1.default />
        <Analyzer_1.default stages={pipeline.stages} log={pipeline.log} running={pipeline.running} error={pipeline.error} onRun={pipeline.run} onReset={pipeline.reset}/>
        <ReportSection_1.default report={pipeline.report} running={pipeline.running}/>
      </main>
      <Footer_1.default />
    </div>);
}
