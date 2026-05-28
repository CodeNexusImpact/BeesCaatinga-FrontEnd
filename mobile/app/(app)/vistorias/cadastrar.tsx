import Botao from '@/components/botao';
import Input from '@/components/input';
import Selector from '@/components/selector';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert, View, Text } from 'react-native';
import Checkbox from 'expo-checkbox';
import { cadastrarVistoria } from '@/services/vistoriaService';
import ModalSucesso from '@/components/modalSucesso';
import { useAuth } from '@/hooks/useAuth';

export default function CadastrarVistoria() {
  const router = useRouter();
  const { session } = useAuth();
  const produtorId = session || 1;

  // --- Estados da Vistoria ---
  const [dataVistoria, setDataVistoria] = useState(new Date().toLocaleDateString('pt-BR'));
  const [apiario, setApiario] = useState('');
  const [colmeia, setColmeia] = useState('');
  const [condicao, setCondicao] = useState('saudavel');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalSucessoVisivel, setModalSucessoVisivel] = useState(false);

  // Estados para os checkboxes
  const [pragasObj, setPragasObj] = useState({
    varroa: false,
    formiga: false,
    traca: false,
    lagartixa: false,
    outro: false,
  });

  const [perdasObj, setPerdasObj] = useState({
    alimentacao: false,
    veneno: false,
    clima: false,
    outro: false,
  });

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
      // Converte objetos de checkbox em arrays de strings
      const pragas = Object.entries(pragasObj)
        .filter(([_, checked]) => checked)
        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));
      
      const perdas = Object.entries(perdasObj)
        .filter(([_, checked]) => checked)
        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

      const payload = {
        data: dataVistoria,
        apiarioId: apiario,
        colmeiaId: colmeia,
        condicaoVistoria: condicao,
        observacoes,
        pragas,
        perdas,
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

  // Componente auxiliar para renderizar cada item de checkbox
  const CheckboxItem = ({
    label,
    value,
    onValueChange,
  }: {
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.checkboxContainer}>
      <Checkbox
        style={styles.checkbox}
        value={value}
        onValueChange={onValueChange}
        color={value ? cores.primaria : undefined}
      />
      <Text style={styles.checkboxLabel}>{label}</Text>
    </View>
  );

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

      {/* Seção de Checkboxes */}
      <View style={styles.checkboxSection}>
        <View style={styles.checkboxColumn}>
          <Text style={styles.checkboxTitle}>Pragas</Text>
          <CheckboxItem label="Varroa" value={pragasObj.varroa} onValueChange={(v) => setPragasObj(p => ({...p, varroa: v}))} />
          <CheckboxItem label="Formiga" value={pragasObj.formiga} onValueChange={(v) => setPragasObj(p => ({...p, formiga: v}))} />
          <CheckboxItem label="Traça" value={pragasObj.traca} onValueChange={(v) => setPragasObj(p => ({...p, traca: v}))} />
          <CheckboxItem label="Lagartixa" value={pragasObj.lagartixa} onValueChange={(v) => setPragasObj(p => ({...p, lagartixa: v}))} />
          <CheckboxItem label="Outro" value={pragasObj.outro} onValueChange={(v) => setPragasObj(p => ({...p, outro: v}))} />
        </View>

        <View style={styles.checkboxColumn}>
          <Text style={styles.checkboxTitle}>Perda por</Text>
          <CheckboxItem label="Alimentação" value={perdasObj.alimentacao} onValueChange={(v) => setPerdasObj(p => ({...p, alimentacao: v}))} />
          <CheckboxItem label="Veneno" value={perdasObj.veneno} onValueChange={(v) => setPerdasObj(p => ({...p, veneno: v}))} />
          <CheckboxItem label="Clima" value={perdasObj.clima} onValueChange={(v) => setPerdasObj(p => ({...p, clima: v}))} />
          <CheckboxItem label="Outro" value={perdasObj.outro} onValueChange={(v) => setPerdasObj(p => ({...p, outro: v}))} />
        </View>
      </View>

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
  checkboxSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: layout.espacamento.amigavel,
    marginTop: layout.espacamento.texto,
    backgroundColor: cores.branco,
    padding: layout.espacamento.colega,
    borderRadius: layout.borderRadius.r25,
    borderWidth: 1,
    borderColor: cores.cores.base[20], 
  },
  checkboxColumn: {
    flex: 1,
    gap: layout.espacamento.colega,
  },
  checkboxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.preto,
    marginBottom: layout.espacamento.amigavel,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.espacamento.amigavel,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: layout.borderRadius.r25,
  },
  checkboxLabel: {
    fontSize: 15,
    color: cores.preto,
  },
});