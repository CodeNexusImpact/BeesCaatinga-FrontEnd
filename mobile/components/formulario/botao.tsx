import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import Icon from '@/components/icon';
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
  cor?: 'primaria' | 'secundaria' | 'branca' | 'terciaria'; // Adicionado 'terciaria'
  tamanho?: 'grande' | 'medio' | 'pequeno';
  outline?: boolean; // Adicionado outline
  size?: 'small' | 'medium' | 'large'; // Adicionado size (para compatibilidade com Dashboard)
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
  outline = false, // Valor padrão
  size, // Ignorado por enquanto, mas mantido para compatibilidade
}) => {
  const corHex =
    cor === 'primaria'
      ? cores.primaria
      : cor === 'secundaria'
      ? cores.secundaria
      : cor === 'terciaria'
      ? cores.terciaria
      : cores.botaoBranco;

  // Cor do texto: se for botão branco, usa a cor primária; caso contrário, branco.
  const textColor = cor === 'branca' ? cores.primaria : cores.branco; // Corrigido: cores.texto -> cores.primaria

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
          backgroundColor: outline ? 'transparent' : corHex,
          borderWidth: outline ? 1 : 0,
          borderColor: outline ? corHex : 'transparent',
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
    // Removido borderWidth aqui, agora é controlado pelo outline
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