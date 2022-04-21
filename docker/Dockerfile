FROM node:16 AS builder

WORKDIR /fates_platform

# Public Path when building application
ARG PUBLIC_PATH=""
ENV PUBLIC_PATH=${PUBLIC_PATH}

ARG API_SERVER="http://localhost:8000"
ENV API_SERVER=${API_SERVER}

# Copy application and install dependencies
COPY . /fates_platform
RUN npm install

# build application
RUN npm run build

# ----------------------------------------------------------------------
# Second stage, final image
# ----------------------------------------------------------------------

FROM nginx:alpine

COPY --from=builder /fates_platform/build/ /usr/share/nginx/html/
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
