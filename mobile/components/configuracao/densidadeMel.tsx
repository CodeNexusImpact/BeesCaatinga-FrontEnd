import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Botao from '@/components/formulario/botao';
import cores from '@/constants/cores';
import { useAuth } from '@/hooks/useAuth';
import { atualizarProdutor, buscarProdutor } from '@/services/produtorService';
import { alerta } from '@/utils/alerta';
import { mensagemDeErro } from '@/utils/erros';
import { DENSIDADE_MAX, DENSIDADE_MIN, DENSIDADE_PADRAO, densidadeValida, formatarNumero, lerDecimal, setDensidadeMel, useDensidadeMel } from '@/utils/mel';

/** Configuração da densidade do mel (kg por litro): salva no aparelho e no cadastro do produtor. */
export default function DensidadeMel() {
  const { user, atualizarUsuario } = useAuth();
  const densidade = useDensidadeMel();
  const [texto, setTexto] = useState(formatarNumero(densidade, 2));
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const produtorId = user?.id;

  // Valor do servidor (se existir) tem prioridade.
  useEffect(() => {
    if (!produtorId) return;
    buscarProdutor(produtorId)
      .then((p: any) => {
        const d = Number(p?.densidadeMel);
        if (densidadeValida(d)) {
          setDensidadeMel(d);
          setTexto(formatarNumero(d, 2));
        }
      })
      .catch(() => {});
  }, [produtorId]);

  const salvar = async () => {
    const d = lerDecimal(texto);
    if (!densidadeValida(d)) {
      setErro(`Use um valor entre ${formatarNumero(DENSIDADE_MIN)} e ${formatarNumero(DENSIDADE_MAX)}.`);
      return;
    }
    setErro(null);
    setSalvando(true);
    try {
      await setDensidadeMel(d);
      if (produtorId) {
        const atualizado = await atualizarProdutor(produtorId, { densidadeMel: Math.round(d * 1000) / 1000 });
        if (atualizado && user) await atualizarUsuario({ ...user, ...atualizado });
      }
      alerta('Sucesso', `Densidade do mel salva: ${formatarNumero(d)} kg por litro.`);
    } catch (e) {
      alerta('Salvo no aparelho', mensagemDeErro(e, 'Não foi possível salvar no servidor; o valor ficou salvo neste aparelho.'));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.rotulo}>Densidade do mel (kg por litro)</Text>
      <TextInput
        style={styles.input}
        value={texto}
        onChangeText={(t) => setTexto(t.replace(/[^0-9.,]/g, ''))}
        keyboardType="decimal-pad"
        accessibilityLabel="Densidade do mel em kg por litro"
        testID="campo-densidade"
      />
      <Text style={styles.dica}>
        Usada para converter quilos em litros. Padrão: {formatarNumero(DENSIDADE_PADRAO)} (mel a 20 °C). Mel de abelha sem ferrão costuma ser mais leve.
      </Text>
      {erro && <Text style={styles.erro}>{erro}</Text>}
      <Botao title={salvando ? 'Salvando...' : 'Salvar densidade'} onPress={salvar} cor="secundaria" tamanho="pequeno" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: cores.branco, borderRadius: 12, padding: 14, gap: 8, marginVertical: 8 },
  rotulo: { fontSize: 16, fontWeight: 'bold', color: cores.texto },
  input: { borderWidth: 1, borderColor: cores.borda, borderRadius: 8, paddingHorizontal: 12, minHeight: 48, fontSize: 17, backgroundColor: cores.superficie },
  dica: { fontSize: 14, color: cores.textoSecundario },
  erro: { fontSize: 14, color: cores.perigo, fontWeight: '600' },
});
