import Botao from '@/components/formulario/botao';
import Input from '@/components/formulario/input';
import Selector from '@/components/formulario/selector';
import Subtexto from '@/components/subTexto';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { maskDate } from '@/utils/masks';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '@/hooks/useAuth';
import { listarApiariosPorProdutor } from '@/services/apiarioService';
import { cadastrarRastreabilidade } from '@/services/rastreabilidadeService';

export default function CadastrarLoteMel() {
  const router = useRouter();
  const { user } = useAuth();

  // Estados
  const [dataProducao, setDataProducao] = useState(new Date().toLocaleDateString('pt-BR'));
  const [quantidadeProduzida, setQuantidadeProduzida] = useState('');
  const [apiario, setApiario] = useState('');
  const [nomeFlorada, setNomeFlorada] = useState('');
  const [coordenadas, setCoordenadas] = useState<{ latitude: number; longitude: number } | null>(null);
  const [tipoAbelhas, setTipoAbelhas] = useState('');
  const [loading, setLoading] = useState(false);

  // Opções dinâmicas
  const [apiarioOptions, setApiarioOptions] = useState<{label: string, value: string}[]>([]);

  useEffect(() => {
    const fetchApiarios = async () => {
        if (!user?.id) return;
        try {
            const data = await listarApiariosPorProdutor(user.id);
            setApiarioOptions(data.map(a => ({ label: a.nome, value: a.id.toString() })));
        } catch (e) {
            console.error('❌ [CADASTRAR LOTE] Erro ao buscar apiários:', e);
        }
    };
    fetchApiarios();
  }, [user?.id]);

  const handleSubmit = async () => {
    if (!dataProducao || !quantidadeProduzida || !apiario || !tipoAbelhas || !user?.id) {
        Alert.alert('Erro', 'Preencha data, quantidade, apiário e tipo de abelha.');
        return;
    }
    if (!coordenadas) {
        Alert.alert('Erro', 'Registre a localização da produção ("Usar localização atual").');
        return;
    }

    setLoading(true);
    try {
        // Espelha LoteCriadoDTO do backend (apiário é identificado pelo nome).
        const payload = {
            dataProducao,
            quantidadeProduzida: parseFloat(quantidadeProduzida.replace(',', '.')),
            nomeApiario: apiarioOptions.find((a) => a.value === apiario)?.label ?? '',
            tipoFlorada: nomeFlorada || undefined,
            tipoAbelha: tipoAbelhas,
            latitude: coordenadas.latitude,
            longitude: coordenadas.longitude,
            vendido: false,
        };

        await cadastrarRastreabilidade(user.id, payload);
        Alert.alert('Sucesso', 'Lote cadastrado com sucesso!');
        router.push('/rastreabilidade/listar');
    } catch (error) {
        console.error('❌ [CADASTRAR LOTE] Erro ao salvar:', error);
        Alert.alert('Erro', 'Ocorreu um erro ao salvar o lote no servidor.');
    } finally {
        setLoading(false);
    }
  };

  const handleDateChange = (text: string) => {
    setDataProducao(maskDate(text));
  };

  const usarLocalizacaoAtual = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Não foi possível acessar a localização.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      setCoordenadas({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
    } catch {
      Alert.alert('Erro', 'Não foi possível obter a localização atual.');
    }
  };

  // Valores alinhados aos enums TipoAbelha / TipoFlorada do backend.
  const tipoAbelhasOptions = [
    { label: 'Jandaíra', value: 'JANDAIRA' },
    { label: 'Uruçu Nordestina', value: 'URUCU_NORDESTINA' },
    { label: 'Africanizada', value: 'AFRICANIZADA' },
    { label: 'Apis mellifera', value: 'APIS_MELLIFERA' },
  ];

  const floradaOptions = [
    { label: 'Silvestre', value: 'SILVESTRE' },
    { label: 'Polifloral', value: 'POLIFLORAL' },
    { label: 'Monofloral', value: 'MONOFLORAL' },
    { label: 'Marmeleiro', value: 'MARMELEIRO' },
    { label: 'Jitirana', value: 'JITIRANA' },
    { label: 'Angico', value: 'ANGICO' },
    { label: 'Aroeira', value: 'AROEIRA' },
    { label: 'Cipó-uva', value: 'CIPO_UVA' },
    { label: 'Quitoco', value: 'QUITOCO' },
    { label: 'Eucalipto', value: 'EUCALIPTO' },
    { label: 'Laranjeira', value: 'LARANJEIRA' },
    { label: 'Assa-peixe', value: 'ASSA_PEIXE' },
    { label: 'Acácia', value: 'ACACIA' },
    { label: 'Café', value: 'CAFE' },
    { label: 'Uva-japonesa', value: 'UVA_JAPONESA' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Stack.Screen options={{ title: 'Cadastrar' }} />
      <Subtexto style={styles.subtitulo}>Preencha os dados do lote de mel para gerar um ID.</Subtexto>

      {/* Data de Produção/Extração */}
      <Input
        label="Data de Produção/Extração"
        value={dataProducao}
        onChangeText={handleDateChange}
        placeholder="dd/mm/aaaa"
        iconName="calendar"
        maxLength={10}
      />

      {/* Quantidade Produzida */}
      <Input
        label="Quantidade Produzida (kg)"
        value={quantidadeProduzida}
        onChangeText={(text) => {
          const cleaned = text.replace(/[^0-9.,]/g, '');
          setQuantidadeProduzida(cleaned);
        }}
        keyboardType="decimal-pad"
        placeholder="0,0"
      />

      {/* Apiário */}
      <Selector
        label="Selecione o apiário"
        options={apiarioOptions}
        onSelect={setApiario}
        placeholder="Selecione o apiário"
        iconName="beehiveOutline"
      />

      {/* Nome da Florada */}
      <Selector
        label="Nome da florada"
        options={floradaOptions}
        onSelect={setNomeFlorada}
        placeholder="Selecione a florada"
        iconName="flower"
      />

      {/* Localidade da Produção */}
      <Botao title="📍 Usar localização atual" onPress={usarLocalizacaoAtual} cor="secundaria" />
      <Text style={styles.subtitulo}>
        {coordenadas
          ? `Localização: ${coordenadas.latitude.toFixed(5)}, ${coordenadas.longitude.toFixed(5)}`
          : 'Localização da produção não registrada'}
      </Text>

      {/* Tipo de Abelhas */}
      <Selector
        label="Tipo de Abelhas"
        options={tipoAbelhasOptions}
        onSelect={setTipoAbelhas}
        placeholder="Selecione o tipo de abelhas"
        iconName="bee"
      />

      {/* Botão Cadastrar */}
      <Botao
        title={loading ? 'Salvando...' : 'Cadastrar'}
        onPress={loading ? () => {} : handleSubmit}
        cor="primaria"
        style={styles.button}
      />
    </ScrollView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  contentContainer: {
    padding: layout.espacamento.amigavel,
    gap: layout.espacamento.colega,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.texto,
    textAlign: 'center',
    marginBottom: layout.espacamento.texto,
  },
  subtitulo: {
    fontSize: 16,
    color: cores.texto,
    textAlign: 'center',
    marginBottom: layout.espacamento.amigavel,
    lineHeight: 20,
  },
  button: {
    marginTop: layout.espacamento.social,
  },
});