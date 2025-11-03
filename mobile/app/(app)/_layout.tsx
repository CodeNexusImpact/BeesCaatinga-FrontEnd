import { Stack } from 'expo-router';
import cores from '@/constants/cores';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: cores.primaria,
        },
        headerTintColor: cores.preto,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="home" options={{}} />
    </Stack>
  );
}
