import Botao from '@/components/botao';
import Input from '@/components/input';
import Selector from '@/components/selector';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import Checkbox from 'expo-checkbox';

export default function EditarInsumo() {
    const router = useRouter();

    // Estados
    const [dataEntrada, setDataEntrada] = useState('18/09/2025');
    const [nomeInsumo, setNomeInsumo] = useState('');
    const [tipoInsumo, setTipoInsumo] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [unidadeMedida, setUnidadeMedida] = useState('');
    const [isAtivo, setIsAtivo] = useState(true);
    const [dataValidade, setDataValidade] = useState('18/09/2025');
    const [semValidade, setSemValidade] = useState(false);
    const [observacoes, setObservacoes] = useState('');

    // Opções
    const nomeInsumoOptions = [
        { label: 'Cera de Abelha', value: 'cera' },
        { label: 'Açúcar (Xarope)', value: 'acucar' },
    ];
    const tipoInsumoOptions = [
        { label: 'Alimentação', value: 'alimentacao' },
        { label: 'Material', value: 'material' },
    ];
    const unidadeMedidaOptions = [
        { label: 'Kg', value: 'kg' },
        { label: 'L', value: 'l' },
        { label: 'Unidade(s)', value: 'un' },
    ];

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            {/* Data de Entrada */}
            <Input
                label="Data de Entrada"
                value={dataEntrada}
                onChangeText={setDataEntrada}
                placeholder="dd/mm/aaaa"
                iconName="calendar"
            />

            {/* Quantidade + Unidade Medida */}
            <View style={styles.row}>
                <Input
                    label="Quantidade*"
                    value={quantidade}
                    onChangeText={(text) => {
                        const cleaned = text.replace(/[^0-9.,]/g, '');
                        setQuantidade(cleaned);
                    }}
                    keyboardType="decimal-pad"
                    style={styles.inputMetade}
                    placeholder="0,0"
                />
                <Selector
                    label="Unidade medida"
                    options={unidadeMedidaOptions}
                    onSelect={setUnidadeMedida}
                    placeholder="Selecione o tipo de medida"
                    style={styles.inputMetade}
                />
            </View>

            {/* Nome do insumo */}
            <Selector
                label="Nome do insumo*"
                options={nomeInsumoOptions}
                onSelect={setNomeInsumo}
                placeholder="Selecione o nome do insumo"
            />

            {/* Tipo de insumo */}
            <Selector
                label="Tipo de insumo*"
                options={tipoInsumoOptions}
                onSelect={setTipoInsumo}
                placeholder="Selecione o tipo de insumo"
            />



            {/* CAMPO: Status */}
            <View style={styles.validadeContainer}>
                <Input
                    label="Status:"
                    value={isAtivo ? 'ativo no estoque' : 'inativo'}
                    editable={false}
                    style={styles.inputValidade}
                    placeholder=""
                    onChangeText={() => { }}
                />
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        value={isAtivo}
                        onValueChange={setIsAtivo}
                        color={isAtivo ? cores.cores.primaria[60] : undefined}
                    />
                </View>
            </View>

            {/* Data de Validade + Checkbox */}
            <View style={styles.validadeContainer}>
                <Input
                    label="Data de validade"
                    value={dataValidade}
                    onChangeText={setDataValidade}
                    placeholder="dd/mm/aaaa"
                    iconName="calendar"
                    style={styles.inputValidade}
                    editable={!semValidade}
                />
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        value={semValidade}
                        onValueChange={setSemValidade}
                        color={semValidade ? cores.cores.primaria[60] : undefined}
                    />
                    <Text style={styles.checkboxLabel}>Sem validade</Text>
                </View>
            </View>

            {/* Observações */}
            <Input
                label="Observações (opcional)"
                value={observacoes}
                onChangeText={setObservacoes}
                placeholder="Digite aqui..."
                iconName="pencil"
                multiline={true}
                numberOfLines={4}
                style={styles.observacoesInput}
            />

            {/* Botão Salvar */}
            <Botao
                title="Salvar"
                onPress={() => {
                    console.log({
                        dataEntrada,
                        nomeInsumo,
                        tipoInsumo,
                        quantidade,
                        unidadeMedida,
                        isAtivo,
                        dataValidade: semValidade ? 'N/A' : dataValidade,
                        observacoes,
                    });
                    router.push('/insumos/listar');
                }}
                cor="primaria"
                style={styles.button}
            />

            {/*BOTÃO: Apagar */}
            <Botao
                title="Apagar"
                onPress={() => {
                    console.log('APAGAR INSUMO');
                    router.back();
                }}
                cor="secundaria"
                style={styles.buttonDelete}
            />

        </ScrollView>
    );
}

// Estilos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.fundo,
    },
    contentContainer: {
        padding: layout.espacamento.amigavel,
        gap: layout.espacamento.colega,
        paddingBottom: 50,
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
    validadeContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: layout.espacamento.amigavel,
    },
    inputValidade: {
        flex: 1,
    },
    checkboxContainer: {
        paddingBottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkboxLabel: {
        fontSize: 14,
        color: cores.primaria,
    },
    observacoesInput: {
        height: 120,
        textAlignVertical: 'top',
    },
    button: {
        marginTop: layout.espacamento.social,
    },
    buttonDelete: {
        marginTop: layout.espacamento.amigavel,
    }
});