import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Subtexto from '@/components/subTexto';
import Botao from '@/components/formulario/botao';

export default function Index() {
    const router = useRouter();

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{ title: 'Relatórios' }} />

            <Subtexto style={styles.subtexto}>Gerencie seus relatórios</Subtexto>

            <View style={styles.botoesContainer}>
                <View style={styles.botaoCard}>
                    <Botao
                        title="Relatório Apiário"
                        cor="secundaria"
                        iconName="fileDocument"
                        onPress={() => router.push('/apiario/tabelaApiario')}
                        style={styles.botao}
                        textStyle={styles.botaoTexto}
                    />
                </View>
                <View style={styles.botaoCard}>
                    <Botao
                        title="Relatório Colmeia"
                        cor="secundaria"
                        iconName="fileDocument"
                        onPress={() => router.push('/apiario/tabelaColmeia')}
                        style={styles.botao}
                        textStyle={styles.botaoTexto}
                    />
                </View>

                <View style={styles.botaoCard}>
                    <Botao
                        title="Relatório Produção"
                        cor="secundaria"
                        iconName="fileDocument"
                        onPress={() => router.push('/producao/tabela')}
                        style={styles.botao}
                        textStyle={styles.botaoTexto}
                    />
                </View>

                <View style={styles.botaoCard}>
                    <Botao
                        title="Relatório Vistoria"
                        cor="secundaria"
                        iconName="fileDocument"
                        onPress={() => router.push('/vistorias/tabela')}
                        style={styles.botao}
                        textStyle={styles.botaoTexto}
                    />
                </View>

                <View style={styles.botaoCard}>
                    <Botao
                        title="Relatório Insumo"
                        cor="secundaria"
                        iconName="fileDocument"
                        onPress={() => router.push('/insumos/tabela')}
                        style={styles.botao}
                        textStyle={styles.botaoTexto}
                    />
                </View>

                <View style={styles.botaoCard}>
                    <Botao
                        title="Relatório Rastreabilidade"
                        cor="secundaria"
                        iconName="fileDocument"
                        onPress={() => router.push('/rastreabilidade/tabela')}
                        style={styles.botao}
                        textStyle={styles.botaoTexto}
                    />
                </View>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.cores.base[10],
    },
    subtexto: {
        fontSize: 16,
        color: cores.cores.base[80],
        textAlign: 'center',
        paddingHorizontal: layout.espacamento.amigavel,
        paddingTop: layout.espacamento.amigavel,
        paddingBottom: layout.espacamento.colega,
        fontWeight: '600',
    },
    botoesContainer: {
        padding: layout.espacamento.amigavel,
        gap: layout.espacamento.colega,
    },
    botaoCard: {
        backgroundColor: cores.cores.base[10],
        borderRadius: layout.borderRadius.r25,
        padding: layout.espacamento.amigavel,
        shadowColor: cores.cores.base[100],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: cores.cores.base[40],
    },
    botao: {
        marginBottom: layout.espacamento.texto,
    },
    botaoTexto: {
        fontSize: 16,
        fontWeight: '600',
    },
}); 