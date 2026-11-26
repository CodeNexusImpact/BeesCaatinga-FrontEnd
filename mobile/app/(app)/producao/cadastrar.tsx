import Botao from '@/components/formulario/botao';
import Input from '@/components/formulario/input';
import Selector from '@/components/formulario/selector';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { maskDate } from '@/utils/masks';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { cadastrarProducao } from '@/services/producaoService';
import { listarApiariosPorProdutor } from '@/services/apiarioService';
import { listarColmeiasPorApiario } from '@/services/colmeiaService';
import { useAuth } from '@/hooks/useAuth';
import type { ProducaoCriadaDTO } from '@/types/producao';
import { UnidadeMedida } from '@/types/insumos/Enums';
import { alerta, alertaSalvo, idDoSeletor } from '@/utils/alerta';
import CampoKgLitros from '@/components/formulario/campoKgLitros';
import CampoSugestao from '@/components/formulario/campoSugestao';
import { mensagemDeErro } from '@/utils/erros';
import { dataValida } from '@/utils/datas';
import { formatarKgL } from '@/utils/mel';
import { lembrarEscolha, registrarHistorico, ultimaEscolha } from '@/utils/sugestoes';

export default function CadastrarProducao() {
  const router = useRouter();
  const { user } = useAuth();

  const [tipoProduto, setTipoProduto] = useState('');
  const [kg, setKg] = useState<number | null>(null);
  const [apiario, setApiario] = useState('');
  const [colmeia, setColmeia] = useState('');
  const [dataColeta, setDataColeta] = useState(new Date().toLocaleDateString('pt-BR'));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [apiarioOptions, setApiarioOptions] = useState<{ label: string; value: string }[]>([]);
  const [colmeiaOptions, setColmeiaOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    let ativo = true;
    Promise.all([listarApiariosPorProdutor(user.id), ultimaEscolha('apiario')])
      .then(([data, ultimo]) => {
        if (!ativo) return;
        const opcoes = data.map((a) => ({ label: a.pendente ? `${a.nome} (pendente de envio)` : a.nome, value: String(a.id) }));
        setApiarioOptions(opcoes);
        if (ultimo && opcoes.some((o) => o.value === ultimo)) setApiario(ultimo); // lembra o último apiário usado
      })
      .catch((e) => alerta('Erro', mensagemDeErro(e, 'Não foi possível carregar seus apiários.')));
    return () => {
      ativo = false;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!apiario || !user?.id) return;
    let ativo = true;
    listarColmeiasPorApiario(user.id, apiario)
      .then((data) => ativo && setColmeiaOptions(data.map((c: any) => ({ label: c.identificador || `Colmeia ${c.id}`, value: String(c.id) }))))
      .catch(() => ativo && setColmeiaOptions([]));
    return () => {
      ativo = false;
    };
  }, [apiario, user?.id]);

  const escolherApiario = (v: string) => {
    setApiario(v);
    setColmeia('');
    setColmeiaOptions([]);
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
    if (!dataValida(dataColeta)) return alerta('Atenção', 'Informe a data da coleta no formato dd/mm/aaaa.');
    if (!apiario) return alerta('Atenção', 'Escolha o apiário.');
    if (!colmeia) return alerta('Atenção', 'Escolha a colmeia.');
    if (!tipoProduto.trim()) return alerta('Atenção', 'Informe o tipo de mel.');
    if (!kg || kg <= 0) return alerta('Atenção', 'Informe a quantidade em kg ou em litros.');

    setIsSubmitting(true);
    try {
      // A quantidade é sempre enviada em kg (o campo em litros é convertido pela densidade do mel).
      const dto: ProducaoCriadaDTO = {
        tipoProducao: tipoProduto.trim(),
        quantidade: Math.round(kg * 100) / 100,
        unidadeMedida: 'KILOGRAMA' as UnidadeMedida,
        apiarioId: idDoSeletor(apiario) as number,
        colmeiaId: idDoSeletor(colmeia) as number,
        dataColeta,
      };
      const salvo = await cadastrarProducao(user.id, dto, {
        nomeApiario: apiarioOptions.find((a) => a.value === apiario)?.label,
        nomeColmeia: colmeiaOptions.find((c) => c.value === colmeia)?.label,
      });
      lembrarEscolha('apiario', apiario);
      registrarHistorico('producao.tipo', tipoProduto);
      alertaSalvo(salvo, `Produção de ${formatarKgL(dto.quantidade)} cadastrada com sucesso!`, [{ text: 'OK', onPress: () => router.push('/producao/listar') }]);
    } catch (error) {
      alerta('Erro', mensagemDeErro(error, 'Não foi possível cadastrar a produção.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: 'Cadastrar Produção' }} />

      <Input label="Data da coleta" value={dataColeta} onChangeText={(t) => setDataColeta(maskDate(t))} placeholder="dd/mm/aaaa" iconName="calendar" maxLength={10} />

      <View style={{ zIndex: 30 }}>
        <Selector label="Apiário" options={apiarioOptions} onSelect={escolherApiario} placeholder="Selecione o apiário" iconName="home" value={apiario} />
      </View>
      <View style={{ zIndex: 20 }}>
        <Selector
          label="Colmeia"
          options={colmeiaOptions}
          onSelect={setColmeia}
          placeholder={apiario ? 'Selecione a colmeia' : 'Escolha o apiário primeiro'}
          iconName="beehiveOutline"
          value={colmeia}
        />
      </View>

      <View style={{ zIndex: 10 }}>
        <CampoSugestao
          rotulo="Tipo de mel"
          valor={tipoProduto}
          onChange={setTipoProduto}
          placeholder="Ex.: Mel de Jandaíra"
          campoApi="tipoProducao"
          campoLocal="producao.tipo"
          opcoes={TIPOS_MEL}
          dica="Comece a digitar: aparecem os tipos que você já usou."
        />
      </View>

      <CampoKgLitros kg={kg} onChange={setKg} rotulo="Quantidade colhida" />

      <Botao
        title={isSubmitting ? 'Salvando...' : 'Cadastrar produção'}
        onPress={isSubmitting ? () => {} : handleSubmit}
        cor="primaria"
        style={[styles.button, isSubmitting && { opacity: 0.7 }]}
      />
    </ScrollView>
  );
}

const TIPOS_MEL = ['Mel de Jandaíra', 'Mel de Marmeleiro', 'Mel de Aroeira', 'Mel de Angico', 'Mel silvestre', 'Mel de Uruçu'];

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
    flexDirection: 'row', flexWrap: 'wrap', // empilha em telas estreitas (celular)
    justifyContent: 'space-between',
    gap: layout.espacamento.amigavel,
    zIndex: 10,
    position: 'relative',
  },
  inputMetade: { flexGrow: 1, flexBasis: 240 },
  conversaoInput: {
    backgroundColor: cores.cores.primaria[10], 
    borderColor: cores.cores.primaria[30], 
  },
  button: {
    marginTop: layout.espacamento.social,
  },
});