import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from './icon';
import Botao from './formulario/botao';
import temaCores from '@/constants/cores';
import layout from '@/constants/layout';

interface ModalSelecaoImagemProps {
    visivel: boolean;
    aoTirarFoto: () => void;
    aoEscolherDaGaleria: () => void;
    aoCancelar: () => void;
}

export default function ModalSelecaoImagem({
    visivel,
    aoTirarFoto,
    aoEscolherDaGaleria,
    aoCancelar,
}: ModalSelecaoImagemProps) {
    return (
        <Modal
            visible={visivel}
            transparent={true}
            animationType="fade"
            onRequestClose={aoCancelar}
        >
            <View style={styles.sobreposicao}>
                <View style={styles.containerModal}>
                    <TouchableOpacity style={styles.botaoFechar} onPress={aoCancelar}>
                        <Icon name="close" size={20} color={temaCores.texto} />
                    </TouchableOpacity>

                    <Text style={styles.titulo}>Selecionar Imagem</Text>

                    <Text style={styles.mensagem}>Como você quer escolher a imagem?</Text>

                    <View style={styles.botoesContainer}>
                        <Botao
                            title="Tirar Foto"
                            onPress={aoTirarFoto}
                            cor="primaria"
                            tamanho="medio"
                            style={styles.botao}
                        />
                        <Botao
                            title="Escolher da Galeria"
                            onPress={aoEscolherDaGaleria}
                            cor="primaria"
                            tamanho="medio"
                            style={styles.botao}
                        />
                        <Botao
                            title="Cancelar"
                            onPress={aoCancelar}
                            cor="branca"
                            tamanho="medio"
                            style={[styles.botao, styles.botaoCancelar]}
                            textStyle={{ color: temaCores.texto }}
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
        backgroundColor: temaCores.branco,
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
        color: temaCores.texto,
        textAlign: 'center',
        marginBottom: layout.espacamento.texto,
    },
    mensagem: {
        fontSize: 16,
        color: temaCores.texto,
        textAlign: 'center',
        marginBottom: layout.espacamento.colega,
        lineHeight: 22,
    },
    botoesContainer: {
        width: '100%',
        alignItems: 'center',
    },
    botao: {
        width: '100%',
        marginBottom: layout.espacamento.amigavel,
    },
    botaoCancelar: {
        borderWidth: 1,
        borderColor: temaCores.borda,
        backgroundColor: temaCores.cores.base[5],
    }
});