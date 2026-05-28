# Guia de Git para a Equipe

Este documento contém as convenções e comandos essenciais de Git para garantir um fluxo de trabalho consistente e colaborativo.

---

## 1. Convenção de Commits e Branches

Adotamos o padrão [**Conventional Commits**](https://www.conventionalcommits.org/en/v1.0.0/) e [**Conventional Branch**](https://conventional-branch.github.io/) para padronizar as mensagens. Isso facilita a leitura do histórico do projeto e permite o versionamento semântico de forma automática.
Como utilizar:
### 1.1. Branches

`<tipo>/<descrição>`

#### Tipos de Branches

* `main`: O branch de desenvolvimento principal.

* `backend/feat/`: Para novas funcionalidades do backend (por exemplo, *backend/feat/adicionar-autenticacao*).

* `frontend/feat/`: Para novas funcionalidades do frontend (por exemplo, *frontend/feat/criar-pagina-login*).

* `backend/fix/`: Para correções de bugs no backend (por exemplo, *backend/fix/corrigir-bug-api*).

* `frontend/fix/`: Para correções de bugs no frontend (por exemplo, *frontend/fix/corrigir-layout-header*).

* `hotfix/`: Para correções urgentes, que podem ser tanto para backend quanto para frontend (por exemplo, *hotfix/seguranca-backend*).

* `release/`: Para branches que preparam um lançamento. Pode ser específico (*release/backend/v1.2.0*) ou geral (*release/v1.2.0*).

* `chore/`: Para tarefas que não alteram o código, como atualizações de dependências (por exemplo, *chore/atualizar-dependencias-backend*).

--- 
### 1.2. Commits:

`:emoji: <tipo>(escopo): <descrição>`
*O escopo é opcional*

#### Tipos de Commits

A mensagem do seu commit deve começar com um dos tipos abaixo, seguido de uma descrição concisa.

* `feat`: Indica que seu código adiciona um **novo recurso**.
* `fix`: Indica que seu código está solucionando um **bug**.
* `docs`: Mudanças na **documentação** (ex: README). Não inclui alterações em código.
* `style`: Alterações de **formatação** de código (ex: semicolons, lint). Não inclui alterações em código.
* `refactor`: Mudanças de **refatoração** que não alteram a funcionalidade. Ex: melhorias de performance.
* `build`: Mudanças em arquivos de **build e dependências**.
* `test`: Alterações em **testes** (ex: criação ou exclusão de testes unitários). Não inclui alterações em código.
* `chore`: Atualizações de **tarefas de manutenção** (ex: adicionar um arquivo ao `.gitignore`).

#### Emojis para Mensagens de Commit

Para deixar o histórico mais visual, encorajamos o uso de emojis no início da mensagem do commit, seguindo o padrão.

* `🎉` `:tada:` - **Commit inicial**
* `✨` `:sparkles:` - **Novo recurso** (`feat`)
* `🐛` `:bug:` - **Bugfix** (`fix`)
* `🎨` `:art:`  - **Mudanças na estrutura de estilo, design ou CSS** (`style`)
* `📚` `:books:` - **Documentação** (`docs`)
* `🧪` `:test_tube:` - **Testes** (`test`)
* `♻️` `:recycle:` - **Refatoração** (`refactor`)
* `🔧` `:wrench:` - **Arquivos de configuração** (`chore`)
* `➖` `:heavy_minus_sign:` - **Removendo uma dependência** (`build`)
* `➕` `:heavy_plus_sign:` - **Adicionando uma dependência** (`build`)
* `🚧` `:construction:` - **Em progresso**
* `🔖` `:bookmark:` - **Tag de versão**
* `📝` `:pencil:` - **Texto**

#### Exemplos
* `:sparkles: feat(login): adiciona validação de formulário de login`
* `:bug: fix(apiario): corrige cálculo do total de colmeias ativas`
* `:wrench: chore(dependencias): atualiza a versão da biblioteca de mapas`

---

## 2. Comandos Git Essenciais

#### Comandos de Branch:

* `git branch <nome-do-branch>`: Cria um novo branch.

* `git switch <nome-do-branch>`: Muda para um branch existente.

* `git switch -c <nome-do-branch>`: Cria um novo branch e muda para ele imediatamente.

* `git merge <nome-do-branch>`: Mescla as mudanças de um branch para o branch atual, criando um commit de merge.

#### Comandos de Sincronização e Histórico:

* `git pull origin <nome-do-branch>`: Puxa as últimas mudanças do repositório remoto.

* `git fetch`: Baixa as informações mais recentes do repositório remoto sem mesclá-las automaticamente.

* `git rebase <nome-do-branch>`: Rebaseia seus commits locais em cima dos commits de outro branch. Use com cautela, pois reescreve o histórico.

* `git log --oneline`: Mostra o histórico de commits de forma resumida e mais fácil de ler.

#### Comandos de Commit e Preparação:

* `git add .`: Adiciona todos os arquivos modificados e novos para a área de preparação (staging area).

* `git commit -m "Sua mensagem"`: Faz um commit com a mensagem especificada.

* `git push origin <nome-do-branch>`: Envia os commits locais para o repositório remoto.

#### Outras Operações Importantes:

* `git status`: Mostra o status dos arquivos no seu repositório local (modificados, preparados, etc.).

* `git restore <nome-do-arquivo>`: Restaura um arquivo para a versão do último commit.

* `git stash`: Salva temporariamente as alterações que você não quer comitar.

* `git stash pop`: Restaura as alterações salvas por git stash.
