import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import InputConfig from '@/components/inputConfig';
import Icon from '@/components/icon';
import Botao from '@/components/botao';

export default function Index() {
    // Estados para as configurações
    const [notificacoesAtivadas, setNotificacoesAtivadas] = useState(true);
    const [localizacaoAtivada, setLocalizacaoAtivada] = useState(true);
    const [temaEscuro, setTemaEscuro] = useState(false);
    const [tamanhoFonte, setTamanhoFonte] = useState(16);
    const [mostrarSeletorFonte, setMostrarSeletorFonte] = useState(false);

    const handleNotificacoesPress = () => {
        setNotificacoesAtivadas(!notificacoesAtivadas);
        console.log('Notificações:', !notificacoesAtivadas ? 'Ativadas' : 'Desativadas');
    };

    const handleLocalizacaoPress = () => {
        setLocalizacaoAtivada(!localizacaoAtivada);
        console.log('Localização:', !localizacaoAtivada ? 'Ativada' : 'Desativada');
    };

    const handleTemaPress = () => {
        setTemaEscuro(!temaEscuro);
        console.log('Tema:', !temaEscuro ? 'Escuro' : 'Claro');
    };

    const handleSincronizarPress = () => {
        console.log('Sincronizando dados...');
    };

    const handleTamanhoFontePress = () => {
        setMostrarSeletorFonte(true);
    };

    const handleLimparCachePress = () => {
        console.log('Limpando cache...');
    };

    const handleSalvarPress = () => {
        console.log('Configurações salvas:', {
            notificacoes: notificacoesAtivadas,
            localizacao: localizacaoAtivada,
            tema: temaEscuro ? 'escuro' : 'claro',
            tamanhoFonte: tamanhoFonte
        });
    };

    const handleExcluirPerfilPress = () => {
        console.log('Excluindo perfil...');
    };

    const selecionarTamanhoFonte = (tamanho: number) => {
        setTamanhoFonte(tamanho);
        setMostrarSeletorFonte(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>                
                {/* Lista de configurações */}
                <View style={styles.configList}>
                    {/* Notificações */}
                    <InputConfig
                        label="Notificações"
                        status={notificacoesAtivadas ? "Ativado" : "Desativado"}
                        showSwitch={true}
                        onPress={handleNotificacoesPress}
                        showArrow={false}
                    />
                    
                    {/* Localização */}
                    <InputConfig
                        label="Localização"
                        status={localizacaoAtivada ? "Ativado" : "Desativado"}
                        showSwitch={true}
                        onPress={handleLocalizacaoPress}
                        showArrow={false}
                    />
                    
                    {/* Tema com ícone */}
                    <InputConfig
                        label="Tema"
                        value={temaEscuro ? "Escuro" : "Claro"}
                        onPress={handleTemaPress}
                        showArrow={true}
                        iconName={temaEscuro ? "weather-night" : "white-balance-sunny"}
                    />
                    
                    {/* Sincronização de Dados */}
                    <InputConfig
                        label="Sincronização de Dados"
                        showButton={true}
                        buttonText="Sincronizar"
                        onButtonPress={handleSincronizarPress}
                        showArrow={false}
                    />
                    
                    {/* Tamanho da Fonte */}
                    <InputConfig
                        label="Tamanho da Fonte"
                        value={tamanhoFonte.toString()}
                        onPress={handleTamanhoFontePress}
                        showArrow={true}
                    />
                    
                    {/* Limpar Cache */}
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

            {/* Modal para seleção de tamanho da fonte */}
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
                                onPress={() => selecionarTamanhoFonte(tamanho)}
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