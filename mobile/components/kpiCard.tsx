import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import cores from '@/constants/cores';
import layout from '@/constants/layout';

interface KpiCardProps {
    label: string;
    value: string | number;
    corDaBarra?: string;
    showSideBar?: boolean;
    style?: StyleProp<ViewStyle>;
}

export default function KpiCard({
    label,
    value,
    corDaBarra = cores.primaria, 
    showSideBar = true,
    style
}: KpiCardProps) {
    return (
        <View style={[styles.kpiCardContainer, style]}>
            {showSideBar && (
                <View style={[styles.kpiSideBorder, { backgroundColor: corDaBarra }]} />
            )}

            {/* Conteúdo do card */}
            <View style={[
                styles.kpiContentCard,
                !showSideBar && styles.kpiContentCardNoBar
            ]}>
                <Text style={styles.kpiLabel} numberOfLines={2}>{label}</Text>
                <Text style={styles.kpiValue}>{value}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    kpiCardContainer: {
        flexDirection: 'row',
        minWidth: 160,
        height: 90,
        backgroundColor: cores.branco, 
        borderRadius: layout.borderRadius.r25, 
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        elevation: 3,
        marginVertical: 5,
        marginHorizontal: 2,
        overflow: 'hidden', 
    },
    kpiSideBorder: {
        width: 9, 
        height: '100%',
        backgroundColor: cores.primaria, 
    },
    kpiContentCard: {
        flex: 1,
        paddingHorizontal: layout.espacamento.amigavel,
        paddingVertical: layout.espacamento.texto,
        justifyContent: 'space-between',
    },
    kpiContentCardNoBar: {
    },
    
    kpiLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: cores.texto,
        textAlign: 'left',
    },
    kpiValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: cores.texto,
        textAlign: 'center',
    },
});