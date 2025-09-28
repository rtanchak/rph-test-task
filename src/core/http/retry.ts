export type ShouldRetry = (args: {
    attempt: number;
    error?: any;
    status?: number;
  }) => boolean;
  
  export function calcBackoffMs(attempt: number, base = 200, cap = 3000): number {
    const jitter = Math.random() * 100;
    return Math.min(cap, base * 2 ** (attempt - 1)) + jitter;
  }
  
  export const defaultShouldRetry: ShouldRetry = ({ attempt, status, error }) => {
    if (attempt >= 3) return false;
    if (status && [429, 500, 502, 503, 504].includes(status)) return true;
    const code = error?.code;
    // мережеві/таймаутні
    if (['ECONNRESET', 'ETIMEDOUT', 'EAI_AGAIN'].includes(code)) return true;
    return false;
  };
  