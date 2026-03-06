import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Input from '@/components/input';
import { EnderecoProps } from '@/types/common/Endereco';
import {styles as formStyles} from '@/styles/forms.styles';
import { maskCEP } from '@/utils/masks';

interface FormEnderecoProps {
    enderecoInicial: EnderecoProps;
    onEnderecoChange: (endereco: EnderecoProps) => void;
}

const FormEndereco: React.FC<FormEnderecoProps> = ({ enderecoInicial, onEnderecoChange }) => {
    const [endereco, setEndereco] = useState<EnderecoProps>(enderecoInicial);

    const handleChange = (field: string, value: string) => {
        let formattedValue = value;
        
        if (field === 'cep') {
            formattedValue = maskCEP(value);        } 

        const updatedEndereco = { ...endereco, [field]: formattedValue };
        setEndereco(updatedEndereco);
        onEnderecoChange(updatedEndereco);
    };

    return (
        <View style={formStyles.formStyle}>

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
