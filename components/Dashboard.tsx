import React from 'react';
import { Truck, FileBarChart, Receipt, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AppView } from '../types';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onReset }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">O</div>
            <span className="font-bold text-slate-800 text-xl">OrderSense</span>
        </div>
        <button 
            onClick={onReset}
            className="text-sm text-slate-500 hover:text-indigo-600 flex items-center transition-colors"
        >
            <ArrowLeft className="w-4 h-4 mr-1" /> Upload New
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="mb-10 text-center animate-fade-in-up">
            <div className="inline-flex items-center justify-center p-2 bg-green-100 text-green-700 rounded-full mb-4 px-4 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Analysis Complete
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Select Your Report</h2>
            <p className="text-slate-500 max-w-lg mx-auto">
                We've successfully extracted the data. Choose a format below to view, analyze, or print your documents.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {/* Card 1 */}
            <button 
                onClick={() => onNavigate('waybill')}
                className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 text-left flex flex-col items-start"
            >
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                    <Truck className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Waybill Data Report</h3>
                <p className="text-slate-500 mb-6 flex-1">Generate shipping labels and logistic tracking documents for this order.</p>
                <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                    View Report <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                </span>
            </button>

            {/* Card 2 */}
            <button 
                onClick={() => onNavigate('aggregate')}
                className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 text-left flex flex-col items-start"
            >
                 <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                    <FileBarChart className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Order Aggregate System</h3>
                <p className="text-slate-500 mb-6 flex-1">Visualize item breakdowns, SKU analysis, and revenue charts.</p>
                <span className="text-purple-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Analyze Data <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                </span>
            </button>

            {/* Card 3 */}
            <button 
                onClick={() => onNavigate('invoice')}
                className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 text-left flex flex-col items-start"
            >
                 <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                    <Receipt className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Customer Invoicing</h3>
                <p className="text-slate-500 mb-6 flex-1">Professional formatted invoice ready for accounting or customer delivery.</p>
                <span className="text-emerald-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                    View Invoice <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                </span>
            </button>
        </div>
      </main>
    </div>
  );
};
