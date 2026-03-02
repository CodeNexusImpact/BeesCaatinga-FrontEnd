import React from 'react';
import { View, Text, StyleSheet, Switch, TextInput, TouchableOpacity } from 'react-native';
import { cores, temaCores } from '@/constants/cores';
import layout from '@/constants/layout';

interface TipoQuantidadeColmeiaProps {
    isEditable: boolean;
    tipo: string;
    ativas: number;
    inativas: number;
    onAtivasChange: (value: number) => void;
    onInativasChange: (value: number) => void;
}

const TipoQuantidadeColmeia: React.FC<TipoQuantidadeColmeiaProps> = ({
    isEditable,
    tipo,
    ativas,
    inativas,
    onAtivasChange,
    onInativasChange
}) => {
    const [isEnabled, setIsEnabled] = React.useState(isEditable);

    const toggleSwitch = () => {
        setIsEnabled(previousState => {
            const newState = !previousState;
            if (!newState) {
                onAtivasChange(0);
                onInativasChange(0);
            }
            return newState;
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.frame}>

                <View style={styles.subFrame}>
                    <TouchableOpacity onPress={toggleSwitch}>
                        <Switch value={isEnabled} />
                    </TouchableOpacity>

                    <Text style={styles.text}>{tipo}</Text>

                </View>


                <View style={styles.subFrame}>
                    <View style={styles.numberInput}>
                        <TextInput
                            style={styles.text}
                            value={ativas.toString()}
                            editable={isEnabled}
                            keyboardType="numeric"
                            maxLength={3}
                            onChangeText={(text) => {
                                const numericValue = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                                onAtivasChange(Number(numericValue));
                            }}
                        />
                    </View>
                    <View style={styles.numberInput}>
                        <TextInput
                            style={styles.text}
                            value={inativas.toString()}
                            editable={isEnabled}
                            keyboardType="numeric"
                            maxLength={3}
                            onChangeText={(text) => {
                                const numericValue = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                                onInativasChange(Number(numericValue));
                            }}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: temaCores.branco,
        gap: 8,
        padding: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 999,
        width: '100%',
    },
    frame: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },
    subFrame: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    numberInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 999,
        paddingHorizontal: 8,
        alignContent: 'center',
        width: 86,
        height: 'auto',
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
});

export default TipoQuantidadeColmeia;