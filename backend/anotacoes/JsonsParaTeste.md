# Produtor
## 1. Caso Válido (Completo)
````json
{
  "email": "joao.apicultor@email.com",
  "senha": "senha123",
  "nomeCompleto": "João Silva Santos",
  "nomeDoApiario": "Apiário Florada Nordestina",
  "nomeDaEmpresa": "Mel da Caatinga LTDA",
  "telefone": "(11) 99999-9999",
  "genero": "MASCULINO",
  "dataDeNascimento": "15/05/1985",
  "endereco": "Rua Exemplo, nº 215"
}
````

## 2. Caso Válido (Sem empresa)
````json
{
  "email": "maria.apiaria@email.com",
  "senha": "maria123456",
  "nomeCompleto": "Maria Oliveira Costa",
  "nomeDoApiario": "Abelhas do Sertão",
  "telefone": "(85) 98888-7777",
  "genero": "FEMININO",
  "dataDeNascimento": "20/10/1990"
}
````

## 3. Email Inválido
````json
{
  "email": "email-invalido",
  "senha": "senha123",
  "nomeCompleto": "Carlos Souza",
  "nomeDoApiario": "Apiário Central",
  "telefone": "(21) 97777-6666",
  "genero": "MASCULINO",
  "dataDeNascimento": "10/08/1978"
}
````

## 4. Campo Obrigatório Faltante (Sem senha)
````json
{
  "email": "teste@email.com",
  "nomeCompleto": "Ana Paula Lima",
  "nomeDoApiario": "Mel Puro",
  "telefone": "(31) 95555-4444",
  "genero": "FEMININO",
  "dataDeNascimento": "05/12/1988"
}
````

## 5. Telefone Muito Curto
````json
{
  "email": "pedro@email.com",
  "senha": "pedro123",
  "nomeCompleto": "Pedro Alves",
  "nomeDoApiario": "Apiário Verde",
  "telefone": "123",
  "genero": "MASCULINO",
  "dataDeNascimento": "25/03/1995"
}
````

## 6. Data Futura (Inválida)
````json
{
  "email": "futuro@email.com",
  "senha": "senhafutura",
  "nomeCompleto": "Lucas Mendes",
  "nomeDoApiario": "Apiário do Futuro",
  "telefone": "(47) 94444-3333",
  "genero": "MASCULINO",
  "dataDeNascimento": "15/12/2030"
}
````

## 7. Gênero Nulo
````json
{
  "email": "teste.genero@email.com",
  "senha": "teste123",
  "nomeCompleto": "Fernanda Rocha",
  "nomeDoApiario": "Apiário das Flores",
  "telefone": "(19) 93333-2222",
  "dataDeNascimento": "30/07/1982"
}
````

## 8. Caso Válido (Gênero OUTRO)
````json
{
  "email": "outro.genero@email.com",
  "senha": "senha456",
  "nomeCompleto": "Alex Santos",
  "nomeDoApiario": "Apiário Diversidade",
  "nomeDaEmpresa": "Abelhas & Cia",
  "telefone": "(81) 92222-1111",
  "genero": "OUTRO",
  "dataDeNascimento": "12/09/1993"
}
````

## 9. Múltiplos Erros
````json
{
  "email": "email-mal-formatado",
  "senha": "",
  "nomeCompleto": "",
  "nomeDoApiario": "",
  "telefone": "123",
  "genero": null,
  "dataDeNascimento": "15/12/2030"
}
````

## 10. Caso Válido (Telefone com DDD sem parênteses)
````json
{
  "email": "rafael.apiario@email.com",
  "senha": "rafael789",
  "nomeCompleto": "Rafael Costa Pereira",
  "nomeDoApiario": "Apiário Serra Verde",
  "nomeDaEmpresa": "Produtos Apícolas Serra",
  "telefone": "11 97777-8888",
  "genero": "MASCULINO",
  "dataDeNascimento": "08/04/1975"
}
````