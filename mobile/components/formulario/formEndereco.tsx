import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import Input from '@/components/formulario/input';
import { EnderecoProps } from '@/types/common/Endereco';
import {styles as formStyles} from '@/styles/forms.styles';
import { maskCEP } from '@/utils/masks';
import Botao from '@/components/formulario/botao';
import { alerta } from '@/utils/alerta';

interface FormEnderecoProps {
    enderecoInicial: EnderecoProps;
    onEnderecoChange: (endereco: EnderecoProps) => void;
}

const FormEndereco: React.FC<FormEnderecoProps> = ({ enderecoInicial, onEnderecoChange }) => {
    const [endereco, setEndereco] = useState<EnderecoProps>(enderecoInicial);

    const [enderecoAnterior, setEnderecoAnterior] = useState<EnderecoProps>(enderecoInicial);

    // Sincroniza o estado interno se o endereço inicial mudar (ex: carregamento via API)
    if (enderecoInicial !== enderecoAnterior) {
        setEnderecoAnterior(enderecoInicial);
        setEndereco(enderecoInicial);
    }

    const handleChange = (field: string, value: string) => {
        let formattedValue = value;
        
        if (field === 'cep') {
            formattedValue = maskCEP(value);        } 

        const updatedEndereco = { ...endereco, [field]: formattedValue };
        setEndereco(updatedEndereco);
        onEnderecoChange(updatedEndereco);
    };

    // Preenche as coordenadas com a posição atual do dispositivo.
    async function handleUseCurrentLocation() {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alerta('Permissão negada', 'Não foi possível acessar a localização.');
                return;
            }
            const pos = await Location.getCurrentPositionAsync({});
            const updatedEndereco = {
                ...endereco,
                coordenadas: { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
            };
            setEndereco(updatedEndereco);
            onEnderecoChange(updatedEndereco);
        } catch {
            alerta('Erro', 'Não foi possível obter a localização atual.');
        }
    }

    const { latitude, longitude } = endereco.coordenadas ?? { latitude: 0, longitude: 0 };

    return (
        <View style={formStyles.formStyle}>
        <Botao title={'Usar localização atual'} iconName='location' textStyle={{ color: '#000000' }} onPress={handleUseCurrentLocation}></Botao>
            {latitude !== 0 || longitude !== 0 ? (
                <Text>{`Coordenadas: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`}</Text>
            ) : null}

            <Input
                label="CEP"
                value={endereco.cep}
                onChangeText={(value) => handleChange('cep', value)}
                placeholder="Digite o CEP"
                keyboardType="numeric"
            />

            <Input
                label="Rua"
                value={endereco.rua}
                onChangeText={(value) => handleChange('rua', value)}
                placeholder="Digite a rua"
            />

            <Input
                label="Número"
                value={endereco.numero}
                onChangeText={(value) => handleChange('numero', value)}
                placeholder="Digite o número"
                keyboardType="numeric"
                maxLength={10}
            />

            <Input
                label="Bairro"
                value={endereco.bairro}
                onChangeText={(value) => handleChange('bairro', value)}
                placeholder="Digite o bairro"
            />

            <Input
                label="Cidade"
                value={endereco.cidade}
                onChangeText={(value) => handleChange('cidade', value)}
                placeholder="Digite a cidade"
            />

            <Input
                label="Estado"
                value={endereco.estado}
                onChangeText={(value) => handleChange('estado', value)}
                placeholder="Digite o estado"
            />            

            <Input
                label="Propriedade"
                value={endereco.propriedade}
                onChangeText={(value) => handleChange('propriedade', value)}
                placeholder="Digite a propriedade"
            />

            <Input
                label="Complemento"
                value={endereco.complemento}
                onChangeText={(value) => handleChange('complemento', value)}
                placeholder="Digite o complemento"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
});

export default FormEndereco;
