import cores from '@/constants/cores';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const DivisionLine = () => {
  return <View style={styles.line} />;
};

const styles = StyleSheet.create({
  line: {
    borderBottomColor: cores.bordaSuave, // Color of the line
    borderBottomWidth: 1,      // Thickness of the line
    width: '100%', 
  },
});

export default DivisionLine;
