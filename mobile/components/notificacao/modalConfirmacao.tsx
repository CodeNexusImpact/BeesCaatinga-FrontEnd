import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '../icon';
import Botao from '../formulario/botao';
import cores from '@/constants/cores';
import layout from '@/constants/layout';

interface ModalConfirmacaoProps {
    visivel: boolean;
    titulo: string;
    mensagem: string;
    textoConfirmar?: string;
    textoCancelar?: string;
    aoConfirmar: () => void;
    aoCancelar: () => void;
    aoFechar?: () => void;
}

export default function ModalConfirmacao({
    visivel,
    titulo,
    mensagem,
    textoConfirmar = 'Apagar',
    textoCancelar = 'Cancelar',
    aoConfirmar,
    aoCancelar,
    aoFechar,
}: ModalConfirmacaoProps) {

    return (
        <Modal
            visible={visivel}
            transparent={true}
            animationType="fade"
            onRequestClose={aoFechar}
        >
            <View style={styles.sobreposicao}>
                <View style={styles.containerModal}>
                    {/* Botão de fechar (X) */}
                    {aoFechar && (
                        <TouchableOpacity style={styles.botaoFechar} onPress={aoFechar}>
                            <Icon name="close" size={20} color={cores.texto} />
                        </TouchableOpacity>
                    )}

                    <Text style={styles.titulo}>{titulo}</Text>

                    <Text style={styles.mensagem}>{mensagem}</Text>

                    <View style={styles.linhaBotoes}>
                        <Botao
                            title={textoCancelar}
                            onPress={aoCancelar}
                            cor="branca"
                            tamanho="pequeno"
                            style={{
                                borderWidth: 1,
                                borderColor: cores.borda[30],
                                backgroundColor: cores.borda[5],
                            }}
                            textStyle={{ fontSize: 14, color: cores.texto }}
                        />
                        <Botao
                            title={textoConfirmar}
                            onPress={aoConfirmar}
                            cor="primaria"
                            tamanho="pequeno"
                            style={{
                                borderWidth: 1,
                                borderColor: cores.primaria,
                            }}
                            textStyle={{ fontSize: 14, color: cores.branco }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    sobreposicao: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerModal: {
        width: '80%',
        maxWidth: 350,
        backgroundColor: cores.branco,
        borderRadius: layout.borderRadius.r25,
        padding: layout.espacamento.amigavel,
        position: 'relative',
        alignItems: 'center',
    },
    botaoFechar: {
        position: 'absolute',
        top: layout.espacamento.texto,
        right: layout.espacamento.texto,
        padding: 5,
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: cores.texto,
        textAlign: 'center',
        marginBottom: layout.espacamento.texto,
    },
    mensagem: {
        fontSize: 16,
        color: cores.texto,
        textAlign: 'center',
        marginBottom: layout.espacamento.colega,
        lineHeight: 22,
    },
    linhaBotoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: layout.espacamento.texto,
        width: '100%',
    },
});