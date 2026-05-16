# Use official Python Lambda base image
FROM public.ecr.aws/lambda/python:3.14

# Install uv - ultra-fast Python package installer (Rust-based, 10-100x faster than pip)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Set working directory
WORKDIR /asset

# Copy requirements first for better layer caching
COPY requirements.txt .

# Install dependencies using uv (much faster than pip)
RUN uv pip install --system -r requirements.txt

# Copy application code
COPY . .
