# API de Times de Pokémon

Este repositório contém uma API REST desenvolvida como parte de um desafio técnico. A API permite a criação e consulta de times de Pokémon, utilizando a [PokeAPI](https://pokeapi.co/) para buscar informações sobre os Pokémon incluídos nos times.

## Tecnologias Utilizadas

- **NestJS**: Framework back-end TypeScript eficiente e escalável baseado em Node.js.
- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional.
- **Prisma ORM**: Interface para facilitar o acesso e a manipulação do banco de dados.
- **Docker**: Usado para containerizar a aplicação e o banco de dados, garantindo facilidade de implantação e consistência entre ambientes de desenvolvimento.

## Construção/Inicialização e Execução do projeto

### Pré-Requisitos

- Docker
- Docker Compose

Siga os guias de instalação oficiais para Docker e Docker Compose caso ainda não os tiver instalado.

### Inicialização

1. Clone este repositório.
2. Entre no diretório do repositório clonado.
3. Inicie os serviços utilizando o Docker Compose. Para construir e executar a aplicação pela primeira vez, use:

    ```bash
    docker-compose up --build
    ```

    Após a construção inicial, você pode iniciar a aplicação utilizando somente o:

    ```bash
    docker-compose up
    ```
- Lembre-se que dependendo das suas configurações, é necessário executar o comando via cmd, com privilégios de administrador.

A API estará disponível em `http://localhost:3000`.

## Facilidades na Execução

Com o intuito de simplificar os testes da aplicação, nesse caso em específico, este projeto foi configurado para que ao utilizar o `docker-compose up`, o Prisma automaticamente verifique e aplique quaisquer migrações pendentes no banco de dados, garantindo que a estrutura do banco esteja sempre atualizada com o modelo de dados da aplicação. Além disso, o comando também inicia a aplicação automaticamente, eliminando a necessidade de executar comandos adicionais para colocar a API em funcionamento.

## Rotas da API

### Criação de Times

- **POST /api/teams/**

 Cria um novo time de Pokémon.

  **Input**:
  ```json
  {
    "user": "nome_do_usuario",
    "team": ["blastoise", "pikachu", "charizard", "venusaur", "lapras", "dragonite"]
  }
  ```

  **Output**:
  ```json
  {
    "message": "Team created successfully",
	  "teamId": 1
  }
  ```
  

- **GET /api/teams/**

Retorna todos os times registrados.

  **Output**:
  ```json
  {
    "1": {
      "owner": "vitor",
      "pokemons": [
        {
          "id": 149,
          "name": "dragonite",
          "weight": 2100,
          "height": 22
        },
        {
          "id": 9,
          "name": "blastoise",
          "weight": 855,
          "height": 16
        }
      ]
    },
    "2": {
      "owner": "andré",
      "pokemons": [
        {
          "id": 131,
          "name": "lapras",
          "weight": 2200,
          "height": 25
        },
        {
          "id": 3,
          "name": "venusaur",
          "weight": 1000,
          "height": 20
        }
      ]
    }
  }
  ```
    
- **GET /api/teams/{user}**

Busca os times registrados por determinado nome de usuário.

  **Output**:
  ```json
  [
    {
      "teamId": 1,
      "owner": "vitor",
      "pokemons": [
        {
          "id": 149,
          "name": "dragonite",
          "weight": 2100,
          "height": 22
        },
        {
          "id": 131,
          "name": "lapras",
          "weight": 2200,
          "height": 25
        },
        {
          "id": 3,
          "name": "venusaur",
          "weight": 1000,
          "height": 20
        },
        {
          "id": 6,
          "name": "charizard",
          "weight": 905,
          "height": 17
        },
        {
          "id": 25,
          "name": "pikachu",
          "weight": 60,
          "height": 4
        },
        {
          "id": 9,
          "name": "blastoise",
          "weight": 855,
          "height": 16
        }
      ]
    }
  ]
  ```
    
- **GET /api/teams/id/{id}**

Busca um time por sua ID única.

  **Output**:
  ```json
  {
    "teamId": 1,
    "owner": "vitor",
    "pokemons": [
      {
        "id": 149,
        "name": "dragonite",
        "weight": 2100,
        "height": 22
      },
      {
        "id": 9,
        "name": "blastoise",
        "weight": 855,
        "height": 16
      }
    ]
  }
  ```