FROM oven/bun

WORKDIR /

COPY . .
RUN cp .env.example .env
RUN bun install

EXPOSE 3000

CMD [ "bun", "server" ]
