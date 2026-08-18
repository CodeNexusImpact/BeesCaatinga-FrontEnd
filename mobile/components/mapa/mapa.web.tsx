import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import type * as Leaflet from 'leaflet';
import cores from '@/constants/cores';
import { LocalizacaoMapa, RegiaoDeMapa } from '@/types/mapa/mapaLocalizacao';

interface MapaWebProps {
  localizacoes?: LocalizacaoMapa[];
  regiaoPadrao?: RegiaoDeMapa;
  permiteEdicao?: boolean;
  onMarkerPress?: (localizacao: LocalizacaoMapa) => void;
  onMapPress?: (latitude: number, longitude: number) => void;
  onMapClick?: (latitude: number, longitude: number) => void;
  style?: any;
}

export default function MapaWeb({
  localizacoes = [],
  regiaoPadrao = {
    latitude: -5.0917,
    longitude: -42.8156,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  },
  permiteEdicao = false,
  onMarkerPress,
  onMapPress,
  onMapClick,
  style,
}: MapaWebProps) {
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const markersRef = useRef<Leaflet.Marker[]>([]);

  // Garantir injeção do CSS do Leaflet no head do documento
  useEffect(() => {
    setIsClient(true);

    if (typeof document !== 'undefined') {
      const cssId = 'leaflet-cdn-css';
      if (!document.getElementById(cssId)) {
        const link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.crossOrigin = '';
        document.head.appendChild(link);
      }
    }
  }, []);

  useEffect(() => {
    if (!isClient || typeof window === 'undefined' || !containerRef.current) return;

    let isMounted = true;
    let resizeObserver: ResizeObserver | null = null;

    const initMap = async () => {
      try {
        const leafletModule = await import('leaflet');
        const L = (leafletModule.default || leafletModule) as typeof Leaflet;

        if (!isMounted || !containerRef.current) return;

        // Limpar mapa anterior se existir
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }

        // Limpar ID do Leaflet no container para evitar erro de re-inicialização
        if ((containerRef.current as any)._leaflet_id) {
          (containerRef.current as any)._leaflet_id = null;
        }

        // Definir ícones padrão do Leaflet com URLs seguras
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        // Criar novo mapa
        const map = L.map(containerRef.current, {
          center: [regiaoPadrao.latitude, regiaoPadrao.longitude],
          zoom: 12,
          zoomControl: true,
        });

        // Adicionar layer do OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        // Forçar Leaflet a recalcular tamanho do container
        setTimeout(() => {
          if (isMounted && map) {
            map.invalidateSize();
          }
        }, 150);

        setTimeout(() => {
          if (isMounted && map) {
            map.invalidateSize();
          }
        }, 600);

        // Observar mudanças de tamanho do elemento
        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(() => {
            if (map) {
              map.invalidateSize();
            }
          });
          resizeObserver.observe(containerRef.current);
        }

        // Adicionar click handler se permitir edição
        if (permiteEdicao) {
          map.on('click', (e: Leaflet.LeafletMouseEvent) => {
            if (onMapPress) {
              onMapPress(e.latlng.lat, e.latlng.lng);
            }
            if (onMapClick) {
              onMapClick(e.latlng.lat, e.latlng.lng);
            }
          });
        }

        // Adicionar marcadores
        markersRef.current = [];
        localizacoes.forEach((localizacao) => {
          const cor = getColorForTipo(localizacao.tipo);

          const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `
              <div style="
                background-color: ${cor};
                width: 30px;
                height: 40px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 2px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.25);
              ">
                <div style="
                  transform: rotate(45deg);
                  color: white;
                  font-weight: bold;
                  font-size: 12px;
                ">
                  ${localizacao.tipo ? localizacao.tipo.charAt(0).toUpperCase() : '📍'}
                </div>
              </div>
            `,
            iconSize: [30, 40],
            iconAnchor: [15, 40],
            popupAnchor: [0, -40],
          });

          const marker = L.marker(
            [localizacao.latitude, localizacao.longitude],
            { icon: customIcon }
          )
            .bindPopup(
              `<div>
                <strong>${localizacao.nome}</strong><br/>
                ${localizacao.descricao ? `<p>${localizacao.descricao}</p>` : ''}
                <small>${localizacao.latitude.toFixed(4)}, ${localizacao.longitude.toFixed(4)}</small>
              </div>`
            )
            .addTo(map);

          marker.on('click', () => {
            if (onMarkerPress) {
              onMarkerPress(localizacao);
            }
          });

          markersRef.current.push(marker);
        });

        // Ajustar visualização para conter marcadores se houver
        if (localizacoes.length > 0) {
          const bounds = L.latLngBounds(
            localizacoes.map((loc) => [loc.latitude, loc.longitude] as [number, number])
          );
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }

        mapRef.current = map;
      } catch (err) {
        console.error('Erro ao inicializar o mapa Leaflet:', err);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isClient, localizacoes, regiaoPadrao, permiteEdicao, onMarkerPress, onMapPress, onMapClick]);

  return (
    <View style={[styles.container, style]}>
      <style>{mapContainerStyle}</style>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '350px',
          position: 'relative',
          zIndex: 0,
        }}
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

function getColorForTipo(tipo: string): string {
  const colorMap: Record<string, string> = {
    apiario: '#2E7D32',      // Verde
    vistoria: '#1565C0',     // Azul
    propriedade: '#F57C00',  // Laranja
    produtor: '#C62828',     // Vermelho
  };
  return colorMap[tipo] || '#666666';
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    minHeight: 350,
    aspectRatio: 1 / 1,
    borderColor: cores.primaria,
    borderWidth: 2,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#e5e3df', // Cor de fundo semelhante aos tiles de mapa
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
  .leaflet-container {
    width: 100% !important;
    height: 100% !important;
    min-height: 350px !important;
    font-family: 'Roboto', sans-serif;
    z-index: 1;
  }

  .leaflet-popup-content {
    font-size: 12px;
    font-family: 'Roboto', sans-serif;
  }

  .custom-div-icon {
    background: transparent;
    border: none;
  }
`;