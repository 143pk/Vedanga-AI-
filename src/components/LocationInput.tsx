import React, { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, RefreshCw, Check, Compass, Search } from "lucide-react";

interface LocationSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
}

interface LocationInputProps {
  value: string;
  onChange: (formattedValue: string, lat?: number, lon?: number) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  placeholder = "Search City, Town, or Country...",
  label = "Place of Birth",
  required = false,
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingGps, setLoadingGps] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasCoordinates, setHasCoordinates] = useState(value.includes("°"));

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync internal query state if external value changes
  useEffect(() => {
    setQuery(value);
    setHasCoordinates(value.includes("°"));
  }, [value]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced place search via OpenStreetMap Nominatim
  useEffect(() => {
    if (!query || query.trim().length < 2 || !showDropdown) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingSearch(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query.trim()
          )}&limit=5&addressdetails=1`
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data || []);
        }
      } catch (err) {
        console.error("Geocoding search error:", err);
      } finally {
        setLoadingSearch(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, showDropdown]);

  // Select place from suggestions
  const handleSelectSuggestion = (item: LocationSuggestion) => {
    const latNum = parseFloat(item.lat);
    const lonNum = parseFloat(item.lon);

    // Format neat short name: "City, State, Country"
    const addr = item.address;
    const mainCity = addr?.city || addr?.town || addr?.village || item.display_name.split(",")[0];
    const state = addr?.state || "";
    const country = addr?.country || "";

    const cleanLocation = [mainCity, state, country].filter(Boolean).join(", ");
    const latDir = latNum >= 0 ? "N" : "S";
    const lonDir = lonNum >= 0 ? "E" : "W";

    const formattedWithGps = `${cleanLocation} (${Math.abs(latNum).toFixed(2)}°${latDir}, ${Math.abs(lonNum).toFixed(2)}°${lonDir})`;

    setQuery(formattedWithGps);
    setHasCoordinates(true);
    setShowDropdown(false);
    onChange(formattedWithGps, latNum, lonNum);
  };

  // Handle GPS Current Location detection
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingGps(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const latDir = lat >= 0 ? "N" : "S";
        const lonDir = lon >= 0 ? "E" : "W";

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address;
            const city = addr?.city || addr?.town || addr?.village || addr?.suburb || addr?.county || "Current Location";
            const state = addr?.state || "";
            const country = addr?.country || "";

            const cleanLocation = [city, state, country].filter(Boolean).join(", ");
            const formatted = `${cleanLocation} (${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lon).toFixed(2)}°${lonDir})`;

            setQuery(formatted);
            setHasCoordinates(true);
            onChange(formatted, lat, lon);
          } else {
            const fallback = `GPS Location (${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lon).toFixed(2)}°${lonDir})`;
            setQuery(fallback);
            setHasCoordinates(true);
            onChange(fallback, lat, lon);
          }
        } catch (e) {
          const fallback = `GPS Location (${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lon).toFixed(2)}°${lonDir})`;
          setQuery(fallback);
          setHasCoordinates(true);
          onChange(fallback, lat, lon);
        } finally {
          setLoadingGps(false);
        }
      },
      (error) => {
        setLoadingGps(false);
        alert("Unable to detect GPS position. Please type your city name manually.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setHasCoordinates(val.includes("°"));
    setShowDropdown(true);
    onChange(val);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Label & GPS Trigger */}
      <div className="flex items-center justify-between mb-1">
        <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={handleDetectGps}
          disabled={loadingGps}
          className="flex items-center space-x-1 text-[10px] text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
          title="Auto-detect exact GPS coordinates via your device"
        >
          {loadingGps ? (
            <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
          ) : (
            <Navigation className="w-3 h-3 text-amber-400" />
          )}
          <span>{loadingGps ? "Acquiring..." : "Use Device GPS"}</span>
        </button>
      </div>

      {/* Input Field */}
      <div className="relative">
        <MapPin className="w-3.5 h-3.5 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
        <input
          type="text"
          required={required}
          placeholder={placeholder}
          value={query}
          onFocus={() => setShowDropdown(true)}
          onChange={handleInputChange}
          className={`w-full bg-slate-950/90 border ${
            hasCoordinates ? "border-amber-500/60 ring-1 ring-amber-500/20" : "border-slate-700"
          } focus:border-amber-500 rounded-xl py-2.5 pl-9 pr-8 text-xs text-slate-100 outline-none transition-all`}
        />

        {/* Right Status Indicator */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {loadingSearch && <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />}
          {hasCoordinates && !loadingSearch && (
            <span className="flex items-center text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded-md">
              <Check className="w-2.5 h-2.5 mr-0.5" /> GPS
            </span>
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800 backdrop-blur-xl">
          <div className="px-3 py-1.5 bg-slate-950/60 text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center">
              <Search className="w-3 h-3 mr-1" /> Accurate GPS Location Results
            </span>
            <span className="text-slate-500">Select exact match</span>
          </div>

          {suggestions.map((item) => {
            const lat = parseFloat(item.lat);
            const lon = parseFloat(item.lon);
            const latDir = lat >= 0 ? "N" : "S";
            const lonDir = lon >= 0 ? "E" : "W";

            return (
              <button
                key={item.place_id}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full text-left px-3.5 py-2.5 hover:bg-amber-500/10 transition-colors flex items-start justify-between group cursor-pointer"
              >
                <div className="pr-2">
                  <div className="text-xs text-slate-100 font-medium group-hover:text-amber-200 line-clamp-1">
                    {item.display_name}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center mt-0.5 space-x-1">
                    <Compass className="w-3 h-3 text-amber-400/80" />
                    <span>
                      {Math.abs(lat).toFixed(4)}° {latDir}, {Math.abs(lon).toFixed(4)}° {lonDir}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-lg shrink-0 self-center font-mono">
                  Select GPS
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
