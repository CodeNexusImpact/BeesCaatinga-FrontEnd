import cores from '@/constants/cores';
import layout from '@/constants/layout';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from './icon';

interface InputConfigProps {
    label: string;
    value?: string;
    status?: string;
    onPress?: () => void;
    showArrow?: boolean;
    showSwitch?: boolean;
    showButton?: boolean;
    buttonText?: string;
    onButtonPress?: () => void;
    iconName?: string; // Nova prop para ícone
    style?: object;
}

export default function InputConfig({
    label,
    value,
    status,
    onPress,
    showArrow = true,
    showSwitch = false,
    showButton = false,
    buttonText = "Ação",
    onButtonPress,
    iconName, // Nova prop
    style
}: InputConfigProps) {
    
    const renderRightContent = () => {
        if (showButton) {
            return (
                <TouchableOpacity onPress={onButtonPress} style={styles.button}>
                    <Text style={styles.buttonText}>{buttonText}</Text>
                </TouchableOpacity>
            );
        }
        
        if (showSwitch) {
            return (
                <View style={styles.switchContainer}>
                    <View style={[
                        styles.switch,
                        status === 'Ativado' ? styles.switchOn : styles.switchOff
                    ]}>
                        <View style={styles.switchCircle} />
                    </View>
                    <Text style={styles.statusText}>{status}</Text>
                </View>
            );
        }
        
        return (
            <View style={styles.valueContainer}>
                {iconName && (
                    <Icon name={iconName} size={20} color="#8E8E93"/>
                )}
                {value && <Text style={styles.valueText}>{value}</Text>}
                {showArrow && <Icon name="chevronRight" size={20} color="#C7C7CC" />}
            </View>
        );
    };

    const ContainerComponent = onPress ? TouchableOpacity : View;

    return (
        <ContainerComponent 
            style={[styles.container, style]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={styles.label}>{label}</Text>
            <View style={styles.rightContent}>
                {renderRightContent()}
            </View>
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    label: {
        fontSize: 17,
        fontWeight: '400',
        color: '#000000',
        flex: 1,
    },
    rightContent: {
        alignItems: 'flex-end',
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    icon: {
        marginRight: 4,
    },
    valueText: {
        fontSize: 17,
        color: '#8E8E93',
        fontWeight: '400',
    },
    statusText: {
        fontSize: 17,
        color: '#8E8E93',
        fontWeight: '400',
        marginLeft: 8,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    switch: {
        width: 51,
        height: 31,
        borderRadius: 15.5,
        padding: 2,
        justifyContent: 'center',
    },
    switchOn: {
        backgroundColor: '#34C759',
        alignItems: 'flex-end',
    },
    switchOff: {
        backgroundColor: '#E9E9EA',
        alignItems: 'flex-start',
    },
    switchCircle: {
        width: 27,
        height: 27,
        borderRadius: 13.5,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 1,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '600',
    },
});