import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: amount < 1 ? 2 : 0,
    maximumFractionDigits: amount < 1 ? 2 : 0,
  }).format(amount);
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function calculateBankerOffer(remainingAmounts: number[], roundIndex: number): number {
  if (remainingAmounts.length === 0) return 0;
  
  const expectedValue = remainingAmounts.reduce((a, b) => a + b, 0) / remainingAmounts.length;
  
  // The banker's offer gets closer to the true expected value as rounds progress.
  // We add a little bit of randomness to make it feel authentic.
  const roundFactor = (roundIndex + 1) / 10; // 0.1 to 0.9 depending on round
  const basePercentage = 0.15 + (0.75 * roundFactor);
  
  // +/- 5% randomness
  const randomness = 1 + (Math.random() * 0.1 - 0.05); 
  
  const rawOffer = expectedValue * basePercentage * randomness;
  
  // Round to nearest hundred or ten for cleaner numbers
  if (rawOffer > 100000) return Math.round(rawOffer / 1000) * 1000;
  if (rawOffer > 10000) return Math.round(rawOffer / 500) * 500;
  if (rawOffer > 1000) return Math.round(rawOffer / 100) * 100;
  return Math.round(rawOffer);
}
