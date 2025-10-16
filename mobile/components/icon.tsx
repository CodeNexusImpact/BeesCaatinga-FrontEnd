// src/components/AppIcon.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppIcons, AppIconName } from '@/constants/icons'; // Importa a documentação
import { View} from 'react-native';

type AppIconProps = {  
  name: AppIconName; 
  size?: number;
  color?: string;
  align?: 'left' | 'right' | 'center';
};

export default function Icon({ name, size = 24, color = '#333' ,align = 'center'}: AppIconProps) {
  // Busca o nome real do ícone na sua documentação (AppIcons)
  const iconName = AppIcons[name]; 
  
  return (
    <View style={{      
      alignSelf: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
      justifyContent: 'center',
      alignItems: 'center',
      height: size,
      width: size,
    }}>
      <MaterialCommunityIcons 
        name={iconName} 
        size={size} 
        color={color} 
      />
    </View>
  );  
}