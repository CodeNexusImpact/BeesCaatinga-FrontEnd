import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import * as Location from 'expo-location';
import Mapa from '@/components/mapa/mapa';
import Botao from '@/components/formulario/botao';
import cores from '@/constants/cores';
import { alerta } from '@/utils/alerta';
import { arredondarCoordenada, validarCoordenadas } from './mapaComum';
import type { LocalizacaoMapa } from '@/types/mapa/mapaLocalizacao';

export interface Coordenada {
  latitude: number;
  longitude: number;
}

interface Props {
  valor: Coordenada | null;
  onChange: (c: Coordenada | null) => void;
  /** Outros pontos para referência (ex.: demais apiários). */
  referencias?: LocalizacaoMapa[];
  dica?: string;
}

const fmt = (n: number | undefined) => (n === undefined ? '' : String(n));

/**
 * Escolha de localização: toque/clique no mapa, GPS do aparelho ou digitação manual
 * (com validação de faixa: latitude -90..90, longitude -180..180).
 */
export default function SeletorLocalizacao({ valor, onChange, referencias = [], dica = 'Toque no mapa no local do apiário, use o GPS ou digite as coordenadas.' }: Props) {
  const [lat, setLat] = useState(fmt(valor?.latitude));
  const [lng, setLng] = useState(fmt(valor?.longitude));
  const [erro, setErro] = useState<string | null>(null);
  const [buscandoGps, setBuscandoGps] = useState(false);
  const [valorAnterior, setValorAnterior] = useState(valor);

  // Sincroniza os campos quando o valor muda por fora (mapa, GPS ou carregamento da edição).
  if (valor !== valorAnterior) {
    setValorAnterior(valor);
    setLat(fmt(valor?.latitude));
    setLng(fmt(valor?.longitude));
  }

  const definir = (latitude: number, longitude: number) => {
    const c = { latitude: arredondarCoordenada(latitude), longitude: arredondarCoordenada(longitude) };
    setErro(null);
    onChange(c);
  };

  const aoDigitar = (novaLat: string, novaLng: string) => {
    setLat(novaLat);
    setLng(novaLng);
    const normLat = novaLat.replace(',', '.').trim();
    const normLng = novaLng.replace(',', '.').trim();
    if (!normLat && !normLng) {
      setErro(null);
      onChange(null);
      return;
    }
    const msg = validarCoordenadas(normLat, normLng);
    setErro(msg);
    if (!msg) {
      const c = { latitude: Number(normLat), longitude: Number(normLng) };
      setValorAnterior(c);
      onChange(c);
    }
  };

  const usarGps = async () => {
    try {
      setBuscandoGps(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alerta('Localização não permitida', 'Para preencher sozinho, permita o acesso à localização. Você também pode tocar no mapa ou digitar as coordenadas.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      definir(pos.coords.latitude, pos.coords.longitude);
    } catch {
      alerta('Sem GPS', 'Não foi possível obter sua localização agora. Toque no mapa no local do apiário ou digite as coordenadas.');
    } finally {
      setBuscandoGps(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.dica}>{dica}</Text>
      <Mapa localizacoes={referencias} permiteEdicao pontoSelecionado={valor} onMapPress={definir} style={styles.mapa} />
      <Botao title={buscandoGps ? 'Obtendo localização...' : 'Usar minha localização atual'} iconName="location" onPress={usarGps} cor="branca" />
      <View style={styles.linha}>
        <View style={styles.campo}>
          <Text style={styles.rotulo}>Latitude</Text>
          <TextInput
            style={styles.input}
            value={lat}
            onChangeText={(t) => aoDigitar(t, lng)}
            placeholder="Ex.: -7.02470"
            keyboardType="numbers-and-punctuation"
            accessibilityLabel="Latitude"
          />
        </View>
        <View style={styles.campo}>
          <Text style={styles.rotulo}>Longitude</Text>
          <TextInput
            style={styles.input}
            value={lng}
            onChangeText={(t) => aoDigitar(lat, t)}
            placeholder="Ex.: -37.28060"
            keyboardType="numbers-and-punctuation"
            accessibilityLabel="Longitude"
          />
        </View>
      </View>
      {erro ? (
        <Text style={styles.erro}>{erro}</Text>
      ) : valor ? (
        <Text style={styles.ok}>{`Coordenadas: ${valor.latitude.toFixed(5)}, ${valor.longitude.toFixed(5)}`}</Text>
      ) : (
        <Text style={styles.dica}>Nenhuma localização escolhida.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8, width: '100%' },
  mapa: { minHeight: 280, aspectRatio: 1.2 },
  linha: { flexDirection: 'row', gap: 8 },
  campo: { flex: 1, gap: 4 },
  rotulo: { fontWeight: '600', color: cores.texto },
  input: { borderWidth: 1, borderColor: '#999', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 10, fontSize: 16, backgroundColor: '#fff' },
  dica: { color: '#555', fontSize: 14 },
  erro: { color: '#C62828', fontSize: 14, fontWeight: '600' },
  ok: { color: '#2E7D32', fontSize: 14, fontWeight: '600' },
});
