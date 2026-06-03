import Botao from '@/components/botao';
import Input from '@/components/input';
import Selector from '@/components/selector';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ScrollView, StyleSheet, View, Alert, ActivityIndicator } from 'react-native';
import Subtexto from '@/components/subTexto';
import { getProducaoPorId, atualizarProducao, deletarProducao } from '@/services/producaoService';
import { UnidadeMedida } from '@/types/insumos/Enums';

const DENSIDADE_MEL_KG_L = 1.4;

export default function Editar() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const { user } = useAuth();

    const [tipoProduto, setTipoProduto] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [medida, setMedida] = useState<UnidadeMedida | ''>('');
    const [apiario, setApiario] = useState('');
    const [colmeia, setColmeia] = useState('');
    const [dataColeta, setDataColeta] = useState('');
    const [conversao, setConversao] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const carregarDados = async () => {
            if (!id) return;
            try {
                const data = await getProducaoPorId(id as string);
                if (!data) {
                    Alert.alert('Erro', 'Produção não encontrada.');
                    router.back();
                    return;
                }

                // Preenche os estados com os dados da API
                setTipoProduto(data.tipoProducao);
                setQuantidade(data.quantidade.toString());
                // Mapeamento reverso se necessário (neste caso o DTO não traz unidadeMedida, 
                // mas vamos assumir KILOGRAMA como padrão ou buscar de onde paramos)
                setMedida('KILOGRAMA');
                setApiario('1'); // IDs fixos para o mock se não vierem no DTO
                setColmeia('1');

                // Formata data de YYYY-MM-DD para DD/MM/YYYY
                if (data.dataColeta) {
                    const [ano, mes, dia] = data.dataColeta.split('-');
                    setDataColeta(`${dia}/${mes}/${ano}`);
                }
            } catch (error) {
                Alert.alert('Erro', 'Não foi possível carregar os dados da produção.');
                router.back();
            } finally {
                setIsLoading(false);
            }
        };

        carregarDados();
    }, [id]);

    useEffect(() => {
        const numQuantidade = parseFloat(quantidade.replace(',', '.'));
        if (isNaN(numQuantidade)) {
            setConversao('N/A');
            return;
        }

        let litros = 0;
        if (medida === 'KILOGRAMA') {
            litros = numQuantidade / DENSIDADE_MEL_KG_L;
        } else if (medida === 'LITRO') {
            litros = numQuantidade;
        } else {
            setConversao('N/A');
            return;
        }

        setConversao(`${litros.toFixed(2).replace('.', ',')} L`);
    }, [quantidade, medida]);

    const handleSalvar = async () => {
        if (!id) return;
        if (!quantidade || !medida || !tipoProduto || !apiario || !colmeia || !dataColeta) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        setIsSaving(true);
        try {
            const [dia, mes, ano] = dataColeta.split('/');
            const dataFormatada = `${ano}-${mes}-${dia}`;

            const dto = {
                tipoProducao: tipoProduto,
                quantidade: parseFloat(quantidade.replace(',', '.')),
                unidadeMedida: medida,
                apiarioId: parseInt(apiario),
                colmeiaId: parseInt(colmeia),
                dataColeta: dataFormatada,
            };

            if (!user) {
                Alert.alert('Erro', 'Usuário não autenticado.');
                return;
            }

            await atualizarProducao(id as string, user.id, dto);
            Alert.alert('Sucesso', 'Produção atualizada com sucesso!', [
                { text: 'OK', onPress: () => router.push('/producao/listar') }
            ]);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar as alterações.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleApagar = () => {
        Alert.alert(
            "Apagar Registro",
            `Tem certeza que deseja apagar o registro ID: ${id}? Esta ação não pode ser desfeita.`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Apagar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            if (!user) {
                                Alert.alert('Erro', 'Usuário não autenticado.');
                                return;
                            }

                            await deletarProducao(parseInt(id as string), user.id);
                            Alert.alert('Sucesso', 'Registro apagado!', [
                                { text: 'OK', onPress: () => router.push('/producao/listar') }
                            ]);
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível apagar o registro.');
                        }
                    }
                }
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={cores.primaria} />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <Stack.Screen options={{ title: 'Editar' }} />
            <Subtexto style={styles.subtexto}>Edite os dados da produção.</Subtexto>

            <Input
                label="ID"
                value={id ? id.toString() : ''}
                editable={false}
                style={styles.idInput}
                onChangeText={() => { }}
            />

            <Input
                label="Conversão para litro"
                value={conversao}
                editable={false}
                style={styles.conversaoInput}
                onChangeText={() => { }}
            />

            <View style={styles.row}>
                <Input
                    label="Quantidade"
                    value={quantidade}
                    onChangeText={setQuantidade}
                    keyboardType="decimal-pad"
                    style={styles.inputMetade}
                    placeholder="0,0"
                />
                <Selector
                    label="Medida"
                    options={[
                        { label: 'Kg', value: 'KILOGRAMA' },
                        { label: 'L', value: 'LITRO' },
                    ]}
                    onSelect={(val) => setMedida(val as UnidadeMedida)}
                    placeholder="Selecione"
                    style={styles.inputMetade}
                    value={medida}
                />
            </View>

            <Selector
                label="Tipo Produto"
                options={[
                    { label: 'Mel de Jandaíra', value: 'Mel de Jandaíra' },
                    { label: 'Mel de Marmeleiro', value: 'Mel de Marmeleiro' },
                ]}
                onSelect={setTipoProduto}
                placeholder="Selecione o tipo"
                iconName="honeycomb"
                value={tipoProduto}
            />

            <Selector
                label="Apiário"
                options={[
                    { label: 'Rosa do Sertão', value: '1' },
                    { label: 'Vale das Abelhas', value: '2' },
                ]}
                onSelect={setApiario}
                placeholder="Selecione o Apiário"
                iconName="home"
                value={apiario}
            />

            <Selector
                label="Colmeia"
                options={[
                    { label: 'Colmeia 1', value: '1' },
                    { label: 'Colmeia 2', value: '2' },
                ]}
                onSelect={setColmeia}
                placeholder="Selecione a Colmeia"
                iconName="beehiveOutline"
                value={colmeia}
            />

            <Input
                label="Data Coleta"
                value={dataColeta}
                onChangeText={setDataColeta}
                placeholder="dd/mm/aaaa"
                iconName="calendar"
            />

            <Botao
                title={isSaving ? "Salvando..." : "Salvar Edição"}
                onPress={handleSalvar}
                cor="primaria"
                style={styles.buttonSave}
            />

            <Botao
                title="Apagar registro"
                onPress={handleApagar}
                cor="branca"
                style={styles.buttonDelete}
            />

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.fundo,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        padding: layout.espacamento.amigavel,
        gap: layout.espacamento.colega,
        paddingBottom: layout.espacamento.social,
    },
    subtexto: {
        width: '100%',
        paddingTop: layout.espacamento.amigavel,
        marginBottom: layout.espacamento.amigavel,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: layout.espacamento.amigavel,
        zIndex: 10,
        position: 'relative',
    },
    inputMetade: {
        flex: 1,
    },
    buttonSave: {
        marginTop: layout.espacamento.social,
    },
    idInput: {
        backgroundColor: '#EEEEEE',
        borderColor: '#DDDDDD',
    },
    conversaoInput: {
        backgroundColor: cores.cores.primaria[10],
        borderColor: cores.cores.primaria[30],
    },
    buttonDelete: {
        marginTop: layout.espacamento.amigavel,
    },
});