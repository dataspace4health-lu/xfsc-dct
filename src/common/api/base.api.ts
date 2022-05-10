import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { mock } from 'src/mocks/mocker';

export interface BaseApiOptions extends Omit<AxiosRequestConfig, 'baseURL'> {}

export class BaseAPI {
    private requester: AxiosInstance;

    constructor(endpoint: string, props?: BaseApiOptions) {
        this.requester = axios.create({
            baseURL: endpoint,
            ...props,
        });
        mock(this.requester, endpoint);
    }

    protected handleError(error: any): Promise<boolean> {
        return Promise.resolve(false);
    }

    protected request<T>(url: string, method: string, data?: any): Promise<T | void> {
        return this.requester
            .request<T>({
                method,
                url,
                data,
            })
            .then((response) => response.data)
            .catch((error) => {
                if (!this.handleError(error.toJSON())) {
                    throw error;
                }
            });
    }
}
