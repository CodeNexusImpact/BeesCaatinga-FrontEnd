import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import cores from '@/constants/cores';

export default function Mapa() {
  return (
    <View style={styles.container}>
      {/* <MapView style={styles.map} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {    
    width: '90%',
    aspectRatio: 1 / 1,
    borderColor: cores.primaria,
    borderWidth: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {    
    flex: 1,
  },
});
