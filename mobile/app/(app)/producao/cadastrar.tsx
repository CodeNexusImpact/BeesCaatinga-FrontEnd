import Botao from '@/components/botao';
import Input from '@/components/input';
import Selector from '@/components/selector';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { maskDate } from '@/utils/masks';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Alert, ActivityIndicator } from 'react-native';
import { cadastrarProducao } from '@/services/producaoService';
import { listarApiariosPorProdutor } from '@/services/apiarioService';
import { listarColmeiasPorApiario } from '@/services/colmeiaService';
import { useAuth } from '@/hooks/useAuth';
import type { ProducaoCriadaDTO } from '@/types/producao';
import { UnidadeMedida } from '@/types/insumos/Enums';

export default function CadastrarProducao() {
  const router = useRouter();
  const { user } = useAuth();

  // Estados
  const [tipoProduto, setTipoProduto] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [medida, setMedida] = useState<UnidadeMedida | ''>('');
  const [apiario, setApiario] = useState('');
  const [colmeia, setColmeia] = useState('');
  const [dataColeta, setDataColeta] = useState(new Date().toLocaleDateString('pt-BR'));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Opções dinâmicas
  const [apiarioOptions, setApiarioOptions] = useState<{label: string, value: string}[]>([]);
  const [colmeiaOptions, setColmeiaOptions] = useState<{label: string, value: string}[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  useEffect(() => {
    const fetchApiarios = async () => {
        if (!user?.id) return;
        try {
            setLoadingOptions(true);
            const data = await listarApiariosPorProdutor(user.id);
            setApiarioOptions(data.map(a => ({ label: a.nome, value: a.id.toString() })));
        } catch (e) {
            console.error('Erro ao buscar apiários:', e);
        } finally {
            setLoadingOptions(false);
        }
    };
    fetchApiarios();
  }, [user?.id]);

  useEffect(() => {
    const fetchColmeias = async () => {
        if (!apiario || !user?.id) {
            setColmeiaOptions([]);
            return;
        };
        try {
            const data = await listarColmeiasPorApiario(user.id, apiario);
            setColmeiaOptions(data.map((c: any) => ({ label: `Colmeia ${c.id}`, value: c.id.toString() })));
        } catch (e) {
            console.error('Erro ao buscar colmeias:', e);
        }
    };
    fetchColmeias();
  }, [apiario, user?.id]);

  const handleSubmit = async () => {
    // Validação de campos vazios
    if (!quantidade || !medida || !tipoProduto || !apiario || !colmeia || !dataColeta || !user?.id) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    // Validação básica de formato de data (DD/MM/YYYY)
    if (dataColeta.length < 10) {
      Alert.alert('Erro', 'Por favor, insira uma data válida (dd/mm/aaaa).');
      return;
    }

    setIsSubmitting(true);
    try {
      // Formata a data de DD/MM/YYYY para YYYY-MM-DD
      const partes = dataColeta.split('/');
      if (partes.length !== 3) throw new Error('Formato de data inválido');
      const [dia, mes, ano] = partes;
      const dataFormatada = `${ano}-${mes}-${dia}`;

      const dto: ProducaoCriadaDTO = {
        tipoProducao: tipoProduto,
        quantidade: parseFloat(quantidade.replace(',', '.')),
        unidadeMedida: medida as UnidadeMedida,
        apiarioId: parseInt(apiario),
        colmeiaId: parseInt(colmeia),
        dataColeta: dataFormatada,
      };

      await cadastrarProducao(user.id, dto);
      
      Alert.alert('Sucesso', 'Produção cadastrada com sucesso!', [
        { text: 'OK', onPress: () => router.push('/producao/listar') }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar a produção.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (text: string) => {
    setDataColeta(maskDate(text));
  };

  // Opções fixas
  const tipoProdutoOptions = [
    { label: 'Mel de Jandaíra', value: 'Mel de Jandaíra' },
    { label: 'Mel de Marmeleiro', value: 'Mel de Marmeleiro' },
  ];

  const medidaOptions = [
    { label: 'Kg', value: 'KILOGRAMA' },
    { label: 'L', value: 'LITRO' },
  ];

  // Conversão fixa só para exibição (pode ser calculada depois)
  const conversao = '1,43 L';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Stack.Screen options={{ title: 'Cadastrar Produção' }} />
      {/* Conversão (somente leitura) */}
      <Input
        label="Conversão para litro"
        value={conversao}
        editable={false}
        style={styles.conversaoInput}
        placeholder="Cálculo automático"
        onChangeText={() => {}} 
      />

      {/* Quantidade + Medida */}
      <View style={styles.row}>
        <Input
          label="Adicione a Quantidade"
          value={quantidade}
          onChangeText={(text) => {
            const cleaned = text.replace(/[^0-9.,]/g, '');
            setQuantidade(cleaned);
          }}
          keyboardType="decimal-pad"
          style={styles.inputMetade}
          placeholder="0,0"
        />
        <Selector
          label="Medida"
          options={medidaOptions}
          onSelect={(val) => setMedida(val as UnidadeMedida)}
          placeholder="Selecione"
          style={styles.inputMetade}
          value={medida}
        />
      </View>

      {/* Tipo de Mel */}
      <Selector
        label="Tipo de Mel"
        options={tipoProdutoOptions}
        onSelect={setTipoProduto}
        placeholder="Selecione o tipo de Mel"
        iconName="honeycomb"
        value={tipoProduto}
      />

      {/* Apiário */}
      <Selector
        label="Apiário"
        options={apiarioOptions}
        onSelect={setApiario}
        placeholder="Selecione o Apiário"
        iconName="home"
        value={apiario}
      />

      {/* Colmeia */}
      <Selector
        label="Colmeia"
        options={colmeiaOptions}
        onSelect={setColmeia}
        placeholder="Selecione a Colmeia"
        iconName="beehiveOutline"
        value={colmeia}
      />

      {/* Data Coleta */}
      <Input
        label="Data de Coleta"
        value={dataColeta}
        onChangeText={handleDateChange}
        placeholder="dd/mm/aaaa"
        iconName="calendar"
        maxLength={10}
      />

      {/* Botão */}
      <Botao
        title={isSubmitting ? "Enviando..." : "Cadastrar"}
        onPress={handleSubmit}
        cor="primaria"
        style={[styles.button, isSubmitting && { opacity: 0.7 }]}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: layout.espacamento.amigavel,
    zIndex: 10,
    position: 'relative',
  },
  inputMetade: {
    flex: 1,
  },
  conversaoInput: {
    backgroundColor: cores.cores.primaria[10], 
    borderColor: cores.cores.primaria[30], 
  },
  button: {
    marginTop: layout.espacamento.social,
  },
});