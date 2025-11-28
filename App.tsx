
import React, { useState } from 'react';
import { Landing } from './components/Landing';
import { PlatformSelector } from './components/PlatformSelector';
import { UploadProcessor } from './components/UploadProcessor';
import { Dashboard } from './components/Dashboard';
import { WaybillReport, AggregateReport, InvoiceReport } from './components/Reports';
import { AppView, OrderData, Platform } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('Shopee');
  const [orderData, setOrderData] = useState<OrderData[] | null>(null);

  // Transitions
  const handleStart = () => setCurrentView('platform-selection');
  
  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
    setCurrentView('upload');
  };

  const handleDataExtracted = (data: OrderData[]) => {
    setOrderData(data);
    setCurrentView('dashboard');
  };

  const handleReset = () => {
    setOrderData(null);
    setCurrentView('platform-selection'); // Go back to platform selection on new upload
  };

  const handleBackToDashboard = () => setCurrentView('dashboard');

  // View Routing
  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <Landing onStart={handleStart} />;
      
      case 'platform-selection':
        return (
          <PlatformSelector 
            onSelect={handlePlatformSelect} 
            onBack={() => setCurrentView('landing')} 
          />
        );
      
      case 'upload':
        return (
          <UploadProcessor 
            platform={selectedPlatform}
            onDataExtracted={handleDataExtracted} 
            onBack={() => setCurrentView('platform-selection')} 
          />
        );
      
      case 'dashboard':
        return (
          <Dashboard 
            onNavigate={setCurrentView} 
            onReset={handleReset} 
          />
        );
      
      case 'waybill':
        return orderData ? (
          <WaybillReport data={orderData} onBack={handleBackToDashboard} />
        ) : <Dashboard onNavigate={setCurrentView} onReset={handleReset} />;
      
      case 'aggregate':
        return orderData ? (
          <AggregateReport data={orderData} onBack={handleBackToDashboard} />
        ) : <Dashboard onNavigate={setCurrentView} onReset={handleReset} />;
      
      case 'invoice':
        return orderData ? (
          <InvoiceReport data={orderData} onBack={handleBackToDashboard} />
        ) : <Dashboard onNavigate={setCurrentView} onReset={handleReset} />;

      default:
        return <Landing onStart={handleStart} />;
    }
  };

  return (
    <div className="font-sans antialiased text-slate-900 bg-white">
      {renderView()}
    </div>
  );
}

export default App;
