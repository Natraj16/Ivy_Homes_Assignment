#!/bin/bash
# Setup script for Ivy Homes assignment

echo "Setting up Ivy Homes Assignment Project..."

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r backend/requirements.txt

# Download data
echo "Downloading data from API..."
python backend/api_client.py

# Run analysis
echo "Running analysis..."
python backend/analyzer.py

echo "Setup complete! Check data/ and analysis/ directories for results."
