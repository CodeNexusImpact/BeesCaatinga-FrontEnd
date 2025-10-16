// src/constants/Icons.ts
//fonte dos icons: https://icons.expo.fyi/Index

import { ComponentProps } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

export const AppIcons: Record<string, IoniconsName> = {
  // --- Navegação Principal (TabBar/Drawer) ---
  home: 'home-outline',
  profile: 'person-circle-outline',
  settings: 'settings-outline',
  
  // --- Ações Comuns ---
  add: 'add-circle-outline',
  edit: 'create-outline',
  delete: 'trash-outline',
  search: 'search-outline',
  
  // --- Autenticação e Feedback ---
  // Geralmente usados no processo de login/cadastro ou alertas
  lock: 'lock-closed-outline',
  email: 'mail-outline',
  success: 'checkmark-circle', // Ícone preenchido para feedback forte
  warning: 'alert-circle',
  error: 'close-circle',
  
  // --- Outros ---
  back: 'chevron-back',
  forward: 'chevron-forward',
  share: 'share-social-outline',
  info: 'information-circle-outline',
  calendar: 'calendar-outline',
} as const;

/**
 * Exporta a lista de nomes dos ícones.
 * Para usar, importe este objeto e utilize a chave (ex: Icons.home).
 */
export type AppIconName = keyof typeof AppIcons;