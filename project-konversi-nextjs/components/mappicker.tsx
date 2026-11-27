"use client";
import { useEffect, useRef } from "react";
import { LOKASI_TOKO } from "@/lib/pesanan";

export interface TitikPeta {
  lat: number;
  lng: number;
}

export interface TampilanPeta {
  lat: number;
  lng: number;
  zoom: number;
  id: number;
}

interface MapPickerProps {
  lokasi: TitikPeta | null;
  tampilan: TampilanPeta;
  onPilih: (lat: number, lng: number) => void;
}

const URL_LEAFLET = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

function MapPicker({ lokasi, tampilan, onPilih }: MapPickerProps) {
  const mapEl = useRef<HTMLDivElement>(null);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const garisRef = useRef<any>(null);
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const onPilihRef = useRef(onPilih);

  useEffect(() => {
    onPilihRef.current = onPilih;
  }, [onPilih]);

  // Buat peta Leaflet (Leaflet dimuat dari CDN yang sama seperti di index.html)
  useEffect(() => {
    function buatPeta() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const L = (window as any).L;
      if (!L || !mapEl.current || mapRef.current) return;

      const map = L.map(mapEl.current).setView(
        [LOKASI_TOKO.lat, LOKASI_TOKO.lng],
        12
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      const iconToko = L.divIcon({
        className: "map-marker-toko",
        html: '<div class="marker-pin marker-pin-toko">🏪</div>',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });

      L.marker([LOKASI_TOKO.lat, LOKASI_TOKO.lng], { icon: iconToko })
        .addTo(map)
        .bindPopup("<b>Toko Bika Ambon</b><br>" + LOKASI_TOKO.nama);

      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        onPilihRef.current(e.latlng.lat, e.latlng.lng);
      });

      mapRef.current = map;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).L) {
      buatPeta();
    } else {
      let script = document.getElementById("leaflet-js") as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = URL_LEAFLET;
        document.body.appendChild(script);
      }
      script.addEventListener("load", buatPeta);
    }

    return () => {
      const script = document.getElementById("leaflet-js");
      if (script) script.removeEventListener("load", buatPeta);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
        garisRef.current = null;
      }
    };
  }, []);

  // Marker lokasi user + garis putus-putus dari toko
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const L = (window as any).L;
    const map = mapRef.current;
    if (!L || !map) return;

    if (garisRef.current) {
      map.removeLayer(garisRef.current);
      garisRef.current = null;
    }

    if (!lokasi) {
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      return;
    }

    if (markerRef.current) {
      markerRef.current.setLatLng([lokasi.lat, lokasi.lng]);
    } else {
      const iconUser = L.divIcon({
        className: "map-marker-user",
        html: '<div class="marker-pin marker-pin-user">📍</div>',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });

      markerRef.current = L.marker([lokasi.lat, lokasi.lng], {
        icon: iconUser,
        draggable: true,
      }).addTo(map);

      markerRef.current.on(
        "dragend",
        (ev: { target: { getLatLng: () => { lat: number; lng: number } } }) => {
          const pos = ev.target.getLatLng();
          onPilihRef.current(pos.lat, pos.lng);
        }
      );
    }

    garisRef.current = L.polyline(
      [
        [LOKASI_TOKO.lat, LOKASI_TOKO.lng],
        [lokasi.lat, lokasi.lng],
      ],
      {
        color: "#d48227",
        weight: 3,
        dashArray: "6 6",
      }
    ).addTo(map);
  }, [lokasi]);

  // Pindahin tampilan peta (cari alamat, lokasi saya, reset)
  useEffect(() => {
    if (tampilan.id === 0 || !mapRef.current) return;
    mapRef.current.setView([tampilan.lat, tampilan.lng], tampilan.zoom);
  }, [tampilan]);

  return <div id="mapPicker" className="map-picker" ref={mapEl}></div>;
}

export default MapPicker;
