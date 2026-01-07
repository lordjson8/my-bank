import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  isAxiosError,
} from "axios";

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
        return this.handleResponseError(error);
      }
    );
  }

  private getErrorMessage(error: AxiosError): string {
    if (error.response) {
      return `Error: ${error.response.status} - ${JSON.stringify(
        error.response.data
      )}`;
    } else if (error.request) {
      return "No response received from server.";
    }

    return error.message;
  }

  private handleResponseError(error: AxiosError): never {
    const apiError = {
      message: this.getErrorMessage(error),
      status: error.response?.status,
      data: error.response?.data,
      code: error.code,
    };

    // Handle specific error codes
    if (apiError.status === 401) {
      // Unauthorized - clear auth data
      //   await authService.clearAuthData();
      // You might want to redirect to login here
    }

    throw apiError;
  }

  async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      const response = await this.retryRequest<T>(url, config);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const response = await this.client.post<AxiosResponse<T>>(
      url,
      data,
      config
    );
    return response.data;
  }

  private shouldRetry(error: AxiosError): boolean {
    if (error.response) {
      const status = error.response.status;
      return status >= 500 && status < 600;
    }
    return true;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
    // return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async retryRequest<T>(
    url: string,
    config?: AxiosRequestConfig,
    retriesLeft: number = this.maxRetries
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.get<T>(url, config);
    } catch (error) {
      if (retriesLeft > 0 && isAxiosError(error) && this.shouldRetry(error)) {
        await this.delay(1000 * (this.maxRetries - retriesLeft + 1));
        return this.retryRequest<T>(url, config, retriesLeft - 1);
      }
      throw error;
    }
  }
}

const apiClient = new ApiClient();
export default apiClient;
