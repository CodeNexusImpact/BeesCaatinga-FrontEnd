import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from './icon';
import { useRouter } from 'expo-router';
import {temaCores} from '@/constants/cores';

const BottomMenu = () => {
    const router = useRouter();

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
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/login' as any)}>
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