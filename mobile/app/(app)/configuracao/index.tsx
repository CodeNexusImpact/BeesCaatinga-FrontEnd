import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { deletarProdutor } from '@/services/produtorService';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import InputConfig from '@/components/formulario/inputConfig';
import Icon from '@/components/icon';
import Botao from '@/components/formulario/botao';

const CONFIG_KEYS = {
    NOTIFICACOES: '@config_notificacoes',
    LOCALIZACAO: '@config_localizacao',
    TEMA: '@config_tema',
    FONTE: '@config_fonte'
};

export default function Index() {
    const router = useRouter();
    const { user, signOut } = useAuth();

    // Estados locais
    const [notificacoesAtivadas, setNotificacoesAtivadas] = useState(true);
    const [localizacaoAtivada, setLocalizacaoAtivada] = useState(true);
    const [temaEscuro, setTemaEscuro] = useState(false);
    const [tamanhoFonte, setTamanhoFonte] = useState(16);
    
    const [mostrarSeletorFonte, setMostrarSeletorFonte] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const carregarConfiguracoes = async () => {
            try {
                const notificacoes = await AsyncStorage.getItem(CONFIG_KEYS.NOTIFICACOES);
                const localizacao = await AsyncStorage.getItem(CONFIG_KEYS.LOCALIZACAO);
                const tema = await AsyncStorage.getItem(CONFIG_KEYS.TEMA);
                const fonte = await AsyncStorage.getItem(CONFIG_KEYS.FONTE);

                if (notificacoes !== null) setNotificacoesAtivadas(JSON.parse(notificacoes));
                if (localizacao !== null) setLocalizacaoAtivada(JSON.parse(localizacao));
                if (tema !== null) setTemaEscuro(JSON.parse(tema));
                if (fonte !== null) setTamanhoFonte(parseInt(fonte, 10));
            } catch (error) {
                console.error('Erro ao carregar configurações:', error);
            } finally {
                setIsLoading(false);
            }
        };
        carregarConfiguracoes();
    }, []);

    // Handlers
    const handleSalvarPress = async () => {
        try {
            await AsyncStorage.setItem(CONFIG_KEYS.NOTIFICACOES, JSON.stringify(notificacoesAtivadas));
            await AsyncStorage.setItem(CONFIG_KEYS.LOCALIZACAO, JSON.stringify(localizacaoAtivada));
            await AsyncStorage.setItem(CONFIG_KEYS.TEMA, JSON.stringify(temaEscuro));
            await AsyncStorage.setItem(CONFIG_KEYS.FONTE, tamanhoFonte.toString());
            
            Alert.alert('Sucesso', 'Configurações salvas localmente!');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar as configurações.');
        }
    };

    const handleLimparCachePress = () => {
        Alert.alert(
            'Limpar Cache',
            'Isso limpará dados temporários (exceto seu login). Deseja continuar?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Limpar', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear();
                            setNotificacoesAtivadas(true);
                            setLocalizacaoAtivada(true);
                            setTemaEscuro(false);
                            setTamanhoFonte(16);
                            Alert.alert('Sucesso', 'Cache limpo com sucesso.');
                        } catch (error) {
                            Alert.alert('Erro', 'Ocorreu um erro ao limpar o cache.');
                        }
                    } 
                }
            ]
        );
    };

    const handleExcluirPerfilPress = () => {
        if (!user?.id) {
            Alert.alert('Erro', 'Usuário não identificado.');
            return;
        }

        Alert.alert(
            'Atenção Crítica!',
            'Tem certeza? Esta ação é irreversível e apagará TODOS os seus dados permanentemente.',
            [
                { text: 'Não, cancelar', style: 'cancel' },
                { 
                    text: 'Sim, excluir', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deletarProdutor(user.id);
                            Alert.alert('Despedida', 'Seu perfil foi excluído com sucesso.');
                            await signOut();
                            router.replace('/login');
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível excluir o perfil.');
                        }
                    }
                }
            ]
        );
    };

    // A tela inteira não deve ficar bloqueada pelo Loading. Apenas um overlay simples.
    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]} pointerEvents="none">
                <ActivityIndicator size="large" color={cores.primaria} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Garantir o header e botão de voltar funcional */}
            <Stack.Screen options={{ title: 'Configurações' }} />

            <ScrollView 
                style={styles.scrollView} 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled" // Libera os toques perfeitamente
            >                
                {/* Lista de configurações com o componente original restaurado */}
                <View style={styles.configList}>
                    <InputConfig
                        label="Notificações"
                        status={notificacoesAtivadas ? "Ativado" : "Desativado"}
                        showSwitch={true}
                        value={notificacoesAtivadas}
                        onValueChange={setNotificacoesAtivadas}
                        showArrow={false}
                    />
                    <InputConfig
                        label="Localização"
                        status={localizacaoAtivada ? "Ativado" : "Desativado"}
                        showSwitch={true}
                        value={localizacaoAtivada}
                        onValueChange={setLocalizacaoAtivada}
                        showArrow={false}
                    />
                    <InputConfig
                        label="Tema"
                        value={temaEscuro ? "Escuro" : "Claro"}
                        onPress={() => setTemaEscuro(!temaEscuro)}
                        showArrow={true}
                        iconName={temaEscuro ? "weather-night" : "white-balance-sunny"}
                    />
                    <InputConfig
                        label="Sincronização de Dados"
                        showButton={true}
                        buttonText="Sincronizar"
                        onButtonPress={() => Alert.alert('Sincronização', 'Sincronização manual será implementada em breve.')}
                        showArrow={false}
                    />
                    <InputConfig
                        label="Tamanho da Fonte"
                        value={tamanhoFonte.toString()}
                        onPress={() => setMostrarSeletorFonte(true)}
                        showArrow={true}
                    />
                    <InputConfig
                        label="Limpar Cache"
                        showButton={true}
                        buttonText="Limpar"
                        onButtonPress={handleLimparCachePress}
                        showArrow={false}
                    />
                </View>
                
                <View style={styles.buttonsContainer}>
                    <Botao
                        title="Salvar"
                        onPress={handleSalvarPress}
                        cor="primaria"
                        tamanho="grande"
                        style={styles.saveButton}
                        textStyle={styles.saveButtonText}
                    />
                    
                    <Botao
                        title="Excluir perfil"
                        onPress={handleExcluirPerfilPress}
                        cor="branca"
                        tamanho="grande"
                        style={styles.deleteButton}
                        textStyle={styles.deleteButtonText}
                    />
                </View>
            </ScrollView>

            {/* Modal para seleção de tamanho da fonte (design original restaurado) */}
            <Modal
                visible={mostrarSeletorFonte}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setMostrarSeletorFonte(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecionar Tamanho da Fonte</Text>
                        
                        {[14, 16, 18, 20, 22].map((tamanho) => (
                            <TouchableOpacity
                                key={tamanho}
                                style={[
                                    styles.opcaoFonte,
                                    tamanhoFonte === tamanho && styles.opcaoFonteSelecionada
                                ]}
                                onPress={() => {
                                    setTamanhoFonte(tamanho);
                                    setMostrarSeletorFonte(false);
                                }}
                            >
                                <Text style={[
                                    styles.textoOpcaoFonte,
                                    { fontSize: tamanho },
                                    tamanhoFonte === tamanho && styles.textoOpcaoFonteSelecionada
                                ]}>
                                    Tamanho {tamanho}
                                </Text>
                                {tamanhoFonte === tamanho && (
                                    <Icon name="check" size={20} color={cores.primaria} />
                                )}
                            </TouchableOpacity>
                        ))}
                        
                        <TouchableOpacity
                            style={styles.botaoFecharModal}
                            onPress={() => setMostrarSeletorFonte(false)}
                        >
                            <Text style={styles.textoBotaoFechar}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.branco,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: cores.texto,
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 32,
    },
    configList: {
        backgroundColor: cores.branco,
        marginHorizontal: 0,
    },
    buttonsContainer: {
        paddingHorizontal: 20,
        marginTop: 40,
        marginBottom: 20,
        gap: 12,
    },
    saveButton: {
        // Estilos adicionais se necessário
    },
    saveButtonText: {
        // Estilos de texto específicos
    },
    deleteButton: {
        borderWidth: 0.5,
        borderColor: cores.preto,
    },
    deleteButtonText: {
        color: cores.perigo,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: cores.borda, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: cores.branco,
        borderRadius: 12,
        padding: 20,
        width: '80%',
        maxWidth: 300,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: cores.texto,
    },
    opcaoFonte: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    opcaoFonteSelecionada: {
        backgroundColor: cores.primaria, 
    },
    textoOpcaoFonte: {
        color: cores.texto,
    },
    textoOpcaoFonteSelecionada: {
        color: cores.primaria,
        fontWeight: '600',
    },
    botaoFecharModal: {
        marginTop: 16,
        paddingVertical: 12,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: cores.perigo,
    },
    textoBotaoFechar: {
        color: cores.primaria,
        fontSize: 17,
        fontWeight: '600',
    },
});