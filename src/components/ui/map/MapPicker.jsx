import L from "leaflet";
import "leaflet/dist/leaflet.css";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import styles from "./mapPicker.module.scss";

/* ========= Subcomponentes a nivel de módulo (identidad estable) ========= */

function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick?.(e.latlng);
    },
  });
  return null;
}

function MapCore({ marker, disabled, setMarker, reverseGeocode, onChange }) {
  useMapEvents({}); // noop; prepara el contexto si luego quisieras más eventos

  return (
    <>
      <ClickHandler
        onClick={async ({ lat, lng }) => {
          if (disabled) return;
          setMarker({ lat, lng });
          const addr = await reverseGeocode(lat, lng);
          onChange?.({ lat, lng, address: addr });
        }}
      />
      {marker && (
        <Marker
          position={[marker.lat, marker.lng]}
          draggable={!disabled}
          eventHandlers={{
            dragend: async (e) => {
              if (disabled) return;
              const { lat, lng } = e.target.getLatLng();
              setMarker({ lat, lng });
              const addr = await reverseGeocode(lat, lng);
              onChange?.({ lat, lng, address: addr });
            },
          }}
        />
      )}
    </>
  );
}

function SearchBox({
  query,
  onQueryChange,
  suggestions,
  onPickSuggestion,
  disabled,
  showSearch,
  searchPlaceholder,
  loading,
}) {
  const map = useMapEvents({});
  const searchRef = useRef(null);

  // Evita que los eventos del buscador lleguen al mapa, sin romper el foco.
  useEffect(() => {
    if (searchRef.current) {
      L.DomEvent.disableClickPropagation(searchRef.current);
      L.DomEvent.disableScrollPropagation(searchRef.current);
    }
  }, []);

  if (!showSearch) return null;

  return (
    <div ref={searchRef} className={styles.search}>
      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder={searchPlaceholder}
          value={query}
          onChange={onQueryChange} // <-- solo actualiza texto
          disabled={disabled}
          onFocus={() => {
            map.dragging?.disable();
            map.scrollWheelZoom?.disable();
          }}
          onBlur={() => {
            map.dragging?.enable();
            map.scrollWheelZoom?.enable();
          }}
        />
        {loading && <div className={styles.searchLoading}>Buscando…</div>}
      </div>

      {suggestions.length > 0 && (
        <ul className={styles.suggestions} role="listbox">
          {suggestions.map((s) => (
            <li key={s.place_id}>
              <button
                type="button"
                className={styles.suggestion}
                onMouseDown={(e) => e.preventDefault()} // evita robar el foco
                onClick={() => onPickSuggestion(s, map)}
              >
                {s.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ============================ Componente principal ============================ */

export function MapPicker({
  value,
  onChange, // ({lat, lng, address?}) => void
  initialCenter = { lat: -2.170998, lng: -79.922359 }, // Guayaquil aprox
  initialZoom = 10,
  height = 360,
  disabled = false,
  searchPlaceholder = "Buscar ciudad, país, dirección…",
  className = "",
  showSearch = true,
  showAddress = true,
  language = "es",
}) {
  const containerRef = useRef(null);
  const [marker, setMarker] = useState(value || null);
  const [address, setAddress] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mantener controlado desde fuera si cambia value
  useEffect(() => {
    if (value?.lat && value?.lng) setMarker(value);
  }, [value?.lat, value?.lng]);

  // Busca en Nominatim (con cancelación de peticiones previas)
  const abortRef = useRef(null);
  const performSearch = useCallback(
    async (q) => {
      const trimmed = q.trim();
      if (trimmed.length < 3 || disabled) {
        setSuggestions([]);
        return;
      }

      try {
        // Cancela petición anterior si existiese
        abortRef.current?.abort?.();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.set("q", trimmed);
        url.searchParams.set("format", "json");
        url.searchParams.set("addressdetails", "1");
        url.searchParams.set("limit", "5");
        url.searchParams.set("accept-language", language);
        // url.searchParams.set("email", "tu-email@dominio.com"); // recomendado

        const res = await fetch(url.toString(), {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        if (query.trim().length < 3) setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [language, disabled, query]
  );

  // Debounce de 700ms: busca automáticamente cuando dejas de escribir
  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = (query ?? "").trim();
      if (trimmed.length >= 3) performSearch(trimmed);
      else setSuggestions([]);
    }, 700);
    return () => clearTimeout(t);
  }, [query, performSearch]);

  const handlePickSuggestion = (sug, map) => {
    const lat = parseFloat(sug.lat);
    const lng = parseFloat(sug.lon);
    const addr = sug.display_name;
    setMarker({ lat, lng });
    setAddress(addr);
    setSuggestions([]);
    setQuery(addr);
    map?.setView([lat, lng], 15);
    onChange?.({ lat, lng, address: addr });
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const url = new URL("https://nominatim.openstreetmap.org/reverse");
      url.searchParams.set("lat", String(lat));
      url.searchParams.set("lon", String(lng));
      url.searchParams.set("format", "json");
      url.searchParams.set("addressdetails", "1");
      url.searchParams.set("accept-language", language);
      const res = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      const addr = data?.display_name || "";
      setAddress(addr);
      setQuery(addr || "");
      return addr;
    } catch {
      return "";
    }
  };

  return (
    <div
      className={[styles.mapPicker, className].filter(Boolean).join(" ")}
      style={{ height }}
      ref={containerRef}
      aria-disabled={disabled || undefined}
    >
      <MapContainer
        center={[
          marker?.lat ?? initialCenter.lat,
          marker?.lng ?? initialCenter.lng,
        ]}
        zoom={initialZoom}
        scrollWheelZoom={!disabled}
        keyboard={false}
        className={styles.map}
      >
        <TileLayer
          // Tiles de OSM (respetar atribución)
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
        />

        <MapCore
          marker={marker}
          disabled={disabled}
          setMarker={setMarker}
          reverseGeocode={reverseGeocode}
          onChange={onChange}
        />

        <SearchBox
          query={query}
          onQueryChange={(e) => setQuery(e.target.value)} // <- dispara debounce por efecto
          suggestions={suggestions}
          onPickSuggestion={handlePickSuggestion}
          disabled={disabled}
          showSearch={showSearch}
          searchPlaceholder={searchPlaceholder}
          loading={loading}
        />
      </MapContainer>

      {showAddress && (
        <div className={styles.addressBar} title={address}>
          {address ||
            (marker
              ? `${marker.lat.toFixed(5)}, ${marker.lng.toFixed(5)}`
              : "Selecciona un punto")}
        </div>
      )}
    </div>
  );
}

MapPicker.propTypes = {
  value: PropTypes.shape({ lat: PropTypes.number, lng: PropTypes.number }),
  onChange: PropTypes.func,
  initialCenter: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  initialZoom: PropTypes.number,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  className: PropTypes.string,
  showSearch: PropTypes.bool,
  showAddress: PropTypes.bool,
  language: PropTypes.string,
};

SearchBox.propTypes = {
  query: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired,
  suggestions: PropTypes.array.isRequired,
  onPickSuggestion: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  showSearch: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  loading: PropTypes.bool,
};

MapCore.propTypes = {
  marker: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  disabled: PropTypes.bool,
  setMarker: PropTypes.func.isRequired,
  reverseGeocode: PropTypes.func.isRequired,
  onChange: PropTypes.func,
};

ClickHandler.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default MapPicker;
