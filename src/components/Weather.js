
import React, { useState } from 'react';
import axios from 'axios';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Use your API key directly (or from .env when fixed)
  const API_KEY = 'fe1ff53cfaf7ae4a5ab6e418e9659c05';

  // Dynamic background gradient based on weather condition
  const getBackground = (condition) => {
    const main = condition?.toLowerCase() || '';
    if (main.includes('clear')) return 'from-sky-500 via-blue-600 to-indigo-700';
    if (main.includes('cloud')) return 'from-gray-600 via-gray-700 to-slate-800';
    if (main.includes('rain')) return 'from-blue-800 via-indigo-900 to-gray-900';
    if (main.includes('thunder')) return 'from-purple-900 via-indigo-900 to-black';
    if (main.includes('snow')) return 'from-cyan-400 via-blue-500 to-indigo-600';
    return 'from-blue-500 via-purple-600 to-pink-500';
  };

  const fetchWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError('');
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
      const response = await axios.get(url);
      setWeather(response.data);
    } catch (err) {
      setError(err.response?.status === 404 ? `"${city}" not found.` : 'Error fetching weather.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const bgGradient = weather ? getBackground(weather.weather[0]?.main) : 'from-blue-500 via-purple-600 to-pink-500';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} transition-all duration-1000 flex items-center justify-center p-4`}>
      <div className="w-full max-w-lg mx-auto">
        {/* Header with animation */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg tracking-tight">
            🌤️ Weather<span className="text-yellow-300">Wise</span>
          </h1>
          <p className="text-white/80 text-lg mt-2 font-light">Real‑time forecasts for any city</p>
        </div>

        {/* Search Card - Glassmorphism */}
        <div className="backdrop-blur-xl bg-white/20 rounded-3xl shadow-2xl p-6 mb-6 border border-white/30 transition-all hover:shadow-3xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
              placeholder="e.g., Chennai, London, Tokyo"
              className="flex-1 px-5 py-3 rounded-2xl bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-300/50 text-lg backdrop-blur-sm"
            />
            <button
              onClick={fetchWeather}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold rounded-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                '🔍 Search'
              )}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-500/30 border border-red-400 rounded-xl text-white text-center animate-shake">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Weather Display */}
        {weather && !loading && (
          <div className="animate-fade-in-up">
            <div className="backdrop-blur-xl bg-white/20 rounded-3xl shadow-2xl overflow-hidden border border-white/30">
              {/* City & Date */}
              <div className="text-center pt-8 pb-4 px-6 border-b border-white/20">
                <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow">
                  {weather.name}, {weather.sys.country}
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              {/* Main Weather */}
              <div className="flex flex-col md:flex-row items-center justify-around gap-6 p-6">
                <div className="text-center">
                 
                  <p className="text-white text-lg font-semibold capitalize mt-2">{weather.weather[0].description}</p>
                </div>
                <div className="text-center">
                  <div className="text-7xl md:text-8xl font-black text-white drop-shadow-lg">
                    {Math.round(weather.main.temp)}°
                  </div>
                  <p className="text-white/90 text-lg mt-1">Feels like {Math.round(weather.main.feels_like)}°C</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-black/20 backdrop-blur-sm">
                <div className="text-center p-3 rounded-xl bg-white/10">
                  <div className="text-3xl mb-1">💧</div>
                  <p className="text-white/80 text-xs uppercase tracking-wide">Humidity</p>
                  <p className="text-white text-xl font-bold">{weather.main.humidity}%</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/10">
                  <div className="text-3xl mb-1">💨</div>
                  <p className="text-white/80 text-xs uppercase tracking-wide">Wind</p>
                  <p className="text-white text-xl font-bold">{Math.round(weather.wind.speed * 3.6)} km/h</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/10">
                  <div className="text-3xl mb-1">📈</div>
                  <p className="text-white/80 text-xs uppercase tracking-wide">Max Temp</p>
                  <p className="text-white text-xl font-bold">{Math.round(weather.main.temp_max)}°</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/10">
                  <div className="text-3xl mb-1">📉</div>
                  <p className="text-white/80 text-xs uppercase tracking-wide">Min Temp</p>
                  <p className="text-white text-xl font-bold">{Math.round(weather.main.temp_min)}°</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="backdrop-blur-xl bg-white/20 rounded-3xl p-8 animate-pulse">
            <div className="h-8 bg-white/30 rounded-full w-3/4 mx-auto mb-6"></div>
            <div className="h-32 w-32 bg-white/30 rounded-full mx-auto mb-6"></div>
            <div className="h-12 bg-white/30 rounded-full w-1/2 mx-auto"></div>
          </div>
        )}

        {/* Empty State */}
        {!weather && !loading && !error && (
          <div className="text-center text-white/90 py-12 animate-fade-in">
            <div className="text-7xl mb-4">🏙️</div>
            <h3 className="text-2xl font-semibold mb-2">Discover Weather Anywhere</h3>
            <p className="text-white/70">Search for any city to get live conditions</p>
          </div>
        )}
      </div>

      {/* Custom animations - add these to your global CSS or keep here */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in 0.5s ease-out; }
        @keyframes shake {
          0%,100%{ transform: translateX(0); }
          25%{ transform: translateX(-6px); }
          75%{ transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default Weather;


