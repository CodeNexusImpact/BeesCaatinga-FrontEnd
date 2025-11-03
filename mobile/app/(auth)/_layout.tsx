import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function AuthLayout() {
  return (
    <View style={{ flex: 1 }} id='authView'>
      <Stack initialRouteName='login'>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="cadastro" options={{ headerShown: false }} />
        <Stack.Screen name="redefinirSenha" options={{ headerShown: false }} />
      </Stack> 
    </View>
  );
}
  