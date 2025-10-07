# Bem-vindo ao aplicativo Expo 👋

Este é um projeto [Expo](https://expo.dev) criado com o comando [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Primeiros Passos

Siga os passos abaixo para configurar e iniciar o aplicativo mobile em seu ambiente de desenvolvimento:

1. Acesse o projeto:

   ```bash
   cd mobile
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o aplicativo:

   ```bash
   npx expo start
   ```

Ao executar o comando, você verá um código QR e diversas opções para abrir o aplicativo:

- [Development build (Compilação de Desenvolvimento)](https://docs.expo.dev/develop/development-builds/introduction/): Uma versão pré-construída com todas as suas dependências nativas.
- [Android (Emulador Android)](https://docs.expo.dev/workflow/android-studio-emulator/): Abre o app em um emulador Android.
- [iOS simulator (Simulador iOS)](https://docs.expo.dev/workflow/ios-simulator/): Abre o app em um simulador iOS (requer macOS).
- [Expo Go](https://expo.dev/go): Uma "caixa de areia" (sandbox) limitada para desenvolvimento rápido com Expo.

Você pode começar a desenvolver editando os arquivos dentro do diretório **app**. Este projeto utiliza o [roteamento baseado em arquivo](https://docs.expo.dev/router/introduction) (File-based routing) do Expo Router.

## Reiniciando o Projeto do Zero

Quando estiver pronto para limpar o código inicial e começar um novo desenvolvimento:

```bash
npm run reset-project
```

Este comando moverá o código inicial (starter code) para um diretório chamado app-example e criará um diretório app vazio, onde você pode começar seu desenvolvimento limpo.

## Saiba Mais

Para aprender mais sobre como desenvolver seu projeto com o Expo, consulte os seguintes recursos:

- [Expo documentation](https://docs.expo.dev/): Aprenda os fundamentos ou explore tópicos avançados com nossos [guias](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Siga um tutorial passo a passo para criar um projeto que roda em Android, iOS e web.