import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import InteractionForm from './components/InteractionForm';
import AIChat from './components/AIChat';
import InteractionList from './components/InteractionList';

const App = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header: Dense and Aligned */}
          <div className="space-y-0.5 ml-1">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Log HCP Interaction</h1>
            <p className="text-[12px] text-gray-500 font-medium">Record interaction details or use the AI Assistant to automate the process.</p>
          </div>

          {/* Main Container: Single Card with Internal Grid */}
          <div className="crm-card grid grid-cols-1 lg:grid-cols-[1fr_320px] overflow-hidden min-h-[600px] border-gray-200">
            {/* Left Side: Form Section (70%) */}
            <div className="bg-white p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-gray-100">
              <InteractionForm />
            </div>

            {/* Right Side: AI Assistant Panel (30%) */}
            <div className="bg-gray-50/40 p-5 sm:p-6 flex flex-col h-full">
              <AIChat />
            </div>
          </div>

          {/* Interaction History Section */}
          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Interactions</h2>
              <button className="text-[12px] font-bold text-blue-600 hover:underline">View all</button>
            </div>
            <InteractionList />
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default App;
