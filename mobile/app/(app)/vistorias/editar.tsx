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
  } from 'react-native';
import { getVistoriaById, atualizarVistoria } from '@/services/vistoriaService';
import { useAuth } from '@/hooks/useAuth';
import { maskDate } from '@/utils/masks';
import { voltar } from '@/utils/navegacao';
import { alerta } from '@/utils/alerta';

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

const condicaoOptions = [
  { label: 'Saudável', value: 'SAUDAVEL' },
  { label: 'Manutenção Necessária', value: 'MANUTENCAO_NECESSARIA' },
  { label: 'Agendar Colheita', value: 'AGENDAR_COLHEITA' },
];

const PRAGAS = { varroa: false, formiga: false, traca: false, lagartixa: false, outro: false };
const PERDAS = { alimentacao: false, veneno: false, clima: false, outro: false };

/** Converte a lista do backend (ex.: ['VARROA']) no objeto de checkboxes. */
const paraCheckbox = <T extends Record<string, boolean>>(base: T, lista?: string[]): T => {
  const next = { ...base };
  (lista ?? []).forEach((v) => {
    const k = v.toLowerCase();
    if (k in next) (next as Record<string, boolean>)[k] = true;
  });
  return next;
};
const paraLista = (obj: Record<string, boolean>) =>
  Object.entries(obj).filter(([, marcado]) => marcado).map(([k]) => k.toUpperCase());

const isoParaBr = (iso?: string) => {
  if (!iso) return '';
  const [a, m, d] = iso.split('-');
  return d && m && a ? `${d}/${m}/${a}` : iso;
};

export default function EditarVistoria() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();
  const userId = user?.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [dataVistoria, setDataVistoria] = useState('');
  const [nomeApiario, setNomeApiario] = useState('');
  const [nomeColmeia, setNomeColmeia] = useState('');
  const [condicao, setCondicao] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [pragasObj, setPragasObj] = useState(PRAGAS);
  const [perdasObj, setPerdasObj] = useState(PERDAS);

  useEffect(() => {
    if (!id || !userId) return;
    let ativo = true;
    getVistoriaById(userId, id)
      .then((dados) => {
        if (!ativo) return;
        if (!dados) {
          alerta('Erro', 'Vistoria não encontrada!');
          voltar(router);
          return;
        }
        setDataVistoria(isoParaBr(dados.dataVistoria));
        setNomeApiario(dados.nomeApiario ?? '');
        setNomeColmeia(dados.nomeColmeia ?? '');
        setCondicao(dados.condicao ?? '');
        setObservacoes(dados.observacoes ?? '');
        setPragasObj(paraCheckbox(PRAGAS, dados.pragasIdentificadas));
        setPerdasObj(paraCheckbox(PERDAS, dados.perdasIdentificadas));
      })
      .catch(() => {
        if (!ativo) return;
        alerta('Erro', 'Vistoria não encontrada!');
        voltar(router);
      })
      .finally(() => ativo && setIsLoading(false));
    return () => {
      ativo = false;
    };
  }, [id, userId, router]);

  const handleSalvar = async () => {
    if (!id || !userId || isSaving) return;
    if (dataVistoria.length !== 10 || !condicao) {
      alerta('Erro', 'Informe a data (dd/mm/aaaa) e a condição.');
      return;
    }
    setIsSaving(true);
    try {
      await atualizarVistoria(id, userId, {
        dataVistoria,
        condicao,
        observacoes,
        pragasIdentificadas: paraLista(pragasObj),
        perdasIdentificadas: paraLista(perdasObj),
      });
      alerta('Sucesso', 'Vistoria atualizada com sucesso!');
      router.push('/vistorias/listar');
    } catch (error) {
      console.error('Erro ao atualizar vistoria:', error);
      alerta('Erro', 'Não foi possível atualizar a vistoria.');
    } finally {
      setIsSaving(false);
    }
  };

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
        onChangeText={(t) => setDataVistoria(maskDate(t))}
        placeholder="dd/mm/aaaa"
        maxLength={10}
        iconName="calendar"
      />

      {/* Apiário e colmeia não podem ser alterados (a API não permite). */}
      <Input label="Apiário" value={nomeApiario} onChangeText={() => {}} editable={false} iconName="home" />
      <Input label="Colmeia" value={nomeColmeia} onChangeText={() => {}} editable={false} iconName="beehiveOutline" />

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
        title={isSaving ? 'Salvando...' : 'Salvar'}
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