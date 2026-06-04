import Botao from '@/components/formulario/botao';
import Input from '@/components/formulario/input';
import Selector from '@/components/formulario/selector';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Checkbox from 'expo-checkbox';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, 
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import { getVistoriaById, atualizarVistoria } from '@/services/vistoriaService';

export default function EditarVistoria() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [dataVistoria, setDataVistoria] = useState('');
  const [apiario, setApiario] = useState('');
  const [colmeia, setColmeia] = useState('');
  const [condicao, setCondicao] = useState('');
  const [observacoes, setObservacoes] = useState('');
  
  const [pragasObj, setPragasObj] = useState({
    varroa: false, formiga: false, traca: false, lagartixa: false, outro: false,
  });
  const [perdasObj, setPerdasObj] = useState({
    alimentacao: false, veneno: false, clima: false, outro: false,
  });

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

  useEffect(() => {
    const carregarVistoria = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const vistoriaId = Array.isArray(id) ? id[0] : id;
          const dados = await getVistoriaById(vistoriaId);
          
          if (dados) {
            setDataVistoria(dados.data);
            setApiario(dados.apiarioId?.toString() || '');
            setColmeia(dados.colmeiaId?.toString() || '');
            setCondicao(dados.condicaoVistoria);
            setObservacoes(dados.observacoes);

            // Reconstrói objetos de checkbox a partir dos arrays do banco
            if (dados.pragas) {
                setPragasObj(prev => {
                    const next = { ...prev };
                    dados.pragas?.forEach(p => {
                        const key = p.toLowerCase() as keyof typeof prev;
                        if (key in next) (next as any)[key] = true;
                    });
                    return next;
                });
            }
            if (dados.perdas) {
                setPerdasObj(prev => {
                    const next = { ...prev };
                    dados.perdas?.forEach(p => {
                        const key = p.toLowerCase() as keyof typeof prev;
                        if (key in next) (next as any)[key] = true;
                    });
                    return next;
                });
            }
          }
        } catch (error) {
          console.error('Erro ao buscar vistoria:', error);
          Alert.alert('Erro', 'Vistoria não encontrada!');
          router.back();
        } finally {
          setIsLoading(false);
        }
      }
    };

    carregarVistoria();
  }, [id]);

  const handleSalvar = async () => {
    if (!id) return;

    setIsSaving(true);
    try {
      const vistoriaId = Array.isArray(id) ? id[0] : id;

      const pragas = Object.entries(pragasObj)
        .filter(([_, checked]) => checked)
        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));
      
      const perdas = Object.entries(perdasObj)
        .filter(([_, checked]) => checked)
        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

      await atualizarVistoria(vistoriaId, {
        data: dataVistoria,
        apiarioId: apiario,
        colmeiaId: colmeia,
        condicaoVistoria: condicao,
        observacoes,
        pragas,
        perdas,
      });

      Alert.alert('Sucesso', 'Vistoria atualizada com sucesso!');
      router.push('/vistorias/listar');
    } catch (error) {
      console.error('Erro ao atualizar vistoria:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a vistoria.');
    } finally {
      setIsSaving(false);
    }
  };

  const CheckboxItem = ({ label, value, onValueChange }: {
    label: string; value: boolean; onValueChange: (value: boolean) => void;
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={cores.primaria} />
        <Text style={styles.loadingText}>Carregando vistoria...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Stack.Screen options={{ title: 'Editar' }} />
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
        value={observacoes}
        onChangeText={setObservacoes}
        placeholder="Observações (opcional):"
        multiline={true}
        numberOfLines={5}
        style={styles.textArea}
      />

      <Botao
        title="Salvar"
        onPress={handleSalvar}
        cor="primaria"
        style={styles.button}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: cores.fundo,
    gap: layout.espacamento.colega,
  },
  loadingText: {
    fontSize: 16,
    color: cores.placeholder,
  },
});