// app/(auth)/index.tsx

import { Redirect } from 'expo-router';

// Este arquivo é a primeira coisa que o grupo (auth) tenta carregar.
// Ele imediatamente redireciona para a tela de login.
export default function AuthRoot() {
  return <Redirect href="/login" />;
}