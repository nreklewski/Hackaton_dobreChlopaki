"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

// Custom icons will be used, but we need to set a default to avoid errors
if (typeof window !== "undefined") {
  // Only set default icon on client side
  try {
    const DefaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    L.Marker.prototype.options.icon = DefaultIcon;
  } catch (e) {
    // Ignore if icons can't be loaded
  }
}

// Custom icons for different statuses
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const orangeIcon = createCustomIcon("#ff8c00");
const greenIcon = createCustomIcon("#28a745");
const blueIcon = createCustomIcon("#007bff"); // For initiatives

type FilterType = "wszystkie" | "planowane" | "w trakcie" | "gotowe" | "inicjatywy";

interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
  status: string;
  description?: string;
  fullDescription?: string; // dłuższy opis dla popup w sekcji usług
  date?: string;
  image?: string;
  votes?: number;
  progress?: number; // postęp projektu 0-100 (tylko dla zmian)
  daysRemaining?: number; // planowana ilość dni do zakończenia (tylko dla zmian)
}

type TabType = "wszystkie" | "zmiany" | "inicjatywy" | "zglos-problem";

interface MapComponentProps {
  activeFilter: FilterType;
  activeTab?: TabType;
  locations: Location[];
  selectedLocationId?: number | null;
  onMapClick?: (e: L.LeafletMouseEvent) => void;
  reportLocation?: { lat: number; lng: number } | null;
  showStatus?: boolean; // czy pokazywać status w popup (domyślnie true)
  onVote?: (initiativeId: number) => void;
  votedInitiatives?: Set<number>;
}

// Component to handle map centering when location is selected
function MapCenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

// Component to handle map clicks
function MapClickHandler({ onMapClick }: { onMapClick: (e: L.LeafletMouseEvent) => void }) {
  useMapEvents({
    click: onMapClick,
  });
  return null;
}

// Component to auto-open popup when marker is selected
function MarkerWithAutoPopup({
  position,
  icon,
  isSelected,
  children,
}: {
  position: [number, number];
  icon: L.DivIcon;
  isSelected: boolean;
  children: React.ReactNode;
}) {
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (isSelected && markerRef.current) {
      // Small delay to ensure marker is rendered
      setTimeout(() => {
        markerRef.current?.openPopup();
      }, 100);
    } else if (!isSelected && markerRef.current) {
      // Close popup when deselected
      markerRef.current.closePopup();
    }
  }, [isSelected]);

  return (
    <Marker
      eventHandlers={{
        add: (e) => {
          markerRef.current = e.target;
          if (isSelected) {
            setTimeout(() => {
              e.target.openPopup();
            }, 100);
          }
        },
      }}
      position={position}
      icon={icon}
    >
      {children}
    </Marker>
  );
}

export default function MapComponent({
  activeFilter,
  activeTab,
  locations,
  selectedLocationId,
  onMapClick,
  reportLocation,
  showStatus = true, // domyślnie pokazuj status
  onVote,
  votedInitiatives = new Set(),
}: MapComponentProps) {
  const [subscribedLocations, setSubscribedLocations] = useState<Set<number>>(new Set());
  const [highlightedLocation, setHighlightedLocation] = useState<number | null>(null);
  const [shareLocationId, setShareLocationId] = useState<number | null>(null);
  const filteredLocations = locations.filter((loc) => {
    // Jeśli activeTab nie jest podane (np. w sekcji usług), pokazuj wszystkie punkty
    if (!activeTab) {
      return true;
    }
    // Jeśli aktywna zakładka to "wszystkie", pokazuj wszystkie punkty
    if (activeTab === "wszystkie") {
      return true;
    }
    // Jeśli aktywna zakładka to "inicjatywy", pokazuj tylko inicjatywy
    if (activeTab === "inicjatywy") {
      return loc.status === "inicjatywy";
    }
    // Jeśli aktywna zakładka to "zmiany", pokazuj tylko zmiany (nie inicjatywy)
    if (activeTab === "zmiany") {
      if (loc.status === "inicjatywy") {
        return false;
      }
      if (activeFilter === "wszystkie") {
        return true;
      }
      return loc.status === activeFilter;
    }
    // Dla innych zakładek (np. zglos-problem) nie pokazuj żadnych punktów
    return false;
  });

  const selectedLocation = selectedLocationId
    ? locations.find((loc) => loc.id === selectedLocationId)
    : null;

  const getIcon = (status: string) => {
    if (status === "gotowe") return greenIcon;
    if (status === "w trakcie") return orangeIcon;
    if (status === "planowane") return createCustomIcon("#007bff");
    if (status === "inicjatywy") return blueIcon;
    if (status === "wszystkie") return createCustomIcon("#0075a7"); // Primary color for services
    return createCustomIcon("#007bff");
  };

  const center: [number, number] = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : [51.758, 19.456];

  const reportIcon = createCustomIcon("#dc2626"); // Red icon for report

  return (
    <MapContainer
      center={center}
      zoom={selectedLocation ? 15 : 13}
      style={{ height: "100%", width: "100%", zIndex: 1 }}
      scrollWheelZoom={true}
    >
      <MapCenter center={center} zoom={selectedLocation ? 15 : 13} />
      {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Location markers */}
      {filteredLocations.map((location) => {
        const icon = getIcon(location.status);
        const isInitiative = location.status === "inicjatywy";
        const isSelected = selectedLocationId === location.id;

        return (
          <MarkerWithAutoPopup
            key={location.id}
            position={[location.lat, location.lng]}
            icon={icon}
            isSelected={isSelected}
          >
            <Popup>
              <div className="min-w-[250px] max-w-[350px]">
                <h4 className="font-bold text-sm mb-2">{location.name}</h4>
                {location.image && (
                  <div className="mb-2">
                    <Image
                      src={location.image}
                      alt={location.name}
                      width={200}
                      height={120}
                      className="w-full h-24 object-cover rounded"
                    />
                  </div>
                )}
                {/* Pokazuj fullDescription jeśli dostępne, w przeciwnym razie description */}
                {location.fullDescription ? (
                  <p className="text-xs text-gray-700 mb-2 leading-relaxed">{location.fullDescription}</p>
                ) : location.description ? (
                  <p className="text-xs text-gray-600 mb-2">{location.description}</p>
                ) : null}
                {/* Status pokazujemy tylko jeśli showStatus jest true i to nie jest inicjatywa */}
                {showStatus && !isInitiative && (
                  <>
                    <p className="text-xs mb-2">
                      <span className="font-semibold">Status:</span>{" "}
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs ${
                          location.status === "gotowe"
                            ? "bg-green-100 text-green-800"
                            : location.status === "w trakcie"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {location.status}
                      </span>
                    </p>
                    {/* Progress bar for changes - only for "w trakcie" */}
                    {location.progress !== undefined && location.status === "w trakcie" && (
                      <div className="mb-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-gray-700">Postęp:</span>
                          <span className="text-xs font-bold text-primary">{location.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500 bg-orange-500"
                            style={{ width: `${location.progress}%` }}
                          />
                        </div>
                        {location.daysRemaining !== undefined && location.daysRemaining > 0 && (
                          <p className="text-xs text-gray-600 mt-1">
                            Planowane zakończenie za: <span className="font-semibold text-primary">{location.daysRemaining} dni</span>
                          </p>
                        )}
                      </div>
                    )}
                    {location.date && (
                      <p className="text-xs mt-1">
                        <span className="font-semibold">Data:</span> {location.date}
                      </p>
                    )}
                  </>
                )}
                {isInitiative && location.votes !== undefined && (
                  <>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <div className="flex items-center gap-2 relative">
                        <motion.span
                          key={location.votes}
                          initial={{ y: 0, scale: 1 }}
                          animate={{ 
                            y: votedInitiatives.has(location.id) ? [-10, 0] : 0,
                            scale: votedInitiatives.has(location.id) ? [1.3, 1] : 1
                          }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className="text-lg"
                        >
                          👍
                        </motion.span>
                        <span className="font-semibold">
                          <motion.span
                            key={location.votes}
                            initial={{ scale: 1 }}
                            animate={{ scale: votedInitiatives.has(location.id) ? [1.2, 1] : 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {location.votes}
                          </motion.span>{" "}
                          {location.votes === 1 ? "głos" : location.votes < 5 ? "głosy" : "głosów"}
                        </span>
                      </div>
                      {location.date && (
                        <span className="text-gray-500">{location.date}</span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        if (!votedInitiatives.has(location.id) && onVote) {
                          onVote(location.id);
                        }
                      }}
                      disabled={votedInitiatives.has(location.id)}
                      className={`mt-2 w-full px-3 py-1 text-xs font-bold uppercase transition-all duration-300 ${
                        votedInitiatives.has(location.id)
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : "bg-secondary text-white hover:bg-opacity-90"
                      }`}
                    >
                      {votedInitiatives.has(location.id) ? "✓ Zagłosowano" : "Zagłosuj"}
                    </button>
                  </>
                )}
                {/* Przyciski Zasubskrybuj i Udostępnij */}
                <div className="mt-2 flex gap-2">
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!subscribedLocations.has(location.id)) {
                        setSubscribedLocations((prev) => new Set(prev).add(location.id));
                        setHighlightedLocation(location.id);
                        setTimeout(() => setHighlightedLocation(null), 1500);
                      }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    animate={{
                      boxShadow: highlightedLocation === location.id
                        ? "0 0 25px rgba(0, 117, 167, 0.8)"
                        : "0 2px 4px rgba(0, 0, 0, 0.1)",
                      scale: highlightedLocation === location.id ? [1, 1.05, 1] : 1,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                    className={`flex-1 px-3 py-2 text-xs font-bold uppercase transition-colors duration-300 rounded ${
                      subscribedLocations.has(location.id)
                        ? "bg-green-500 text-white"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                  >
                    {subscribedLocations.has(location.id) ? "✓ Zasubskrybowano" : "Zasubskrybuj"}
                  </motion.button>
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShareLocationId(location.id);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-2 bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-300 rounded flex items-center justify-center"
                    title="Udostępnij"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" strokeWidth="2"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" strokeWidth="2"></line>
                    </svg>
                  </motion.button>
                </div>
              </div>
            </Popup>
          </MarkerWithAutoPopup>
        );
      })}

      {/* Report Location Marker */}
      {reportLocation && (
        <Marker position={[reportLocation.lat, reportLocation.lng]} icon={reportIcon}>
          <Popup>
            <div className="min-w-[200px]">
              <h4 className="font-bold text-sm mb-2">Zaznaczony punkt</h4>
              <p className="text-xs text-gray-600">
                Lokalizacja zgłoszenia problemu
              </p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Share Modal */}
      <AnimatePresence>
        {shareLocationId !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000]"
              onClick={() => setShareLocationId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-[1001] min-w-[280px] max-w-[400px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Udostępnij</h3>
                  <button
                    onClick={() => setShareLocationId(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-2">
                  {/* Skopiuj link */}
                  <motion.button
                    onClick={async () => {
                      const location = locations.find((loc) => loc.id === shareLocationId);
                      const url = `${window.location.origin}/mapa?location=${shareLocationId}`;
                      try {
                        await navigator.clipboard.writeText(url);
                        // Można dodać wizualną informację o skopiowaniu
                      } catch (err) {
                        console.error("Failed to copy:", err);
                      }
                    }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-left"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-700"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span className="font-semibold text-gray-800">Skopiuj link</span>
                  </motion.button>

                  {/* Facebook */}
                  <motion.button
                    onClick={() => {
                      const location = locations.find((loc) => loc.id === shareLocationId);
                      const url = encodeURIComponent(`${window.location.origin}/mapa?location=${shareLocationId}`);
                      const text = encodeURIComponent(location?.name || "");
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
                        "_blank",
                        "width=600,height=400"
                      );
                    }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-left"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-white"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="font-semibold">Udostępnij na Facebooku</span>
                  </motion.button>

                  {/* Twitter */}
                  <motion.button
                    onClick={() => {
                      const location = locations.find((loc) => loc.id === shareLocationId);
                      const url = encodeURIComponent(`${window.location.origin}/mapa?location=${shareLocationId}`);
                      const text = encodeURIComponent(location?.name || "");
                      window.open(
                        `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
                        "_blank",
                        "width=600,height=400"
                      );
                    }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors text-left"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-white"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    <span className="font-semibold">Udostępnij na Twitterze</span>
                  </motion.button>

                  {/* WhatsApp */}
                  <motion.button
                    onClick={() => {
                      const location = locations.find((loc) => loc.id === shareLocationId);
                      const url = encodeURIComponent(`${window.location.origin}/mapa?location=${shareLocationId}`);
                      const text = encodeURIComponent(`${location?.name || ""} - ${url}`);
                      window.open(
                        `https://wa.me/?text=${text}`,
                        "_blank",
                        "width=600,height=400"
                      );
                    }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-left"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-white"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    <span className="font-semibold">Udostępnij na WhatsApp</span>
                  </motion.button>

                  {/* Email */}
                  <motion.button
                    onClick={() => {
                      const location = locations.find((loc) => loc.id === shareLocationId);
                      const url = `${window.location.origin}/mapa?location=${shareLocationId}`;
                      const subject = encodeURIComponent(location?.name || "");
                      const body = encodeURIComponent(`Sprawdź to: ${location?.name}\n\n${url}`);
                      window.location.href = `mailto:?subject=${subject}&body=${body}`;
                    }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-left"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span className="font-semibold">Wyślij e-mailem</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MapContainer>
  );
}

