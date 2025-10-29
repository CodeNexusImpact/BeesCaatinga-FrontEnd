// styles/input.styles.ts
import layout from "@/constants/layout";
import fonts from "@/constants/fonts";
import { StyleSheet } from "react-native";
import cores from "@/constants/cores";

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: layout.espacamento.amigavel,
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: layout.borderRadius.r25,
        paddingVertical: layout.espacamento.texto,
        backgroundColor: cores.branco, 
        borderColor: cores.borda,
    },
    label: {
        fontSize: 14,
        fontFamily: fonts.family.sans,
        color: '#333',
    },
    input: {
        height: 40,
        flexShrink: 1,
        flexGrow: 1,
        paddingHorizontal: 10,
        fontSize: 16,
        alignSelf: 'center',
    },
    icon: {
        marginRight: layout.espacamento.texto,
    },
});

export default styles;