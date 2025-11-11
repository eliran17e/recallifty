import React, { useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);

    try {
      const response = await fetch("http://localhost:8000/search/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setResults(data.suggestions || ["No matches found."]);
    } catch (err) {
      setResults(["Error fetching data"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 text-gray-900">
      <h1 className="text-5xl font-extrabold text-blue-700 mb-8 tracking-tight">
        Recallify <span className="text-blue-400">🔍</span>
      </h1>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg px-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Describe what you remember..."
          className="flex-1 p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Thinking..." : "Find Memory"}
        </button>
      </div>

      <div className="mt-8 w-full max-w-lg px-4">
        {results.length > 0 && (
          <ul className="bg-white rounded-lg shadow p-4 space-y-2">
            {results.map((item, idx) => (
              <li key={idx} className="text-gray-800 border-b last:border-none pb-2">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}