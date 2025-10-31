# Use nginx to serve static content
FROM nginx:alpine

# Copy the static website files to nginx html directory
COPY public/ /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
