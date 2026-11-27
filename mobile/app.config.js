// Configuração única do Expo. Variáveis sensíveis vêm do ambiente (ver .env.example).
module.exports = {
  expo: {
    name: 'BeesCaatinga',
    slug: 'beescaatinga',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'beescaatinga',
    userInterfaceStyle: 'automatic',
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'br.com.codenexusimpact.beescaatinga',
      infoPlist: {
        NSLocationWhenInUseUsageDescription: 'Permitir acesso à sua localização para funcionalidades de mapa',
      },
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    android: {
      package: 'br.com.codenexusimpact.beescaatinga',
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
      permissions: [
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
      ],
      blockedPermissions: ['android.permission.RECORD_AUDIO'],
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-sharing',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: { backgroundColor: '#000000' },
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission:
            'O aplicativo acessa suas fotos para permitir que você as defina como imagem de perfil ou anexe em relatórios.',
          cameraPermission:
            'O aplicativo acessa sua câmera para permitir que você tire fotos para seu perfil ou para anexar em relatórios.',
          microphonePermission: false,
        },
      ],
      [
        'expo-location',
        {
          locationWhenInUsePermission: 'Permitir acesso à sua localização para funcionalidades de mapa',
        },
      ],
      'expo-secure-store',
      'expo-asset',
      'expo-web-browser',
      'expo-font',
      'expo-image',
      'expo-status-bar',
    ],
    // Vínculo com o projeto EAS (rode `eas init` uma vez e defina EAS_PROJECT_ID no CI).
    extra: {
      eas: {
        projectId: process.env.EAS_PROJECT_ID || 'a51fb642-07f6-415b-845e-ba78fc2bcf2d',
      },
    },
    owner: process.env.EXPO_OWNER || 'codenexusimpact',
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};
