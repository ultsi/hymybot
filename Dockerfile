FROM node:8.7.0

WORKDIR /install
COPY package.json /install
RUN npm install
ENV NODE_PATH=/install/node_modules
WORKDIR /app/hymybot
RUN echo "Europe/Helsinki" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

COPY . .

CMD ["node", "index.js"]
