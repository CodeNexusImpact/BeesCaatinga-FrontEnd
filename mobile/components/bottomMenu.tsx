import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import Icon from '@/components/icon';
import { useRouter } from 'expo-router';
import {temaCores} from '@/constants/cores';
import { useAuth } from '@/hooks/useAuth';

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
            Alert.alert(
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

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/' as any)}>
                <Icon name="home" size={24} color="black" />
                <Text style={styles.menuText}>Inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/apiario/listar' as any)}>
                <Icon name="map" size={24} color="black" />
                <Text style={styles.menuText}>Apiários</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/relatorio' as any)}>
                <Icon name="pizzaGraph" size={24} color="black" />
                <Text style={styles.menuText}>Relatórios</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/configuracao' as any)}>
                <Icon name="settings" size={24} color="black" />
                <Text style={styles.menuText}>Configuração</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleSair}>
                <Icon name="logout" size={24} color="black" />
                <Text style={styles.menuText}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: temaCores.primaria,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        height: 60,
        width: '100%',
    },
    menuItem: {
        alignItems: 'center',
    },
    menuText: {
        fontSize: 12,
        marginTop: 4,
    },
});

export default BottomMenu;