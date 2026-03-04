import React from 'react';
import { View, StyleSheet } from 'react-native';

const DivisionLine = () => {
  return <View style={styles.line} />;
};

const styles = StyleSheet.create({
  line: {
    borderBottomColor: '#ccc', // Color of the line
    borderBottomWidth: 1,      // Thickness of the line
    width: '100%', 
  },
});

export default DivisionLine;
