import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const makePin = (price, deal) => {
  const p = Math.round(Number(price)).toLocaleString('tr-TR');
  const bg   = deal ? 'linear-gradient(135deg,#f59e0b,#ef4444)' : 'rgba(10,10,15,0.92)';
  const bdr  = deal ? 'rgba(255,255,255,0.25)' : 'rgba(249,115,22,0.4)';
  const clr  = deal ? '#fff' : '#fb923c';
  const tip  = deal ? '#ef4444' : 'rgba(10,10,15,0.92)';
  const tipb = deal ? 'none' : '1px solid rgba(249,115,22,0.4)';
  return L.divIcon({
    className: '',
    html: `<div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
      <div style="background:${bg};border:1px solid ${bdr};color:${clr};padding:4px 11px;border-radius:20px;font-size:11px;font-weight:800;font-family:'Plus Jakarta Sans',sans-serif;white-space:nowrap;box-shadow:0 6px 24px rgba(0,0,0,0.5);display:flex;align-items:center;gap:4px;">
        ₺${p}${deal ? ' 🔥' : ''}
      </div>
      <div style="background:${tip};border-right:${tipb};border-bottom:${tipb};width:8px;height:8px;transform:rotate(45deg);margin-top:-4px;"></div>
    </div>`,
    iconSize: [90, 38], iconAnchor: [45, 38], popupAnchor: [0, -42],
  });
};

const AutoFit = ({ listings }) => {
  const map = useMap();
  useEffect(() => {
    const pts = listings.filter(l => l.latitude && l.longitude).map(l => [l.latitude, l.longitude]);
    if (pts.length) map.fitBounds(L.latLngBounds(pts), { padding: [50, 50], maxZoom: 14 });
  }, [listings, map]);
  return null;
};

export const MapView = ({ listings }) => (
  <div className="rounded-2xl overflow-hidden border border-white/[0.06]" style={{ height: 440 }}>
    <MapContainer center={[41.025, 28.985]} zoom={12} scrollWheelZoom={false} style={{ width:'100%', height:'100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
      <AutoFit listings={listings} />
      {listings.map(l => {
        if (!l.latitude || !l.longitude) return null;
        const deal = l.predictedPrice && l.price < l.predictedPrice;
        const disc = deal ? Math.round(((l.predictedPrice - l.price) / l.predictedPrice)*100) : 0;
        return (
          <Marker key={l.id} position={[l.latitude, l.longitude]} icon={makePin(l.price, deal)}>
            <Popup className="ss-popup">
              <div style={{width:240,fontFamily:"'Plus Jakarta Sans',sans-serif",background:'#0f0f16',color:'#eee',borderRadius:14,overflow:'hidden'}}>
                <div style={{position:'relative',height:120,overflow:'hidden',background:'#1a1a24'}}>
                  <img src={l.imageUrl} alt={l.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(15,15,22,0.9),transparent)'}} />
                  {deal && <div style={{position:'absolute',top:8,left:8,background:'linear-gradient(135deg,#f59e0b,#ef4444)',color:'#fff',padding:'2px 9px',borderRadius:20,fontSize:10,fontWeight:800}}>🔥 %{disc} Fırsat</div>}
                  <div style={{position:'absolute',bottom:8,right:8,background:'rgba(0,0,0,0.7)',color:'#fbbf24',padding:'3px 9px',borderRadius:20,fontSize:11,fontWeight:700}}>★ {Number(l.reviewScoresRating||4.8).toFixed(1)}</div>
                </div>
                <div style={{padding:'10px 12px 12px'}}>
                  <p style={{fontWeight:700,fontSize:13,margin:'0 0 3px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{l.name}</p>
                  <p style={{fontSize:11,color:'#666',margin:'0 0 8px'}}>{l.neighbourhoodCleansed} · {l.roomType}</p>
                  <div style={{borderTop:'1px solid rgba(255,255,255,0.05)',paddingTop:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <span style={{fontSize:16,fontWeight:900}}>₺{Number(l.price).toLocaleString('tr-TR',{maximumFractionDigits:0})}</span>
                      <span style={{fontSize:11,color:'#555',marginLeft:3}}>/gece</span>
                    </div>
                    <a href="#listings" style={{background:'linear-gradient(135deg,#f97316,#ec4899)',color:'#fff',padding:'5px 12px',borderRadius:9,fontSize:11,fontWeight:800,textDecoration:'none'}}>İncele</a>
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
