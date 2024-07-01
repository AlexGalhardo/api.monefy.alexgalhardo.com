<div align="center">
  	<h1 align="center"><a href="https://api-money-manager.alexgalhardo.com" target="_blank">api-money-manager.alexgalhardo.com v2</a></h1>
</div>

## Introduction

- API source code for money manager application.
- Front End Source Code: <https://github.com/AlexGalhardo/money-manager.alexgalhardo.com>
- Front End Live: <https://money-manager.alexgalhardo.com>
- Swagger API Documentation live: <https://api-money-manager.alexgalhardo.com/swagger>

## Development Setup Local

- Prerequisites:
   - Install Docker & docker-compose: <https://docs.docker.com/engine/install/>
   - Install Bun: <https://bun.sh/docs/installation>

1. Clone repository
```bash
git clone git@github.com:AlexGalhardo/api-money-manager.alexgalhardo.com.git
```

2. Install dependencies
```bash
bun install
```

3. Create `.env` file
```bash
cp .env.example .env
```
- Dont forget to setup your credentials in `.env` file

4. Create migrations, seeds and up server
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

a. Running tests
```bash
bun test
```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) April 2024-present, [Alex Galhardo](https://github.com/AlexGalhardo)
