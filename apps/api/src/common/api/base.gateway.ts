import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export type BaseGatewayOptions = Omit<AxiosRequestConfig, 'baseURL'>;

export class BaseGateway {
    private readonly requester: AxiosInstance;

    constructor(baseURL: string, props?: BaseGatewayOptions) {
        this.requester = axios.create({
            baseURL,
            ...props,
        });
    }

    protected handleError(error: any): Promise<boolean> {
        return Promise.resolve(false);
    }

    protected request<T>(url: string, method: string, access_token?: string, data?: any): Promise<T | void> {
        return this.requester
            .request<T>({
                method,
                url,
                headers: {
                    Authorization: access_token ? `Bearer ${access_token}` : null, // ??? try out if this works
                },
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
