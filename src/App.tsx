import React from 'react';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  return (
    <div id="app-root-container" className="min-h-screen bg-zinc-950 font-sans text-white">
      <Dashboard />
    </div>
  );
};

export default App;
