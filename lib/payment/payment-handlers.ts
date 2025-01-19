// lib/payments/stripeHandler.ts
import Stripe from 'stripe';
import { PAYMENT_CONFIG } from '@/config/payment';

const stripe = new Stripe(PAYMENT_CONFIG.stripe.secretKey!, {
  apiVersion: '2023-10-16'
});

export async function createStripePaymentIntent({
  amount,
  currency = 'USD',
  paymentMethod,
  metadata
}: {
  amount: number;
  currency?: string;
  paymentMethod: string;
  metadata?: Record<string, string>;
}) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    payment_method_types: [paymentMethod],
    metadata
  });

  return paymentIntent;
}

// lib/payments/cryptoHandler.ts
import { CoinbaseCommerce } from 'coinbase-commerce-node';
import { Circle } from '@circle-fin/circle-sdk';

export async function createCryptoCharge({
  amount,
  currency,
  cryptoCurrency,
  provider = 'coinbase'
}: {
  amount: number;
  currency: string;
  cryptoCurrency: string;
  provider?: 'coinbase' | 'circle';
}) {
  if (provider === 'coinbase') {
    const charge = await CoinbaseCommerce.charges.create({
      name: 'Extrastaff360 Payment',
      description: 'Payment for services',
      local_price: {
        amount: amount.toString(),
        currency,
      },
      pricing_type: 'fixed_price',
      requested_info: ['email']
    });
    return charge;
  }

  if (provider === 'circle') {
    const circle = new Circle(PAYMENT_CONFIG.crypto.providers.circle.apiKey!);
    const payment = await circle.cryptoPayment.create({
      amount: {
        amount: amount.toString(),
        currency: cryptoCurrency
      },
      settlementCurrency: currency,
      paymentMethods: [{ type: 'crypto' }]
    });
    return payment;
  }
}

// lib/payments/bankTransferHandler.ts
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { TransferWise } from 'transferwise';

export async function initiateBankTransfer({
  amount,
  currency,
  bankDetails,
  provider = 'plaid'
}: {
  amount: number;
  currency: string;
  bankDetails: any;
  provider?: 'plaid' | 'wise';
}) {
  if (provider === 'plaid') {
    const plaidConfig = new Configuration({
      basePath: PlaidEnvironments[PAYMENT_CONFIG.bankTransfer.providers.plaid.env],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': PAYMENT_CONFIG.bankTransfer.providers.plaid.clientId,
          'PLAID-SECRET': PAYMENT_CONFIG.bankTransfer.providers.plaid.secret,
        },
      },
    });

    const plaidClient = new PlaidApi(plaidConfig);
    const transfer = await plaidClient.transferCreate({
      access_token: bankDetails.accessToken,
      account_id: bankDetails.accountId,
      type: 'credit',
      network: 'ach',
      amount: amount.toString(),
      currency,
      description: 'Extrastaff360 Payment'
    });
    return transfer.data;
  }

  if (provider === 'wise') {
    const wise = new TransferWise({
      apiKey: PAYMENT_CONFIG.bankTransfer.providers.wise.apiKey
    });

    const transfer = await wise.transfer.create({
      targetAccount: bankDetails.accountId,
      quoteId: bankDetails.quoteId,
      customerTransactionId: bankDetails.transactionId,
      details: {
        reference: 'Extrastaff360 Payment',
        transferPurpose: 'service_payment',
        sourceOfFunds: 'other'
      }
    });
    return transfer;
  }
}

// lib/payments/mobileMoneyHandler.ts
export async function initiateMobileMoneyPayment({
  amount,
  currency,
  phoneNumber,
  provider
}: {
  amount: number;
  currency: string;
  phoneNumber: string;
  provider: 'mpesa' | 'mtn';
}) {
  if (provider === 'mpesa') {
    // Implement M-Pesa STK Push
    const mpesaApi = require('mpesa-api').default;
    const mpesa = new mpesaApi({
      consumerKey: PAYMENT_CONFIG.mobileMoney.providers.mpesa.consumerKey,
      consumerSecret: PAYMENT_CONFIG.mobileMoney.providers.mpesa.consumerSecret,
      environment: 'production'
    });

    const response = await mpesa.stkPush({
      amount,
      phoneNumber,
      callbackUrl: `${process.env.BASE_URL}/api/payments/mpesa/callback`,
      accountReference: 'Extrastaff360',
      transactionDesc: 'Payment for services'
    });
    return response;
  }

  if (provider === 'mtn') {
    // Implement MTN Mobile Money
    const mtnMomo = require('mtn-momo');
    const collections = new mtnMomo.Collections({
      apiKey: PAYMENT_CONFIG.mobileMoney.providers.mtn.apiKey,
      apiSecret: PAYMENT_CONFIG.mobileMoney.providers.mtn.apiSecret,
      environment: 'production'
    });

    const response = await collections.requestToPay({
      amount,
      currency,
      externalId: Date.now().toString(),
      payer: {
        partyIdType: 'MSISDN',
        partyId: phoneNumber
      },
      payerMessage: 'Payment for Extrastaff360 services',
      payeeNote: 'Service payment'
    });
    return response;
  }
}

// lib/payments/sepaHandler.ts
export async function initiateSEPAPayment({
  amount,
  currency,
  iban,
  name,
  reference
}: {
  amount: number;
  currency: string;
  iban: string;
  name: string;
  reference: string;
}) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    payment_method_types: ['sepa_debit'],
    payment_method_data: {
      type: 'sepa_debit',
      sepa_debit: {
        iban,
      },
      billing_details: {
        name,
        email: 'required@email.com',
      },
    },
    metadata: {
      reference,
    },
    mandate_data: {
      customer_acceptance: {
        type: 'online',
        online: {
          ip_address: 'required_ip_address',
          user_agent: 'required_user_agent',
        },
      },
    },
  });

  return paymentIntent;
}