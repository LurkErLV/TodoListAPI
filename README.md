<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<h1 align="center">API Documentation</h1>
<br/>
<h3>- Swagger</h3>

#### API Description
```http 
GET http://localhost:3000/api
```
<br/>
<h3>- Authentication</h3>

### Register
```http 
POST http://localhost:3000/api/auth/register
```
#### Required parameters in body:
##### 1. "email";
##### 2. "login";
##### 3. "password" (must be 5 to 20 chars long);

#### Returns JSON with "access_token" and "refresh_token".

### Login
```http 
GET http://localhost:3000/api/auth/login
```
#### Required parameters in body:
##### 1. "email";
##### 2. "password";

#### Returns JSON with "access_token" and "refresh_token".


### Refresh tokens
```http 
POST http://localhost:3000/api/auth/refresh
```
#### Required parameters in body:
##### 1. "token" (refresh token);

#### Required "access_token" in Bearer.

#### Returns JSON with "access_token" and "refresh_token".

<br/>
<h3>- Task managment</h3>

### Create task
```http
POST http://localhost:3000/api/tasks/create
```
#### Required parameters in body:
##### 1. "task" (task description);

#### Required "access_token" in Bearer.

#### Returns 201 status code.

### Delete task
```http
DELETE http://localhost:3000/api/tasks/delete/:id
```

#### Required "access_token" in Bearer.

#### Required "id" in route.

#### Returns 200 status code.

### Get all user tasks
```http
GET http://localhost:3000/api/tasks
```

#### Required "access_token" in Bearer.

#### Returns JSON with array "tasks".

### Toggle task done status
```http
PATCH http://localhost:3000/api/tasks/done/:id
```

#### Required "access_token" in Bearer.

#### Required "id" in route.

#### Returns JSON with task.


## DOTENV
```ts
DATABASE_URL="MySQL connect url"
JWT_SECRET="Secret one"
JWT_REFRESH_SECRET="Secret two"
```