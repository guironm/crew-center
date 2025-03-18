"use client";

export default function Header() {
  return (
    <header className="bg-slate-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Crew Center</h1>
        <div className="flex items-center space-x-4">
          <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-800 transition">
            Dashboard
          </button>
          <button className="px-3 py-1 rounded hover:bg-slate-700 transition">
            Settings
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center">
            <span className="font-bold">A</span>
          </div>
        </div>
      </div>
    </header>
  );
}
