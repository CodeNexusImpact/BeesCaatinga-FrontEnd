import React, { useEffect } from 'react';
import { Text, Animated, StyleSheet } from 'react-native';
import cores from '@/constants/cores';
import layout from '@/constants/layout';

interface ModalSucessoProps {
  visivel: boolean;
  mensagem: string;
  duracao?: number;
  aoFechar: () => void;
}

export default function ModalSucesso({
  visivel,
  mensagem,
  duracao = 3000,
  aoFechar,
}: ModalSucessoProps) {
  const animacaoOpacidade = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visivel) {
      Animated.timing(animacaoOpacidade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();

      const temporizador = setTimeout(() => {
        Animated.timing(animacaoOpacidade, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start(() => aoFechar());
      }, duracao);

      return () => clearTimeout(temporizador);
    }
  }, [visivel]);

  if (!visivel) return null;

  return (
    <Animated.View style={[styles.toast, { opacity: animacaoOpacidade }]}>
      <Text style={styles.textoMensagem}>{mensagem}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 20,
    left: '5%',
    right: '5%',
    backgroundColor: cores.sucesso[100],
    borderRadius: layout.borderRadius.r25,
    padding: layout.espacamento.amigavel,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textoMensagem: {
    fontSize: 16,
    color: cores.branco,
    textAlign: 'center',
  },
});