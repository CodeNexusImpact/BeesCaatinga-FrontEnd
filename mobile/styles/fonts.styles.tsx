import { StyleSheet } from "react-native";
import fonts from "@/constants/fonts";
import { temaCores } from "@/constants/cores";

export const Typography = StyleSheet.create({
    
    CabecalhoExtraGrande: {        
        fontFamily: fonts.family.display,
        fontSize: fonts.size.xg,
        color: temaCores.texto,
    }, 

    CabecalhoGrande: {        
        fontFamily: fonts.family.display,
        fontSize: fonts.size.gg,
        color: temaCores.texto,
    }, 
    CabecalhoMedio: {
        fontFamily: fonts.family.display,
        fontSize: fonts.size.g,
        color: temaCores.texto,
    },
    CabecalhoPequeno: {
        fontFamily: fonts.family.display,
        fontSize: fonts.size.m,
        color: temaCores.texto,
    },
    
    // ----------------------
    // 2. CORPO DE TEXTO (Body/Regular Text)
    // Usam fonts.secondary e cores.text
    // ----------------------
    Texto: {
        fontFamily: fonts.family.sans,
        fontSize: fonts.size.m,
        color: temaCores.texto,
    },
    
    Texto_Pequeno: {
        fontFamily: fonts.family.sans,
        fontSize: fonts.size.p,
        color: temaCores.texto,
    },

    Negrito: {
        fontFamily: fonts.family.bold,
        fontSize: fonts.size.m,
        color: temaCores.texto,
    },

    CaixaAlta: {
        fontFamily: fonts.family.sans,
        fontSize: fonts.size.m,
        color: temaCores.texto,
        textTransform: "uppercase",
    },
});

export default Typography;