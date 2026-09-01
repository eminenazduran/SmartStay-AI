import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Star, MapPin, Sparkles, Flame, Bed, Users } from 'lucide-react';

// Leaflet varsayılan ikon yolu düzeltmesi
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Özel Fiyat Etiketli Harita İkonu Oluşturucu (Airbnb Stili)
const createCustomPriceIcon = (price, isDeal) => {
  const formattedPrice = Number(price).toLocaleString('tr-TR');
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div class="relative group cursor-pointer">
        <div class="px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center space-x-1 shadow-lg transition-all transform hover:scale-110 ${
          isDeal
            ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-rose-500/30 ring-2 ring-white/50'
            : 'bg-slate-900/90 text-brand-300 border border-brand-500/40 shadow-slate-950/60 hover:bg-brand-500 hover:text-slate-950'
        }">
          <span>${formattedPrice} TL</span>
          ${isDeal ? '<span class="text-[10px]">🔥</span>' : ''}
        </div>
        <div class="w-2 h-2 mx-auto rotate-45 -mt-1 ${isDeal ? 'bg-rose-500' : 'bg-slate-900 border-r border-b border-brand-500/40'}"></div>
      </div>
    `,
    iconSize: [80, 36],
    iconAnchor: [40, 36],
    popupAnchor: [0, -36]
  });
};

// Filtrelenen ilanlara göre harita sınırlarını otomatik odaklayan yardımcı bileşen
const MapBoundsUpdater = ({ listings }) => {
  const map = useMap();

  useEffect(() => {
    if (listings && listings.length > 0) {
      const validCoords = listings
        .filter(l => l.latitude && l.longitude)
        .map(l => [l.latitude, l.longitude]);

      if (validCoords.length > 0) {
        const bounds = L.latLngBounds(validCoords);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [listings, map]);

  return null;
};

export const MapView = ({ listings, selectedListingId, onSelectListing }) => {
  const defaultCenter = [41.0250, 28.9850]; // İstanbul Boğaz & Tarihi Yarımada merkezi
  const defaultZoom = 12;

  return (
    <div id="map" className="glass-card rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-800 space-y-4">
      {/* Harita Başlığı */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>İnteraktif İstanbul Konaklama Haritası</span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-teal-500/20 text-teal-300 font-semibold">
                {listings.length} Konum
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Fiyat etiketlerine tıklayarak ilan detaylarını ve AI değerlemesini inceleyin
            </p>
          </div>
        </div>

        {/* Lejant / Bilgi */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-slate-900 border border-brand-400"></span>
            <span>Standart Fiyat</span>
          </div>
          <div className="flex items-center space-x-1.5 text-amber-300 font-semibold">
            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></span>
            <span>🔥 Fırsat Fiyat</span>
          </div>
        </div>
      </div>

      {/* Harita Konteyneri */}
      <div className="w-full h-[520px] rounded-xl overflow-hidden relative border border-slate-800 z-10 shadow-inner">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          {/* CartoDB Dark Matter Modern Harita Katmanı */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
          />

          {/* Sınırları Otomatik Güncelleyici */}
          <MapBoundsUpdater listings={listings} />

          {/* İlan İşaretçileri (Markers) */}
          {listings.map((listing) => {
            if (!listing.latitude || !listing.longitude) return null;

            const isDeal = listing.predictedPrice && listing.price < listing.predictedPrice;
            const discountPercent = isDeal
              ? Math.round(((listing.predictedPrice - listing.price) / listing.predictedPrice) * 100)
              : 0;

            return (
              <Marker
                key={listing.id}
                position={[listing.latitude, listing.longitude]}
                icon={createCustomPriceIcon(listing.price, isDeal)}
                eventHandlers={{
                  click: () => onSelectListing && onSelectListing(listing.id)
                }}
              >
                {/* Zengin İlan Popup'ı */}
                <Popup className="custom-dark-popup">
                  <div className="w-64 bg-slate-900 text-slate-100 rounded-xl overflow-hidden shadow-2xl border border-slate-800 font-sans">
                    {/* Görsel */}
                    <div className="relative aspect-[16/10] bg-slate-800">
                      <img
                        src={listing.imageUrl || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80"}
                        alt={listing.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

                      <div className="absolute top-2 left-2 flex items-center space-x-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white">
                          {listing.neighbourhoodCleansed}
                        </span>
                      </div>

                      {isDeal && (
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md flex items-center space-x-1">
                            <Flame className="w-3 h-3" />
                            <span>%{discountPercent} Fırsat</span>
                          </span>
                        </div>
                      )}

                      <div className="absolute bottom-2 right-2 flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-900/90 text-amber-400 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{Number(listing.reviewScoresRating || 4.8).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Detaylar */}
                    <div className="p-3.5 space-y-2.5">
                      <div>
                        <h4 className="font-bold text-sm text-white line-clamp-1">
                          {listing.name}
                        </h4>
                        <p className="text-[11px] text-slate-400">{listing.roomType}</p>
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          <span>{listing.accommodates || 2} Kişi</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Bed className="w-3 h-3 text-slate-400" />
                          <span>{listing.bedrooms || 1} Yatak O.</span>
                        </span>
                      </div>

                      {/* Fiyat Bilgisi */}
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline space-x-1">
                            <span className="text-base font-extrabold text-white">
                              {Number(listing.price).toLocaleString('tr-TR')}
                            </span>
                            <span className="text-[10px] text-slate-400">TL/gece</span>
                          </div>
                          {listing.predictedPrice && (
                            <p className="text-[10px] text-slate-400 flex items-center space-x-1">
                              <Sparkles className="w-2.5 h-2.5 text-brand-400" />
                              <span>AI: {Number(listing.predictedPrice).toLocaleString('tr-TR')} TL</span>
                            </p>
                          )}
                        </div>

                        <a
                          href="#listings"
                          className="px-2.5 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-slate-950 text-xs font-bold transition-all text-center"
                        >
                          İncele
                        </a>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
