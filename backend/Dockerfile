# Use Python 3.10 slim image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy project files to the container
COPY . .

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install torch==2.1.2+cpu torchvision==0.16.2+cpu torchaudio==2.1.2+cpu -f https://download.pytorch.org/whl/cpu/torch_stable.html
RUN pip install -r requirements.txt

# Expose the port
EXPOSE 8000

# Start the FastAPI app
CMD ["uvicorn", "mlModel.testing:app", "--host", "0.0.0.0", "--port", "8000"]
