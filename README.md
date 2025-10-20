# Wallet Property Fed - Carteira de Imóveis Web3

Sistema de gestão de imóveis integrado com blockchain, desenvolvido como Trabalho de Conclusão de Curso (TCC).

## Sobre o Projeto

Plataforma web descentralizada para gestão de propriedades imobiliárias utilizando tecnologia blockchain. O sistema permite registro, transferência e acompanhamento de imóveis de forma segura e transparente através da integração com MetaMask e contratos inteligentes.

## Tecnologias Utilizadas

- **Vite** - Build tool e dev server
- **TypeScript** - Linguagem de programação
- **React** - Framework frontend
- **shadcn-ui** - Biblioteca de componentes
- **Tailwind CSS** - Framework CSS
- **Ethers.js** - Integração com blockchain
- **React Router** - Roteamento
- **React Query** - Gerenciamento de estado
- **React Hook Form** - Formulários
- **Zod** - Validação de esquemas

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- MetaMask instalado no navegador
- Carteira Ethereum configurada

## Instalação e Execução

```sh
# Clone o repositório
git clone <URL_DO_REPOSITORIO>

# Navegue até o diretório do projeto
cd wallet-property-fed

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:8080`

## Scripts Disponíveis

```sh
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Build em modo desenvolvimento
npm run build:dev

# Executar linter
npm run lint

# Preview da build de produção
npm run preview
```

## Estrutura do Projeto

```
wallet-property-fed/
├── public/          # Arquivos estáticos
├── src/
│   ├── components/  # Componentes React
│   ├── pages/       # Páginas da aplicação
│   ├── hooks/       # Custom hooks
│   ├── lib/         # Utilitários e configurações
│   └── main.tsx     # Ponto de entrada
├── index.html
├── package.json
└── vite.config.ts
```

## Funcionalidades

- 🔐 Autenticação via MetaMask
- 🏠 Cadastro e gestão de propriedades
- 📝 Contratos inteligentes para transferência de propriedades
- 📊 Dashboard com métricas e estatísticas
- 💼 Gerenciamento de carteira de imóveis
- 🔍 Consulta de histórico de transações
- 📱 Interface responsiva

## Desenvolvimento

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## Licença

Este projeto foi desenvolvido para fins acadêmicos como Trabalho de Conclusão de Curso.

## Autor

Desenvolvido por Fabiano - TCC
