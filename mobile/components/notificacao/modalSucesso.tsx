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
    console.log('ModalSucesso - visivel:', visivel); 

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
    <Animated.View style={[styles.modal, { opacity: animacaoOpacidade }]}>
      <Text style={styles.textoMensagem}>{mensagem}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
  bottom: 20,
  left: '5%',
  right: '5%',
  backgroundColor: cores.sucesso[100],
  borderRadius: layout.borderRadius.r25,
  padding: layout.espacamento.amigavel,
  alignItems: 'center',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
  elevation: 3,
  zIndex: 9999, 
  },
  textoMensagem: {
    fontSize: 16,
    color: cores.branco,
    textAlign: 'center',
  },
});