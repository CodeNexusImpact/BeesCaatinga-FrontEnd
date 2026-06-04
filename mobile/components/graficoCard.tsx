import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Botao from './formulario/botao';
import Subtexto from './subTexto';
import KpiCard from './kpiCard'; // Certifique-se que este componente existe

export interface KpiData {
    label: string;
    value: string | number;
    corDaBarra?: string;
}

interface GraficoCardProps {
    subtexto: string;
    kpis: KpiData[];
    // MUDANÇA AQUI: Tornando opcional (?)
    onBotaoPress?: () => void;
    // MUDANÇA AQUI: Tornando opcional (?)
    tituloBotao?: string;
    children?: React.ReactNode;
    showSideBar?: boolean;
}

export default function GraficoCard({
    subtexto,
    kpis,
    onBotaoPress,
    tituloBotao,
    children,
    showSideBar = true
}: GraficoCardProps) {
    return (
        <View style={styles.container}>
            <Subtexto style={styles.subtexto}>
                {subtexto}
            </Subtexto>

            {/* Scroll horizontal dos KPIs */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.kpiScroll}
                contentContainerStyle={styles.kpiContent}
            >
                <View style={styles.kpiRow}>
                    {kpis.map((kpi, index) => (
                        <KpiCard
                            key={index}
                            label={kpi.label}
                            value={kpi.value}
                            corDaBarra={kpi.corDaBarra}
                            showSideBar={showSideBar}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Área do Gráfico */}
            <View style={styles.childrenContainer}>
                {children}
            </View>
            
            {/* MUDANÇA AQUI: Só renderiza o botão se tiver título E função */}
            {tituloBotao && onBotaoPress && (
                <Botao
                    title={tituloBotao}
                    cor="primaria"
                    onPress={onBotaoPress}
                    style={styles.botao}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: cores.branco, // Mudei para branco para destacar o card
        borderRadius: layout.borderRadius.r25,
        padding: layout.espacamento.amigavel,
        marginBottom: layout.espacamento.amigavel,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    subtexto: {
        fontSize: 14,
        color: cores.preto,
        marginBottom: 15,
        textAlign: 'center', // Centraliza o subtexto
    },
    kpiScroll: {
        marginHorizontal: -layout.espacamento.amigavel, // Permite scroll ir até a borda
        marginBottom: 15,
    },
    kpiContent: {
        paddingHorizontal: layout.espacamento.amigavel,
    },
    kpiRow: {
        flexDirection: 'row',
        gap: 12,
    },
    childrenContainer: {
        marginTop: 10,
    },
    botao: {
        marginTop: 20,
    },
});