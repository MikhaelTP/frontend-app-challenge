import api from './api';
import type { Currency } from '../types';

// Used as offline fallback when the Kambista API is unreachable
export const FALLBACK_BUY_RATE = 3.68;
export const FALLBACK_SELL_RATE = 3.72;

export interface RateResponse {
  rate: number;
  exchange: number;
  tc: { bid: number; ask: number };
  data: { operate: boolean; msg: string };
  savings: { amount: string; currency: string };
}

export async function fetchCurrentRates(): Promise<{ buy: number; sell: number }> {
  try {
    const { data } = await api.get<RateResponse>('/exchange/kambista/current');
    return { buy: data.tc.bid, sell: data.tc.ask };
  } catch {
    return { buy: FALLBACK_BUY_RATE, sell: FALLBACK_SELL_RATE };
  }
}

export async function calculateExchange(
  originCurrency: Currency,
  destinationCurrency: Currency,
  amount: number
): Promise<RateResponse | null> {
  try {
    const { data } = await api.get<RateResponse>('/exchange/calculates', {
      params: { originCurrency, destinationCurrency, amount, active: 'S' },
    });
    return data;
  } catch {
    return null;
  }
}
