import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import Icon from './icon';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import fonts from '@/constants/fonts';

interface BotaoProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  iconName?: string;
  iconPosition?: 'left' | 'right';
  style?: object;
  textStyle?: object;
  cor?: 'primaria' | 'secundaria' | 'branca';
  tamanho?: 'grande' | 'medio' | 'pequeno';
}

const Botao: React.FC<BotaoProps> = ({
  title,
  onPress,
  style,
  textStyle,
  cor = 'primaria',
  iconName,
  iconPosition = 'left',
  tamanho = 'grande',
}) => {
  const corHex =
    cor === 'primaria'
      ? cores.primaria
      : cor === 'secundaria'
      ? cores.secundaria
      : cores.botaoBranco;

  const textColor = cor === 'branca' ? cores.texto : cores.branco;

  // Estilo base do botão
  const getButtonStyle = () => {
    switch (tamanho) {
      case 'pequeno':
        return styles.buttonPequeno;
      case 'medio':
        return styles.buttonMedio;
      case 'grande':
      default:
        return styles.buttonGrande;
    }
  };

  const getTextStyle = () => {
    switch (tamanho) {
      case 'pequeno':
        return styles.textPequeno;
      case 'medio':
        return styles.textMedio;
      case 'grande':
      default:
        return styles.textGrande;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.buttonBase,
        getButtonStyle(),
        style,
        {
          backgroundColor: corHex,
          flexDirection: iconPosition === 'right' ? 'row-reverse' : 'row',
        },
      ]}
      onPress={onPress}
    >
      {iconName && (
        <Icon
          name={iconName}
          size={tamanho === 'pequeno' ? 16 : tamanho === 'medio' ? 24 : 28}
          color={textColor}
        />
      )}
      <Text style={[getTextStyle(), textStyle, { color: textColor }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Estilo base comum a todos
  buttonBase: {
    borderRadius: layout.borderRadius.r25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  // Tamanhos
  buttonGrande: {
    width: '100%',
    paddingVertical: layout.espacamento.texto, // 4
    paddingHorizontal: layout.espacamento.amigavel, // 8
    gap: layout.espacamento.texto,
  },
  buttonMedio: {
    width: 'auto',
    minWidth: 120,
    paddingVertical: layout.espacamento.texto,
    paddingHorizontal: layout.espacamento.amigavel,
    gap: layout.espacamento.texto,
  },
  buttonPequeno: {
    width: 'auto',
    minWidth: 100,
    paddingVertical: layout.espacamento.texto,
    paddingHorizontal: layout.espacamento.amigavel,
    gap: layout.espacamento.texto,
  },

  // Textos
  textGrande: {
    fontSize: fonts.size.g, // 26
    fontWeight: 'bold',
  },
  textMedio: {
    fontSize: fonts.size.m, // 16
    fontWeight: 'bold',
  },
  textPequeno: {
    fontSize: fonts.size.p, // 14
    fontWeight: 'bold',
  },
});

export default Botao;