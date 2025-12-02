import { Stack } from 'expo-router';
import cores from '@/constants/cores';
import Header from '@/components/header';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        header:({ options }) => <Header title={options.title || 'BeesCaatinga'} />, 
      }}>        
    </Stack>
  );
}
