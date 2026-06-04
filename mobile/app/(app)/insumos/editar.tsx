import Botao from '@/components/formulario/botao';
import Input from '@/components/formulario/input';
import Selector from '@/components/formulario/selector';
import ModalSucesso from '@/components/notificacao/modalSucesso';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, ActivityIndicator, Alert } from 'react-native';
import { buscarInsumoPorId, atualizarInsumo } from '@/services/insumoService';
import { maskDate } from '@/utils/masks';
import { useAuth } from '@/hooks/useAuth';
import Checkbox from 'expo-checkbox';

export default function EditarInsumo() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();

    // Estados de Controle
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [modalSucessoVisivel, setModalSucessoVisivel] = useState(false);

    // Estados do Formulário (Espelho do db.json)
    const [dataInsumo, setDataInsumo] = useState('');
    const [nome, setNome] = useState('');
    const [tipoInsumo, setTipoInsumo] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [unidadeMedida, setUnidadeMedida] = useState('');
    const [dataValidade, setDataValidade] = useState('');
    const [semValidade, setSemValidade] = useState(false);
    const [statusInsumo, setStatusInsumo] = useState('DISPONIVEL');
    const [observacoes, setObservacoes] = useState('');

    const tipoInsumoOptions = [
        { label: 'Alimentação', value: 'Alimentação' },
        { label: 'Medicamento', value: 'Medicamento' },
        { label: 'Equipamento', value: 'Equipamento' },
        { label: 'Outro', value: 'Outro' },
    ];

    const unidadeMedidaOptions = [
        { label: 'Kg', value: 'KG' },
        { label: 'g', value: 'G' },
        { label: 'L', value: 'L' },
        { label: 'mL', value: 'ML' },
        { label: 'Unidade(s)', value: 'UN' },
    ];

    const statusOptions = [
        { label: 'Disponível', value: 'DISPONIVEL' },
        { label: 'Em Uso', value: 'EM_USO' },
        { label: 'Estoque Baixo', value: 'ESTOQUE_BAIXO' },
    ];

    useEffect(() => {
        if (id) carregarDados();
    }, [id]);

    const carregarDados = async () => {
        if (!user?.id) return;
        try {
            setIsLoading(true);
            const data = await buscarInsumoPorId(id!, user.id);

            // MAPEMAENTO DE CHAVES REAIS (db.json)
            setDataInsumo(data.dataInsumo || '');
            setNome(data.nome || '');
            setTipoInsumo(data.tipoInsumo || '');
            setQuantidade(data.quantidade?.toString() || '');
            setUnidadeMedida(data.unidadeMedida || '');
            setDataValidade(data.dataValidade === 'N/A' ? '' : (data.dataValidade || ''));
            setSemValidade(data.dataValidade === 'N/A');
            setStatusInsumo(data.statusInsumo || 'DISPONIVEL');
            setObservacoes(data.observacoes || '');
        } catch (error) {
            console.error('❌ [EDITAR INSUMO] Erro:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados para edição.');
            router.back();
        } finally {
            setIsLoading(false);
        }
    };

    const handleSalvar = async () => {
        if (isSaving || !user?.id) return;

        if (!nome || !quantidade || !tipoInsumo) {
            Alert.alert('Erro', 'Preencha os campos obrigatórios (*)');
            return;
        }

        // Payload sem o campo ID (id vai apenas na URL do PUT)
        const payload = {
            dataInsumo,
            nome,
            tipoInsumo,
            quantidade: parseFloat(quantidade.replace(',', '.')),
            unidadeMedida,
            dataValidade: semValidade ? 'N/A' : dataValidade,
            statusInsumo,
            observacoes
        };

        try {
            setIsSaving(true);
            await atualizarInsumo(id!, user.id, payload);
            setModalSucessoVisivel(true);
        } catch (error) {
            console.error('❌ [EDITAR INSUMO] Erro ao salvar:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao salvar as alterações no servidor.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={cores.primaria[100]} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Stack.Screen options={{ title: 'Editar Insumo' }} />

            <Input
                label="Data de Entrada"
                value={dataInsumo}
                onChangeText={(t) => setDataInsumo(maskDate(t))}
                placeholder="dd/mm/aaaa"
                iconName="calendar"
                maxLength={10}
            />

            <Input
                label="Nome do Insumo*"
                value={nome}
                onChangeText={setNome}
                placeholder="Ex: Cera Alveolada"
            />

            <View style={[styles.row, { zIndex: 30 }]}>
                <Input
                    label="Quantidade*"
                    value={quantidade}
                    onChangeText={(t) => setQuantidade(t.replace(/[^0-9.,]/g, ''))}
                    keyboardType="decimal-pad"
                    style={styles.inputMetade}
                    placeholder="0.00"
                />
                <View style={styles.inputMetade}>
                    <Selector
                        label="Unidade"
                        options={unidadeMedidaOptions}
                        value={unidadeMedida}
                        onSelect={setUnidadeMedida}
                    />
                </View>
            </View>

            <View style={[styles.row, { zIndex: 20 }]}>
                <View style={styles.inputMetade}>
                    <Selector
                        label="Tipo de Insumo*"
                        options={tipoInsumoOptions}
                        value={tipoInsumo}
                        onSelect={setTipoInsumo}
                    />
                </View>
                <View style={styles.inputMetade}>
                    <Selector
                        label="Status*"
                        options={statusOptions}
                        value={statusInsumo}
                        onSelect={setStatusInsumo}
                    />
                </View>
            </View>

            <Input
                label="Data de Validade"
                value={semValidade ? 'Não se aplica' : dataValidade}
                onChangeText={(t) => setDataValidade(maskDate(t))}
                placeholder="dd/mm/aaaa"
                iconName="calendar"
                editable={!semValidade}
                style={semValidade ? styles.inputDisabled : {}}
                maxLength={10}
            />

            <View style={styles.checkboxContainer}>
                <Checkbox
                    value={semValidade}
                    onValueChange={setSemValidade}
                    color={semValidade ? cores.primaria : undefined}
                />
                <Text style={styles.checkboxLabel}>Não se aplica / Sem validade</Text>
            </View>

            <Input
                label="Observações (opcional)"
                value={observacoes}
                onChangeText={setObservacoes}
                placeholder="Detalhes adicionais..."
                multiline={true}
                numberOfLines={4}
                style={styles.textArea}
            />

            <Botao
                title={isSaving ? "Salvando..." : "Salvar Alterações"}
                onPress={handleSalvar}
                cor="primaria"
                style={styles.button}
            />

            <Botao
                title="Cancelar"
                onPress={() => router.back()}
                cor="secundaria"
                style={styles.buttonCancel}
            />

            <ModalSucesso
                visivel={modalSucessoVisivel}
                mensagem="Insumo atualizado com sucesso!"
                aoFechar={() => {
                    setModalSucessoVisivel(false);
                    router.back();
                }}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    contentContainer: { padding: layout.espacamento.amigavel, gap: layout.espacamento.colega, paddingBottom: 50 },
    row: { flexDirection: 'row', justifyContent: 'space-between', gap: layout.espacamento.amigavel },
    inputMetade: { flex: 1 },
    textArea: { minHeight: 100, textAlignVertical: 'top' },
    inputDisabled: { backgroundColor: '#f0f0f0' },
    checkboxContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: -8 },
    checkboxLabel: { fontSize: 14, color: cores.texto },
    button: { marginTop: layout.espacamento.social },
    buttonCancel: { marginTop: layout.espacamento.amigavel }
});
