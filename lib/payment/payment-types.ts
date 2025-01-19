// types/payments.ts

export type PaymentProvider = 
  | 'stripe'
  | 'crypto'
  | 'bank_transfer'
  | 'mobile_money'
  | 'sepa';

export type PaymentMethod =
  | 'card'
  | 'apple_pay'
  | 'google_pay'
  | 'bank_transfer'
  | 'crypto'
  | 'mobile_money'
  | 'sepa_debit';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'disputed';

export type CryptoCurrency = 'BTC' | 'ETH' | 'USDC';

export type MobileMoneyProvider = 'mpesa' | 'mtn';

export interface PaymentDetails {
  amount: number;
  currency: string;
  provider: PaymentProvider;
  method: PaymentMethod;
  status: PaymentStatus;
  reference: string;
  metadata?: Record<string, any>;
}

export interface CardPaymentDetails extends PaymentDetails {
  provider: 'stripe';
  method: 'card';
  card: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
}

export interface CryptoPaymentDetails extends PaymentDetails {
  provider: 'crypto';
  method: 'crypto';
  cryptoCurrency: CryptoCurrency;
  walletAddress: string;
  networkFee?: number;
}

export interface BankTransferDetails extends PaymentDetails {
  provider: 'bank_transfer';
  method: 'bank_transfer';
  bankAccount: {
    accountHolder: string;
    accountNumber: string;
    routingNumber?: string;
    iban?: string;
    swift?: string;
  };
}

export interface MobileMoneyDetails extends PaymentDetails {
  provider: 'mobile_money';
  method: 'mobile_money';
  mobileMoneyProvider: MobileMoneyProvider;
  phoneNumber: string;
  country: string;
}

export interface SEPAPaymentDetails extends PaymentDetails {
  provider: 'sepa';
  method: 'sepa_debit';
  iban: string;
  accountHolder: string;
  mandateReference: string;
}

export type AnyPaymentDetails =
  | CardPaymentDetails
  | CryptoPaymentDetails
  | BankTransferDetails
  | MobileMoneyDetails
  | SEPAPaymentDetails;