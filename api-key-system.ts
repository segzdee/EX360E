// EXTRASTAFF360 API Key Management System
// Version: 2.0.0
// Implementation: Production

import { randomBytes, createHmac } from 'crypto';
import { RedisKeyStore } from './storage';
import { MetricsCollector } from './metrics';
import { AuditLogger } from './audit';

interface APIKeyConfig {
  prefix: string;
  length: number;
  algorithm: string;
  rotationPeriod: number; // milliseconds
  rateLimit: {
    window: number;    // milliseconds
    maxRequests: number;
  };
}

class APIKeyManager {
  private readonly config: APIKeyConfig = {
    prefix: 'es360_',
    length: 32,
    algorithm: 'sha256',
    rotationPeriod: 90 * 24 * 60 * 60 * 1000, // 90 days
    rateLimit: {
      window: 60 * 1000,  // 1 minute
      maxRequests: 1000
    }
  };

  private readonly keyStore: RedisKeyStore;
  private readonly metrics: MetricsCollector;
  private readonly auditLogger: AuditLogger;

  constructor() {
    this.keyStore = new RedisKeyStore();
    this.metrics = new MetricsCollector();
    this.auditLogger = new AuditLogger();
  }

  async generateAPIKey(
    scope: string[],
    metadata: Record<string, any>
  ): Promise<string> {
    try {
      // Generate cryptographically secure key
      const keyBuffer = randomBytes(this.config.length);
      const key = this.config.prefix + keyBuffer.toString('hex');

      // Create key hash for storage
      const keyHash = this.hashKey(key);

      // Store key metadata
      await this.keyStore.storeKey({
        hash: keyHash,
        scope,
        metadata,
        created: new Date(),
        expires: new Date(Date.now() + this.config.rotationPeriod)
      });

      // Log key generation
      await this.auditLogger.log({
        action: 'key_generated',
        scope,
        metadata,
        timestamp: new Date()
      });

      // Update metrics
      await this.metrics.incrementCounter('api_keys_generated');

      return key;
    } catch (error) {
      await this.handleError('key_generation_failed', error);
      throw error;
    }
  }

  private hashKey(key: string): string {
    return createHmac(this.config.algorithm, process.env.HASH_SECRET)
      .update(key)
      .digest('hex');
  }

  async validateAPIKey(
    key: string,
    requiredScope: string[]
  ): Promise<boolean> {
    try {
      // Get key hash
      const keyHash = this.hashKey(key);

      // Retrieve key metadata
      const keyData = await this.keyStore.getKey(keyHash);
      if (!keyData) {
        throw new Error('Invalid API key');
      }

      // Validate expiration
      if (new Date() > new Date(keyData.expires)) {
        throw new Error('Expired API key');
      }

      // Validate scope
      const hasScope = requiredScope.every(
        scope => keyData.scope.includes(scope)
      );
      if (!hasScope) {
        throw new Error('Insufficient scope');
      }

      // Check rate limit
      const isRateLimited = await this.checkRateLimit(keyHash);
      if (isRateLimited) {
        throw new Error('Rate limit exceeded');
      }

      // Log validation
      await this.auditLogger.log({
        action: 'key_validated',
        keyHash,
        scope: requiredScope,
        timestamp: new Date()
      });

      return true;
    } catch (error) {
      await this.handleError('key_validation_failed', error);
      return false;
    }
  }

  private async checkRateLimit(keyHash: string): Promise<boolean> {
    const requests = await this.keyStore.getRequestCount(
      keyHash,
      this.config.rateLimit.window
    );
    return requests >= this.config.rateLimit.maxRequests;
  }

  async rotateAPIKey(
    oldKey: string,
    metadata?: Record<string, any>
  ): Promise<string> {
    try {
      // Validate old key
      const oldKeyHash = this.hashKey(oldKey);
      const keyData = await this.keyStore.getKey(oldKeyHash);
      if (!keyData) {
        throw new Error('Invalid API key');
      }

      // Generate new key
      const newKey = await this.generateAPIKey(
        keyData.scope,
        { ...keyData.metadata, ...metadata }
      );

      // Invalidate old key
      await this.keyStore.invalidateKey(oldKeyHash);

      // Log rotation
      await this.auditLogger.log({
        action: 'key_rotated',
        oldKeyHash,
        newKeyHash: this.hashKey(newKey),
        timestamp: new Date()
      });

      return newKey;
    } catch (error) {
      await this.handleError('key_rotation_failed', error);
      throw error;
    }
  }

  async getAPIKeyMetrics(): Promise<any> {
    return {
      activeKeys: await this.metrics.getActiveKeyCount(),
      rotationsLast24h: await this.metrics.getRotationCount(24 * 60 * 60 * 1000),
      validationSuccess: await this.metrics.getValidationSuccessRate(),
      rateLimitExceeded: await this.metrics.getRateLimitExceededCount()
    };
  }

  private async handleError(
    type: string,
    error: Error
  ): Promise<void> {
    await this.metrics.incrementCounter(`error_${type}`);
    await this.auditLogger.logError(type, error);
  }
}

// Export the manager
export {
  APIKeyManager,
  APIKeyConfig
};
