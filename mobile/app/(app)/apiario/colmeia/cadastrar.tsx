import React, { useState, useEffect, useCallback } from 'react';
// Importe o React Native como um objeto completo
import * as RN from 'react-native';
import { maskDate } from '@/utils/masks';
const {
    ScrollView,
    StyleSheet,
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator } = RN;

import { Stack, useRouter, useFocusEffect } from 'expo-router';

// Componentes internos
import Botao from '@/components/botao';
import Input from '@/components/input';
import Selector from '@/components/selector';
import Subtexto from '@/components/subTexto';
import { useAuth } from '@/hooks/useAuth';
import { listarApiariosPorProdutor } from '@/services/apiarioService';
import { cadastrarColmeia } from '@/services/colmeiaService';

// Constantes
import cores from '@/constants/cores';
import layout from '@/constants/layout';

export default function Cadastrar() {
    const router = useRouter();
    const { user } = useAuth();

    const [identificador, setIdentificador] = useState('');
    const [dataCriacao, setDataCriacao] = useState(new Date().toLocaleDateString('pt-BR'));
    const [apiario, setApiario] = useState('');
    const [tipo, setTipo] = useState('');
    const [ativo, setAtivo] = useState('sim');
    const [observacoes, setObservacoes] = useState('');
    const [loading, setLoading] = useState(false);

    // Opções dinâmicas
    const [apiarioOptions, setApiarioOptions] = useState<{label: string, value: string}[]>([]);

    /**
     * Busca dinâmica de Apiários com useFocusEffect para garantir dados atualizados
     */
    const carregarApiarios = useCallback(async () => {
        if (!user?.id) return;
        try {
            const data = await listarApiariosPorProdutor(user.id);
            if (Array.isArray(data)) {
                const options = data.map(a => ({ 
                    label: a.nome || `Apiário ${a.id}`, 
                    value: a.id.toString() 
                }));
                setApiarioOptions(options);
            }
        } catch (e) {
            console.error('Erro ao buscar apiários para o select:', e);
        }
    }, [user?.id]);

    useFocusEffect(
        useCallback(() => {
            carregarApiarios();
        }, [carregarApiarios])
    );

    const handleSubmit = async () => {
        if (!identificador || !apiario || !tipo || !user?.id) {
            Alert.alert('Erro', 'Por favor, selecione um apiário válido e preencha os campos obrigatórios.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                identificador,
                apiario_id: parseInt(apiario),
                tipo: tipo.toUpperCase(),
                ativa: ativo === 'sim',
                observacoes,
                latitude: -8.0, // Default para evitar erro de nulo no backend se não vier do mapa
                longitude: -36.0,
                detalhesDaLocalizacao: "",
                caminhoDaFoto: ""
            };

            await cadastrarColmeia(user.id, parseInt(apiario), payload);
            Alert.alert('Sucesso', 'Colmeia cadastrada com sucesso!');
            router.back();
        } catch (error) {
            console.error('Erro ao cadastrar colmeia:', error);
            Alert.alert('Erro', 'Não foi possível cadastrar a colmeia.');
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (text: string) => {
        setDataCriacao(maskDate(text));
    };


    const tipoOptions = [
        { label: 'Madeira', value: 'madeira' },
        { label: 'Concreto', value: 'concreto' },
        { label: 'Poliestireno', value: 'poliestireno' },
    ];

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
            >
                <Stack.Screen options={{ title: 'Cadastrar Colmeia' }} />

                {/* SEÇÃO DADOS */}
                <View style={[styles.secao, { zIndex: 100 }]}>
                    <Subtexto>Dados</Subtexto>

                    <Input
                        label="Identificador:"
                        placeholder="Identificador da Colmeia"
                        value={identificador}
                        onChangeText={setIdentificador}
                        iconName="tag"
                    />

                    {/* Campo de Data com correção para a mensagem preta de preenchimento */}
                    <Input
                        label="Data de Criação:"
                        placeholder="DD/MM/AAAA"
                        value={dataCriacao}
                        onChangeText={handleDateChange}
                        iconName="calendar"
                        autoComplete="off"
                        importantForAutofill="no"
                        textContentType="none"
                        maxLength={10}
                    />

                    <View style={{ zIndex: 30 }}>
                        <Selector
                            label="Apiário:"
                            options={apiarioOptions}
                            onSelect={setApiario}
                            placeholder="Selecione o Apiário"
                            iconName="home"
                            value={apiario}
                        />
                    </View>

                    <View style={{ zIndex: 20 }}>
                        <Selector
                            label="Tipo:"
                            options={tipoOptions}
                            onSelect={setTipo}
                            placeholder="Selecione o tipo"
                            iconName="beehiveOutline"
                            value={tipo}
                        />
                    </View>

                    <View style={{ zIndex: 10 }}>
                        <Selector
                            label="Ativo:"
                            options={[{ label: 'Sim', value: 'sim' }, { label: 'Não', value: 'nao' }]}
                            onSelect={setAtivo}
                            placeholder="Está ativa?"
                            value={ativo}
                        />
                    </View>
                </View>

                {/* SEÇÃO LOCALIZAÇÃO */}
                <View style={[styles.secao, { zIndex: 1, marginTop: 10 }]}>
                    <Subtexto>Localização</Subtexto>
                    <View style={styles.mapaPlaceholder}>
                        <Text style={{ color: cores.cores.base[40] }}>Mapa Interativo</Text>
                    </View>
                    <Botao title="📍 Usar localização atual" onPress={() => { }} cor="secundaria" />
                </View>

                {/* SEÇÃO DADOS ADICIONAIS */}
                <View style={[styles.secao, { zIndex: 0 }]}>
                    <Subtexto>Dados Adicionais</Subtexto>
                    <View style={[styles.secao, { flex: 1,flexDirection: RN.Dimensions.get('window').width > 600 ? 'row' : 'column' , justifyContent: 'space-between', width: '100%'}]}>
                    <Input
                        label='Foto'
                        useImagePicker={true}
                        onImagePicked={(uri) => {
                            // Aqui você pode gerenciar a URI da imagem selecionada
                            console.log('Imagem selecionada:', uri);
                        }}
                    />
                    <Input
                        label="Observações:"
                        placeholder="---"
                        value={observacoes}
                        onChangeText={setObservacoes}
                        multiline={true}
                        style={styles.inputObservacoes}
                    />
                    </View>
                </View>

                <Botao title="Cadastrar ↗" onPress={handleSubmit} cor="primaria" style={styles.buttonFinal} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.cores.base[10] },
    contentContainer: {
        padding: layout.espacamento.amigavel,
        gap: layout.espacamento.colega,
        flexGrow: 1
    },
    secao: { flex: 1, height: 'auto', gap: layout.espacamento.amigavel },
    mapaPlaceholder: {
        height: 220,
        backgroundColor: '#E0E0E0',
        borderRadius: layout.borderRadius.r25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: cores.cores.base[20]
    },
    inputObservacoes: { minHeight: 80, textAlignVertical: 'top' },
    buttonFinal: { marginTop: layout.espacamento.social, marginBottom: 20 },
});