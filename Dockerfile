# Use Python 3.12.1 as the base image
FROM python:3.12.1-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project into the container
COPY . .

# Expose the port Uvicorn will run on
EXPOSE 8000

# Command to run the app with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]


# # Stage 1: Build the React frontend
# FROM node:18-alpine AS frontend-builder
# WORKDIR /frontend
# COPY frontend/package*.json ./
# RUN npm ci
# COPY frontend/ .
# RUN npm run build

# # Stage 2: Build and run the Python backend
# FROM python:3.12.1-slim

# # Set working directory for the backend
# WORKDIR /app

# # Copy Python requirements
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# # Copy the entire repository (includes backend code)
# COPY . .

# # Copy the built frontend into a directory served by the backend
# # Adjust the path depending on how your backend serves static files
# # e.g., if your backend serves static files from "/app/frontend/build"
# COPY --from=frontend-builder /frontend/build ./frontend/build

# # Expose the port your backend uses
# EXPOSE 8000

# # Command to run the Python backend
# # This assumes your backend entrypoint is "main:app"
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]



