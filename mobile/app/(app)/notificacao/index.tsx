import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import CardNotificacao from '@/components/cardNotificacao';

export default function Index() {
        const notificacoes = [
        {
            id: 1,
            titulo: 'Produção Total (kg)',
            mensagem: 'Nova versão disponível com melhorias nos relatórios.',
            naoLida: true,
        },
        {
            id: 2,
            titulo: 'Registro de Mel Concluído',
            mensagem: '20kg de mel da colheita de outono foram registrados com sucesso.',
            naoLida: true,
        },
        {
            id: 3,
            titulo: 'Produção Total (kg)',
            mensagem: 'Nova versão disponível com melhorias nos relatórios.',
            naoLida: true,
        },
        {
            id: 4,
            titulo: 'Vistoria Agendada',
            mensagem: 'Lembrete: Vistoria da Colmeia 101 amanhã, 10h.',
            naoLida: true,
        },
        {
            id: 5,
            titulo: 'Produção Total (kg)',
            mensagem: 'Nova versão disponível com melhorias nos relatórios.',
            naoLida: true,
        },
    ];

    const handleMarcarComoLido = () => {
        console.log('Marcar todas como lidas');
    };

    const handleNotificacaoPress = (id: number) => {
        console.log('Notificação pressionada:', id);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.marcarLidoButton} onPress={handleMarcarComoLido}>
                    <Text style={styles.marcarLidoText}>Marcar como lido</Text>
                </TouchableOpacity>
            </View>

            {/* Lista de notificações */}
            <ScrollView 
                style={styles.scrollView} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {notificacoes.map((notificacao) => (
                    <CardNotificacao
                        key={notificacao.id}
                        titulo={notificacao.titulo}
                        mensagem={notificacao.mensagem}
                        naoLida={notificacao.naoLida}
                        onPress={() => handleNotificacaoPress(notificacao.id)}
                        style={styles.card}
                    />
                ))}
                
                {/* Espaço no final para scroll */}
                <View style={styles.bottomSpace} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.fundo,
    },
    header: {
        flexDirection: 'row-reverse',
        paddingHorizontal: layout.espacamento.amigavel,
        paddingVertical: layout.espacamento.texto,
        backgroundColor: cores.branco,
    },
    marcarLidoButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: cores.primaria,
        borderRadius: layout.borderRadius.r25,
    },
    marcarLidoText: {
        fontSize: 14,
        fontWeight: '600',
        color: cores.branco,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: layout.espacamento.amigavel,
        paddingTop: 10,
    },
    card: {
        marginBottom: 10,
    },
    bottomSpace: {
        height: 20,
    },
});