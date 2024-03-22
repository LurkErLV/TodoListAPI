<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<h1 align="center">API Documentation</h1>
<h3>- Swagger</h3>

#### API Description
```http 
GET http://localhost:3000/api
```

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

## DOTENV
```ts
DATABASE_URL="MySQL connect url"
JWT_SECRET="Secret one"
JWT_REFRESH_SECRET="Secret two"
```