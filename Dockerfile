FROM nginx:alpine

# Copier les fichiers HTML, CSS et JS pour le frontend
COPY ./ /usr/share/nginx/html

# Production inclut aussi le backend
RUN if [ "$ENV" = "production" ]; then \
        mkdir -p /usr/src/app && \
        apk add --no-cache python3 py3-pip && \
        pip3 install -r /usr/src/app/requirements.txt; \
    fi

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
