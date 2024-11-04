## Pre-requisitos

### Requisitos de Base de Datos
Este aplicativo requiere una base de datos MongoDB con la funcionalidad de replica set habilitada para soportar transacciones atómicas.

Para facilitar la configuración, se incluye un archivo docker-compose.yaml que permite levantar una instancia de MongoDB con replica set usando Docker. Simplemente ejecuta el siguiente comando en la raíz del proyecto:

```bash
docker-compose up -d
```

Este comando iniciará los contenedores necesarios en segundo plano (-d). Además, se creará un directorio .mongo en la raíz del proyecto, donde se almacenará la información de ejecución de la base de datos, incluyendo los logs y los datos de la base de datos.

Asegúrate de que Docker y Docker Compose estén instalados en tu entorno antes de ejecutar el comando.

Para gestionar la base de datos MongoDB, se recomienda utilizar **MongoDB Compass**. Puedes descargarlo desde el siguiente enlace:

- [Descargar MongoDB Compass](https://www.mongodb.com/try/download/compass)

## Creación de Usuario Administrador Predeterminado

En la primera ejecución de la aplicación, si no existen usuarios en la base de datos y la variable de entorno `CREATE_DEFAULT_ADMIN` está configurada en `true`, el sistema creará automáticamente un usuario administrador predeterminado. Esto permite iniciar la aplicación con un usuario inicial, facilitando el acceso y configuración (Ver variables de entorno `DEFAULT_ADMIN_`).

## Configuración de Variables de Entorno

En la raíz del proyecto se proporciona un archivo `.env-EXAMPLE` que contiene una configuración básica de las variables de entorno necesarias para ejecutar la aplicación.

Para utilizar este archivo como base de configuración:

1. Copia el archivo `.env-EXAMPLE` en un nuevo archivo llamado `.env`:
  ```bash
   cp .env-EXAMPLE .env
  ```

2. Abre el archivo .env y ajusta las variables de entorno según tus necesidades. Este archivo incluye configuraciones clave, como las credenciales de la base de datos, secretos para los tokens de acceso y los parámetros para la creación del usuario administrador predeterminado.

Una vez configuradas las variables en el archivo .env, puedes iniciar la aplicación con la configuración personalizada.

> **Importante::** No compartir el archivo .env directamente, ya que puede contener información sensible. Asegúrate de mantenerlo seguro y excluido del control de versiones.

### Variables de entorno disponibles:

| ENV                     | Descripción                                                                       | Tipo          | Valor por Defecto      |
|-------------------------|-----------------------------------------------------------------------------------|---------------|------------------------|
| PORT                    | El puerto que usará la aplicación para las solicitudes HTTP.                      | Número        | 3000                   |
| CORS_ENABLED_ORIGINS    | Orígenes habilitados para CORS separados por el carácter ';'.                     | String[]      |                        |
| ACCESS_TOKEN_SECRET     | Secreto para generar el token JWT de acceso.                                      | String        |                        |
| DB_HOST                 | Nombre del host de la base de datos.                                              | localhost     | localhost              |
| DB_PORT                 | Puerto de la base de datos.                                                       | Número        | 27017                  |
| DB_USERNAME             | Nombre de usuario de la base de datos.                                            | String        | root                   |
| DB_PASSWORD             | Contraseña de la base de datos.                                                   | String        | example                |
| DB_COLLECTION           | Colección de la base de datos usada por la aplicación.                            | String        | lab                    |
| DB_AUTH_SOURCE          | Colección de la base de datos usada para autenticación.                           | String        | admin                  |
| DB_REPLICA_SET          | Nombres de las instancias del replicaset de la base de datos.                     | String        | rs0                    |
| CREATE_DEFAULT_ADMIN    | Creación de cuenta de administrador predeterminada si no existe en la BD.         | Booleano      | false                  |
| DEFAULT_ADMIN_EMAIL     | Correo electrónico de la cuenta de administrador predeterminada.                  | String        | admin@example.com      |
| DEFAULT_ADMIN_PASSWORD  | Contraseña de la cuenta de administrador predeterminada.                          | String        | example                |
| DEFAULT_ADMIN_NAME      | Nombre de usuario de la cuenta de administrador predeterminada.                   | String        | Admin                  |
| DEFAULT_ADMIN_LASTNAME  | Apellido de usuario de la cuenta de administrador predeterminada.                 | String        | User                   |
| DEFAULT_ADMIN_DNI       | DNI de usuario de la cuenta de administrador predeterminada.                      | Número        | 12345678               |
| DEFAULT_ADMIN_ROLE      | Roles de la cuenta de administrador predeterminada separados por el carácter ';'. | String[]      | admin;lab              |


## Iniciando el Proyecto

### Configuración del Proyecto

Para instalar las dependencias necesarias, ejecuta el siguiente comando en la raíz del proyecto:

```bash
$ npm install
```
### Compilar y Ejecutar el Proyecto

Puedes compilar y ejecutar el proyecto de diferentes maneras:

- Para iniciar la aplicación en modo desarrollo, utiliza:
```bash
$ npm run start:dev
```

- Para iniciar la aplicación en modo producción, utiliza:
```bash
$ npm run start:prod
```

### Ejecutar Pruebas
Para asegurarte de que tu aplicación funcione correctamente, puedes ejecutar las pruebas con los siguientes comandos:

- Para ejecutar las pruebas unitarias, utiliza:
```bash
$ npm run test
```

- Si quieres verificar la cobertura de las pruebas, ejecuta:
```bash
$ npm run test:cov
```

## Licencias
Nest: [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
