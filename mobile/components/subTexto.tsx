import cores from '@/constants/cores';
import fonts from '@/constants/fonts';
import React from 'react';
import { StyleSheet, View, ViewStyle, Text, TextStyle } from 'react-native';

interface SubtextoProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Subtexto: React.FC<SubtextoProps> = ({ children, style, textStyle }) => {
  return (
    <View style={[styles.container, style]}>
        <Text style = {[styles.text, textStyle]}>{children}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    alignContent: 'center',
  },

  text: {
    marginBottom: 4,
    fontSize: fonts.size.g, 
    fontFamily: fonts.family.sans,
    color: cores.texto,
  },

  line: {
    width: '100%',
    height: 1,
    backgroundColor: cores.borda,
  },
});

export default Subtexto;