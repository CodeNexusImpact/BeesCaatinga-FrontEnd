import React, { useEffect, useState } from 'react';
import MapView, { Marker, Circle } from 'react-native-maps';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import cores from '@/constants/cores';
import { LocalizacaoMapa, RegiaoDeMapa } from '@/types/mapa/mapaLocalizacao';

interface MapaProps {
  localizacoes?: LocalizacaoMapa[];
  permiteEdicao?: boolean;
  onMarkerPress?: (localizacao: LocalizacaoMapa) => void;
  onMapPress?: (latitude: number, longitude: number) => void;
  onMapClick?: (latitude: number, longitude: number) => void;
  style?: any;
}

export default function Mapa({
  localizacoes = [],
  permiteEdicao = false,
  onMarkerPress,
  onMapPress,
  onMapClick,
  style,
}: MapaProps) {
  const [initialRegion, setInitialRegion] = useState<RegiaoDeMapa | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Solicitar permissão de localização
        let { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          console.warn('Permissão de localização negada');
          // Definir região padrão (Caatinga, Brasil)
          setInitialRegion({
            latitude: -5.0917,
            longitude: -42.8156,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          });
          setLoading(false);
          return;
        }

        // Obter localização atual
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const { latitude, longitude } = location.coords;
        setUserLocation({ latitude, longitude });

        setInitialRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

        setLoading(false);
      } catch (error) {
        console.error('Erro ao obter localização:', error);
        Alert.alert('Erro', 'Não foi possível obter sua localização');
        // Fallback: região padrão
        setInitialRegion({
          latitude: -5.0917,
          longitude: -42.8156,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        });
        setLoading(false);
      }
    })();
  }, []);

  const handleMarkerPress = (localizacao: LocalizacaoMapa) => {
    if (onMarkerPress) {
      onMarkerPress(localizacao);
    }
  };

  const handleMapPress = (event: any) => {
    if (permiteEdicao) {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      if (onMapPress) {
        onMapPress(latitude, longitude);
      }
      if (onMapClick) {
        onMapClick(latitude, longitude);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  if (!initialRegion) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        onPress={handleMapPress}
        zoomEnabled={true}
        scrollEnabled={true}
      >
        {/* Marcador da localização do usuário */}
        {userLocation && (
          <Circle
            center={userLocation}
            radius={100}
            strokeColor={cores.primaria}
            strokeWidth={2}
            fillColor={`${cores.primaria}20`}
          />
        )}

        {/* Marcadores das localizações */}
        {localizacoes.map((localizacao) => (
          <Marker
            key={`${localizacao.tipo}-${localizacao.id}`}
            coordinate={{
              latitude: localizacao.latitude,
              longitude: localizacao.longitude,
            }}
            title={localizacao.nome}
            description={localizacao.descricao}
            onPress={() => handleMarkerPress(localizacao)}
            pinColor={
              localizacao.tipo === 'apiario'
                ? cores.primaria
                : localizacao.tipo === 'vistoria'
                ? cores.secundaria
                : cores.alerta
            }
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1 / 1,
    borderColor: cores.primaria,
    borderWidth: 2,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});