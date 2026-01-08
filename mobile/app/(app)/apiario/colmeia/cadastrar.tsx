import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import Botao from '@/components/botao';
import Input from '@/components/input';
import Selector from '@/components/selector';
import Subtexto from '@/components/subTexto';
import ImagePickerExample from '@/components/imagemPicker';
import cores from '@/constants/cores';
import layout from '@/constants/layout';

export default function Cadastrar() {
    const router = useRouter();

    const [identificador, setIdentificador] = useState('');
    const [dataCriacao, setDataCriacao] = useState('');
    const [apiario, setApiario] = useState('');
    const [tipo, setTipo] = useState('');
    const [ativo, setAtivo] = useState('');
    const [observacoes, setObservacoes] = useState('');

    const apiarioOptions = [
        { label: 'Rosa do Sertão', value: 'rosa' },
        { label: 'Vale das Abelhas', value: 'vale' },
    ];

    const tipoOptions = [
        { label: 'Madeira', value: 'madeira' },
        { label: 'Concreto', value: 'concreto' },
        { label: 'Poliestireno', value: 'poliestireno' },
    ];

    return (
        <ScrollView 
            style={styles.container} 
            contentContainerStyle={styles.contentContainer}
            nestedScrollEnabled={true}
        >
            <Stack.Screen options={{ title: 'Cadastrar Colmeia' }} />

            {/* SEÇÃO DADOS: zIndex decrescente para os seletores não bugarem */}
            <View style={[styles.secao, { zIndex: 100 }]}>
                <Subtexto>Dados</Subtexto>

                <Input
                    label="Identificador:"
                    placeholder="Colmeia"
                    value={identificador}
                    editable={false}
                    onChangeText={setIdentificador}
                />

                <Input
                    label="Data de Criação:"
                    placeholder="DD/MM/AAAA"
                    value={dataCriacao}
                    onChangeText={setDataCriacao}
                    iconName="calendar"
                />

                <View style={{ zIndex: 30 }}>
                    <Selector
                        label="Apiário:"
                        options={apiarioOptions}
                        onSelect={setApiario}
                        placeholder="Selecione o Apiário"
                        iconName="home"
                    />
                </View>

                <View style={{ zIndex: 20 }}>
                    <Selector
                        label="Tipo:"
                        options={tipoOptions}
                        onSelect={setTipo}
                        placeholder="Selecione o tipo"
                        iconName="beehiveOutline"
                    />
                </View>

                <View style={{ zIndex: 10 }}>
                    <Selector
                        label="Ativo:"
                        options={[{label: 'Sim', value: 'sim'}, {label: 'Não', value: 'nao'}]}
                        onSelect={setAtivo}
                        placeholder="Está ativa?"
                    />
                </View>
            </View>

            {/* SEÇÃO LOCALIZAÇÃO */}
            <View style={[styles.secao, { zIndex: 1, marginTop: 10 }]}>
                <Subtexto>Localização</Subtexto>
                <View style={styles.mapaPlaceholder}>
                    <Text style={{ color: cores.placeholder }}>Mapa Interativo</Text>
                </View>
                <Botao title="📍 Usar localização atual" onPress={() => {}} cor="secundaria" />
            </View>

            <View style={[styles.secao, { zIndex: 0 }]}>
                <Subtexto>Dados Adicionais</Subtexto>
                <ImagePickerExample />
                <Input
                    label="Observações:"
                    placeholder="---"
                    value={observacoes}
                    onChangeText={setObservacoes}
                    multiline={true}
                    style={styles.inputObservacoes}
                />
            </View>

            <Botao title="Cadastrar ↗" onPress={() => {}} cor="primaria" style={styles.buttonFinal} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.cores.base[10] },
    contentContainer: { padding: layout.espacamento.amigavel, gap: layout.espacamento.colega },
    secao: { gap: layout.espacamento.amigavel },
    mapaPlaceholder: { height: 220, backgroundColor: '#E0E0E0', borderRadius: layout.borderRadius.r25, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: cores.borda },
    inputObservacoes: { minHeight: 80, textAlignVertical: 'top' },
    buttonFinal: { marginTop: layout.espacamento.social, marginBottom: 20 },
});