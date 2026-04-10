import { Routes, Route, Link } from 'react-router-dom';
import Generator from './pages/Generator';

function App() {
  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <nav className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-accent font-bold text-xl">TrackAdemic AI</span>
          </div>
          <div className="flex space-x-6 text-sm">
            <Link to="/" className="text-gray-300 hover:text-white">Dashboard</Link>
            <Link to="/generator" className="text-accent font-semibold">Curriculum Generator</Link>
            <Link to="/browser" className="text-gray-300 hover:text-white">Browser</Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<div className="text-center py-20 text-gray-400">Dashboard UI (In Development)</div>} />
          <Route path="/generator" element={<Generator />} />
          <Route path="/browser" element={<div className="text-center py-20 text-gray-400">Browser UI (In Development)</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
