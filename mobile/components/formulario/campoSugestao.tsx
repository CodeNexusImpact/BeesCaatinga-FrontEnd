import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import cores from '@/constants/cores';
import { buscarSugestoes, CampoSugestao as CampoApi } from '@/services/sugestaoService';
import { filtrarSugestoes, lerHistorico } from '@/utils/sugestoes';

interface Props {
  rotulo: string;
  valor: string;
  onChange: (v: string) => void;
  placeholder?: string;
  dica?: string;
  /** Campo do GET /sugestoes (dados já cadastrados no servidor). */
  campoApi?: CampoApi;
  /** Chave do histórico local (valores digitados antes neste aparelho). */
  campoLocal?: string;
  /** Opções fixas sugeridas (ex.: tipos comuns). */
  opcoes?: string[];
  multiline?: boolean;
  testID?: string;
}

/** Campo de texto com sugestões enquanto digita (dados do produtor + histórico local + opções comuns). */
export default function CampoSugestao({ rotulo, valor, onChange, placeholder, dica, campoApi, campoLocal, opcoes = [], multiline, testID }: Props) {
  const [foco, setFoco] = useState(false);
  const [candidatos, setCandidatos] = useState<string[]>([]);

  useEffect(() => {
    let ativo = true;
    Promise.all([campoApi ? buscarSugestoes(campoApi) : Promise.resolve([]), campoLocal ? lerHistorico(campoLocal) : Promise.resolve([])]).then(
      ([api, local]) => ativo && setCandidatos([...local, ...api, ...opcoes]),
    );
    return () => {
      ativo = false;
    };
    // opcoes é estável por tela
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campoApi, campoLocal]);

  const lista = foco ? filtrarSugestoes(candidatos, valor) : [];

  return (
    <View style={[styles.container, { zIndex: foco ? 500 : 1 }]}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multi]}
        value={valor}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#767676"
        onFocus={() => setFoco(true)}
        onBlur={() => setTimeout(() => setFoco(false), 200)}
        multiline={multiline}
        accessibilityLabel={rotulo}
        testID={testID}
      />
      {lista.length > 0 && (
        <View style={styles.lista} accessibilityRole="menu">
          {lista.map((s) => (
            <TouchableOpacity
              key={s}
              style={styles.item}
              onPress={() => {
                onChange(s);
                setFoco(false);
              }}
              accessibilityRole="menuitem"
              accessibilityLabel={`Sugestão: ${s}`}
            >
              <Text style={styles.itemTexto}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {!!dica && <Text style={styles.dica}>{dica}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 4, width: '100%', position: 'relative' },
  rotulo: { fontSize: 16, fontWeight: 'bold', color: cores.texto },
  input: { borderWidth: 1, borderColor: '#8a8a8a', borderRadius: 8, paddingHorizontal: 12, minHeight: 48, fontSize: 17, backgroundColor: '#fff' },
  multi: { minHeight: 90, paddingTop: 10, textAlignVertical: 'top' },
  lista: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, overflow: 'hidden', elevation: 4, boxShadow: '0px 2px 6px rgba(0,0,0,0.15)' },
  item: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemTexto: { fontSize: 16, color: cores.texto },
  dica: { fontSize: 14, color: '#555' },
});
