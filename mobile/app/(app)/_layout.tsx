import { Stack} from 'expo-router';
import cores from '@/constants/cores';
import Header from '@/components/header';
import BottomMenu from '@/components/bottomMenu';
import { View } from 'react-native';

export default function Layout() {
  return (
    <View style={{ flex: 1, alignContent: 'flex-end' }}>
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            header: ({ options }) => <Header title={options.title || 'BeesCaatinga'} />,
          }} />
      </View>
      <View style={{ height: 60 }}>
        <BottomMenu />
      </View>
    </View>
  );
}
