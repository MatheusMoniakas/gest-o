# Trello Clone

Um clone do Trello construído com React, TypeScript e Vite, oferecendo funcionalidades completas de gerenciamento de tarefas com drag and drop.

## 🚀 Funcionalidades

### ✨ Funcionalidades Principais
- **Boards**: Crie e gerencie múltiplos boards
- **Listas**: Organize tarefas em listas personalizáveis
- **Cards**: Crie, edite e organize cards com títulos e descrições
- **Drag & Drop**: Arraste cards entre listas e reordene listas
- **Interface Responsiva**: Funciona perfeitamente em desktop e mobile

### 🎯 Funcionalidades Avançadas
- **Etiquetas Coloridas**: Adicione etiquetas coloridas aos cards para organização
- **Membros**: Atribua membros aos cards com avatares personalizados
- **Datas de Vencimento**: Defina e gerencie prazos com alertas visuais
- **Comentários**: Adicione comentários aos cards para colaboração
- **Status de Conclusão**: Marque cards como concluídos
- **Busca e Filtros**: Encontre cards rapidamente com busca avançada
- **Cores de Cobertura**: Personalize cards com cores de fundo
- **Modal de Detalhes**: Visualização completa dos cards com todas as funcionalidades

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca para interface de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool e servidor de desenvolvimento
- **React Beautiful DnD** - Biblioteca para drag and drop
- **Lucide React** - Ícones modernos
- **CSS3** - Estilização com variáveis CSS e design responsivo

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Board.tsx       # Componente principal do board
│   ├── List.tsx        # Componente de lista
│   ├── Card.tsx        # Componente de card
│   └── BoardSelector.tsx # Seletor de boards
├── context/            # Context API para gerenciamento de estado
│   └── BoardContext.tsx
├── types/              # Definições TypeScript
│   └── index.ts
├── App.tsx             # Componente principal
├── App.css             # Estilos globais
└── main.tsx            # Ponto de entrada
```

## 🚀 Como Executar

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Abra o navegador em:**
   ```
   http://localhost:3000
   ```

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 🎨 Características do Design

- **Design Moderno**: Interface limpa inspirada no Trello
- **Cores Consistentes**: Paleta de cores profissional
- **Animações Suaves**: Transições e hover effects
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Acessibilidade**: Contraste adequado e navegação por teclado

## 🔧 Funcionalidades Implementadas

### Gerenciamento de Boards
- ✅ Criar novos boards
- ✅ Editar título e descrição
- ✅ Excluir boards
- ✅ Selecionar board ativo

### Gerenciamento de Listas
- ✅ Criar novas listas
- ✅ Editar título da lista
- ✅ Excluir listas
- ✅ Reordenar listas (drag & drop)

### Gerenciamento de Cards
- ✅ Criar novos cards
- ✅ Editar título e descrição
- ✅ Excluir cards
- ✅ Mover cards entre listas (drag & drop)
- ✅ Reordenar cards dentro da lista
- ✅ **Etiquetas coloridas** com 10 cores predefinidas
- ✅ **Membros** com avatares e iniciais
- ✅ **Datas de vencimento** com alertas visuais
- ✅ **Comentários** com sistema completo
- ✅ **Status de conclusão** com toggle
- ✅ **Cores de cobertura** para personalização
- ✅ **Modal de detalhes** com todas as funcionalidades

### Busca e Filtros
- ✅ **Busca por texto** em títulos e descrições
- ✅ **Filtro por etiquetas** com seleção múltipla
- ✅ **Filtro por membros** com seleção múltipla
- ✅ **Filtro por data** (vencidas, hoje, esta semana, concluídas)
- ✅ **Contador de resultados** em tempo real

### Interface
- ✅ Sidebar com seleção de boards
- ✅ Layout responsivo e moderno
- ✅ Modo mobile otimizado
- ✅ Feedback visual para ações
- ✅ Animações suaves e transições
- ✅ Design inspirado no Trello original

## 🚀 Próximas Funcionalidades

- [ ] Persistência com backend
- [ ] Autenticação de usuários
- [ ] Colaboração em tempo real
- [ ] Etiquetas e cores para cards
- [ ] Datas de vencimento
- [ ] Comentários em cards
- [ ] Anexos de arquivos
- [ ] Filtros e busca
- [ ] Temas claro/escuro

## 📝 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abrir um Pull Request

## 📞 Contato

Se você tiver alguma dúvida ou sugestão, sinta-se à vontade para entrar em contato!
