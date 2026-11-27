import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import cores from '@/constants/cores';

interface Props {
  titulo: string;
  subtitulo?: string;
  children: React.ReactNode;
}

/**
 * Moldura das telas de acesso (login, cadastro, recuperar senha).
 * Celular: faixa com o logo no topo e o formulário num cartão abaixo (sem sobreposição).
 * Tablet/computador: cartão centralizado em duas colunas (logo | formulário).
 */
export default function TelaAuth({ titulo, subtitulo, children }: Props) {
  const { width, height } = useWindowDimensions();
  const largo = width >= 768;
  return (
    <KeyboardAvoidingView style={styles.fundo} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.rolagem, largo && { minHeight: height, justifyContent: 'center' }]} keyboardShouldPersistTaps="handled">
        <View style={[styles.cartao, largo && styles.cartaoLargo]}>
          <View style={[styles.marca, largo ? styles.marcaLarga : styles.marcaEstreita]}>
            <Image source={require('@/assets/images/LogoBeesCaatinga.png')} style={largo ? styles.logoGrande : styles.logo} contentFit="contain" accessibilityLabel="BeesCaatinga" />
            {largo && <Text style={styles.slogan}>Gestão de apiários, produção e rastreabilidade do mel da Caatinga.</Text>}
          </View>
          <View style={[styles.form, largo && styles.formLargo]}>
            <Text style={styles.titulo} accessibilityRole="header">{titulo}</Text>
            {!!subtitulo && <Text style={styles.subtitulo}>{subtitulo}</Text>}
            {children}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: cores.fundo },
  rolagem: { flexGrow: 1, padding: 16, alignItems: 'center' },
  cartao: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: cores.superficie,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: cores.bordaSuave,
    boxShadow: '0px 8px 24px rgba(62, 39, 35, 0.12)',
    elevation: 4,
  },
  cartaoLargo: { maxWidth: 980, flexDirection: 'row', minHeight: 560 },
  marca: { backgroundColor: cores.primaria, alignItems: 'center', justifyContent: 'center' },
  marcaEstreita: { paddingVertical: 20, paddingHorizontal: 16 },
  marcaLarga: { flex: 1, padding: 32, gap: 20 },
  logo: { width: 180, height: 110 },
  logoGrande: { width: '85%', height: 240 },
  slogan: { fontSize: 18, fontWeight: '600', color: cores.textoSobrePrimaria, textAlign: 'center', lineHeight: 26 },
  form: { padding: 20, gap: 14 },
  formLargo: { flex: 1.15, padding: 40, justifyContent: 'center' },
  titulo: { fontSize: 26, fontWeight: 'bold', color: cores.texto, textAlign: 'center' },
  subtitulo: { fontSize: 16, color: cores.textoSecundario, textAlign: 'center', marginTop: -6 },
});
