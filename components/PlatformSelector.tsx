
import React from 'react';
import { ShoppingBag, ShoppingCart, Video, ArrowLeft } from 'lucide-react';
import { Platform } from '../types';

interface PlatformSelectorProps {
  onSelect: (platform: Platform) => void;
  onBack: () => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ onSelect, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>

        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Choose Your Platform</h2>
          <p className="text-lg text-slate-500">
            Select the platform you are processing orders for to improve accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-100">
          {/* Shopee */}
          <button
            onClick={() => onSelect('Shopee')}
            className="group relative bg-white overflow-hidden rounded-2xl shadow-sm border-2 border-transparent hover:border-orange-500 hover:shadow-xl transition-all duration-300 p-8 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors duration-300">
              <ShoppingBag className="w-10 h-10 text-orange-500 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Shopee</h3>
            <p className="text-slate-500">Process standard Shopee waybills (SPX, J&T, etc.)</p>
            <div className="absolute inset-0 border-2 border-orange-500 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none" />
          </button>

          {/* Lazada */}
          <button
            onClick={() => onSelect('Lazada')}
            className="group relative bg-white overflow-hidden rounded-2xl shadow-sm border-2 border-transparent hover:border-blue-600 hover:shadow-xl transition-all duration-300 p-8 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
              <ShoppingCart className="w-10 h-10 text-blue-600 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Lazada</h3>
            <p className="text-slate-500">Process Lazada logistics labels (LEX DO, Flash, etc.)</p>
            <div className="absolute inset-0 border-2 border-blue-600 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none" />
          </button>

          {/* Tiktok */}
          <button
            onClick={() => onSelect('Tiktok')}
            className="group relative bg-white overflow-hidden rounded-2xl shadow-sm border-2 border-transparent hover:border-black hover:shadow-xl transition-all duration-300 p-8 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-black transition-colors duration-300">
              <Video className="w-10 h-10 text-black group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">TikTok Shop</h3>
            <p className="text-slate-500">Process TikTok Shop waybills (J&T, NinjaVan, etc.)</p>
            <div className="absolute inset-0 border-2 border-black opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none" />
          </button>
        </div>
      </div>
    </div>
  );
};
