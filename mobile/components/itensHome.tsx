import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ImageSourcePropType, Image } from 'react-native';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import fonts from '@/constants/fonts';
import { AppIconName } from '@/constants/icons';
import Icon from '@/components/icon';

interface ItemHomeProps {
  title: string;
  iconName?: AppIconName;       // Ícone padrão
  imageSource?: ImageSourcePropType; // Imagem personalizada
  onPress: () => void;
}

const ItemHome: React.FC<ItemHomeProps> = ({ title, iconName, imageSource, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {imageSource ? (
        <Image source={imageSource} style={styles.customImage} />
      ) : iconName ? (
        <Icon name={iconName} size={60} color={cores.primaria} />
      ) : null}

      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 126,
    height: 126,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.branco,
    borderRadius: layout.borderRadius.r25,
    borderWidth: 0.2,
    borderColor: cores.borda,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
    padding: layout.espacamento.texto,
    margin: layout.espacamento.amigavel,
  },
  customImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  text: {
    fontSize: fonts.size.p,
    fontFamily: fonts.family.body,
    textAlign: 'center',
  },
});

export default ItemHome;