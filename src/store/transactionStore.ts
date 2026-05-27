import { create } from 'zustand';
import type { Transaction, Bank, BankAccount, SourceFund } from '../types';

function generateId(): string {
  return Math.random().toString(36).substring(2, 8);
}

interface TransactionState {
  current: Partial<Transaction>;
  savedAccounts: BankAccount[];
  step: number;
  initTransaction: (data: Partial<Transaction>) => void;
  setOriginBank: (bank: Bank) => void;
  setDestinationAccount: (account: BankAccount) => void;
  setSourceOfFunds: (fund: SourceFund) => void;
  addSavedAccount: (account: BankAccount) => void;
  completeTransaction: () => void;
  reset: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  current: {},
  step: 1,
  savedAccounts: [
    {
      id: 'mock-1',
      bank: { id: 1, name: 'BCP', code: 'bcp' },
      accountType: 'Ahorros',
      accountNumber: '19400123456789',
      alias: 'Mi BCP',
      currency: 'PEN',
    },
    {
      id: 'mock-2',
      bank: { id: 2, name: 'Interbank', code: 'interbank' },
      accountType: 'Ahorros',
      accountNumber: '89800056781234',
      alias: 'Interbank Soles',
      currency: 'PEN',
    },
    {
      id: 'mock-3',
      bank: { id: 4, name: 'BBVA Continental', code: 'bbva' },
      accountType: 'Corriente',
      accountNumber: '00110234560078',
      alias: 'BBVA Dólares',
      currency: 'USD',
    },
  ],

  initTransaction: (data) => set({ current: { ...data }, step: 1 }),
  setOriginBank: (bank) => set((s) => ({ current: { ...s.current, originBank: bank } })),
  setDestinationAccount: (account) =>
    set((s) => ({ current: { ...s.current, destinationAccount: account } })),
  setSourceOfFunds: (fund) =>
    set((s) => ({ current: { ...s.current, sourceOfFunds: fund } })),
  addSavedAccount: (account) =>
    set((s) => ({ savedAccounts: [...s.savedAccounts, account] })),
  completeTransaction: () =>
    set((s) => ({
      current: {
        ...s.current,
        id: `km${generateId()}`,
        kambistCode: `km${generateId()}`,
        estimatedTime: '20h 15min',
      },
    })),
  reset: () => set({ current: {}, step: 1 }),
}));
