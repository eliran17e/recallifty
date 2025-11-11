import React, { useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchData, setSearchData] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    setSearchData(null);

    try {
      const response = await fetch("http://localhost:8000/search/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setResults(data.suggestions || ["No matches found."]);
      setSearchData(data);
    } catch (err) {
      setResults(["Error fetching data"]);
      setSearchData(null);
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

      <div className="mt-8 w-full max-w-4xl px-4">
        {results.length > 0 && (
          <div className="space-y-8">
            {results.map((title, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>

                {/* Show corresponding YouTube video if it exists */}
                {searchData?.youtube && searchData.youtube[index] && (
                  <a
                    href={searchData.youtube[index].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={searchData.youtube[index].thumbnail}
                        alt={searchData.youtube[index].title}
                        className="w-full h-auto rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white text-5xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          ▶
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-gray-600 text-sm line-clamp-2">{searchData.youtube[index].title}</p>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}