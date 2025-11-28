import React from 'react';
import { FileText, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-3xl w-full space-y-8 animate-fade-in-up">
        
        {/* Hero Icon */}
        <div className="mx-auto bg-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 rotate-3 transition-transform hover:rotate-6">
          <FileText className="text-white w-10 h-10" />
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
          Welcome! This app will help you <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
            Order Summary Report!
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Instantly transform your paper invoices and digital receipts into actionable data. 
          Generate Waybills, Aggregate Reports, and Customer Invoices in seconds with AI.
        </p>

        <div className="pt-8">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
          >
            <span>Let's get started</span>
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 rounded-full ring-4 ring-white/20 group-hover:ring-white/40"></div>
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left">
          <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
            <ShieldCheck className="w-6 h-6 text-emerald-500 mb-2" />
            <h3 className="font-semibold text-slate-800">Secure Processing</h3>
            <p className="text-sm text-slate-500">Your data is processed securely and never stored.</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
            <Zap className="w-6 h-6 text-amber-500 mb-2" />
            <h3 className="font-semibold text-slate-800">Instant OCR</h3>
            <p className="text-sm text-slate-500">Powered by Gemini 2.5 Flash for speed.</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
            <FileText className="w-6 h-6 text-blue-500 mb-2" />
            <h3 className="font-semibold text-slate-800">Multi-Format</h3>
            <p className="text-sm text-slate-500">Export to Waybill, Aggregate, or Invoice.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
