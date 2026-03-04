import layout from "@/constants/layout";
import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    formStyle: {
        flex: 1,
        display: "flex",
        padding: layout.espacamento.social,
        rowGap: layout.espacamento.amigavel,
        justifyContent: "flex-start",
        alignItems: "center",
    }

});