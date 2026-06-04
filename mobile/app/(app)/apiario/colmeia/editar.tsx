import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';

// Componentes e Constantes Padronizados
import Botao from '@/components/formulario/botao';
import Input from '@/components/formulario/input';
import Selector from '@/components/formulario/selector';
import Subtexto from '@/components/subTexto';
import ImagePickerExample from '@/components/formulario/imagemPicker';
import cores from '@/constants/cores';
import layout from '@/constants/layout';

// Mock de dados da colmeia para preencher o formulário
const mockColmeia = {
  identificador: 'C-007',
  apiario: 'vale', // 'vale' corresponde a 'Vale das Abelhas'
  tipo: 'madeira',
  ativo: 'sim',
  observacoes: 'Colmeia forte, pronta para a próxima temporada.',
};

export default function EditarColmeia() {
  const router = useRouter();
  // Para obter o ID da colmeia da rota, ex: /colmeia/editar?id=123
  const { id } = useLocalSearchParams();

  // Estados do formulário, inicializados com dados de exemplo
  const [identificador, setIdentificador] = useState('');
  const [apiario, setApiario] = useState('');
  const [tipo, setTipo] = useState('');
  const [ativo, setAtivo] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Simula o carregamento dos dados da colmeia
  useEffect(() => {
    // Em um aplicativo real, você faria uma chamada de API aqui usando o `id`
    console.log(`Carregando dados para a colmeia ID: ${id}`);
    setIdentificador(mockColmeia.identificador);
    setApiario(mockColmeia.apiario);
    setTipo(mockColmeia.tipo);
    setAtivo(mockColmeia.ativo);
    setObservacoes(mockColmeia.observacoes);
  }, [id]);

  // Opções para os seletores
  const apiarioOptions = [
    { label: 'Rosa do Sertão', value: 'rosa' },
    { label: 'Vale das Abelhas', value: 'vale' },
  ];

  const tipoOptions = [
    { label: 'Madeira', value: 'madeira' },
    { label: 'Concreto', value: 'concreto' },
    { label: 'Poliestireno', value: 'poliestireno' },
  ];

  const ativoOptions = [
    { label: 'Sim', value: 'sim' },
    { label: 'Não', value: 'nao' },
  ];

  const handleSalvar = () => {
    console.log('Salvando alterações para a colmeia ID:', id);
    console.log({
      identificador,
      apiario,
      tipo,
      ativo,
      observacoes,
    });
    // Lógica de navegação após sucesso
    // router.back();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Stack.Screen options={{ title: 'Editar Colmeia' }} />

      {/* SEÇÃO: DADOS */}
      <View style={styles.secao}>
        <Subtexto>Dados</Subtexto>
        
        <Input
          label="Identificador"
          placeholder="Ex: Colmeia C-001"
          value={identificador}
          onChangeText={setIdentificador}
          editable={false} // Identificador não é editável
        />

        <Selector
          label="Apiário:"
          options={apiarioOptions}
          value={apiario}
          onSelect={setApiario}
          placeholder="Selecione o Apiário"
          iconName="home"
        />

        <Selector
          label="Tipo:"
          options={tipoOptions}
          value={tipo}
          onSelect={setTipo}
          placeholder="Selecione o tipo"
          iconName="beehiveOutline"
        />

        <Selector
          label="Ativo:"
          options={ativoOptions}
          value={ativo}
          onSelect={setAtivo}
          placeholder="Selecione"
        />
      </View>

      {/* SEÇÃO: LOCALIZAÇÃO */}
      <View style={styles.secao}>
        <Subtexto>Localização</Subtexto>
        <Text style={styles.instrucaoMapa}>Marque a localização no mapa: 📍</Text>
        
        <View style={styles.mapaPlaceholder}>
          <Text style={{ color: cores.placeholder }}>Mapa Interativo</Text>
        </View>

        <Botao 
          title="📍 Usar localização atual" 
          onPress={() => {}} 
          cor="secundaria"
          style={styles.buttonLocalizacao}
        />
        <Text style={styles.detalhesLocalizacao}>Detalhes da localização:</Text>
      </View>

      {/* SEÇÃO: DADOS ADICIONAIS */}
      <View style={styles.secao}>
        <Subtexto>Dados Adicionais</Subtexto>
        
        <Text style={styles.labelFoto}>Foto</Text>
        <ImagePickerExample onImagePicked={function (uri: string | null): void {
          throw new Error('Function not implemented.');
        } } />

        <Input
          label="Observações:"
          placeholder="---"
          value={observacoes}
          onChangeText={setObservacoes}
          multiline={true}
          style={styles.inputObservacoes}
        />
      </View>

      {/* BOTÃO FINAL */}
      <Botao
        title="Salvar Alterações"
        onPress={handleSalvar}
        cor="primaria"
        style={styles.buttonFinal}
      />
    </ScrollView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.cores.base[10],
  },
  contentContainer: {
    padding: layout.espacamento.amigavel,
    gap: layout.espacamento.colega,
  },
  secao: {
    gap: layout.espacamento.amigavel,
  },
  instrucaoMapa: {
    color: cores.texto,
    fontSize: 14,
  },
  mapaPlaceholder: {
    height: 220,
    backgroundColor: '#E0E0E0',
    borderRadius: layout.borderRadius.r25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.borda,
  },
  detalhesLocalizacao: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  labelFoto: {
    fontSize: 14,
    color: cores.texto,
    marginBottom: -5,
  },
  inputObservacoes: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonLocalizacao: {
    marginTop: 5,
  },
  buttonFinal: {
    marginTop: layout.espacamento.social,
    marginBottom: 20,
  },
});
