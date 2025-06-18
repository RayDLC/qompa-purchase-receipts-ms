# Qompa Purchase Receipts Microservice

Este proyecto utiliza PostgreSQL 15 y Prisma como ORM.  
Sigue estos pasos para levantar la base de datos y aplicar el esquema de Prisma.

---

## Requisitos

- [Docker](https://www.docker.com/get-started) instalado
- Node.js y npm instalados

---

## 1. Levantar PostgreSQL 15 con Docker

Ejecuta el siguiente comando en tu terminal:

```sh
docker run --name qompa-postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_DB=qompa `
  -v $(pwd)/prisma/seed-purchase-receipts.sql:/docker-entrypoint-initdb.d/seed.sql `
  -p 5432:5432 `
  -d postgres:15-alpine
```

Esto creará y levantará una base de datos llamada `qompa` en el puerto `5432`.

---

## 2. Configurar la conexión en `.env`

Asegúrate de tener un archivo `.env` en la raíz del proyecto con la siguiente variable:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/qompa"
```

---

## 3. Aplicar el esquema de Prisma

Ejecuta en la terminal:

```sh
npx prisma migrate dev --name init
```

Esto aplicará las migraciones y creará las tablas según tu archivo `prisma/schema.prisma`.

---

## 4. (Opcional) Visualizar la base de datos

Puedes abrir Prisma Studio para ver y editar los datos de forma visual:

```sh
npx prisma studio
```

---

## 5. Levantar la aplicación

Instala las dependencias y ejecuta tu microservicio normalmente:

```sh
encore run
```

---

## Notas

- Si necesitas reiniciar la base de datos, puedes detener y eliminar el contenedor con:
  ```sh
  docker stop qompa-postgres
  docker rm qompa-postgres
  ```
- Asegúrate de que el puerto 5432 esté libre en tu máquina.

---