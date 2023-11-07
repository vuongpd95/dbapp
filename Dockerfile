FROM node:20-alpine
ENV NODE_ENV production
USER node
WORKDIR /home/node

COPY package*.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npm prune --omit=dev

WORKDIR /home/node
EXPOSE 80
CMD ["node", "app.js"]