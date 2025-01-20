// Core types and interfaces
interface Point {
  latitude: number;
  longitude: number;
}

interface Shift {
  id: string;
  companyId: string;
  startTime: Date;
  endTime: Date;
  location: Point;
  hourlyRate: number;
  status: ShiftStatus;
  createdAt: Date;
}

enum ShiftStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED'
}

enum UserType {
  FREELANCER = 'FREELANCER',
  COMPANY = 'COMPANY',
  AGENCY = 'AGENCY'
}

interface ClockEvent {
  id: string;
  shiftId: string;
  staffId: string;
  eventType: 'IN' | 'OUT';
  timestamp: Date;
  location: Point;
  verified: boolean;
}

interface ServiceError extends Error {
  code: string;
  details?: any;
}

// Configuration management with environment variable support
class ConfigService {
  private static instance: ConfigService;
  private config: Record<string, any>;

  private constructor() {
    this.config = {
      GEOFENCE_RADIUS: parseInt(process.env.GEOFENCE_RADIUS || '100'),
      PAYMENT_HOLD_DURATION: parseInt(process.env.PAYMENT_HOLD_DURATION || '86400000'),
      JWT_EXPIRY: process.env.JWT_EXPIRY || '24h',
      SERVICE_FEES: {
        FREELANCER: parseFloat(process.env.FREELANCER_FEE || '0.05'),
        COMPANY: parseFloat(process.env.COMPANY_FEE || '0.07'),
        AGENCY: parseFloat(process.env.AGENCY_FEE || '0.10')
      },
      DB_CONNECTION: process.env.DB_CONNECTION,
      REDIS_URL: process.env.REDIS_URL
    };
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  get<T>(key: string): T {
    return this.config[key];
  }
}

// Enhanced database service with connection pooling and retry logic
class DatabaseService {
  private static instance: DatabaseService;
  private pool: any; // Replace with actual Pool type from your DB library
  private readonly maxRetries = 3;

  private constructor() {
    this.initializePool();
  }

  private async initializePool() {
    const config = ConfigService.getInstance();
    this.pool = await createPool(config.get('DB_CONNECTION'));
  }

  static async getInstance(): Promise<DatabaseService> {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async execute<T>(query: string, params?: any[]): Promise<T> {
    let attempts = 0;
    while (attempts < this.maxRetries) {
      try {
        const client = await this.pool.connect();
        try {
          const result = await client.query(query, params);
          return result.rows;
        } finally {
          client.release();
        }
      } catch (error) {
        attempts++;
        if (attempts === this.maxRetries) {
          throw this.createServiceError('DATABASE_ERROR', error);
        }
        await this.delay(Math.pow(2, attempts) * 100); // Exponential backoff
      }
    }
    throw this.createServiceError('DATABASE_ERROR', new Error('Max retries exceeded'));
  }

  private createServiceError(code: string, error: any): ServiceError {
    const serviceError = new Error(error.message) as ServiceError;
    serviceError.code = code;
    serviceError.details = error;
    return serviceError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Enhanced location verification with caching
class LocationVerificationService {
  private readonly config: ConfigService;
  private readonly cache: Map<string, boolean>;
  private readonly cacheTTL: number = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.config = ConfigService.getInstance();
    this.cache = new Map();
  }

  async verifyLocation(staffLocation: Point, venueLocation: Point): Promise<boolean> {
    const cacheKey = this.generateCacheKey(staffLocation, venueLocation);
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const verified = await this.performVerification(staffLocation, venueLocation);
    this.cache.set(cacheKey, verified);
    
    setTimeout(() => {
      this.cache.delete(cacheKey);
    }, this.cacheTTL);

    return verified;
  }

  private generateCacheKey(staffLocation: Point, venueLocation: Point): string {
    return `${staffLocation.latitude},${staffLocation.longitude}-${venueLocation.latitude},${venueLocation.longitude}`;
  }

  private async performVerification(staffLocation: Point, venueLocation: Point): Promise<boolean> {
    try {
      const distance = await this.calculateDistance(staffLocation, venueLocation);
      return distance <= this.config.get<number>('GEOFENCE_RADIUS');
    } catch (error) {
      throw this.createServiceError('LOCATION_VERIFICATION_ERROR', error);
    }
  }

  private createServiceError(code: string, error: any): ServiceError {
    const serviceError = new Error(error.message) as ServiceError;
    serviceError.code = code;
    serviceError.details = error;
    return serviceError;
  }
}

// Enhanced payment service with retry logic and transaction support
class PaymentService {
  private readonly config: ConfigService;
  private readonly db: DatabaseService;
  
  constructor(db: DatabaseService) {
    this.config = ConfigService.getInstance();
    this.db = db;
  }

  async processShiftPayment(shiftId: string): Promise<void> {
    const client = await this.db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const shift = await this.getShiftDetails(shiftId, client);
      const amount = this.calculatePaymentAmount(shift);
      
      await this.holdFunds(shift.companyId, amount, client);
      await this.startDisputePeriod(shiftId, client);
      
      await client.query('COMMIT');
      
      // Schedule payment release after hold period
      this.schedulePaymentRelease(shiftId, amount);
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw this.createServiceError('PAYMENT_PROCESSING_ERROR', error);
    } finally {
      client.release();
    }
  }

  private async schedulePaymentRelease(shiftId: string, amount: number): Promise<void> {
    const holdDuration = this.config.get<number>('PAYMENT_HOLD_DURATION');
    
    setTimeout(async () => {
      try {
        const hasDisputes = await this.hasActiveDisputes(shiftId);
        if (!hasDisputes) {
          await this.releaseFundsToStaff(shiftId, amount);
        }
      } catch (error) {
        // Log error and trigger manual review
        console.error('Payment release failed:', error);
        await this.triggerManualReview(shiftId, error);
      }
    }, holdDuration);
  }

  private createServiceError(code: string, error: any): ServiceError {
    const serviceError = new Error(error.message) as ServiceError;
    serviceError.code = code;
    serviceError.details = error;
    return serviceError;
  }
}

// Main application class with dependency injection
class Extrastaff360Core {
  private readonly config: ConfigService;
  private readonly db: DatabaseService;
  private readonly locationService: LocationVerificationService;
  private readonly paymentService: PaymentService;

  constructor(
    db: DatabaseService,
    locationService: LocationVerificationService,
    paymentService: PaymentService
  ) {
    this.config = ConfigService.getInstance();
    this.db = db;
    this.locationService = locationService;
    this.paymentService = paymentService;
  }

  async initialize(): Promise<void> {
    try {
      await this.db.execute(DATABASE_INIT_QUERY);
      console.log('Database initialized successfully');
      
      // Additional initialization steps...
      
    } catch (error) {
      console.error('Initialization failed:', error);
      throw this.createServiceError('INITIALIZATION_ERROR', error);
    }
  }

  async handleShiftCompletion(shiftId: string): Promise<void> {
    try {
      const shift = await this.verifyShiftCompletion(shiftId);
      await this.paymentService.processShiftPayment(shiftId);
      await this.notifyStakeholders(shift);
      
    } catch (error) {
      console.error('Shift completion failed:', error);
      await this.handleShiftError(shiftId, error);
    }
  }

  private createServiceError(code: string, error: any): ServiceError {
    const serviceError = new Error(error.message) as ServiceError;
    serviceError.code = code;
    serviceError.details = error;
    return serviceError;
  }
}

// Application bootstrap
async function bootstrap() {
  try {
    const db = await DatabaseService.getInstance();
    const locationService = new LocationVerificationService();
    const paymentService = new PaymentService(db);
    
    const app = new Extrastaff360Core(db, locationService, paymentService);
    await app.initialize();
    
    console.log('Extrastaff360 Core Services Initialized Successfully');
    
  } catch (error) {
    console.error('Application bootstrap failed:', error);
    process.exit(1);
  }
}

bootstrap();