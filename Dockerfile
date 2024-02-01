###################
# PRODUCTION BUILD
###################

FROM node:18

WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .

EXPOSE 8000
# Start the server using the production build
CMD [ "node", "app.js" ]
