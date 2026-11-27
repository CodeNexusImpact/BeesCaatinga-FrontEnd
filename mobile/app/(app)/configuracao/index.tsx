import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { deletarProdutor } from '@/services/produtorService';
import { useFilaOffline } from '@/services/offline';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Icon from '@/components/icon';
import Botao from '@/components/formulario/botao';
import DensidadeMel from '@/components/configuracao/densidadeMel';
import { alerta } from '@/utils/alerta';
import { preferencias, salvarPreferencias, Tema, TamanhoTexto } from '@/tema/preferencias';

function Opcoes<T extends string>({ rotulo, valor, opcoes, onChange }: { rotulo: string; valor: T; opcoes: { valor: T; texto: string }[]; onChange: (v: T) => void }) {
  return (
    <View style={styles.grupo}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <View style={styles.segmentos} accessibilityRole="radiogroup" accessibilityLabel={rotulo}>
        {opcoes.map((o) => {
          const ativo = o.valor === valor;
          return (
            <TouchableOpacity
              key={o.valor}
              style={[styles.segmento, ativo && styles.segmentoAtivo]}
              onPress={() => !ativo && onChange(o.valor)}
              role="radio"
              aria-checked={ativo}
              accessibilityLabel={`${rotulo}: ${o.texto}`}
            >
              <Text style={[styles.segmentoTexto, ativo && styles.segmentoTextoAtivo]}>{o.texto}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function Linha({ titulo, descricao, icone, onPress }: { titulo: string; descricao?: string; icone: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.linha} onPress={onPress} accessibilityRole="button" accessibilityLabel={titulo}>
      <Icon name={icone} size={26} color={cores.secundaria} />
      <View style={{ flex: 1 }}>
        <Text style={styles.linhaTitulo}>{titulo}</Text>
        {!!descricao && <Text style={styles.linhaDescricao}>{descricao}</Text>}
      </View>
      <Icon name="setaDireita" size={22} color={cores.textoSecundario} />
    </TouchableOpacity>
  );
}

export default function Configuracoes() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { fila } = useFilaOffline();

  const aplicar = (p: Partial<typeof preferencias>, descricao: string) => {
    if (!salvarPreferencias(p)) alerta('Preferência salva', `${descricao} Feche e abra o aplicativo para ver a mudança em todas as telas.`);
  };

  const limparCache = () =>
    alerta('Limpar dados temporários', 'Apaga listas guardadas para uso sem internet e sugestões. Seu login e os envios pendentes são mantidos. Continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Limpar',
        style: 'destructive',
        onPress: async () => {
          const chaves = (await AsyncStorage.getAllKeys()).filter((k) => k.startsWith('@offline:cache:') || k.startsWith('@historico:') || k.startsWith('@ultima_escolha:'));
          await AsyncStorage.multiRemove(chaves);
          alerta('Pronto', 'Dados temporários apagados.');
        },
      },
    ]);

  const excluirPerfil = () => {
    if (!user?.id) return;
    alerta('Excluir perfil', 'Esta ação não pode ser desfeita e apagará TODOS os seus dados. Deseja continuar?', [
      { text: 'Não, cancelar', style: 'cancel' },
      {
        text: 'Sim, excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletarProdutor(user.id);
            alerta('Perfil excluído', 'Seu perfil foi excluído.');
            await signOut();
            router.replace('/login');
          } catch {
            alerta('Erro', 'Não foi possível excluir o perfil.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Stack.Screen options={{ title: 'Configurações' }} />

      <Text style={styles.secao}>Aparência</Text>
      <View style={styles.card}>
        <Opcoes<Tema>
          rotulo="Tema"
          valor={preferencias.tema}
          opcoes={[{ valor: 'claro', texto: 'Claro' }, { valor: 'escuro', texto: 'Escuro' }]}
          onChange={(tema) => aplicar({ tema }, 'Tema alterado.')}
        />
        <Opcoes<TamanhoTexto>
          rotulo="Tamanho do texto"
          valor={preferencias.tamanhoTexto}
          opcoes={[
            { valor: 'normal', texto: 'Normal' },
            { valor: 'grande', texto: 'Grande' },
            { valor: 'muito-grande', texto: 'Muito grande' },
          ]}
          onChange={(tamanhoTexto) => aplicar({ tamanhoTexto }, 'Tamanho do texto alterado.')}
        />
      </View>

      <Text style={styles.secao}>Mel</Text>
      <DensidadeMel />

      <Text style={styles.secao}>Integrações e dados</Text>
      <View style={styles.card}>
        <Linha titulo="Integrações / Webhooks" descricao="Avise outro sistema quando houver novos registros" icone="share" onPress={() => router.push('/configuracao/webhooks' as any)} />
        <Linha
          titulo="Envios pendentes"
          descricao={fila.length ? `${fila.length} registro(s) aguardando internet` : 'Nada aguardando envio'}
          icone="sync"
          onPress={() => router.push('/sincronizacao' as any)}
        />
        <Linha titulo="Limpar dados temporários" descricao="Listas guardadas e sugestões" icone="delete" onPress={limparCache} />
      </View>

      <Text style={styles.secao}>Conta</Text>
      <View style={styles.card}>
        <Linha titulo="Meu Perfil" descricao="Nome, telefone e endereço" icone="user" onPress={() => router.push('/perfil')} />
        <Botao title="Excluir perfil" onPress={excluirPerfil} cor="terciaria" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: layout.espacamento.colega, gap: 12, paddingBottom: 40, maxWidth: 720, width: '100%', alignSelf: 'center' },
  secao: { fontSize: 18, fontWeight: 'bold', color: cores.texto, marginTop: 8 },
  card: { backgroundColor: cores.superficie, borderRadius: 16, padding: 14, gap: 12, borderWidth: 1, borderColor: cores.bordaSuave },
  grupo: { gap: 6 },
  rotulo: { fontSize: 16, fontWeight: 'bold', color: cores.texto },
  segmentos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  segmento: { minHeight: 48, paddingHorizontal: 16, borderRadius: 24, borderWidth: 2, borderColor: cores.secundaria, justifyContent: 'center', flexGrow: 1, alignItems: 'center' },
  segmentoAtivo: { backgroundColor: cores.secundaria },
  segmentoTexto: { fontSize: 16, fontWeight: '600', color: cores.texto },
  segmentoTextoAtivo: { color: '#FFFFFF' },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56 },
  linhaTitulo: { fontSize: 17, fontWeight: 'bold', color: cores.texto },
  linhaDescricao: { fontSize: 14, color: cores.textoSecundario },
});
