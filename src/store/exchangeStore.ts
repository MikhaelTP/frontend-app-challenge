import { create } from 'zustand';
import { fetchCurrentRates, calculateExchange, FALLBACK_BUY_RATE, FALLBACK_SELL_RATE } from '../services/exchangeService';
import type { Currency } from '../types';

interface ExchangeState {
  buyRate: number;
  sellRate: number;
  loading: boolean;
  sendAmount: number;
  sendCurrency: Currency;
  receiveCurrency: Currency;
  receiveAmount: number;
  savingsAmount: number;
  savingsCurrency: string;
  koinksEarned: number;
  fetchRates: () => Promise<void>;
  calculate: () => Promise<void>;
  swapCurrencies: () => void;
  setSendAmount: (amount: number) => void;
  setActiveTab: (tab: 'buy' | 'sell') => void;
}

export const useExchangeStore = create<ExchangeState>((set, get) => ({
  buyRate: FALLBACK_BUY_RATE,
  sellRate: FALLBACK_SELL_RATE,
  loading: false,
  sendAmount: 1000,
  sendCurrency: 'USD',
  receiveCurrency: 'PEN',
  receiveAmount: 0,
  savingsAmount: 0,
  savingsCurrency: 'S/',
  koinksEarned: 0,

  fetchRates: async () => {
    set({ loading: true });
    const rates = await fetchCurrentRates();
    set({ buyRate: rates.buy, sellRate: rates.sell, loading: false });
  },

  calculate: async () => {
    const { sendAmount, sendCurrency, receiveCurrency, buyRate, sellRate } = get();
    if (!sendAmount || sendAmount <= 0) return;
    set({ loading: true });

    const result = await calculateExchange(sendCurrency, receiveCurrency, sendAmount);

    if (result) {
      const usdEq =
        sendCurrency === 'USD' ? sendAmount : sendAmount / (result.tc?.ask || sellRate);
      set({
        receiveAmount: result.exchange,
        savingsAmount: parseFloat(result.savings?.amount ?? '0'),
        savingsCurrency: result.savings?.currency ?? 'S/',
        koinksEarned: Math.floor(usdEq),
        buyRate: result.tc?.bid || buyRate,
        sellRate: result.tc?.ask || sellRate,
        loading: false,
      });
    } else {
      const rate = sendCurrency === 'USD' ? buyRate : sellRate;
      const receiveAmount =
        sendCurrency === 'USD'
          ? parseFloat((sendAmount * rate).toFixed(2))
          : parseFloat((sendAmount / rate).toFixed(2));
      const usdFallback = sendCurrency === 'USD' ? sendAmount : sendAmount / sellRate;
      set({ receiveAmount, savingsAmount: 0, koinksEarned: Math.floor(usdFallback), loading: false });
    }
  },

  swapCurrencies: () => {
    const { sendCurrency, receiveCurrency } = get();
    set({ sendCurrency: receiveCurrency, receiveCurrency: sendCurrency });
    get().calculate();
  },

  setSendAmount: (amount: number) => set({ sendAmount: amount }),

  setActiveTab: (tab: 'buy' | 'sell') => {
    if (tab === 'buy') {
      set({ sendCurrency: 'USD', receiveCurrency: 'PEN' });
    } else {
      set({ sendCurrency: 'PEN', receiveCurrency: 'USD' });
    }
    get().calculate();
  },
}));
