// src/constants/Icons.ts
//fonte dos icons: https://icons.expo.fyi/Index

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ComponentProps } from 'react';

type MaterialCommunityIconsName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export const AppIcons: Record<string, MaterialCommunityIconsName> = {
  // --- Navegação Principal (TabBar/Drawer) ---
  home: 'home-outline', // Ícone principal da tela inicial
  profile: 'account-circle', // Ícone da tela de perfil
  settings: 'cog', // Ícone da tela de configurações

  // --- Ações Comuns ---
  add: 'plus-circle', // Ícone para adicionar novos itens
  edit: 'pencil', // Ícone para editar itens existentes
  delete: 'trash-can-outline', // Ícone para deletar itens
  lupa: 'magnify', // Ícone para busca
  lupaMais: 'magnify-plus', // Ícone para busca com zoom
  lupaMenos: 'magnify-minus', // Ícone para busca sem zoom
  lupaFechar: 'magnify-close', // Ícone para fechar busca

  // --- Autenticação e Feedback ---
  // Geralmente usados no processo de login/cadastro ou alertas
  user: "account", // Ícone de usuário
  lock: 'lock', // Ícone de cadeado fechado
  open: 'lock-open', // Ícone de cadeado aberto
  emailFilled: 'email', // Ícone preenchido para campos de email
  email: 'email-outline', // Ícone de email padrão
  success: 'check-circle-outline', // Ícone preenchido para feedback forte
  warning: 'alert-circle', // Ícone de aviso
  error: 'close-circle', // Ícone de erro
  olho: 'eye', // Ícone de olho aberto
  olhoFechado: 'eye-off', // Ícone de olho fechado
  phone: 'phone', // Ícone de telefone 
  human: 'human-male-female', // Ícone de humano
  
  // --- Outros ---
  back: 'arrow-left-bottom', // Ícone de voltar
  forward: 'arrow-top-right-thick', // Ícone de avançar
  share: 'share', // Ícone de compartilhar
  info: 'information', // Ícone de informação
  calendar: 'calendar-outline', // Ícone de calendário
  chevronDown: 'chevron-down', // Ícone de seta para baixo
  chevronUp: 'chevron-up', // Ícone de seta para cima
  bell: 'bell-outline', // Ícone de notificação
  video: 'video', // Ícone de vídeo
  bee: 'bee', // Ícone de abelha
  beehiveOutline: 'beehive-outline', // Ícone de colmeia
  sprayBottle: 'spray-bottle',         // Insumos
  clipboardCheck: 'clipboard-check-outline', // Vistorias
  qrcodeScan: 'qrcode-scan',           // Rastreabilidade
  eyeCheck: 'eye-check-outline',       // Monitoramento
  fileDocument: 'file-document-outline', // Relatórios
  helpCircle: 'help-circle-outline',   // Tutorial
  package: 'package-variant',       // Pacote
  box: 'box',                       // Caixa
  map: 'map-outline',               // Mapa
  inspection: 'clipboard-check-outline', // Vistorias
  honeycomb: 'hexagon-outline', // Produção de mel
  bottleTonic: 'bottle-tonic', // Garrafa de tônico
} as const;

/**
 * Exporta a lista de nomes dos ícones.
 * Para usar, importe este objeto e utilize a chave (ex: Icons.home).
 */
export type AppIconName = keyof typeof AppIcons;