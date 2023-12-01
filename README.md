## Segundo desafio técnico para a vaga backend
### Descrição 
-	Desenvolver uma API RESTful para autenticação de usuários, que permita operações de cadastro (sign up), autenticação (sign in) e recuperação de informações do usuário.
### Especificações Técnicas:
1.	Formato de Comunicação:
   - Todos os endpoints devem aceitar e retornar apenas dados no formato JSON.
   - Retorno JSON para situações de endpoint não encontrado.
2.	Persistência de Dados:
 - Armazenamento persistente de dados do usuário.
3. Respostas de Erro:
 - Formato padrão:
```json
{"mensagem":"Mensagem de erro"}
```
### URL da API
```url
https://escribo-user-api.onrender.com
```
## Rotas
- ###  Sign Up
```HTTP
POST /signup
```
#### Formato do JSON
```json
{
	"nome":"string",
	"email":"string",
	"senha":"string",
	"telefones":[{"numero":"string(9)","ddd":"string(2)"}]
}
```
- ###  Sign In
```HTTP
POST /signin
```
#### Formato do JSON
```json
{
	"email":"string",
	"senha":"string",
}
```
- ###  Buscar Usuário
```HTTP
GET /user/[id]
```
### Scripts 
- Install: ```sh npm ci ```
- Build: ```sh npm run build ```
- Migrations: ```sh npx prisma migrate deploy ```
- Start: ```sh npm run start ```
- Start Dev: ```sh npm run start:dev ```
