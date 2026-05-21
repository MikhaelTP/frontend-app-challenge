export type Currency = 'USD' | 'PEN';
export type DocumentType = 'DNI' | 'CCE' | 'Pasaporte';
export type AccountType = 'Ahorros' | 'Corriente';

export interface Bank {
  id: number;
  name: string;
  code: string;
}

export interface SourceFund {
  id: number;
  name: string;
}

export interface BankAccount {
  id: string;
  bank: Bank;
  accountType: AccountType;
  accountNumber: string;
  alias: string;
  currency: Currency;
}

export interface UserProfile {
  name: string;
  email: string;
  koinks: number;
}

export interface Transaction {
  id: string;
  sendAmount: number;
  receiveAmount: number;
  exchangeRate: number;
  originCurrency: Currency;
  destinationCurrency: Currency;
  coupon?: string;
  originBank?: Bank;
  destinationAccount?: BankAccount;
  sourceOfFunds?: SourceFund;
  kambistCode?: string;
  estimatedTime?: string;
  savingsAmount?: number;
}

export interface APIError {
  success: false;
  data: {
    name: string;
    title: string;
    message: string;
  };
}
