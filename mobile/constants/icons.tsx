// src/constants/Icons.ts
//fonte dos icons: https://icons.expo.fyi/Index

import { ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type MaterialCommunityIconsName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export const AppIcons: Record<string, MaterialCommunityIconsName> = {
  // --- Navegação Principal (TabBar/Drawer) ---
  home: 'home-outline',
  profile: 'account-circle',
  settings: 'cog',
  
  // --- Ações Comuns ---
  add: 'plus-circle',
  edit: 'pencil',
  delete: 'trash-can-outline',
  lupa: 'magnify',
  lupaMais: 'magnify-plus',
  lupaMenos: 'magnify-minus',
  lupaFechar: 'magnify-close',
  
  // --- Autenticação e Feedback ---
  // Geralmente usados no processo de login/cadastro ou alertas
  user: "account",
  lock: 'lock',
  open: 'lock-open',
  email: 'email-outline',
  success: 'check-circle-outline', // Ícone preenchido para feedback forte
  warning: 'alert-circle',
  error: 'close-circle',
  olho: 'eye',
  olhoFechado: 'eye-off',
  phone: 'phone',
  human: 'human-male-female',
  
  // --- Outros ---
  back: 'arrow-left-bottom',
  forward: 'arrow-top-right-thick',
  share: 'share',
  info: 'information',
  calendar: 'calendar-outline',
  chevronDown: 'chevron-down',
  chevronUp: 'chevron-up',

} as const;

/**
 * Exporta a lista de nomes dos ícones.
 * Para usar, importe este objeto e utilize a chave (ex: Icons.home).
 */
export type AppIconName = keyof typeof AppIcons;