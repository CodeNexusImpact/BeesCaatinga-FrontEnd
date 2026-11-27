import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import type * as Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import cores from '@/constants/cores';
import { LocalizacaoMapa, RegiaoDeMapa } from '@/types/mapa/mapaLocalizacao';
import { COR_TIPO, REGIAO_PADRAO } from './mapaComum';

interface MapaWebProps {
  localizacoes?: LocalizacaoMapa[];
  regiaoPadrao?: RegiaoDeMapa;
  permiteEdicao?: boolean;
  /** Ponto escolhido pelo usuário (modo edição): exibido com marcador destacado. */
  pontoSelecionado?: { latitude: number; longitude: number } | null;
  onMarkerPress?: (localizacao: LocalizacaoMapa) => void;
  onMapPress?: (latitude: number, longitude: number) => void;
  onMapClick?: (latitude: number, longitude: number) => void;
  style?: any;
}

const noopSubscribe = () => () => {};
const escapar = (t: string) => t.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export default function MapaWeb({
  localizacoes = [],
  regiaoPadrao = REGIAO_PADRAO,
  permiteEdicao = false,
  pontoSelecionado = null,
  onMarkerPress,
  onMapPress,
  onMapClick,
  style,
}: MapaWebProps) {
  // true no navegador, false na renderização estática (sem mismatch de hidratação)
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mapa, setMapa] = useState<{ L: typeof Leaflet; map: Leaflet.Map } | null>(null);
  const callbacks = useRef({ onMarkerPress, onMapPress, onMapClick, permiteEdicao });
  useEffect(() => {
    callbacks.current = { onMarkerPress, onMapPress, onMapClick, permiteEdicao };
  });
  const regiaoInicial = useRef(regiaoPadrao);

  // Cria o mapa uma única vez (marcadores são atualizados em outro efeito, sem perder o zoom).
  useEffect(() => {
    if (!isClient || !containerRef.current) return;
    let ativo = true;
    let resizeObserver: ResizeObserver | null = null;
    let instancia: Leaflet.Map | null = null;

    (async () => {
      try {
        // Leaflet empacotado no bundle (sem CDN); carregado só no navegador.
        const L = (await import('leaflet')).default as typeof Leaflet;
        if (!ativo || !containerRef.current) return;
        const r = regiaoInicial.current;
        instancia = L.map(containerRef.current, { center: [r.latitude, r.longitude], zoom: 12, zoomControl: true });
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
        }).addTo(instancia);
        instancia.on('click', (e: Leaflet.LeafletMouseEvent) => {
          const cb = callbacks.current;
          if (!cb.permiteEdicao) return;
          cb.onMapPress?.(e.latlng.lat, e.latlng.lng);
          cb.onMapClick?.(e.latlng.lat, e.latlng.lng);
        });
        [150, 600].forEach((ms) => setTimeout(() => ativo && instancia?.invalidateSize(), ms));
        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(() => instancia?.invalidateSize());
          resizeObserver.observe(containerRef.current);
        }
        setMapa({ L, map: instancia });
      } catch (err) {
        console.error('Erro ao inicializar o mapa Leaflet:', err);
      }
    })();

    return () => {
      ativo = false;
      resizeObserver?.disconnect();
      instancia?.remove();
      setMapa(null);
    };
  }, [isClient]);

  // Marcadores das localizações.
  useEffect(() => {
    if (!mapa) return;
    const { L, map } = mapa;
    const camada = L.layerGroup().addTo(map);
    localizacoes.forEach((loc) => {
      const icone = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="bees-pin" style="background:${COR_TIPO[loc.tipo] ?? '#666'}"><span>${loc.tipo.charAt(0).toUpperCase()}</span></div>`,
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -40],
      });
      L.marker([loc.latitude, loc.longitude], { icon: icone, title: loc.nome, alt: loc.nome })
        .bindPopup(
          `<div><strong>${escapar(loc.nome)}</strong><br/>${loc.descricao ? `${escapar(loc.descricao)}<br/>` : ''}<small>${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}</small></div>`,
        )
        .on('click', () => callbacks.current.onMarkerPress?.(loc))
        .addTo(camada);
    });
    if (localizacoes.length > 0) {
      map.fitBounds(L.latLngBounds(localizacoes.map((l) => [l.latitude, l.longitude] as [number, number])), { padding: [50, 50], maxZoom: 15 });
    }
    return () => {
      camada.remove();
    };
  }, [mapa, localizacoes]);

  // Ponto escolhido no modo edição.
  useEffect(() => {
    if (!mapa || !pontoSelecionado) return;
    const { L, map } = mapa;
    const marcador = L.marker([pontoSelecionado.latitude, pontoSelecionado.longitude], {
      icon: L.divIcon({ className: 'bees-marker bees-marker-selecionado', html: '<span></span>', iconSize: [26, 26], iconAnchor: [13, 26] }),
      title: 'Local escolhido',
      alt: 'Local escolhido',
    }).addTo(map);
    if (!map.getBounds().contains([pontoSelecionado.latitude, pontoSelecionado.longitude])) {
      map.setView([pontoSelecionado.latitude, pontoSelecionado.longitude], Math.max(map.getZoom(), 13));
    }
    return () => {
      marcador.remove();
    };
  }, [mapa, pontoSelecionado]);

  return (
    <View style={[styles.container, style]}>
      <style>{mapContainerStyle}</style>
      <div
        ref={containerRef}
        data-testid="mapa"
        style={{ width: '100%', height: '100%', minHeight: '320px', position: 'relative', zIndex: 0, cursor: permiteEdicao ? 'crosshair' : undefined }}
      >
        {!isClient && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={cores.primaria} />
          </View>
        )}
      </div>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    minHeight: 320,
    aspectRatio: 1 / 1,
    borderColor: cores.primaria,
    borderWidth: 2,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#e5e3df',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

const mapContainerStyle = `
  .leaflet-container { width: 100% !important; height: 100% !important; min-height: 320px !important; font-family: 'Roboto', sans-serif; z-index: 1; }
  .bees-marker span { display: block; width: 22px; height: 22px; border-radius: 50% 50% 50% 0; background: #E0A100; border: 2px solid #fff; transform: rotate(-45deg); box-shadow: 0 1px 4px rgba(0,0,0,.4); }
  .bees-marker-selecionado span { width: 26px; height: 26px; background: #C62828; }
  .bees-pin { width: 30px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,.25); }
  .bees-pin span { transform: rotate(45deg); color: #fff; font-weight: bold; font-size: 12px; }
  .leaflet-popup-content { font-size: 13px; font-family: 'Roboto', sans-serif; }
  .custom-div-icon { background: transparent; border: none; }
`;
