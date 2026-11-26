import React, { useState } from 'react';
import { View } from 'react-native';
import Input from '@/components/formulario/input';
import CampoSugestao from '@/components/formulario/campoSugestao';
import { EnderecoProps } from '@/types/common/Endereco';
import {styles as formStyles} from '@/styles/forms.styles';
import { maskCEP } from '@/utils/masks';

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

            <CampoSugestao rotulo="Bairro" valor={endereco.bairro} onChange={(value) => handleChange('bairro', value)} placeholder="Digite o bairro" campoApi="bairro" />

            <CampoSugestao rotulo="Cidade" valor={endereco.cidade} onChange={(value) => handleChange('cidade', value)} placeholder="Digite a cidade" campoApi="cidade" />

            <CampoSugestao rotulo="Estado" valor={endereco.estado} onChange={(value) => handleChange('estado', value)} placeholder="Digite o estado" campoApi="estado" dica="Ex.: PB" />            

            <CampoSugestao rotulo="Propriedade" valor={endereco.propriedade} onChange={(value) => handleChange('propriedade', value)} placeholder="Digite a propriedade" campoApi="nomeDaPropriedade" dica="Nome do sítio ou fazenda" />

            <Input
                label="Complemento"
                value={endereco.complemento}
                onChangeText={(value) => handleChange('complemento', value)}
                placeholder="Digite o complemento"
            />
        </View>
    );
};

export default FormEndereco;
