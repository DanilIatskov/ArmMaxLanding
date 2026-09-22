# Сайт АРММАКС-СТРОЙ.
#
# Две стадии: в первой собираем, во вторую кладём только результат. Так в
# рантайме нет ни исходников, ни npm, ни кеша сборки — меньше образ и меньше
# того, что может пригодиться тому, кто в контейнер попал.
#
# Переменные NEXT_PUBLIC_* вшиваются в бандл на сборке, серверные (токен бота,
# список получателей) читаются в рантайме из окружения и в образ не попадают.
FROM node:22-slim AS build
WORKDIR /app

# Зависимости ставятся отдельным слоем: правка кода не тянет за собой npm ci,
# и пересборка после обычного коммита занимает секунды вместо минут.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-slim
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# standalone — это server.js и минимальный набор модулей; статику и public
# Next в него не кладёт, их копируем рядом сами.
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Под своим пользователем: процесс в контейнере не должен быть root даже
# внутри него — это бесплатный слой защиты, если в зависимости найдут дыру.
USER node

EXPOSE 3000
CMD ["node", "server.js"]
