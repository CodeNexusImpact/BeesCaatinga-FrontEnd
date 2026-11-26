import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import cores from '@/constants/cores';
import { formatarNumero, kgParaLitros, lerDecimal, litrosParaKg, paraTexto, useDensidadeMel } from '@/utils/mel';

interface Props {
  /** Quantidade em kg (fonte da verdade). */
  kg: number | null;
  onChange: (kg: number | null) => void;
  rotulo?: string;
}

/** Quantidade de mel: o usuário digita kg OU litros e o outro campo é preenchido automaticamente. */
export default function CampoKgLitros({ kg, onChange, rotulo = 'Quantidade de mel' }: Props) {
  const densidade = useDensidadeMel();
  const [textoKg, setTextoKg] = useState(kg != null ? paraTexto(kg) : '');
  const [textoL, setTextoL] = useState(kg != null ? paraTexto(kgParaLitros(kg, densidade)) : '');
  const [kgAnterior, setKgAnterior] = useState(kg);

  // Valor carregado de fora (ex.: edição): atualiza os dois campos.
  if (kg !== kgAnterior) {
    setKgAnterior(kg);
    if (kg == null) {
      setTextoKg('');
      setTextoL('');
    } else if (Math.abs((lerDecimal(textoKg) || 0) - kg) > 0.001) {
      setTextoKg(paraTexto(kg));
      setTextoL(paraTexto(kgParaLitros(kg, densidade)));
    }
  }

  const limpar = (t: string) => t.replace(/[^0-9.,]/g, '');

  const mudouKg = (t: string) => {
    const txt = limpar(t);
    setTextoKg(txt);
    const n = lerDecimal(txt);
    const valor = Number.isFinite(n) ? n : null;
    setTextoL(valor != null ? paraTexto(kgParaLitros(valor, densidade)) : '');
    setKgAnterior(valor);
    onChange(valor);
  };

  const mudouL = (t: string) => {
    const txt = limpar(t);
    setTextoL(txt);
    const n = lerDecimal(txt);
    const valor = Number.isFinite(n) ? litrosParaKg(n, densidade) : null;
    setTextoKg(valor != null ? paraTexto(valor) : '');
    setKgAnterior(valor);
    onChange(valor);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <View style={styles.linha}>
        <View style={styles.campo}>
          <Text style={styles.sub}>Em quilos (kg)</Text>
          <TextInput
            style={styles.input}
            value={textoKg}
            onChangeText={mudouKg}
            keyboardType="decimal-pad"
            placeholder="0,00"
            accessibilityLabel="Quantidade em quilos"
            testID="campo-kg"
          />
        </View>
        <View style={styles.campo}>
          <Text style={styles.sub}>Em litros (L)</Text>
          <TextInput
            style={styles.input}
            value={textoL}
            onChangeText={mudouL}
            keyboardType="decimal-pad"
            placeholder="0,00"
            accessibilityLabel="Quantidade em litros"
            testID="campo-litros"
          />
        </View>
      </View>
      <Text style={styles.dica}>Digite em kg ou em litros: o outro é calculado (densidade {formatarNumero(densidade)} kg/L).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6, width: '100%' },
  rotulo: { fontSize: 16, fontWeight: 'bold', color: cores.texto },
  linha: { flexDirection: 'row', gap: 10 },
  campo: { flex: 1, gap: 4 },
  sub: { fontSize: 14, color: cores.texto },
  input: { borderWidth: 1, borderColor: '#8a8a8a', borderRadius: 8, paddingHorizontal: 12, minHeight: 48, fontSize: 17, backgroundColor: '#fff' },
  dica: { fontSize: 13, color: '#555' },
});
