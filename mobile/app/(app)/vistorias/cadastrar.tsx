import Botao from '@/components/formulario/botao';
import Input from '@/components/formulario/input';
import Selector from '@/components/formulario/selector';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import Checkbox from 'expo-checkbox';
import { cadastrarVistoria } from '@/services/vistoriaService';
import { listarApiariosPorProdutor } from '@/services/apiarioService';
import { listarColmeiasPorApiario } from '@/services/colmeiaService';
import ModalSucesso from '@/components/notificacao/modalSucesso';
import { maskDate } from '@/utils/masks';
import { useAuth } from '@/hooks/useAuth';
import { voltar } from '@/utils/navegacao';
import { alerta, alertaSalvo, idDoSeletor } from '@/utils/alerta';

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

export default function CadastrarVistoria() {
  const router = useRouter();
  const { user } = useAuth();

  // --- Estados da Vistoria ---
  const [dataVistoria, setDataVistoria] = useState(new Date().toLocaleDateString('pt-BR'));
  const [apiario, setApiario] = useState('');
  const [colmeia, setColmeia] = useState('');
  const [condicao, setCondicao] = useState('SAUDAVEL');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalSucessoVisivel, setModalSucessoVisivel] = useState(false);

  // Opções dinâmicas
  const [apiarioOptions, setApiarioOptions] = useState<{label: string, value: string}[]>([]);
  const [colmeiaOptions, setColmeiaOptions] = useState<{label: string, value: string}[]>([]);

  useEffect(() => {
    const fetchApiarios = async () => {
        if (!user?.id) return;
        try {
            const data = await listarApiariosPorProdutor(user.id);
            setApiarioOptions(data.map(a => ({ label: a.nome, value: a.id.toString() })));
        } catch (e) {
            console.error('Erro ao buscar apiários:', e);
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
            setColmeiaOptions(data.map((c: any) => ({ label: c.identificador || `Colmeia ${c.id}`, value: c.id.toString() })));
        } catch (e) {
            console.error('Erro ao buscar colmeias:', e);
        }
    };
    fetchColmeias();
  }, [apiario, user?.id]);

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

  // --- Opções fixas ---
  const condicaoOptions = [
    { label: 'Saudável', value: 'SAUDAVEL' },
    { label: 'Manutenção Necessária', value: 'MANUTENCAO_NECESSARIA' },
    { label: 'Agendar Colheita', value: 'AGENDAR_COLHEITA' },
  ];

  const handleSalvar = async () => {
    if (!apiario || !colmeia || !user?.id) {
      alerta('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (dataVistoria.length !== 10) {
      alerta('Erro', 'Informe a data da vistoria no formato dd/mm/aaaa.');
      return;
    }

    setLoading(true);
    try {
      const pragas = Object.entries(pragasObj)
        .filter(([_, checked]) => checked)
        .map(([key]) => key.toUpperCase());
      
      const perdas = Object.entries(perdasObj)
        .filter(([_, checked]) => checked)
        .map(([key]) => key.toUpperCase());

      const payload = {
        dataVistoria: dataVistoria,
        apiario_id: idDoSeletor(apiario),
        colmeia_id: idDoSeletor(colmeia),
        condicao: condicao,
        observacoes,
        pragasIdentificadas: pragas,
        perdasIdentificadas: perdas,
      };

      const salvo = await cadastrarVistoria(user.id, apiario, colmeia, payload);
      if (salvo?.pendente) alertaSalvo(salvo, '');
      else setModalSucessoVisivel(true);
    } catch (error) {
      console.error('Erro ao salvar vistoria:', error);
      alerta('Erro', 'Não foi possível salvar a vistoria.');
    } finally {
      setLoading(false);
    }
  };

  const aoFecharSucesso = () => {
    setModalSucessoVisivel(false);
    voltar(router);
  };


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Stack.Screen options={{ title: 'Cadastrar Vistoria' }} />
      <Input
        label="Data da Vistoria:"
        value={dataVistoria}
        onChangeText={(t) => setDataVistoria(maskDate(t))}
        placeholder="dd/mm/aaaa"
        maxLength={10}
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
