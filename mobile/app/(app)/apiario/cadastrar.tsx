import React, { useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';

import { ApiarioCriacaoDTO } from '@/types/Apiarios';
import { EnderecoProps } from '@/types/Endereco';
import { Stack } from 'expo-router';

import Input from '@/components/input';
import FormEndereco from '@/components/formEndereco';
import TipoQuantidadeColmeia from '@/components/apiario/tipoQuantidadeColmeia';
import Botao from '@/components/botao';
import Subtexto from '@/components/subTexto';

import { styles as hero } from '@/styles/hero.styles';
import { styles as formStyles } from '@/styles/forms.styles';
import ImagemPicker from '@/components/imagemPicker';



const CadastrarApiario = () => {

    //dados do apiario
    const [nome, setNome] = useState('');
    const [registro, setRegistro] = useState('');
    const [dataCriacao, setDataCriacao] = useState('');

    //endereço
    const [endereco, setEndereco] = useState<EnderecoProps>({
        cep: '',
        propriedade: '',
        estado: '',
        cidade: '',
        bairro: '',
        rua: '',
        numero: '',
        complemento: '',
        coordenadas: {
            latitude: 0,
            longitude: 0,
        },
    });

    //quantidade colmeias por tipo    
    const [colmeiasMadeiraAtivas, setColmeiasMadeiraAtivas] = useState(0);
    const [colmeiasMadeiraInativas, setColmeiasMadeiraInativas] = useState(0);

    const [colmeiasConcretoAtivas, setColmeiasConcretoAtivas] = useState(0);
    const [colmeiasConcretoInativas, setColmeiasConcretoInativas] = useState(0);

    const [colmeiasPoliestirenoAtivas, setColmeiasPoliestirenoAtivas] = useState(0);
    const [colmeiasPoliestirenoInativas, setColmeiasPoliestirenoInativas] = useState(0);

    //dados adicionais
    //const [foto, setFoto] = useState<string[]>([]);
    const [observacoes, setObservacoes] = useState('');


    const handleSubmit = () => {
        const totalColmeiasAtivas = colmeiasMadeiraAtivas + colmeiasConcretoAtivas + colmeiasPoliestirenoAtivas;
        const totalColmeias = totalColmeiasAtivas + colmeiasMadeiraInativas + colmeiasConcretoInativas + colmeiasPoliestirenoInativas;

        const apiarioData: ApiarioCriacaoDTO = {
            nome,
            registro,
            dataCriacao,
            endereco,
            colmeias: {
                madeira: { ativas: colmeiasMadeiraAtivas, inativas: colmeiasMadeiraInativas },
                concreto: { ativas: colmeiasConcretoAtivas, inativas: colmeiasConcretoInativas },
                poliestireno: { ativas: colmeiasPoliestirenoAtivas, inativas: colmeiasPoliestirenoInativas },
            },
            colmeiasAtivas: totalColmeiasAtivas,
            colmeiasTotal: totalColmeias,
            //foto,
            observacoes,
        };

        console.log('Apiário a ser cadastrado:', apiarioData);

        // Aqui você pode fazer uma chamada à API para salvar os dados
        // Exemplo:
        // api.post('/apiarios', apiarioData)
        //     .then(response => console.log('Apiário cadastrado com sucesso:', response))
        //     .catch(error => console.error('Erro ao cadastrar apiário:', error));
    };



    React.useEffect(() => {
        // Example: Pre-fill address with default values or fetch from an API
        setEndereco({
            cep: '00000-000',
            propriedade: 'Propriedade Exemplo',
            estado: 'Estado Exemplo',
            cidade: 'Cidade Exemplo',
            bairro: 'Bairro Exemplo',
            rua: 'Rua Exemplo',
            numero: '123',
            complemento: 'Complemento Exemplo',
            coordenadas: {
                latitude: -10.123456,
                longitude: -50.123456,
            },
        });
    }, []);

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    return (
        <ScrollView>
            <Stack.Screen options={{ title: 'Cadastrar Apiário' }} />

            <View style={hero.formStyle}>
                <View style={formStyles.formStyle}>
                    <Subtexto>Dados</Subtexto>
                    <Input
                        label='Nome'
                        placeholder="Apiário Bees Caatinga "
                        value={nome}
                        onChangeText={setNome}
                    />
                    <Input
                        label='N Registro'
                        placeholder="SISBI 1234/2025"
                        value={registro}
                        onChangeText={setRegistro}
                    />
                    <Input
                        label='Data de Criação'
                        placeholder="31/12/2000"
                        value={dataCriacao}
                        onChangeText={setDataCriacao}
                    />
                </View>
                <View style={formStyles.formStyle}>
                    <Subtexto>Endereço</Subtexto>
                    <FormEndereco enderecoInicial={endereco} onEnderecoChange={setEndereco} />
                </View>
                <View style={formStyles.formStyle}>
                    <Subtexto>Colmeias</Subtexto>
                    <Text>tipo - quantidade colmeias: (ativas / inativas)</Text>
                    <TipoQuantidadeColmeia
                        isEditable={true}
                        tipo={'Madeira'}
                        ativas={colmeiasMadeiraAtivas}
                        inativas={colmeiasMadeiraInativas}
                        onAtivasChange={setColmeiasMadeiraAtivas}
                        onInativasChange={setColmeiasMadeiraInativas}
                    />
                    <TipoQuantidadeColmeia
                        isEditable={false}
                        tipo={'Concreto'}
                        ativas={colmeiasConcretoAtivas}
                        inativas={colmeiasConcretoInativas}
                        onAtivasChange={setColmeiasConcretoAtivas}
                        onInativasChange={setColmeiasConcretoInativas}
                    />
                    <TipoQuantidadeColmeia
                        isEditable={false}
                        tipo={'Poliestireno'}
                        ativas={colmeiasPoliestirenoAtivas}
                        inativas={colmeiasPoliestirenoInativas}
                        onAtivasChange={setColmeiasPoliestirenoAtivas}
                        onInativasChange={setColmeiasPoliestirenoInativas}
                    />
                </View>
                <View style={formStyles.formStyle}>
                    <Subtexto>Dados Adicionais</Subtexto>
                    <View style={[formStyles.formStyle, { flex: 1,flexDirection: Dimensions.get('window').width > 600 ? 'row' : 'column' , justifyContent: 'space-between', width: '100%'}]}>
                        <Input
                            label='Foto'
                            useImagePicker={true}
                            onImagePicked={(uri) => {
                                // Aqui você pode gerenciar a URI da imagem selecionada
                                console.log('Imagem selecionada:', uri);
                            }}
                        />
                        <Input
                            label='Observações'
                            placeholder="Observações adicionais sobre o apiário"
                            value={observacoes}
                            onChangeText={setObservacoes}
                            multiline={true}
                        />
                    </View>
                </View>
                <Botao title="Cadastrar Apiário" onPress={handleSubmit} />



            </View>

        </ScrollView>
    );
};



export default CadastrarApiario;