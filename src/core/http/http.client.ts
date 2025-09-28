import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { calcBackoffMs, defaultShouldRetry, ShouldRetry } from './retry';

export interface HttpClientOptions {
  baseURL?: string;
  timeoutMs?: number;
  defaultHeaders?: Record<string, string | undefined>;
  shouldRetry?: ShouldRetry;
}

@Injectable()
export class HttpClient {
  private readonly http: AxiosInstance;
  private readonly logger = new Logger(HttpClient.name);
  private readonly shouldRetry: ShouldRetry;

  constructor(opts: HttpClientOptions = {}) {
    this.shouldRetry = opts.shouldRetry ?? defaultShouldRetry;

    this.http = axios.create({
      baseURL: opts.baseURL,
      timeout: opts.timeoutMs ?? 5000,
      headers: {
        Accept: 'application/json',
        ...opts.defaultHeaders,
      },
    });

    this.http.interceptors.response.use(
      (res) => res,
      (error) => {
        const status = error?.response?.status;
        this.logger.warn(
          `HTTP error status=${status} url=${error?.config?.url} code=${error?.code}`,
        );
        return Promise.reject(error);
      },
    );
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.requestWithRetry<T>({ method: 'GET', url, ...config });
  }

  async requestWithRetry<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    let attempt = 0;
    const safeConfig = { ...config, headers: { ...config.headers, Authorization: undefined } };

    for (;;) {
      attempt++;
      try {
        const res = await this.http.request<T>(config);
        return res;
      } catch (error: any) {
        const status = error?.response?.status;
        if (!this.shouldRetry({ attempt, status, error })) {
          this.logFailure(safeConfig, error, attempt, status);
          throw error;
        }
        const wait = calcBackoffMs(attempt);
        this.logger.debug(
          `retrying ${safeConfig.method} ${safeConfig.url} attempt=${attempt} wait=${Math.round(wait)}ms`,
        );
        await new Promise((r) => setTimeout(r, wait));
      }
    }
  }

  private logFailure(cfg: AxiosRequestConfig, error: any, attempt: number, status?: number) {
    const code = error?.code;
    this.logger.error(
      `HTTP failed method=${cfg.method} url=${cfg.url} attempt=${attempt} status=${status} code=${code}`,
    );
  }
}
