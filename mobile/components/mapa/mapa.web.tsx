import React from 'react';
import { StyleSheet, View, Text, Dimensions} from 'react-native';
import cores from '@/constants/cores';

export default function Mapa() {
  return (
    <View style={styles.container}>
      <Text style = {styles.map}>O mapa não disponível para navegadores no momento, utilize a versão para celular para visualizar        
      </Text>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {    
      height: width > 600 ? height * 0.6 : height * 0.4,
      aspectRatio: 1 / 1,
      borderColor: cores.primaria,
      borderWidth: 8,
      borderRadius: 16,
      overflow: 'hidden',
    },
  map: {
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: '40%',
  },
});
