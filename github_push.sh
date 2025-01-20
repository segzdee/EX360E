#!/bin/bash

# Project and GitHub Configuration
PROJECT_NAME="ExtraStaff360"
GITHUB_EMAIL="segzdeee@gmail.com"
GITHUB_REPO="Extra360"
GITHUB_USERNAME="segzdee"

# SSH Key Configuration
SSH_KEY_PATH="$HOME/.ssh/id_ed25519_${PROJECT_NAME// /_}"
SSH_CONFIG_PATH="$HOME/.ssh/config"

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to log messages
log() {
    echo -e "${GREEN}[${PROJECT_NAME} Setup]${NC} $1"
}

# Function to log warnings
warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to log errors
error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Generate SSH Key
generate_ssh_key() {
    log "Generating SSH key for ${PROJECT_NAME}"
    
    # Check if SSH key already exists
    if [ -f "${SSH_KEY_PATH}" ]; then
        warn "SSH key already exists at ${SSH_KEY_PATH}"
        read -p "Overwrite existing key? (y/N): " overwrite
        if [[ ! "$overwrite" =~ ^[Yy]$ ]]; then
            log "Keeping existing SSH key"
            return
        fi
    fi

    # Generate new SSH key
    ssh-keygen -t ed25519 -C "${GITHUB_EMAIL}" -f "${SSH_KEY_PATH}" -N ""
    
    if [ $? -eq 0 ]; then
        log "SSH key generated successfully"
    else
        error "Failed to generate SSH key"
    fi
}

# Configure SSH Config
configure_ssh_config() {
    log "Configuring SSH config"
    
    # Create SSH config if not exists
    if [ ! -f "$SSH_CONFIG_PATH" ]; then
        touch "$SSH_CONFIG_PATH"
        chmod 600 "$SSH_CONFIG_PATH"
    fi

    # Check if GitHub host already configured
    if ! grep -q "Host github.com" "$SSH_CONFIG_PATH"; then
        cat >> "$SSH_CONFIG_PATH" << EOL

Host github.com
    HostName github.com
    User git
    IdentityFile ${SSH_KEY_PATH}
EOL
        log "SSH config updated"
    else
        warn "GitHub host already configured in SSH config"
    fi
}

# Add SSH Key to Agent
add_ssh_key_to_agent() {
    log "Adding SSH key to SSH agent"
    
    # Start SSH agent if not running
    eval "$(ssh-agent -s)"
    
    # Add SSH key
    ssh-add "${SSH_KEY_PATH}"
    
    if [ $? -eq 0 ]; then
        log "SSH key added to agent successfully"
    else
        error "Failed to add SSH key to agent"
    fi
}

# Test SSH Connection
test_ssh_connection() {
    log "Testing SSH connection to GitHub"
    
    ssh -T git@github.com
    
    if [ $? -eq 1 ]; then
        log "SSH connection successful"
    else
        error "SSH connection failed"
    fi
}

# Git Operations
git_push_project() {
    log "Preparing to push project to GitHub"
    
    # Stage all files
    git add .
    
    # Commit files
    git commit -m "Initial commit: ${PROJECT_NAME} full project setup"
    
    # Push to GitHub
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        log "Project successfully pushed to GitHub"
    else
        error "Failed to push project to GitHub"
    fi
}

# Main Execution
main() {
    generate_ssh_key
    configure_ssh_config
    add_ssh_key_to_agent
    test_ssh_connection
    git_push_project
}

# Run the script
main
