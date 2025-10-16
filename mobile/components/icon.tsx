// src/components/AppIcon.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import { AppIcons, AppIconName } from '@/constants/icons'; // Importa a documentação
import { View} from 'react-native';

type AppIconProps = {  
  name: AppIconName; 
  size?: number;
  color?: string;
  alingn?: 'left' | 'right' | 'center';
};

export default function AppIcon({ name, size = 24, color = '#333' ,alingn = 'center'}: AppIconProps) {
  // Busca o nome real do ícone na sua documentação (AppIcons)
  const iconName = AppIcons[name]; 
  
  return (
    <View style={{
      flex: 1,
      alignSelf: alingn === 'left' ? 'flex-start' : alingn === 'right' ? 'flex-end' : 'center',
      justifyContent: 'center',
      alignItems: 'center',
      height: size,
      width: size,
    }}>
      <Ionicons 
        name={iconName} 
        size={size} 
        color={color} 
      />
    </View>
  );  
}