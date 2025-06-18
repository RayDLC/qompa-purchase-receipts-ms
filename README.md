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
docker run --name qompa-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=qompa -p 5432:5432 -d postgres:15-alpine

```

Esto creará y levantará una base de datos llamada `qompa` en el puerto `5432`.

---

## 2. Configurar la conexión en `.env`

Asegúrate de tener un archivo `.env` en la raíz del proyecto con la siguiente variable, debes de guiarte del `.env.template`:

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

# Sistema de Filtrado Dinámico

## Endpoints con Filtrado Disponible

Los endpoints que soportan filtrado incluyen los siguientes parámetros opcionales en la query string:

```
GET /endpoint?page=1&limit=10&key=campo1,campo2&operator=eq,contains&value=["valor1","valor2"]
```

## Parámetros de Filtrado

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `page` | Int | No | Número de página (por defecto: 1) |
| `limit` | Int | No | Elementos por página (por defecto: 10) |
| `key` | string | No | Campos a filtrar separados por comas |
| `operator` | string | No | Operadores de filtro separados por comas |
| `value` | string | No | Valores de filtro en formato JSON array |

## Operadores Disponibles

Esta funcionalidad usa los operadores de prisma mas importantes.

## Ejemplos de Uso

### Filtro Simple
Buscar registros donde el status sea "PENDING":
```
GET /users?key=status&operator=eq&value=["PENDING"]
```

### Filtro Múltiple
Buscar registros por ID y status:
```
GET /users?key=id,status&operator=eq,eq&value=["uuid-123","PENDING"]
```

### Filtro con Texto
Buscar usuarios cuyo nombre contenga "Juan":
```
GET /users?key=name&operator=contains&value=["Juan"]
```

### Filtro con Rangos
Buscar usuarios con edad mayor a 18:
```
GET /users?key=age&operator=gt&value=[18]
```

### Filtro Combinado con Paginación
```
GET /users?page=2&limit=5&key=status,createdAt&operator=eq,between&value=["ACTIVE",["2024-01-01","2024-01-01"]]
```

## Notas Importantes

1. **Campos Dinámicos**: Puedes filtrar por cualquier campo que retorne el endpoint
2. **Correspondencia**: El número de `key`, `operator` y `value` debe coincidir
3. **Formato de Valores**: Los valores deben enviarse como array JSON válido
4. **Case Sensitivity**: Por defecto los filtros de texto son case-sensitive, usa el modo `insensitive` cuando esté disponible
5. **Tipos de Datos**: Asegúrate de que los valores coincidan con el tipo de dato del campo (string, number, boolean, date)

## Ejemplo Completo

Para filtrar productos activos con precio mayor a $100 y nombre que contenga "Pro":

```
GET /products?key=status,name&operator=eq,contains&value=["ACTIVE","Pro"]
```

Este sistema permite crear consultas complejas y flexibles manteniendo una sintaxis simple en la URL.