import Botao from '@/components/formulario/botao';
import CampoKgLitros from '@/components/formulario/campoKgLitros';
import CampoSugestao from '@/components/formulario/campoSugestao';
import { paraKg } from '@/utils/mel';
import Input from '@/components/formulario/input';
import Selector from '@/components/formulario/selector';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { maskDate } from '@/utils/masks';
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import Subtexto from '@/components/subTexto';
import { getProducaoPorId, atualizarProducao, deletarProducao } from '@/services/producaoService';
import { UnidadeMedida } from '@/types/insumos/Enums';
import { listarApiariosPorProdutor } from '@/services/apiarioService';
import { listarColmeiasPorApiario } from '@/services/colmeiaService';
import { voltar } from '@/utils/navegacao';
import { alerta, alertaSalvo, idDoSeletor } from '@/utils/alerta';

type Opcao = { label: string; value: string };


export default function Editar() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const { user } = useAuth();

    const [tipoProduto, setTipoProduto] = useState('');
    const [kg, setKg] = useState<number | null>(null);
    const [apiario, setApiario] = useState('');
    const [colmeia, setColmeia] = useState('');
    const [dataColeta, setDataColeta] = useState('');
    const [apiarioOptions, setApiarioOptions] = useState<Opcao[]>([]);
    const [colmeiaOptions, setColmeiaOptions] = useState<Opcao[]>([]);
    const [nomeColmeiaOriginal, setNomeColmeiaOriginal] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const carregarDados = async () => {
            if (!id || !user?.id) return;
            try {
                const [data, apiarios] = await Promise.all([
                    getProducaoPorId(user.id, id as string),
                    listarApiariosPorProdutor(user.id),
                ]);
                if (!data) {
                    alerta('Erro', 'Produção não encontrada.');
                    voltar(router);
                    return;
                }

                const opcoes = (apiarios ?? []).map((a) => ({ label: a.nome, value: String(a.id) }));
                setApiarioOptions(opcoes);

                setTipoProduto(data.tipoProducao);
                setKg(Math.round(paraKg(data.quantidade, data.unidadeMedida) * 100) / 100);
                setApiario(data.apiarioId ? String(data.apiarioId) : opcoes.find((o) => o.label === data.nomeApiario)?.value ?? '');
                if (data.colmeiaId) setColmeia(String(data.colmeiaId));
                setNomeColmeiaOriginal(data.nomeColmeia ?? '');

                if (data.dataColeta) {
                    const [ano, mes, dia] = data.dataColeta.split('-');
                    setDataColeta(`${dia}/${mes}/${ano}`);
                }
            } catch {
                alerta('Erro', 'Não foi possível carregar os dados da produção.');
                voltar(router);
            } finally {
                setIsLoading(false);
            }
        };

        carregarDados();
    }, [id, user?.id, router]);

    // Carrega as colmeias do apiário selecionado.
    useEffect(() => {
        if (!user?.id || !apiario) return;
        let ativo = true;
        listarColmeiasPorApiario(user.id, apiario)
            .then((lista: { id: number; identificador: string }[]) => {
                if (!ativo) return;
                const opcoes = (lista ?? []).map((c) => ({ label: c.identificador, value: String(c.id) }));
                setColmeiaOptions(opcoes);
                setColmeia((atual) => atual || (opcoes.find((o) => o.label === nomeColmeiaOriginal)?.value ?? ''));
            })
            .catch(() => ativo && setColmeiaOptions([]));
        return () => {
            ativo = false;
        };
    }, [apiario, user?.id, nomeColmeiaOriginal]);

    const handleSalvar = async () => {
        if (!id) return;
        if (!kg || kg <= 0 || !tipoProduto.trim() || !dataColeta) {
            alerta('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        setIsSaving(true);
        try {
            const [dia, mes, ano] = dataColeta.split('/');
            const dataFormatada = `${ano}-${mes}-${dia}`;

            const dto = {
                tipoProducao: tipoProduto,
                // Quantidade sempre em kg (o campo em litros é convertido pela densidade do mel).
                quantidade: Math.round(kg * 100) / 100,
                unidadeMedida: 'KILOGRAMA' as UnidadeMedida,
                apiarioId: apiario ? parseInt(apiario, 10) : undefined,
                colmeiaId: colmeia ? parseInt(colmeia, 10) : undefined,
                dataColeta: dataFormatada,
            };

            if (!user) {
                alerta('Erro', 'Usuário não autenticado.');
                return;
            }

            const salvo = await atualizarProducao(id as string, user.id, dto);
            alertaSalvo(salvo, 'Produção atualizada com sucesso!', [
                { text: 'OK', onPress: () => router.push('/producao/listar') }
            ]);
        } catch (error) {
            alerta('Erro', 'Não foi possível salvar as alterações.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleApagar = () => {
        alerta(
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
                                alerta('Erro', 'Usuário não autenticado.');
                                return;
                            }

                            await deletarProducao(parseInt(id as string), user.id);
                            alerta('Sucesso', 'Registro apagado!', [
                                { text: 'OK', onPress: () => router.push('/producao/listar') }
                            ]);
                        } catch (error) {
                            alerta('Erro', 'Não foi possível apagar o registro.');
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
            <Stack.Screen options={{ title: 'Editar Produção' }} />
            <Subtexto style={styles.subtexto}>Edite os dados da produção.</Subtexto>

            <Input
                label="ID"
                value={id ? id.toString() : ''}
                editable={false}
                style={styles.idInput}
                onChangeText={() => { }}
            />

            <CampoKgLitros kg={kg} onChange={setKg} rotulo="Quantidade colhida" />

            <View style={{ zIndex: 40 }}>
                <CampoSugestao rotulo="Tipo de mel" valor={tipoProduto} onChange={setTipoProduto} placeholder="Ex.: Mel de Jandaíra" campoApi="tipoProducao" campoLocal="producao.tipo" />
            </View>

            <Selector
                label="Apiário"
                options={apiarioOptions}
                onSelect={(v) => { setApiario(v); setColmeia(''); }}
                placeholder="Selecione o Apiário"
                iconName="home"
                value={apiario}
            />

            <Selector
                label="Colmeia"
                options={colmeiaOptions}
                onSelect={setColmeia}
                placeholder="Selecione a Colmeia"
                iconName="beehiveOutline"
                value={colmeia}
            />

            <Input
                label="Data Coleta"
                value={dataColeta}
                onChangeText={(t) => setDataColeta(maskDate(t))}
                maxLength={10}
                placeholder="dd/mm/aaaa"
                iconName="calendar"
            />

            <Botao
                title={isSaving ? "Salvando..." : "Salvar alterações"}
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
        flexDirection: 'row', flexWrap: 'wrap', // empilha em telas estreitas (celular)
        justifyContent: 'space-between',
        gap: layout.espacamento.amigavel,
        zIndex: 10,
        position: 'relative',
    },
    inputMetade: { flexGrow: 1, flexBasis: 240 },
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