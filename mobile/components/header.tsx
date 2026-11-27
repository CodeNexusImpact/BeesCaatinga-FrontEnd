import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { temaCores } from '@/constants/cores';
import Icon from '@/components/icon';
import { voltar } from '@/utils/navegacao';

interface HeaderProps {
    title: string;
}
const Header: React.FC<HeaderProps> = ({ title }) => {
    const router = useRouter();

    return (
    <View style={styles.headerContainer}>
        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
            {title !== 'Home' ? (
                <TouchableOpacity onPress={() => voltar(router)} style={styles.botaoIcone} accessibilityRole="button" accessibilityLabel="Voltar">
                    <Icon name="back" size={28} color={temaCores.textoSobrePrimaria} />
                </TouchableOpacity>
            ) : (
                <View style={styles.botaoIcone} />
            )}
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', flexDirection: 'row', gap: 10 }}>
                <Image source={require('@/assets/images/abelha-bees-caatinga.png')} style={{ height: 40, width: 30 }} />
                <Text style={styles.headerTitle} numberOfLines={2} accessibilityRole="header">{title}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/notificacao')} style={styles.botaoIcone} accessibilityRole="button" accessibilityLabel="Avisos">
                <Icon name="sino" size={26} color={temaCores.textoSobrePrimaria} />
            </TouchableOpacity>
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: temaCores.primaria,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        flexDirection: 'row',
    },
    headerTitle: {
        color: temaCores.textoSobrePrimaria,
        fontSize: 20,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    botaoIcone: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Header;