import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';

import { ApiarioCriadoDTO } from '@/types/apiario/ApiarioCriadoDTO';
import { EnderecoProps } from '@/types/common/Endereco';
import { maskDate } from '@/utils/masks';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import Input from '@/components/formulario/input';
import FormEndereco from '@/components/formulario/formEndereco';
import Botao from '@/components/formulario/botao';
import Subtexto from '@/components/subTexto';

import { styles as hero } from '@/styles/hero.styles';
import { styles as formStyles } from '@/styles/forms.styles';
import ImagemPicker from '@/components/formulario/imagemPicker';
import { useAuth } from '@/hooks/useAuth';
import { atualizarApiario, cadastrarApiario, listarApiariosPorProdutor } from '@/services/apiarioService';
import { voltar } from '@/utils/navegacao';
import { alerta, alertaSalvo, idDoSeletor } from '@/utils/alerta';
import SeletorLocalizacao, { Coordenada } from '@/components/mapa/seletorLocalizacao';
import { validarCoordenadas } from '@/components/mapa/mapaComum';

const isoParaBr = (iso?: string | null) => {
    if (!iso) return '';
    const [a, m, d] = iso.split('-');
    return d && m && a ? `${d}/${m}/${a}` : iso;
};

/** Cadastro e edição de apiário (edição quando a rota recebe `?id=`). */
const CadastrarApiario = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { id: apiarioId } = useLocalSearchParams<{ id?: string }>();
    const editando = !!apiarioId;
    const [loading, setLoading] = useState(false);
    const [foto, setFoto] = useState(''); // Armazena a URL da imagem upada

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


    // localização (mapa/GPS/manual)
    const [local, setLocal] = useState<Coordenada | null>(null);

    //dados adicionais
    const [observacoes, setObservacoes] = useState('');

    // Edição: carrega os dados do apiário (a API não tem GET por id; busca na listagem).
    const userId = user?.id;
    useEffect(() => {
        if (!editando || !userId) return;
        let ativo = true;
        listarApiariosPorProdutor(userId)
            .then((lista) => {
                const a = (lista ?? []).find((x) => String(x.id) === String(apiarioId));
                if (!ativo) return;
                if (!a) {
                    alerta('Erro', 'Apiário não encontrado.');
                    voltar(router);
                    return;
                }
                setNome(a.nome ?? '');
                setRegistro(a.nRegistro ?? '');
                setDataCriacao(isoParaBr(a.dataDeCriacao));
                setObservacoes(a.observacoes ?? '');
                setFoto((a as any).fotoUrl ?? a.caminhoDaFoto ?? '');
                setEndereco({
                    cep: a.cep ?? '',
                    propriedade: a.nomeDaPropriedade ?? '',
                    estado: a.estado ?? '',
                    cidade: a.cidade ?? '',
                    bairro: a.bairro ?? '',
                    rua: a.rua ?? '',
                    numero: a.numero ?? '',
                    complemento: a.complemento ?? '',
                    coordenadas: { latitude: Number(a.latitude ?? 0), longitude: Number(a.longitude ?? 0) },
                });
                setLocal(a.latitude != null && a.longitude != null ? { latitude: Number(a.latitude), longitude: Number(a.longitude) } : null);
            })
            .catch(() => ativo && alerta('Erro', 'Não foi possível carregar o apiário.'));
        return () => {
            ativo = false;
        };
    }, [editando, apiarioId, userId, router]);


    const handleSubmit = async () => {
        const obrigatorios = [nome, registro, endereco.cep, endereco.rua, endereco.bairro, endereco.cidade, endereco.estado, endereco.propriedade];
        if (obrigatorios.some((v) => !v?.trim()) || !user?.id) {
            alerta("Erro", "Preencha nome, registro e endereço (CEP, rua, bairro, cidade, estado e propriedade).");
            return;
        }

        if (local) {
            const erroCoord = validarCoordenadas(local.latitude, local.longitude);
            if (erroCoord) {
                alerta("Erro", erroCoord);
                return;
            }
        }

        setLoading(true);
        const apiarioData: ApiarioCriadoDTO = {
            nome,
            nRegistro: registro,
            dataDeCriacao: dataCriacao || undefined,
            cep: endereco.cep.replace(/\D/g, ''),
            nomeDaPropriedade: endereco.propriedade,
            estado: endereco.estado,
            cidade: endereco.cidade,
            bairro: endereco.bairro,
            rua: endereco.rua,
            numero: endereco.numero,
            complemento: endereco.complemento,
            latitude: local?.latitude ?? null,
            longitude: local?.longitude ?? null,
            produtor_id: user.id,
            observacoes,
            caminhoDaFoto: foto || undefined,
        };

        try {
            if (editando) {
                const { produtor_id: _ignorado, ...dadosAtualizacao } = apiarioData;
                const salvo = await atualizarApiario(Number(apiarioId), user.id, dadosAtualizacao);
                alertaSalvo(salvo, "Apiário atualizado com sucesso!");
                voltar(router);
                return;
            }
            const salvo = await cadastrarApiario(user.id, apiarioData);
            alertaSalvo(salvo, "Apiário cadastrado com sucesso!");
            router.replace('/apiario/listar');
        } catch (error: any) {
            console.error('Erro ao salvar apiário:', error);
            const msg = error?.response?.data?.message;
            alerta("Erro", msg || `Não foi possível ${editando ? 'atualizar' : 'cadastrar'} o apiário.`);
        } finally {
            setLoading(false);
        }
    };





    return (
        <ScrollView>
            <Stack.Screen options={{ title: editando ? 'Editar Apiário' : 'Cadastrar Apiário' }} />

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
                        label='Número de registro (SISBI ou SIF)'
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
                    <Subtexto>Localização no Mapa</Subtexto>
                    <SeletorLocalizacao valor={local} onChange={setLocal} />
                </View>
                <View style={formStyles.formStyle}>
                    <Subtexto>Dados Adicionais</Subtexto>
                    <View style={[formStyles.formStyle, { flex: 1,flexDirection: Dimensions.get('window').width > 600 ? 'row' : 'column' , justifyContent: 'space-between', width: '100%'}]}>
                        <Input
                            label='Foto do apiário (opcional)'
                            useImagePicker={true}
                            imagemInicial={foto || null}
                            onImagePicked={(uri) => {
                                setFoto(uri || '');
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
                <Botao title={loading ? 'Salvando...' : editando ? 'Salvar Alterações' : 'Cadastrar Apiário'} onPress={loading ? () => {} : handleSubmit} />



            </View>

        </ScrollView>
    );
};



export default CadastrarApiario;