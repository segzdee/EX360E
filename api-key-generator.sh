#!/bin/bash

# EXTRASTAFF360 Enterprise API Key Generation Protocol
# Version: 2.0.0
# Environment: Production
# Security Level: Enterprise-Grade

# Configuration Parameters
PREFIX="es360"
VERSION="v2"
KEY_LENGTH=32
SEGMENT_LENGTH=8
CHECKSUM_LENGTH=4
OUTPUT_FILE="api_keys.log"
METADATA_FILE="api_key_metadata.json"

# Color Configuration for Output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Validation Function for Generated Keys
validate_key() {
    local key=$1
    if [[ ! $key =~ ^${PREFIX}_${VERSION}_[A-Za-z0-9_]{32}$ ]]; then
        return 1
    fi
    return 0
}

# Generate Timestamp Component
generate_timestamp() {
    date +%s%N | sha256sum | base64 | head -c 8
}

# Generate Random Component
generate_random() {
    openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 16
}

# Generate Checksum
generate_checksum() {
    local input=$1
    echo -n "$input" | sha256sum | head -c ${CHECKSUM_LENGTH}
}

# Generate API Key
generate_api_key() {
    echo "Initializing API key generation protocol..."
    
    # Generate Components
    local timestamp=$(generate_timestamp)
    local random=$(generate_random)
    local uuid=$(uuidgen | tr -d '-' | head -c 8)
    
    # Construct Base Key
    local base_key="${PREFIX}_${VERSION}_${timestamp}_${uuid}_${random}"
    
    # Generate Checksum
    local checksum=$(generate_checksum "$base_key")
    
    # Final Key
    local api_key="${base_key}_${checksum}"
    
    # Validate Generated Key
    if ! validate_key "$api_key"; then
        echo -e "${RED}Error: Generated key validation failed${NC}"
        exit 1
    fi
    
    # Generate Metadata
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local expiry=$(date -u -d "+90 days" +"%Y-%m-%dT%H:%M:%SZ")
    
    # Create Metadata JSON
    cat > "$METADATA_FILE" <<EOL
{
    "key_id": "key_${uuid}",
    "created_at": "${timestamp}",
    "expires_at": "${expiry}",
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
    },
    "security": {
        "encryption": "AES-256-GCM",
        "key_rotation": "90 days"
    },
    "metadata": {
        "generated_by": "api_key_generator_v2",
        "platform_version": "2.0.0",
        "key_type": "production"
    }
}
EOL

    # Log Key Generation
    echo -e "${GREEN}API Key Generated Successfully${NC}"
    echo -e "${BLUE}API Key:${NC} $api_key"
    echo -e "${BLUE}Generated:${NC} $timestamp"
    echo -e "${BLUE}Expires:${NC} $expiry"
    
    # Secure Storage
    echo "[$timestamp] Generated API Key: $api_key" >> "$OUTPUT_FILE"
    chmod 600 "$OUTPUT_FILE" "$METADATA_FILE"
    
    # Display Success Message
    echo -e "\n${GREEN}API Key generation completed successfully${NC}"
    echo -e "Metadata stored in: $METADATA_FILE"
    echo -e "Key log stored in: $OUTPUT_FILE"
}

# Execute Generation Protocol
echo -e "${BLUE}EXTRASTAFF360 Enterprise API Key Generation Protocol${NC}"
echo -e "${BLUE}Version: 2.0.0${NC}"
echo -e "${BLUE}Environment: Production${NC}"
echo "================================================"

# Generate API Key
generate_api_key

# Security Notice
echo -e "\n${RED}SECURITY NOTICE:${NC}"
echo "1. Store this API key securely"
echo "2. Never commit API keys to version control"
echo "3. Rotate keys every 90 days"
echo "4. Monitor key usage for suspicious activity"

exit 0
