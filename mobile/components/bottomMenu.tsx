import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from '@/components/icon';
import { useRouter } from 'expo-router';
import {temaCores} from '@/constants/cores';
import { useAuth } from '@/hooks/useAuth';
import { alerta } from '@/utils/alerta';

const BottomMenu = () => {
    const router = useRouter();
    const { signOut } = useAuth();

    const handleSair = () => {
        if (Platform.OS === 'web') {
            const confirmar = window.confirm("Deseja realmente sair do sistema?");
            if (confirmar) {
                signOut();
            }
        } else {
            alerta(
                "Sair",
                "Deseja realmente sair do sistema?",
                [
                    { text: "Cancelar", style: "cancel" },
                    { 
                        text: "Sair", 
                        onPress: async () => {
                            await signOut();
                        } 
                    }
                ]
            );
        }
    };

    const itens: { rotulo: string; icone: string; acao: () => void }[] = [
        { rotulo: 'Início', icone: 'home', acao: () => router.push('/' as any) },
        { rotulo: 'Apiários', icone: 'beehiveOutline', acao: () => router.push('/apiario/listar' as any) },
        { rotulo: 'Mapa', icone: 'map', acao: () => router.push('/mapa' as any) },
        { rotulo: 'Relatórios', icone: 'pizzaGraph', acao: () => router.push('/relatorio' as any) },
        { rotulo: 'Sair', icone: 'logout', acao: handleSair },
    ];

    return (
        <View style={styles.container} accessibilityRole="tablist">
            {itens.map((i) => (
                <TouchableOpacity key={i.rotulo} style={styles.menuItem} onPress={i.acao} accessibilityRole="button" accessibilityLabel={i.rotulo}>
                    <Icon name={i.icone} size={26} color={temaCores.textoSobrePrimaria} />
                    <Text style={styles.menuText}>{i.rotulo}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: temaCores.primaria,
        paddingVertical: 6,
        borderTopWidth: 1,
        borderTopColor: temaCores.identidade.marrom,
        height: 64,
        width: '100%',
    },
    menuItem: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 64,
        minHeight: 52,
    },
    menuText: {
        fontSize: 13,
        fontWeight: '600',
        color: temaCores.textoSobrePrimaria,
        marginTop: 2,
    },
});

export default BottomMenu;