# Munch Backend Interview Point of Sale

This is my submission to the Munch Backend Exercise. 

## Tech Stack

- Fastify with Typescript
- Sequelize ORM
- MySQL in Docker
- Linting with TS-Standard
- PNPM

## Setup

To setup the poject, there are a few scripts that will need to be run. I have
included them as package scripts.

- `pnpm docker:start` -> Will start the docker MySQL container with a root user.
- `pnpm docker:stop`  -> Will stop the docker container and delete EVERYTHING in it.
- `pnpm setup:db` -> Will create the database with a RW user so we're not using root for everything.

> Please wait 20 seconds for the docker container to be created, and MySQL to initialize before
> running the database setup script.

As part of the setup process, you will need to add a `.env` file with the following details:

```bash
MUNCH_DB_NAME=<your_db_name>
MUNCH_ROOT_USER=root
MUNCH_ROOT_PASSWORD=<your_root_password>
MUNCH_RW_USER=<your_user_name>
MUNCH_RW_PASSWORD=<your_user_password>
```

## Running the project

The following pnpm commands are available for linting, building and running the project.

> Nodemon can also be replaced by PM2 if you'd like to be able to run multiple project processes
> behind a load balancer.

```bash
"lint": "ts-standard",
"build": "tsc -p tsconfig.json",
"dev": "ts-node src/server.ts",
"prod": "nodemon dist/index.js",
"test": "jest"
```

## Endpoints

### User Management
| Endpoints             | Methods | Path |
| --------------------- | ------- | ---- |
| [Register](#register) | `POST`  | `/users/register` |
| [Login](#login)       | `POST`  | `/users/login`|
| [Logout](#logout)     | `POST`  | `/users/logout`|

#### Register

Request:
```json
{
  "username": "my-username",
  "password": "plaintext-password"
}
```

Response:
```json
{
  "userId": 1,
  "username": "my-username"
}
```

Response Codes:
- `201` -> Success
- `400` -> Bad Request
- `409` -> Conflict with Existing Record
- `500` -> Internal Server Error

#### Login

Request:
```json
{
  "username": "my-username",
  "password": "plaintext-password"
}
```

Response:
```json
{
  "accessToken": "your-access-token"
}
```

Response Codes:
- `200` -> Success
- `400` -> Bad Request
- `401` -> Unauthorized
- `500` -> Internal Server Error

#### Logout

Cookie:
A valid JWT token is required

Response Code:
- `200` -> Success

### Product Management
| Endpoints                         | Methods  | Path |
| --------------------------------- | -------- | ---- |
| [Create Product](#create-product) | `POST`   | `/products` |
| [Update Product](#update-product) | `PUT`    | `/products` |
| [List Products](#list-product)    | `GET`    | `/products/:productId` |
| [Delete Product](#delete-product) | `DELETE` | `/products/:productId` |

#### Create Product

Request:
```json
{
    "name": "my-product",
    "price": 50.10,
    "quantity": 44
}
```

Response:
```json
{
    "productId": 1,
    "name": "my-product"
}
```

Response Codes:
- `200` -> Success
- `401` -> Unauthorized
- `400` -> Bad Request
- `409` -> Conflict with Existing Record
- `500` -> Internal Server Error

#### Update Product

Request:
```json
{
    "productId": 1,
    "name": "my-product",
    "description": "Is an optional parameter",
    "price": 50.10,
    "quantity": 54
}
```

Response:
```json
{
    "productId": 1,
    "name": "my-product"
}
```

Response Codes:
- `201` -> Success
- `401` -> Unauthorized
- `400` -> Bad Request
- `404` -> Record Not Found
- `500` -> Internal Server Error

#### List Product

Request:
No body to be passed to this endpoint

Response:
```json
[
  {
    "productId": 1,
    "name": "my-product",
    "price": 12.45,
    "quantity": 3,
    "createdAt": "2024-05-20T12:00:00.000Z",
    "updatedAt": "2024-05-20T12:00:00.000Z",
    "description": "This is an optional text field"
  },
  {
    "productId": 2,
    "name": "my-product-2",
    "price": 15.1,
    "quantity": 8,
    "createdAt": "2024-05-20T12:00:00.000Z",
    "updatedAt": "2024-05-20T12:00:00.000Z",
    "description": "This is an optional text field"
  }
]
```

Response Codes:
- `200` -> Success
- `401` -> Unauthorized
- `500` -> Internal Server Error

#### Delete Product

Request:
No body to be passed to this endpoint

Params:
The product ID

Response:
There is no response from this endpoint

Response Codes:
- `204` -> Success
- `401` -> Unauthorized
- `404` -> Record Not Found
- `500` -> Internal Server Error

### Upsell Management
| Endpoints                         | Methods  | Path |
| --------------------------------- | -------- | ---- |
| [Create Upsell](#create-upsell)   | `POST`   | `/upsell-products` |
| [Get Upsell](#get-upsell)         | `GET`    | `/upsell-products/:productId` |
| [Remove Upsell](#remove-upsell)   | `DELETE` | `/upsell-products/:productId/:upsellId` |

#### Create Upsell

Request:
```json
{
  "productId": 2,
  "upsellIds": [3, 4]
}
```

Response:
There is no response from this endpoint

Response Codes:
- `201` -> Success
- `400` -> Bad Request
- `401` -> Unauthorized
- `404` -> Record Not Found
- `500` -> Internal Server Error

#### Get Upsell

Request:
No body to be passed to this endpoint

Params:
The product ID

Response:
```json
[
  {
    "productId": 1,
    "name": "my-product",
    "price": 12.45,
    "quantity": 3,
    "createdAt": "2024-05-20T12:00:00.000Z",
    "updatedAt": "2024-05-20T12:00:00.000Z",
    "description": "This is an optional text field"
  }
]
```

Response Codes:
- `200` -> Success
- `401` -> Unauthorized
- `404` -> Record Not Found
- `500` -> Internal Server Error

#### Remove Upsell

Request:
No body to be passed to this endpoint

Params:
The product ID
The upsell Product ID

Response:
There is no response from this endpoint

Response Codes:
- `204` -> Success
- `401` -> Unauthorized
- `404` -> Record Not Found
- `500` -> Internal Server Error

### Sales / Transactions
| Endpoints                                 | Methods | Path |
| ----------------------------------------- | ------- | ---- |
| [Create Transaction](#create-transaction) | `POST` | `/transactions` |
| [Get Transaction](#get-transaction)       | `GET` | `/transactions/:transactionId` |

#### Create Transaction

Request:
```json
{
  "totalPrice": 27.55,
  "totalQuantity": 2,
  "products": [
    {
      "productId": 2,
      "quantity": 1
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ]
}
```

OR with upsell products

```json
{
  "totalPrice": 57.55,
  "totalQuantity": 4,
  "products": [
    {
      "productId": 2,
      "quantity": 1,
      "upsell": [4, 5]
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ]
}
```

Response:
```json
{
  "transactionId": 1,
  "totalPrice": 27.55,
  "totalQuantity": 2
}
```

Response Codes:
- `201` -> Success
- `400` -> Bad Request
- `401` -> Unauthorized
- `500` -> Internal Server Error

#### Get Transaction

Request:
No body to be passed to this endpoint

Params:
The Transaction ID

Response:
```json
{
  "transactionId": 2,
  "totalPrice": 27.55,
  "totalQuantity": 2,
  "createdAt": "2024-05-28T17:39:24.000Z",
  "updatedAt": "2024-05-28T17:39:24.000Z",
  "products": [
    {
      "transactionProductId": 3,
      "transactionId": 2,
      "productId": 2,
      "price": 12.45,
      "quantity": 1,
      "createdAt": "2024-05-28T17:39:24.000Z",
      "updatedAt": "2024-05-28T17:39:24.000Z"
    },
    {
      "transactionProductId": 4,
      "transactionId": 2,
      "productId": 3,
      "price": 15.1,
      "quantity": 1,
      "createdAt": "2024-05-28T17:39:24.000Z",
      "updatedAt": "2024-05-28T17:39:24.000Z"
    },
  ]
}
```

Response Codes:
- `200` -> Success
- `401` -> Unauthorized
- `404` -> Record Not Found
- `500` -> Internal Server Error
