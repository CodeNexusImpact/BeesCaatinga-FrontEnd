import React, { useState, useEffect, useCallback } from 'react';
// Importe o React Native como um objeto completo
import * as RN from 'react-native';
import * as Location from 'expo-location';
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
import Botao from '@/components/formulario/botao';
import Input from '@/components/formulario/input';
import Selector from '@/components/formulario/selector';
import Subtexto from '@/components/subTexto';
import { useAuth } from '@/hooks/useAuth';
import { listarApiariosPorProdutor } from '@/services/apiarioService';
import { cadastrarColmeia } from '@/services/colmeiaService';

// Constantes
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { voltar } from '@/utils/navegacao';

export default function Cadastrar() {
    const router = useRouter();
    const { user } = useAuth();
    const userId = user?.id;

    const [identificador, setIdentificador] = useState('');
    const [coordenadas, setCoordenadas] = useState<{ latitude: number; longitude: number } | null>(null);
    const [detalhesDaLocalizacao, setDetalhesDaLocalizacao] = useState('');
    const [apiario, setApiario] = useState('');
    const [tipo, setTipo] = useState('');
    const [ativo, setAtivo] = useState('sim');
    const [observacoes, setObservacoes] = useState('');
    const [loading, setLoading] = useState(false);
    const [foto, setFoto] = useState(''); // Armazena a URL da imagem upada

    // Opções dinâmicas
    const [apiarioOptions, setApiarioOptions] = useState<{label: string, value: string}[]>([]);

    /**
     * Busca dinâmica de Apiários com useFocusEffect para garantir dados atualizados
     */
    const carregarApiarios = useCallback(async () => {
        if (!userId) return;
        try {
            const data = await listarApiariosPorProdutor(userId);
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
    }, [userId]);

    useFocusEffect(
        useCallback(() => {
            carregarApiarios();
        }, [carregarApiarios])
    );

    const handleSubmit = async () => {
        if (!identificador || !apiario || !tipo || !userId) {
            Alert.alert('Erro', 'Por favor, selecione um apiário válido e preencha os campos obrigatórios.');
            return;
        }
        if (!coordenadas) {
            Alert.alert('Erro', 'Registre a localização da colmeia ("Usar localização atual").');
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
                latitude: coordenadas.latitude,
                longitude: coordenadas.longitude,
                detalhesDaLocalizacao,
                caminhoDaFoto: foto || undefined
            };

            await cadastrarColmeia(userId, parseInt(apiario), payload);
            Alert.alert('Sucesso', 'Colmeia cadastrada com sucesso!');
            voltar(router);
        } catch (error) {
            console.error('Erro ao cadastrar colmeia:', error);
            Alert.alert('Erro', 'Não foi possível cadastrar a colmeia.');
        } finally {
            setLoading(false);
        }
    };

    const usarLocalizacaoAtual = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão negada', 'Não foi possível acessar a localização.');
                return;
            }
            const pos = await Location.getCurrentPositionAsync({});
            setCoordenadas({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        } catch {
            Alert.alert('Erro', 'Não foi possível obter a localização atual.');
        }
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
                    <Text style={{ color: cores.texto }}>
                        {coordenadas
                            ? `Localização: ${coordenadas.latitude.toFixed(5)}, ${coordenadas.longitude.toFixed(5)}`
                            : 'Localização não registrada'}
                    </Text>
                    <Botao title="📍 Usar localização atual" onPress={usarLocalizacaoAtual} cor="secundaria" />
                    <Input
                        label="Detalhes da localização:"
                        placeholder="Ex.: perto do açude"
                        value={detalhesDaLocalizacao}
                        onChangeText={setDetalhesDaLocalizacao}
                    />
                </View>

                {/* SEÇÃO DADOS ADICIONAIS */}
                <View style={[styles.secao, { zIndex: 0 }]}>
                    <Subtexto>Dados Adicionais</Subtexto>
                    <View style={[styles.secao, { flex: 1,flexDirection: RN.Dimensions.get('window').width > 600 ? 'row' : 'column' , justifyContent: 'space-between', width: '100%'}]}>
                    <Input
                        label='Foto'
                        useImagePicker={true}
                        onImagePicked={(uri) => {
                            setFoto(uri || '');
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