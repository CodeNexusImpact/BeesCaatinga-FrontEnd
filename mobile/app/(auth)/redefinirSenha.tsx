import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Botao from '@/components/formulario/botao';
import Icon from '@/components/icon';
import TelaAuth from '@/components/auth/telaAuth';
import cores from '@/constants/cores';
import { voltar } from '@/utils/navegacao';

/**
 * Recuperar senha. A API ainda não oferece recuperação por e-mail; em vez de fingir que a senha
 * foi trocada (comportamento anterior), a tela explica o que fazer.
 */
export default function RedefinirSenha() {
  const router = useRouter();
  return (
    <TelaAuth titulo="Recuperar senha">
      <View style={styles.aviso}>
        <Icon name="info" size={32} color={cores.secundaria} />
        <Text style={styles.texto}>
          A recuperação de senha pelo aplicativo ainda não está disponível. Peça ajuda ao técnico ou à associação que acompanha o seu cadastro para criar uma nova senha.
        </Text>
      </View>
      <Text style={styles.dica}>Dica: a senha diferencia letras maiúsculas e minúsculas.</Text>
      <Botao title="Voltar para entrar" iconName="back" onPress={() => voltar(router, '/login')} cor="primaria" />
    </TelaAuth>
  );
}

const styles = StyleSheet.create({
  aviso: { flexDirection: 'row', gap: 12, backgroundColor: '#FFF4D6', borderRadius: 12, padding: 14, alignItems: 'flex-start' },
  texto: { flex: 1, fontSize: 16, color: cores.texto, lineHeight: 23 },
  dica: { fontSize: 15, color: cores.textoSecundario, textAlign: 'center' },
});
