// src/components/AppIcon.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import { AppIcons, AppIconName } from '@/components/constants/icons'; // Importa a documentação

type AppIconProps = {
  // A propriedade 'name' agora só aceita as chaves definidas em AppIconName
  name: AppIconName; 
  size?: number;
  color?: string;
};

export default function AppIcon({ name, size = 24, color = '#333' }: AppIconProps) {
  // Busca o nome real do ícone na sua documentação (AppIcons)
  const iconName = AppIcons[name]; 
  
  return (
    <Ionicons 
      name={iconName} 
      size={size} 
      color={color} 
    />
  );
}