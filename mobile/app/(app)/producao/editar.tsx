import Botao from '@/components/botao';
import Input from '@/components/input';
import Selector from '@/components/selector';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Alert } from 'react-native';
import Subtexto from '@/components/subTexto';


const mockProducoesDatabase = [
    {
        id: 26,
        tipoProduto: 'jandaira',
        quantidade: '2.0', 
        medida: 'kg',
        apiario: 'rosa',
        colmeia: '1',
        dataColeta: '18/09/2025',
    },
    {
        id: 27,
        tipoProduto: 'umbu',
        quantidade: '15',
        medida: 'kg',
        apiario: 'vale',
        colmeia: '3',
        dataColeta: '10/04/2025',
    },
];

// Define a "forma" de um objeto de opção
interface Option {
    label: string;
    value: string;
}

// NOVO: Constante para a densidade (ex: 1.4kg/L para mel)
const DENSIDADE_MEL_KG_L = 1.4;

export default function Editar() {
    const router = useRouter();

    const { id } = useLocalSearchParams();
    const [tipoProduto, setTipoProduto] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [medida, setMedida] = useState('');
    const [apiario, setApiario] = useState('');
    const [colmeia, setColmeia] = useState('');
    const [dataColeta, setDataColeta] = useState('');
    // NOVO: Estado para o campo de conversão
    const [conversao, setConversao] = useState('');

    // Efeito para carregar os dados
    useEffect(() => {
        if (id) {
            const itemParaEditar = mockProducoesDatabase.find(
                (p) => p.id.toString() === id
            );

            if (itemParaEditar) {
                setTipoProduto(itemParaEditar.tipoProduto);
                setQuantidade(itemParaEditar.quantidade);
                setMedida(itemParaEditar.medida);
                setApiario(itemParaEditar.apiario);
                setColmeia(itemParaEditar.colmeia);
                setDataColeta(itemParaEditar.dataColeta);
            }
        }
    }, [id]);

    // NOVO: Efeito para calcular a conversão
    useEffect(() => {
        // Converte a quantidade para número (aceitando vírgula ou ponto)
        const numQuantidade = parseFloat(quantidade.replace(',', '.'));

        if (isNaN(numQuantidade)) {
            setConversao('N/A');
            return;
        }

        let litros = 0;
        if (medida === 'kg') {
            litros = numQuantidade / DENSIDADE_MEL_KG_L;
        } else if (medida === 'g') {
            litros = (numQuantidade / 1000) / DENSIDADE_MEL_KG_L;
        } else if (medida === 'l') {
            litros = numQuantidade;
        } else if (medida === 'ml') {
            litros = numQuantidade / 1000;
        } else {
            setConversao('N/A');
            return;
        }

        // Formata para 1,43 L (como na imagem)
        setConversao(`${litros.toFixed(2).replace('.', ',')} L`);

    }, [quantidade, medida]); // Roda sempre que quantidade ou medida mudar

    // ADICIONE O TIPO 
    const tipoProdutoOptions: Option[] = [
        { label: 'Mel de Jandaíra', value: 'jandaira' },
        { label: 'Mel de Marmeleiro', value: 'marmeleiro' },
        { label: 'Mel de Pajeú', value: 'pajeu' },
        { label: 'Mel de Umbu', value: 'umbu' },
    ];

    const medidaOptions: Option[] = [
        { label: 'Kg', value: 'kg' },
        { label: 'g', value: 'g' },
        { label: 'L', value: 'l' },
        { label: 'mL', value: 'ml' },
    ];

    const apiarioOptions: Option[] = [
        { label: 'Rosa do Sertão', value: 'rosa' },
        { label: 'Vale das Abelhas', value: 'vale' },
        { label: 'Serra do Mel', value: 'serra' },
    ];

    const colmeiaOptions: Option[] = [
        { label: 'Colmeia 1', value: '1' },
        { label: 'Colmeia 2', value: '2' },
        { label: 'Colmeia 3', value: '3' },
    ];

    // NOVO: Função para o botão de apagar
    const handleApagar = () => {
        Alert.alert(
            "Apagar Registro",
            `Tem certeza que deseja apagar o registro ID: ${id}? Esta ação não pode ser desfeita.`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Apagar",
                    style: "destructive",
                    onPress: () => {
                        console.log('Apagando registro ID:', id);
                        // Lógica de apagar (simulada)
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.push('/producao/visualizar');
                        }
                    }
                }
            ]
        );
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <Subtexto style={styles.subtexto}>Edite os dados da produção.</Subtexto>

            {/* NOVO: Campo ID não editável */}
            <Input
                label="ID"
                value={id ? id.toString() : ''}
                editable={false}
                style={styles.idInput}
            />

            <Input
                label="Conversão para litro"
                value={conversao}
                editable={false}
                style={styles.conversaoInput}
            />
           

            {/* Quantidade + Medida */}
            <View style={styles.row}>
                <Input
                    label="Quantidade" 
                    value={quantidade}
                    onChangeText={setQuantidade}
                    keyboardType="decimal-pad"
                    style={styles.inputMetade}
                />
                <Selector
                    label="Medida"
                    options={medidaOptions}
                    onSelect={setMedida}
                    placeholder="Selecione a Medida" 
                    style={styles.inputMetade}
                    value={medida}
                />
            </View>
            
             {/* Tipo de Mel */}
            <Selector
                label="Tipo Produto"
                options={tipoProdutoOptions}
                onSelect={setTipoProduto}
                placeholder="Selecione o tipo de Mel"
                iconName="honeycomb"
                value={tipoProduto}
            />
            

            {/* Apiário */}
            <Selector
                label="Apiário"
                options={apiarioOptions}
                onSelect={setApiario}
                placeholder="Selecione o Apiário"
                iconName="home"
                value={apiario}
            />

            {/* Colmeia */}
            <Selector
                label="Colmeia"
                options={colmeiaOptions}
                onSelect={setColmeia}
                placeholder="Selecione a Colmeia"
                iconName="beehiveOutline"
                value={colmeia}
            />

            {/* Data Coleta */}
            <Input
                label="Data Coleta" 
                value={dataColeta}
                onChangeText={setDataColeta}
                placeholder="dd/mm/aaaa"
                iconName="calendar"
            />

            {/* Botão Salvar */}
            <Botao
                title="Salva edição" 
                onPress={() => {
                    console.log('Salvando alterações para ID:', id);
                    console.log({
                        tipoProduto,
                        quantidade,
                        medida,
                        apiario,
                        colmeia,
                        dataColeta,
                        conversao, 
                    });
                    if (router.canGoBack()) {
                        router.back();
                    } else {
                        router.push('/producao/visualizar');
                    }
                }}
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
        backgroundColor: '#FFF8E1', 
        borderColor: '#FFECB3',
    },
    buttonDelete: {
        marginTop: layout.espacamento.amigavel, 
   
    },
});