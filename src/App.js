import React from 'react';
import DataTable from './components/Table';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header className="py-6 px-4">
        <h1 className="text-3xl font-semibold text-center text-gray-800">
          SortSmart
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Manage and explore our talent database
        </p>
      </header>
      <main>
        <DataTable />
      </main>
      <footer className="py-4 px-4 mt-8">
        <p className="text-center text-gray-600 text-sm">
          {new Date().getFullYear()} AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
