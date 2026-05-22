import Botao from '@/components/botao';
import Input from '@/components/input';
import Selector from '@/components/selector';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert, View } from 'react-native';
import { cadastrarVistoria } from '@/services/vistoriaService';
import ModalSucesso from '@/components/modalSucesso';

export default function CadastrarVistoria() {
  const router = useRouter();

  // --- Estados da Vistoria ---
  const [dataVistoria, setDataVistoria] = useState(new Date().toLocaleDateString('pt-BR'));
  const [apiario, setApiario] = useState('');
  const [colmeia, setColmeia] = useState('');
  const [condicao, setCondicao] = useState('saudavel');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalSucessoVisivel, setModalSucessoVisivel] = useState(false);

  // --- Opções (mock data) ---
  const apiarioOptions = [
    { label: 'Rosa do Sertão', value: '1' },
    { label: 'Vale das Abelhas', value: '2' },
  ];

  const colmeiaOptions = [
    { label: 'Colmeia 1', value: '1' },
    { label: 'Colmeia 2', value: '2' },
  ];

  const condicaoOptions = [
    { label: 'Saudável', value: 'saudavel' },
    { label: 'Manutenção Necessária', value: 'manutencao' },
    { label: 'Em Risco', value: 'risco' },
    { label: 'Perdida', value: 'perdida' },
  ];

  const handleSalvar = async () => {
    if (!apiario || !colmeia) {
      Alert.alert('Erro', 'Por favor, selecione o apiário e a colmeia.');
      return;
    }

    setLoading(true);
    try {
      const produtorId = 1; // Mock produtor ID
      
      const payload = {
        data: dataVistoria,
        apiarioId: apiario,
        colmeiaId: colmeia,
        condicaoVistoria: condicao,
        observacoes,
      };

      await cadastrarVistoria(produtorId, payload);

      setModalSucessoVisivel(true);
    } catch (error) {
      console.error('Erro ao salvar vistoria:', error);
      Alert.alert('Erro', 'Não foi possível salvar a vistoria.');
    } finally {
      setLoading(false);
    }
  };

  const aoFecharSucesso = () => {
    setModalSucessoVisivel(false);
    router.back();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Input
        label="Data da Vistoria:"
        value={dataVistoria}
        onChangeText={setDataVistoria}
        placeholder="dd/mm/aaaa"
        iconName="calendar"
      />

      <Selector
        label="Selecione o Apiário*"
        options={apiarioOptions}
        onSelect={setApiario}
        placeholder="Selecione"
        iconName="home"
        value={apiario}
      />

      <Selector
        label="Selecione a Colmeia*"
        options={colmeiaOptions}
        onSelect={setColmeia}
        placeholder="Selecione"
        iconName="beehiveOutline"
        value={colmeia}
      />

      <Selector
        label="Condição:"
        options={condicaoOptions}
        onSelect={setCondicao}
        placeholder="Selecione a condição da colmeia"
        value={condicao}
      />

      <Input
        label="Observações:"
        value={observacoes}
        onChangeText={setObservacoes}
        placeholder="Observações (opcional):"
        multiline={true}
        numberOfLines={5}
        style={styles.textArea}
      />

      <Botao
        title={loading ? "Salvando..." : "Salvar"}
        onPress={handleSalvar}
        cor="primaria"
        style={styles.button}
        disabled={loading}
      />

      <ModalSucesso
        visivel={modalSucessoVisivel}
        mensagem="Vistoria cadastrada com sucesso!"
        aoFechar={aoFecharSucesso}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  contentContainer: {
    padding: layout.espacamento.amigavel,
    gap: layout.espacamento.colega,
  },
  button: {
    marginTop: layout.espacamento.social,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    padding: layout.espacamento.amigavel,
  },
});