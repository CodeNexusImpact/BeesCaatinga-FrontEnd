import Botao from '@/components/botao';
import Input from '@/components/input';
import Selector from '@/components/selector';
import ModalSucesso from '@/components/modalSucesso';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { maskDate } from '@/utils/masks';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { cadastrarInsumo } from '@/services/insumoService';
import { useAuth } from '@/hooks/useAuth';
import Checkbox from 'expo-checkbox';

export default function CadastrarInsumo() {
  const router = useRouter();
  const { user } = useAuth();

  // --- Estados do Formulário (Espelho do db.json) ---
  const [dataInsumo, setDataInsumo] = useState(new Date().toLocaleDateString('pt-BR'));
  const [nome, setNome] = useState('');
  const [tipoInsumo, setTipoInsumo] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [unidadeMedida, setUnidadeMedida] = useState('');
  const [dataValidade, setDataValidade] = useState('18/05/2027');
  const [semValidade, setSemValidade] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalSucessoVisivel, setModalSucessoVisivel] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting || !user?.id) return;
    
    if (!nome || !quantidade || !tipoInsumo) {
      Alert.alert('Erro', 'Por favor, preencha os campos obrigatórios (*)');
      return;
    }

    // PAYLOAD
    const payload = {
      dataInsumo,
      nome,
      tipoInsumo,
      quantidade: parseFloat(quantidade.replace(',', '.')),
      unidadeMedida,
      dataValidade: semValidade ? 'N/A' : dataValidade,
      observacoes,
      statusInsumo: 'DISPONIVEL'
    };

    try {
      setIsSubmitting(true);
      await cadastrarInsumo(user.id, payload);
      setModalSucessoVisivel(true);
    } catch (error) {
      console.error('❌ [CADASTRAR INSUMO] Erro:', error);
      Alert.alert('Erro', 'Não foi possível realizar o cadastro no servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDataInsumoChange = (text: string) => {
    setDataInsumo(maskDate(text));
  };

  const handleDataValidadeChange = (text: string) => {
    setDataValidade(maskDate(text));
  };

  // --- Opções ---
  const tipoInsumoOptions = [
    { label: 'Alimentação', value: 'Alimentação' },
    { label: 'Medicamento', value: 'Medicamento' },
    { label: 'Equipamento', value: 'Equipamento' },
    { label: 'Outro', value: 'Outro' },
  ];

  const unidadeMedidaOptions = [
    { label: 'Kg', value: 'KG' },
    { label: 'g', value: 'G' },
    { label: 'L', value: 'L' },
    { label: 'mL', value: 'ML' },
    { label: 'Unidade(s)', value: 'UN' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Stack.Screen options={{ title: 'Cadastrar Insumo' }} />
      
      <Input
        label="Data de Entrada:"
        value={dataInsumo}
        onChangeText={handleDataInsumoChange}
        placeholder="dd/mm/aaaa"
        iconName="calendar"
        maxLength={10}
      />

      <Input
        label="Nome do insumo*"
        value={nome}
        onChangeText={setNome}
        placeholder="Ex: Cera Alveolada"
      />

      <View style={[styles.row, { zIndex: 30 }]}>
        <Input
          label="Quantidade*"
          value={quantidade}
          onChangeText={(text) => setQuantidade(text.replace(/[^0-9.,]/g, ''))}
          keyboardType="decimal-pad"
          style={styles.inputMetade}
          placeholder="0,0"
        />
        <View style={styles.inputMetade}>
          <Selector
            label="Unidade medida"
            options={unidadeMedidaOptions}
            value={unidadeMedida}
            onSelect={setUnidadeMedida}
            placeholder="Selecione"
          />
        </View>
      </View>

      <View style={{ zIndex: 20 }}>
        <Selector
          label="Tipo de insumo*"
          options={tipoInsumoOptions}
          value={tipoInsumo}
          onSelect={setTipoInsumo}
          placeholder="Selecione o tipo"
        />
      </View>

      <Input
        label="Data de validade:"
        value={semValidade ? 'Não se aplica' : dataValidade}
        onChangeText={handleDataValidadeChange}
        placeholder="dd/mm/aaaa"
        iconName="calendar"
        editable={!semValidade}
        style={semValidade ? styles.inputDisabled : {}}
        maxLength={10}
      />

      <View style={styles.checkboxContainer}>
        <Checkbox
          value={semValidade}
          onValueChange={setSemValidade}
          color={semValidade ? cores.primaria : undefined}
        />
        <Text style={styles.checkboxLabel}>Não se aplica / Sem validade</Text>
      </View>

      <Input
        label="Observações (opcional):"
        value={observacoes}
        onChangeText={setObservacoes}
        placeholder="Notas adicionais..."
        multiline={true}
        numberOfLines={5}
        style={styles.textArea}
      />

      <Botao
        title={isSubmitting ? "Enviando..." : "Salvar Registro"}
        onPress={handleSubmit}
        cor="primaria"
        style={styles.button}
      />

      <ModalSucesso
        visivel={modalSucessoVisivel}
        mensagem="Insumo cadastrado com sucesso!"
        aoFechar={() => {
          setModalSucessoVisivel(false);
          router.push('/insumos/listar');
        }}
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
    paddingBottom: 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: layout.espacamento.amigavel,
  },
  inputMetade: {
    flex: 1,
  },
  button: {
    marginTop: layout.espacamento.social,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: -8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: cores.texto,
  },
});
