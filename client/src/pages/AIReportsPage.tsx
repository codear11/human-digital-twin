import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AIReport } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Sparkles,
  Bot,
  Compass,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  History,
  FileText,
} from 'lucide-react';

export const AIReportsPage: React.FC = () => {
  const [reports, setReports] = useState<AIReport[]>([]);
  const [currentReport, setCurrentReport] = useState<AIReport | null>(null);
  const [reportType, setReportType] = useState<'HOLISTIC_TWIN' | 'WEEKLY_SUMMARY' | 'MONTHLY_SUMMARY' | 'PREDICTIVE_INSIGHT'>('HOLISTIC_TWIN');
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const data = await api.ai.listReports();
      setReports(data);
      if (data.length > 0 && !currentReport) {
        setCurrentReport(data[0]);
      }
    } catch (err) {
      console.error('Failed to load past AI reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generated = await api.ai.generate(reportType);
      setCurrentReport(generated);
      fetchReports();
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span>AI Digital Twin Synthesis & Predictive Insights</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Algorithmic neural synthesis cross-analyzing biometrics, sleep, locomotion, and financial savings patterns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={reportType}
            onChange={(e: any) => setReportType(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none"
          >
            <option value="HOLISTIC_TWIN">Holistic Digital Twin</option>
            <option value="WEEKLY_SUMMARY">Weekly Performance Summary</option>
            <option value="MONTHLY_SUMMARY">Monthly Evolution Trajectory</option>
            <option value="PREDICTIVE_INSIGHT">Predictive Correlation Model</option>
          </select>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Bot className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'Generate Analysis'}</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Consulting Digital Twin Knowledge Graph..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Report Display */}
          <div className="lg:col-span-2 space-y-6">
            {currentReport ? (
              <div className="glass-panel p-6 lg:p-8 rounded-3xl space-y-6 relative overflow-hidden">
                {/* Glow aura */}
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                        {currentReport.reportType.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                        Engine: {currentReport.source === 'OPENAI_GPT' ? 'OpenAI GPT-4o' : 'Deterministic Local Heuristic'}
                      </span>
                    </div>
                    <h2 className="text-xl font-extrabold text-white">{currentReport.title}</h2>
                  </div>

                  {currentReport.compositeScore !== null && (
                    <div className="text-right">
                      <span className="text-2xl font-black text-cyan-400">{currentReport.compositeScore}</span>
                      <span className="text-[10px] text-slate-500 block uppercase">Snapshot Score</span>
                    </div>
                  )}
                </div>

                {/* Executive Summary */}
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Executive Summary</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{currentReport.summary}</p>
                </div>

                {/* Multidimensional Observations */}
                {currentReport.observations?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-blue-400" />
                      <span>Identified Biometric & Behavioral Observations</span>
                    </h3>
                    <ul className="space-y-2">
                      {currentReport.observations.map((obs, idx) => (
                        <li key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                          <span>{obs}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actionable Recommendations */}
                {currentReport.recommendations?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Actionable Optimization Directives</span>
                    </h3>
                    <ul className="space-y-2">
                      {currentReport.recommendations.map((rec, idx) => (
                        <li key={idx} className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-xs text-emerald-200 flex items-start gap-2.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Predictive Outlook */}
                {currentReport.predictions?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Predictive Trajectory Modeling</span>
                    </h3>
                    <ul className="space-y-2">
                      {currentReport.predictions.map((pred, idx) => (
                        <li key={idx} className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/40 text-xs text-indigo-200 flex items-start gap-2.5">
                          <TrendingUp className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{pred}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Safety & Medical Disclaimer */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-900/40 text-[11px] text-amber-300/80 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{currentReport.disclaimer}</span>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
                <Bot className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="font-bold text-white text-base">No Report Selected</h3>
                <p className="text-xs text-slate-400">
                  Click &quot;Generate Analysis&quot; above to formulate an algorithmic evaluation of your digital twin.
                </p>
              </div>
            )}
          </div>

          {/* Past Reports Timeline */}
          <div className="glass-panel p-6 rounded-2xl h-fit space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <span>Report History Archive</span>
            </h3>

            {reports.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No previously compiled reports found.</p>
            ) : (
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {reports.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setCurrentReport(r)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      currentReport?.id === r.id
                        ? 'bg-slate-800/90 border-cyan-500/60 shadow-md'
                        : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-mono">{r.reportType.replace('_', ' ')}</span>
                      <span>{r.generatedAt ? new Date(r.generatedAt).toLocaleDateString() : ''}</span>
                    </div>
                    <p className="text-xs font-semibold text-white truncate">{r.title}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
