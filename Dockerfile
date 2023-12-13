FROM node:20-alpine
WORKDIR /socketapp
COPY . .
EXPOSE 3050
RUN npm install
CMD ["npm", "start"]