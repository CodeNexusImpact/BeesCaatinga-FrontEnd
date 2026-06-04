import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { cores, temaCores } from '@/constants/cores';
import Icon from '@/components/icon';

interface HeaderProps {
    title: string;
}
const Header: React.FC<HeaderProps> = ({ title }) => {
    const router = useRouter();

    return (
    <View style={styles.headerContainer}>
        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
            <TouchableOpacity onPress={() => router.back()}>
                {title!= "Home" && <Icon name="back" size={30} color={cores.base[100]} />}
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', flexDirection: 'row', gap: 10 }}>
                <Image source={require('@/assets/images/abelha-bees-caatinga.png')} style={{ height: 40, width: 30 }} />
                <Text style={styles.headerTitle}>{title}</Text>
            </View>
                <TouchableOpacity onPress={() => router.push('/notificacao')}>
                <Icon name="sino" size={30} color={cores.base[100]} />
            </TouchableOpacity>
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: temaCores.primaria,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        flexDirection: 'row',
    },
    headerTitle: {
        color: temaCores.texto,
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Header;