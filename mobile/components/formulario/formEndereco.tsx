import React, { useState, useEffect } from 'react';
import { View, StyleSheet, GestureResponderEvent } from 'react-native';
import Input from '@/components/formulario/input';
import { EnderecoProps } from '@/types/common/Endereco';
import {styles as formStyles} from '@/styles/forms.styles';
import { maskCEP } from '@/utils/masks';
import Botao from '@/components/formulario/botao';

interface FormEnderecoProps {
    enderecoInicial: EnderecoProps;
    onEnderecoChange: (endereco: EnderecoProps) => void;
}

const FormEndereco: React.FC<FormEnderecoProps> = ({ enderecoInicial, onEnderecoChange }) => {
    const [endereco, setEndereco] = useState<EnderecoProps>(enderecoInicial);

    // Sincroniza o estado interno se o endereço inicial mudar (ex: carregamento via API)
    useEffect(() => {
        setEndereco(enderecoInicial);
    }, [enderecoInicial]);

    const handleChange = (field: string, value: string) => {
        let formattedValue = value;
        
        if (field === 'cep') {
            formattedValue = maskCEP(value);        } 

        const updatedEndereco = { ...endereco, [field]: formattedValue };
        setEndereco(updatedEndereco);
        onEnderecoChange(updatedEndereco);
    };

    function handleUseCurrentLocation(event: GestureResponderEvent) {
        // Aqui você pode implementar a lógica para obter a localização atual do usuário
        // e atualizar o estado do endereço com as coordenadas e, se possível, preencher os campos de endereço.
        // Exemplo (usando expo-location):
        /*
        import * as Location from 'expo-location';
        */
    }

    return (
        <View style={formStyles.formStyle}>
        <Botao title={'Usar localização atual'} iconName='location' textStyle={{ color: '#000000' }} onPress={handleUseCurrentLocation}></Botao>

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
