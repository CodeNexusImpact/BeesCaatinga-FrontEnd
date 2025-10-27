import cores from '@/constants/cores';
import fonts from '@/constants/fonts';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SubtextoProps {
  children: string;
}

const Subtexto: React.FC<SubtextoProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{children}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',

  },
  text: {
    fontSize: fonts.size.p, // 16px
    fontFamily: fonts.family.body,
    color: cores.texto,
    textAlign: 'center',
    margin: 10,
  },
  line: {
    width: '90%',
    height: 1,
    backgroundColor: cores.borda,
  },
});

export default Subtexto;