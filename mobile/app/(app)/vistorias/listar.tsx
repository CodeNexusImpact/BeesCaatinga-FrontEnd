import Botao from '@/components/botao';
import Selector from '@/components/selector';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// --- Importar os Modais ---
import ModalConfirmacao from '@/components/modalConfirmacao';
import ModalSucesso from '@/components/modalSucesso';

// ---  Importar o GenericCard ---
import GenericCard, { CardField } from '@/components/genericCard';

// --- Dados Mock (Substituir por dados reais) ---
const vistoriasMock = [
  {
    id: 1, 
    data: '18/09/2025',
    status: 'Saudável',
    colmeiaNome: 'Colmeia 1',
    apiarioNome: 'Apiario Rosa do Sertão',
    pragas: '--------',
    perdas: 'Alimentação',
    observacoes:
      'Apesar das perdas por alimentação, a colmeia está saudável.',
    corStatus: cores.sucesso,
  },
  {
    id: 2,
    data: '10/09/2025',
    status: 'Necessita Manuntenção',
    colmeiaNome: 'Colmeia 2',
    apiarioNome: 'Apiario Rosa do Sertão',
    pragas: 'Formigas',
    perdas: '--------',
    observacoes: null,
    corStatus: cores.alerta,
  },
  {
    id: 3,
    data: '03/09/2025',
    status: 'Agendar Colheita',
    colmeiaNome: 'Colmeia 3',
    apiarioNome: 'Apiario Rosa do Sertão',
    pragas: '--------',
    perdas: '--------',
    observacoes: null,
    corStatus: cores.secundaria,
  },
];

// (Mock de options... sem mudança)
const apiarioOptions = [
  { label: 'Rosa do Sertão', value: 'rosa' },
  { label: 'Vale das Abelhas', value: 'vale' },
];
const colmeiaOptions = [
  { label: 'Colmeia 1', value: '1' },
  { label: 'Colmeia 2', value: '2' },
];

export default function ListarVistorias() {
  const router = useRouter();

  // (Estados de Filtro.
  const [apiario, setApiario] = useState('');
  const [colmeia, setColmeia] = useState('');
  const [filtroTempo, setFiltroTempo] = useState('mes');

  //  Estados dos Modais --- 
  const [modalConfirmacaoVisivel, setModalConfirmacaoVisivel] = useState(false);
  const [modalSucessoVisivel, setModalSucessoVisivel] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null); // <-- number

  // Funções de Navegação --- 
  const handleEdit = (id: number) => {
    router.push(`/vistorias/editar?id=${id}`);
  };

  // Funções de Exclusão --- 
  const handleDelete = (id: number) => {
    setIdParaExcluir(id);
    setModalConfirmacaoVisivel(true);
  };

  const confirmarExclusao = () => {
    if (idParaExcluir !== null) {
      console.log('Vistoria excluída com ID:', idParaExcluir);
      // TODO: Lógica de exclusão
    }
    setModalConfirmacaoVisivel(false);
    setTimeout(() => {
      setModalSucessoVisivel(true);
    }, 350);
  };

  const cancelarExclusao = () => {
    setModalConfirmacaoVisivel(false);
    setIdParaExcluir(null);
  };

  const handleGerarRelatorio = () => {
    console.log('Gerar Relatório...');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Listar' }} />
      <View style={styles.container}>
        
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* 👇 Área de Filtros — CORRIGIDA COM zIndex ALTO */}
          <View style={styles.filtroWrapper}>
            <View style={styles.filtroContainer}>
              <Text style={styles.filtroTitulo}>Filtros</Text>
              <Selector
                label="Selecione o Apiário*"
                options={apiarioOptions}
                onSelect={setApiario}
                placeholder="Selecione"
                iconName="home"
              />
              <Selector
                label="Selecione a Colmeia"
                options={colmeiaOptions}
                onSelect={setColmeia}
                placeholder="Selecione"
                iconName="beehiveOutline"
              />
              <View style={styles.botoesRow}>
                <Botao
                  title="Mês"
                  onPress={() => setFiltroTempo('mes')}
                  cor={filtroTempo === 'mes' ? 'primaria' : 'secundaria'}
                  style={styles.botaoMetade}
                />
                <Botao
                  title="Estação"
                  onPress={() => setFiltroTempo('estacao')}
                  cor={filtroTempo === 'estacao' ? 'primaria' : 'secundaria'}
                  style={styles.botaoMetade}
                />
              </View>
            </View>
          </View>

          <Text style={styles.resumoTexto}>
            Resumo Geral do status atual da suas colmeias
          </Text>

          {/* --- Botão de Ordenar --- */}
          <TouchableOpacity style={styles.ordemButton}>
            <Text style={styles.ordemButtonText}>Ordem Data</Text>
            <MaterialCommunityIcons
              name="arrow-up"
              size={16}
              color={cores.preto}
            />
          </TouchableOpacity>

          {/*Lista de Vistorias --- */}
          <View style={styles.listaContainer}>
            {vistoriasMock.map((vistoria) => {
              // Monta os campos para o card
              const fields: CardField[] = [
                {
                  label: 'Status',
                  value: vistoria.status,
                  valueStyle: { color: vistoria.corStatus },
                },
                {
                  label: 'Local',
                  value: `${vistoria.colmeiaNome} - ${vistoria.apiarioNome}`,
                },
                { label: 'Data', value: vistoria.data },
                { label: 'Pragas', value: vistoria.pragas },
                { label: 'Perdas', value: vistoria.perdas },
              ];
              // Adiciona observações SÓ se existirem
              if (vistoria.observacoes) {
                fields.push({
                  label: 'Obs',
                  value: vistoria.observacoes,
                });
              }

              //  Renderiza o GenericCard
              return (
                <GenericCard
                  key={vistoria.id}
                  id={vistoria.id}
                  fields={fields}
                  actions={[
                    {
                      iconName: 'delete',
                      onPress: () => handleDelete(vistoria.id),
                    },
                    {
                      iconName: 'edit',
                      onPress: () => handleEdit(vistoria.id),
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* --- Botão Gerar Relatório  --- */}
          <Botao
            title="Gerar Relatório"
            onPress={handleGerarRelatorio}
            cor="primaria"
            style={styles.footerButton}
          />
        </ScrollView>

        {/* --- Modais --- */}
        <ModalSucesso
          visivel={modalSucessoVisivel}
          mensagem="Vistoria excluída com sucesso!"
          aoFechar={() => setModalSucessoVisivel(false)}
        />
      </View>

      <ModalConfirmacao
        visivel={modalConfirmacaoVisivel}
        titulo="Deseja mesmo apagar esta vistoria?"
        mensagem="Esta ação não pode ser desfeita."
        aoConfirmar={confirmarExclusao}
        aoCancelar={cancelarExclusao}
        aoFechar={cancelarExclusao}
      />
    </>
  );
}

// --- Estilos --- 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  contentContainer: {
    padding: layout.espacamento.amigavel,
    gap: layout.espacamento.colega,
    overflow: 'visible', // ⚠️ IMPORTANTE: evita cortar dropdowns
  },
  filtroWrapper: {
    position: 'relative', // necessário para zIndex funcionar
    zIndex: 999, // força estar acima de tudo
    marginBottom: layout.espacamento.texto,
  },
  filtroContainer: {
    backgroundColor: cores.cores.base[5],
    padding: layout.espacamento.amigavel,
    borderRadius: layout.borderRadius.r25,
    gap: layout.espacamento.amigavel,
    borderWidth: 1,
    borderColor: cores.cores.base[10],
  },
  filtroTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.preto,
  },
  botoesRow: {
    flexDirection: 'row',
    gap: layout.espacamento.amigavel,
  },
  botaoMetade: {
    flex: 1,
  },
  resumoTexto: {
    fontSize: 14,
    color: cores.placeholder,
    textAlign: 'center',
    paddingHorizontal: layout.espacamento.social,
  },
  ordemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: layout.espacamento.texto,
    backgroundColor: cores.primaria,
    borderRadius: layout.borderRadius.r1000,
    paddingVertical: layout.espacamento.texto,
    paddingHorizontal: layout.espacamento.colega,
    alignSelf: 'center',
  },
  ordemButtonText: {
    color: cores.preto,
    fontWeight: 'bold',
  },
  listaContainer: {
    gap: layout.espacamento.colega,
  },
  footerButton: {
    marginTop: layout.espacamento.amigavel,
  },
});