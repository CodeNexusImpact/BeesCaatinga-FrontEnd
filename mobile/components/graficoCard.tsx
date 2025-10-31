import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import Botao from './botao';
import Subtexto from './subTexto';
import KpiCard from './kpiCard';

export interface KpiData {
    label: string;
    value: string | number;
    corDaBarra?: string;
}

interface GraficoCardProps {
    subtexto: string;
    kpis: KpiData[];
    onBotaoPress: () => void;
    tituloBotao: string;
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

            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.kpiScroll}
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

            {children}
            
            <Botao
                title={tituloBotao}
                cor="primaria"
                onPress={onBotaoPress}
                style={styles.botao}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.fundo,
        padding: layout.espacamento.amigavel,
    },
    subtexto: {
        fontSize: 16,
        color: cores.texto,
        marginBottom: 15,
    },
    kpiScroll: {
        marginHorizontal: -2,
    },
    kpiRow: {
        flexDirection: 'row',
        gap: 12,
        paddingVertical: 5,
    },
    botao: {
        marginTop: 20,
    },
});