# Serverless - AWS Node.js Typescript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

# Table of contents
- [Serverless - AWS Node.js Typescript](#serverless---aws-nodejs-typescript)
- [Table of contents](#table-of-contents)
  - [Installation/deployment instructions](#installationdeployment-instructions)
    - [Using NPM](#using-npm)
  - [Test your service](#test-your-service)
    - [Locally](#locally)
    - [Remotely via curl](#remotely-via-curl)
      - [Request](#request)
      - [Response](#response)
  - [Template features](#template-features)
    - [Project structure](#project-structure)
    - [3rd party libraries](#3rd-party-libraries)
    - [Advanced usage](#advanced-usage)

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

## Test your service

This service contains a single lambda function triggered by an HTTP request made on the provisioned API Gateway REST API `/calculate` or `/calculate/{merchantType}` route with `POST` method. The request body must be provided as application/json. The body structure is tested by API Gateway against `src/functions/calculate/schema.ts`

Payload format
|Name|Type|Description|
| ------------- | ------ | ------------- |
|transactions|array|Array with Transaction object|


Transaction Object
|Name|Type|Description|
| ------------- | ------ | ------------- |
|transactionId|string| Transaction ID|
|orderId|string| Order ID|
|merchantId|string| Merchant ID|
|merchantType|string| Merchant Type|
|value|number| Transaction Cost|

### Locally

In order to test the calculate function locally, run the following command:

- `npx sls invoke local -f calculate --path src/functions/calculate/mock.json`

Check the [sls invoke local command documentation](https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/) for more information.

### Remotely via curl
#### Request
```
curl --location --request POST 'https://xxxxxx/calculate/type1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "transactions": [
        {
            "transactionId": "tx1",
            "orderId": "order4",
            "merchantId": "merchant1",
            "merchantType": "type1",
            "value": 999.70
        },
        {
            "transactionId": "tx2",
            "orderId": "order3",
            "merchantId": "merchant1",
            "merchantType": "type1",
            "value": 999.60
        },
        {
            "transactionId": "tx4",
            "orderId": "order1",
            "merchantId": "merchant1",
            "merchantType": "type3",
            "value": 999.40
        },
        {
            "transactionId": "tx8",
            "orderId": "order1",
            "merchantId": "merchant2",
            "merchantType": "type1",
            "value": 123
        },
        {
            "transactionId": "tx9",
            "orderId": "order1",
            "merchantId": "merchant2",
            "merchantType": "type3",
            "value": -123.30
        },
        {
            "transactionId": "tx11",
            "orderId": "order3",
            "merchantId": "merchant2",
            "merchantType": "type1",
            "value": 123.101
        },
        {
            "transactionId": "tx12",
            "orderId": "order1",
            "merchantId": "merchant3",
            "merchantType": "type1",
            "value": -123.50
        },
        {
            "transactionId": "tx13",
            "orderId": "order1",
            "merchantId": "merchant3",
            "merchantType": "type1",
            "value": 123.00
        }
    ]
}'
```

#### Response
```
{
    "gross_sales": {
        "merchant1": "1999.30",
        "merchant2": "246.10",
        "merchant3": "123.00"
    },
    "net_sales": {
        "merchant1": "1999.30",
        "merchant2": "246.10",
        "merchant3": "-0.50"
    },
    "average_order_value": {
        "merchant1": "999.65",
        "merchant2": "123.05",
        "merchant3": "123.00"
    }
}
```

## Template features

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas

```
.
├── src
│   ├── functions               # Lambda configuration and source code folder
│   │   ├── calculate
│   │   │   ├── handler.ts      # `Hello` lambda source code
│   │   │   ├── index.ts        # `Hello` lambda Serverless configuration
│   │   │   ├── mock.json       # `Hello` lambda input parameter, if any, for local invocation
│   │   │   └── schema.ts       # `Hello` lambda input event JSON-Schema
│   │   │
│   │   └── index.ts            # Import/export of all lambda configurations
│   │
│   └── libs                    # Lambda shared code
│       └── apiGateway.ts       # API Gateway specific helpers
│       └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│       └── lambda.ts           # Lambda middleware
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```

### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file

### Advanced usage

Any tsconfig.json can be used, but if you do, set the environment variable `TS_NODE_CONFIG` for building the application, eg `TS_NODE_CONFIG=./tsconfig.app.json npx serverless webpack`