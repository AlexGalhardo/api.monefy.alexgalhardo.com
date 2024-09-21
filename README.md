<div align="center">
  	<h1 align="center"><a href="https://api.monefy.alexgalhardo.com" target="_blank">api.monefy.alexgalhardo.com</a></h1>
</div>

## Introduction

- API source code using Bun and ElysiaJS
- Front End Source Code: <https://github.com/AlexGalhardo/monefy.alexgalhardo.com>
- Front End Live: <https://monefy.alexgalhardo.com>
- Swagger API Documentation live: <https://api.monefy.alexgalhardo.com/swagger>

## Development Setup Local

- Prerequisites:
   - Install Docker & docker-compose: <https://docs.docker.com/engine/install/>
   - Install Bun: <https://bun.sh/docs/installation>

- To see RabbitMQ Management UI, go to: http://localhost:15672
   - Username: guest
   - Password: guest

- To see Redis Commander UI, go to: http://localhost:8082

1. Clone repository
```bash
git clone git@github.com:AlexGalhardo/api-money-manager.alexgalhardo.com.git
```

2. Create `.env` file
```bash
cp .env.example .env
```
- Dont forget to setup your credentials in `.env` file

3. Install dependencies, create migrations & seeds, up docker containers and server
```bash
chmod +x setup.sh && ./setup.sh
```


## Build to single-file executable

- Reference: <https://bun.sh/docs/bundler/executables>

a. Building Server
```bash
bun build --compile --minify ./src/server.ts --outfile server
```

b. Building Client
```bash
bun build --compile --minify ./src/client.ts --outfile client
```

c. Building all
```bash
bun run build
```

Executing binaries
```bash
./server
```

```bash
./client
```

## Tests

a. Running integration tests
```bash
bun run test:integration
```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) April 2024-present, [Alex Galhardo](https://github.com/AlexGalhardo)
