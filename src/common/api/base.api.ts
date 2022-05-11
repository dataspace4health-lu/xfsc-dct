import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { mock } from 'src/mocks/mocker';

export type BaseApiOptions = Omit<AxiosRequestConfig, 'baseURL'>;

export class BaseAPI {
    private readonly requester: AxiosInstance;

    constructor(baseURL: string, props?: BaseApiOptions) {
        this.requester = axios.create({
            baseURL,
            ...props,
        });

        mock(this.requester, baseURL);
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
