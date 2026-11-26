import Icon from '@/components/icon';
import cores from '@/constants/cores';
import { AppIconName } from '@/constants/icons';
import layout from '@/constants/layout';
import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ItemHomeProps {
  title: string;
  /** Passo do fluxo (1 a 7), exibido no canto do cartão. */
  numero?: number;
  descricao?: string;
  iconName?: AppIconName;
  imageSource?: ImageSourcePropType;
  onPress: () => void;
  compacto?: boolean;
}

/** Cartão grande da tela inicial: ícone + texto sempre juntos, área de toque ampla. */
const ItemHome: React.FC<ItemHomeProps> = ({ title, numero, descricao, iconName, imageSource, onPress, compacto }) => (
  <TouchableOpacity
    style={[styles.container, compacto && styles.compacto]}
    onPress={onPress}
    activeOpacity={0.8}
    accessibilityRole="button"
    accessibilityLabel={numero ? `Passo ${numero}: ${title}` : title}
    accessibilityHint={descricao}
  >
    {numero != null && (
      <View style={styles.numero}>
        <Text style={styles.numeroTexto}>{numero}</Text>
      </View>
    )}
    {imageSource ? (
      <Image source={imageSource} resizeMode="contain" style={compacto ? styles.imagemCompacta : styles.imagem} />
    ) : iconName ? (
      <Icon name={iconName} size={compacto ? 32 : 48} color={cores.secundaria} />
    ) : null}
    <Text style={[styles.text, compacto && styles.textCompacto]}>{title}</Text>
    {!!descricao && !compacto && <Text style={styles.descricao}>{descricao}</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.branco,
    borderRadius: layout.borderRadius.r50,
    borderWidth: 2,
    borderColor: cores.primaria,
    padding: 12,
    gap: 6,
    boxShadow: '0px 2px 6px rgba(62, 39, 35, 0.18)',
    elevation: 3,
  },
  compacto: { minHeight: 96, borderColor: cores.cores.base[30], padding: 8 },
  numero: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: cores.secundaria,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeroTexto: { color: cores.branco, fontWeight: 'bold', fontSize: 16 },
  imagem: { width: 56, height: 56 },
  imagemCompacta: { width: 32, height: 32 },
  text: { fontSize: 17, fontWeight: 'bold', textAlign: 'center', color: cores.texto },
  textCompacto: { fontSize: 15 },
  descricao: { fontSize: 14, textAlign: 'center', color: cores.textoSecundario },
});

export default ItemHome;
