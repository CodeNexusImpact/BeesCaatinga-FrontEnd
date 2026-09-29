import Icon from '@/components/icon';
import cores from '@/constants/cores';
import fonts from '@/constants/fonts';
import { AppIconName } from '@/constants/icons';
import layout from '@/constants/layout';
import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ItemHomeProps {
  title: string;
  iconName?: AppIconName;     
  imageSource?: ImageSourcePropType; 
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
        <Image source={imageSource} resizeMode="contain" style={styles.customImage} />
      ) : iconName ? (
        <Icon name={iconName} size={60} color={cores.primaria} />
      ) : null}

      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.branco,
    borderRadius: layout.borderRadius.r25,
    borderWidth: 0.2,
    borderColor: cores.borda,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.8)',
    elevation: 3,
    padding: layout.espacamento.texto,
    margin: layout.espacamento.amigavel,
  },

  customImage: {
    width: 60,
    height: 60,
  },
  
  text: {
    fontSize: fonts.size.p,
    fontFamily: fonts.family.sans, 
    textAlign: 'center',
  },
});

export default ItemHome;