import { Stack } from 'expo-router';
import cores from '@/constants/cores';

/** Telas de acesso: cada uma usa a moldura TelaAuth (sem cartão externo que corte o conteúdo). */
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: cores.fundo } }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="redefinirSenha" />
    </Stack>
  );
}
