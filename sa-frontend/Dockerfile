FROM node:alpine as builder
COPY package.json /sa-frontend/
WORKDIR /sa-frontend
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.15-alpine
COPY --from=builder /sa-frontend/build /usr/share/nginx/html
COPY --from=builder /sa-frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
