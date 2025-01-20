// EXTRASTAFF360 Escrow Management System
// Version: 2.0.0
// Service: Financial Processing

import { TransactionManager } from './transaction';
import { EscrowValidator } from './validators';
import { MetricsCollector } from './metrics';

interface EscrowTransaction {
  transactionId: string;
  shiftId: string;
  clientId: string;
  staffId: string;
  agencyId?: string;
  amount: {
    base: number;
    clientFee: number;
    staffFee: number;
    agencyFee?: number;
    total: number;
  };
  status: EscrowStatus;
  timeline: {
    created: Date;
    held: Date;
    released?: Date;
    disputed?: Date;
    resolved?: Date;
  };
}

enum EscrowStatus {
  PENDING = 'PENDING',
  HELD = 'HELD',
  RELEASED = 'RELEASED',
  DISPUTED = 'DISPUTED',
  REFUNDED = 'REFUNDED'
}

class EscrowService {
  private readonly validator: EscrowValidator;
  private readonly metrics: MetricsCollector;
  private readonly transactionManager: TransactionManager;

  constructor() {
    this.validator = new EscrowValidator();
    this.metrics = new MetricsCollector();
    this.transactionManager = new TransactionManager();
  }

  async createEscrowTransaction(data: Partial<EscrowTransaction>): Promise<EscrowTransaction> {
    try {
      // Validate transaction data
      await this.validator.validateTransaction(data);

      // Calculate fees
      const fees = this.calculateFees(data.amount.base);

      // Create escrow record
      const escrowTransaction: EscrowTransaction = {
        ...data,
        amount: {
          base: data.amount.base,
          ...fees,
          total: data.amount.base + fees.clientFee
        },
        status: EscrowStatus.PENDING,
        timeline: {
          created: new Date(),
          held: new Date()
        }
      };

      // Process initial hold
      await this.transactionManager.holdFunds(escrowTransaction);

      // Update metrics
      await this.metrics.recordTransaction(escrowTransaction);

      return escrowTransaction;
    } catch (error) {
      this.metrics.recordError('escrow_creation_failed', error);
      throw error;
    }
  }

  private calculateFees(baseAmount: number): {
    clientFee: number;
    staffFee: number;
    agencyFee?: number;
  } {
    return {
      clientFee: baseAmount * 0.08, // 8% client fee
      staffFee: baseAmount * 0.10,  // 10% staff fee
      agencyFee: baseAmount * 0.06  // 6% agency fee
    };
  }

  async releaseEscrow(transactionId: string): Promise<EscrowTransaction> {
    try {
      const transaction = await this.transactionManager.getTransaction(transactionId);
      
      // Validate release conditions
      await this.validator.validateRelease(transaction);

      // Process release
      const updatedTransaction = await this.transactionManager.releaseFunds(transaction);
      
      // Update metrics
      await this.metrics.recordRelease(updatedTransaction);

      return updatedTransaction;
    } catch (error) {
      this.metrics.recordError('escrow_release_failed', error);
      throw error;
    }
  }

  async handleDispute(
    transactionId: string,
    disputeData: any
  ): Promise<EscrowTransaction> {
    try {
      const transaction = await this.transactionManager.getTransaction(transactionId);
      
      // Validate dispute
      await this.validator.validateDispute(transaction, disputeData);

      // Process dispute
      const disputedTransaction = await this.transactionManager.initiateDispute(
        transaction,
        disputeData
      );

      // Update metrics
      await this.metrics.recordDispute(disputedTransaction);

      return disputedTransaction;
    } catch (error) {
      this.metrics.recordError('dispute_handling_failed', error);
      throw error;
    }
  }

  async getEscrowMetrics(): Promise<any> {
    return {
      totalTransactions: await this.metrics.getTotalTransactions(),
      disputeRate: await this.metrics.getDisputeRate(),
      averageResolutionTime: await this.metrics.getAverageResolutionTime(),
      successRate: await this.metrics.getSuccessRate()
    };
  }
}

// Export the service
export {
  EscrowService,
  EscrowTransaction,
  EscrowStatus
};
