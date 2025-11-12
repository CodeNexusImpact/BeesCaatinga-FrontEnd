import cores from '@/constants/cores';
import fonts from '@/constants/fonts';
import React from 'react';
import { StyleSheet, View, ViewStyle, Text } from 'react-native';

interface SubtextoProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const Subtexto: React.FC<SubtextoProps> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
        <Text>{children}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  text: {
    fontSize: fonts.size.p, 
    fontFamily: fonts.family.sans,
    color: cores.texto,
    margin: 20,
  },

  line: {
    width: '90%',
    height: 1,
    backgroundColor: cores.borda,
  },
});

export default Subtexto;