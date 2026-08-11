import React, { useState } from 'react';
import { View, Text, ScrollView, Dimensions, Alert, ActivityIndicator } from 'react-native';

import { ApiarioCriadoDTO } from '@/types/apiario/ApiarioCriadoDTO';
import { EnderecoProps } from '@/types/common/Endereco';
import { maskDate } from '@/utils/masks';
import { Stack, useRouter } from 'expo-router';

import Input from '@/components/formulario/input';
import FormEndereco from '@/components/formulario/formEndereco';
import TipoQuantidadeColmeia from '@/components/apiario/tipoQuantidadeColmeia';
import Botao from '@/components/formulario/botao';
import Subtexto from '@/components/subTexto';

import { styles as hero } from '@/styles/hero.styles';
import { styles as formStyles } from '@/styles/forms.styles';
import ImagemPicker from '@/components/formulario/imagemPicker';
import { useAuth } from '@/hooks/useAuth';
import { cadastrarApiario } from '@/services/apiarioService';

const CadastrarApiario = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    //dados do apiario
    const [nome, setNome] = useState('');
    const [registro, setRegistro] = useState('');
    const [dataCriacao, setDataCriacao] = useState('');

    const handleDateChange = (text: string) => {
        setDataCriacao(maskDate(text));
    };

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
    const [observacoes, setObservacoes] = useState('');


    const handleSubmit = async () => {
        if (!nome || !registro || !user?.id) {
            Alert.alert("Erro", "Por favor, preencha os dados obrigatórios.");
            return;
        }

        setLoading(true);
        const apiarioData: ApiarioCriadoDTO = {
            nome,
            nRegistro: registro,
            dataDeCriacao: dataCriacao,
            cep: endereco.cep,
            nomeDaPropriedade: endereco.propriedade,
            estado: endereco.estado,
            cidade: endereco.cidade,
            bairro: endereco.bairro,
            rua: endereco.rua,
            numero: endereco.numero,
            complemento: endereco.complemento,
            latitude: endereco.coordenadas.latitude,
            longitude: endereco.coordenadas.longitude,
            produtor_id: user.id,
        };

        try {
            await cadastrarApiario(user.id, apiarioData);
            Alert.alert("Sucesso", "Apiário cadastrado com sucesso!");
            router.replace('/apiario/listar');
        } catch (error) {
            console.error('Erro ao cadastrar apiário:', error);
            Alert.alert("Erro", "Não foi possível cadastrar o apiário.");
        } finally {
            setLoading(false);
        }
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
                        onChangeText={handleDateChange}
                        maxLength={10}
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