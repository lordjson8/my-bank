import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

class ApiClient {
  private client: AxiosInstance;
  private maxRetries: number;

  constructor() {
    this.client = axios.create({
      baseURL: "https://api.example.com",
      timeout: 5000,
    });
    this.maxRetries = 3;

    this.setInterceptors();
  }

  private async setInterceptors() {
    this.client.interceptors.response.use(
      async (config) => config,
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.request.use(
      async (config) => {
        // Add any request modifications here
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  private async retryRequest<T>(
    url: string,
    config: AxiosRequestConfig,
    retriesLeft: number = this.maxRetries
  ): Promise<T> {
    try {
      return await this.get<T>(url, config);
    } catch (error) {
      if (retriesLeft > 0) {
        return this.retryRequest<T>(url, config, retriesLeft - 1);
      }
      throw error;
    }
  }
}

const apiClient = new ApiClient();
export default apiClient;
