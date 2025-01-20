#!/bin/bash

# EXTRASTAFF360 API Key Generator
# Version: 2.0.0
# Environment: Production

# Directory Setup
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
OUTPUT_DIR="${SCRIPT_DIR}/keys"
mkdir -p "${OUTPUT_DIR}"

# Configuration
PREFIX="es360"
VERSION="v2"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_FILE="${OUTPUT_DIR}/api_keys_${TIMESTAMP}.log"
METADATA_FILE="${OUTPUT_DIR}/api_key_metadata_${TIMESTAMP}.json"

# Generate unique components
generate_key_components() {
    local timestamp=$(date +%s%N)
    local random=$(openssl rand -hex 16)
    local uuid=$(uuidgen | tr -d '-' | cut -c1-8)
    echo "${timestamp}_${uuid}_${random}"
}

# Generate API key
generate_api_key() {
    local components=$(generate_key_components)
    local checksum=$(echo "${PREFIX}_${VERSION}_${components}" | shasum -a 256 | cut -c1-8)
    echo "${PREFIX}_${VERSION}_${components}_${checksum}"
}

# Create metadata
generate_metadata() {
    local api_key=$1
    cat > "${METADATA_FILE}" << EOL
{
    "api_key": "${api_key}",
    "created_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "expires_at": "$(date -u -v+90d +"%Y-%m-%dT%H:%M:%SZ")",
    "platform": "EXTRASTAFF360",
    "environment": "production",
    "permissions": [
        "async_workload:execute",
        "async_workload:status",
        "async_workload:cancel"
    ],
    "rate_limit": {
        "requests_per_minute": 1000,
        "burst": 1500
    }
}
EOL
}

# Main execution
echo "Generating EXTRASTAFF360 API Key..."
API_KEY=$(generate_api_key)
generate_metadata "${API_KEY}"

# Save key to log file
echo "[${TIMESTAMP}] Generated API Key: ${API_KEY}" >> "${OUTPUT_FILE}"

# Set secure permissions
chmod 600 "${OUTPUT_FILE}" "${METADATA_FILE}"

# Display results
echo "================================================"
echo "API Key Generated Successfully"
echo "================================================"
echo "API Key: ${API_KEY}"
echo ""
echo "Files Generated:"
echo "- Log: ${OUTPUT_FILE}"
echo "- Metadata: ${METADATA_FILE}"
echo ""
echo "Security Notice:"
echo "1. Store this API key securely"
echo "2. Never commit to version control"
echo "3. Rotate every 90 days"
