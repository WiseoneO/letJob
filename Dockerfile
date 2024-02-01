###################
# PRODUCTION BUILD
###################

FROM node:18

WORKDIR /usr/app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
USER node
EXPOSE 8000
CMD [ "node", "app.js" ]
