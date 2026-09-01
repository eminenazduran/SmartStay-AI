import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createMapPinIcon = (price, aiBadgeType) => {
  const pFormatted = Math.round(Number(price)).toLocaleString('tr-TR');

  let badgeBg = 'background: #000000; color: #ffffff;';
  let iconName = '';

  if (aiBadgeType === 'great-value' || price < 2000) {
    badgeBg = 'background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: #ffffff;';
    iconName = 'psychology';
  } else if (price > 4000) {
    badgeBg = 'background: #4648d4; color: #ffffff;';
    iconName = 'trending_up';
  }

  const iconHtml = iconName
    ? `<span class="material-symbols-outlined" style="font-size:15px;">${iconName}</span>`
    : '';

  return L.divIcon({
    className: '',
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
        <div style="${badgeBg}padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;white-space:nowrap;box-shadow:0 6px 20px rgba(0,0,0,0.15);border:2px solid #ffffff;display:flex;align-items:center;gap:4px;">
          ${iconHtml}
          <span>₺${pFormatted}</span>
        </div>
      </div>
    `,
    iconSize: [85, 36],
    iconAnchor: [42, 36],
    popupAnchor: [0, -36],
  });
};

const AutoFitBounds = ({ listings }) => {
  const map = useMap();
  useEffect(() => {
    const valid = listings
      .filter((l) => l.latitude && l.longitude)
      .map((l) => [l.latitude, l.longitude]);
    if (valid.length > 0) {
      map.fitBounds(L.latLngBounds(valid), { padding: [40, 40], maxZoom: 14 });
    }
  }, [listings, map]);
  return null;
};

export const MapView = ({ listings, onListingSelect }) => {
  const defaultCenter = [41.025, 28.985];

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%', minHeight: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <AutoFitBounds listings={listings} />

        {listings.map((listing) => {
          if (!listing.latitude || !listing.longitude) return null;
          return (
            <Marker
              key={listing.id}
              position={[listing.latitude, listing.longitude]}
              icon={createMapPinIcon(listing.price, listing.aiBadgeType)}
              eventHandlers={{
                click: () => onListingSelect && onListingSelect(listing)
              }}
            >
              <Popup className="ss-popup">
                <div style={{ width: 230, fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#ffffff', borderRadius: 14, overflow: 'hidden', color: '#1b1b1d' }}>
                  <div style={{ position: 'relative', height: 120, overflow: 'hidden', background: '#e4e2e4' }}>
                    <img
                      src={listing.imageUrl}
                      alt={listing.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {listing.aiBadge && (
                      <div style={{ position: 'absolute', top: 8, left: 8, background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#fff', padding: '3px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>
                        {listing.aiBadge}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '10px 12px 12px' }}>
                    <p style={{ fontWeight: 700, fontSize: 13, margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {listing.name}
                    </p>
                    <p style={{ fontSize: 11, color: '#45464d', margin: '0 0 8px' }}>
                      {listing.neighbourhoodCleansed}
                    </p>
                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 15, fontWeight: 800 }}>₺{Number(listing.price).toLocaleString('tr-TR')}</span>
                      <a href={`/listing/${listing.id}`} style={{ background: '#4648d4', color: '#ffffff', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>
                        Detay
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
  );
};
