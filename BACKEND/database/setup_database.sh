#!/bin/bash

# Database configuration
DB_HOST="localhost"
DB_USER="root"
DB_PASS="your_password"
DB_NAME="extrastaff360"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Log function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Check if mysql client is installed
check_mysql() {
    if ! command -v mysql &> /dev/null; then
        error "MySQL client is not installed"
        exit 1
    fi
}

# Create database if it doesn't exist
create_database() {
    log "Creating database if it doesn't exist..."
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" <<EOF
    CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF
    if [ $? -eq 0 ]; then
        log "Database created or already exists"
    else
        error "Failed to create database"
        exit 1
    fi
}

# Run migrations
run_migrations() {
    log "Running migrations..."
    
    # Get list of migration files
    migrations=(database/migrations/[0-9]*.sql)
    
    # Sort migrations numerically
    IFS=$'\n' sorted=($(sort <<<"${migrations[*]}"))
    unset IFS
    
    for migration in "${sorted[@]}"; do
        log "Applying migration: $migration"
        mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$migration"
        
        if [ $? -eq 0 ]; then
            log "Successfully applied migration: $migration"
        else
            error "Failed to apply migration: $migration"
            exit 1
        fi
    done
}

# Apply triggers
apply_triggers() {
    log "Applying database triggers..."
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < database/triggers/triggers.sql
    
    if [ $? -eq 0 ]; then
        log "Successfully applied triggers"
    else
        error "Failed to apply triggers"
        exit 1
    fi
}

# Run seeds
run_seeds() {
    if [ "$ENVIRONMENT" = "development" ]; then
        log "Running database seeds..."
        php database/seeds/SeedData.php
        
        if [ $? -eq 0 ]; then
            log "Successfully seeded database"
        else
            error "Failed to seed database"
            exit 1
        fi
    else
        warning "Skipping seeds in non-development environment"
    fi
}

# Backup database
backup_database() {
    local backup_file="backups/extrastaff360_$(date +'%Y%m%d_%H%M%S').sql"
    
    log "Creating database backup: $backup_file"
    mkdir -p backups
    
    mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$backup_file"
    
    if [ $? -eq 0 ]; then
        log "Successfully created backup: $backup_file"
    else
        error "Failed to create backup"
        exit 1
    fi
}

# Check database connection
check_connection() {
    log "Checking database connection..."
    if mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "USE $DB_NAME" 2>/dev/null; then
        log "Database connection successful"
    else
        error "Could not connect to database"
        exit 1
    fi
}

# Main setup function
setup_database() {
    local should_backup=false
    
    # Parse command line arguments
    while [[ "$#" -gt 0 ]]; do
        case $1 in
            --backup) should_backup=true ;;
            --env) ENVIRONMENT="$2"; shift ;;
            *) error "Unknown parameter: $1"; exit 1 ;;
        esac
        shift
    done
    
    # Default to production environment if not specified
    ENVIRONMENT=${ENVIRONMENT:-production}
    
    log "Starting database setup in $ENVIRONMENT environment"
    
    # Run checks
    check_mysql
    check_connection
    
    # Backup if requested
    if [ "$should_backup" = true ]; then
        backup_database
    fi
    
    # Run setup steps
    create_database
    run_migrations
    apply_triggers
    run_seeds
    
    log "Database setup completed successfully"
}

# Run setup with provided arguments
setup_database "$@"