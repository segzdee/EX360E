// EXTRASTAFF360 Payment Processing System
// Version: 2.0.0
// Service: Financial Operations

import { StripeService } from './providers/stripe';
import { PaymentValidator } from './validators';
import { MetricsCollector } from './metrics';
import { NotificationService } from './notifications';

interface PaymentTransaction {
  transactionId: string;
  escrowId: string;
  paymentType: PaymentType;
  amount: {
    subtotal: number;
    fees: number;
    tax: number;
    total: number;
  };
  parties: {
    sender: string;
    recipient: string;
    agency?: string;
  };
  status: PaymentStatus;
  metadata: {
    shiftId: string;
    timestamp: Date;
    description: string;
  };
}

enum PaymentType {
  SHIFT_PAYMENT = 'SHIFT_PAYMENT',
  REFUND = 'REFUND',
  AGENCY_COMMISSION = 'AGENCY_COMMISSION',
  PLATFORM_FEE = 'PLATFORM_FEE'
}

enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

class PaymentService {
  private readonly stripeService: StripeService;
  private readonly validator: PaymentValidator;
  private readonly metrics: MetricsCollector;
  private readonly notificationService: NotificationService;

  constructor() {
    this.stripeService = new StripeService();
    this.validator = new PaymentValidator();
    this.metrics = new MetricsCollector();
    this.notificationService = new NotificationService();
  }

  async processPayment(
    paymentData: Partial<PaymentTransaction>
  ): Promise<PaymentTransaction> {
    try {
      // Validate payment data
      await this.validator.validatePayment(paymentData);

      // Calculate final amount with fees
      const calculatedAmount = await this.calculatePaymentAmount(paymentData);

      // Create payment record
      const paymentTransaction: PaymentTransaction = {
        ...paymentData,
        amount: calculatedAmount,
        status: PaymentStatus.PROCESSING,
        metadata: {
          ...paymentData.metadata,
          timestamp: new Date()
        }
      };

      // Process payment through Stripe
      const stripePayment = await this.stripeService.processPayment(paymentTransaction);

      // Update transaction status
      const completedTransaction = {
        ...paymentTransaction,
        status: PaymentStatus.COMPLETED,
        transactionId: stripePayment.id
      };

      // Send notifications
      await this.notificationService.sendPaymentNotification(completedTransaction);

      // Record metrics
      await this.metrics.recordPayment(completedTransaction);

      return completedTransaction;
    } catch (error) {
      await this.handlePaymentError(error, paymentData);
      throw error;
    }
  }

  private async calculatePaymentAmount(
    paymentData: Partial<PaymentTransaction>
  ): Promise<{
    subtotal: number;
    fees: number;
    tax: number;
    total: number;
  }> {
    const subtotal = paymentData.amount.subtotal;
    const fees = this.calculateFees(subtotal, paymentData.paymentType);
    const tax = await this.calculateTax(subtotal);

    return {
      subtotal,
      fees,
      tax,
      total: subtotal + fees + tax
    };
  }

  private calculateFees(amount: number, paymentType: PaymentType): number {
    switch (paymentType) {
      case PaymentType.SHIFT_PAYMENT:
        return amount * 0.10; // 10% platform fee
      case PaymentType.AGENCY_COMMISSION:
        return amount * 0.06; // 6% agency fee
      default:
        return 0;
    }
  }

  async processRefund(
    transactionId: string,
    refundData: any
  ): Promise<PaymentTransaction> {
    try {
      // Validate refund request
      await this.validator.validateRefund(transactionId, refundData);

      // Process refund through Stripe
      const refundResult = await this.stripeService.processRefund(
        transactionId,
        refundData
      );

      // Update transaction status
      const refundedTransaction: PaymentTransaction = {
        ...refundResult,
        status: PaymentStatus.REFUNDED
      };

      // Send notifications
      await this.notificationService.sendRefundNotification(refundedTransaction);

      // Record metrics
      await this.metrics.recordRefund(refundedTransaction);

      return refundedTransaction;
    } catch (error) {
      await this.handleRefundError(error, transactionId);
      throw error;
    }
  }

  async getPaymentAnalytics(): Promise<any> {
    return {
      totalVolume: await this.metrics.getTotalVolume(),
      successRate: await this.metrics.getSuccessRate(),
      averageTransactionValue: await this.metrics.getAverageTransactionValue(),
      refundRate: await this.metrics.getRefundRate()
    };
  }

  private async handlePaymentError(error: any, paymentData: any): Promise<void> {
    await this.metrics.recordError('payment_processing_failed', error);
    await this.notificationService.sendPaymentFailureNotification(
      paymentData,
      error
    );
  }
}

// Export the service
export {
  PaymentService,
  PaymentTransaction,
  PaymentType,
  PaymentStatus
};
