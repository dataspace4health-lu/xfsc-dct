import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { mock } from '../../mocks/mocker';

export type BaseGatewayOptions = Omit<AxiosRequestConfig, 'baseURL'>;

export class BaseGateway {
    private readonly requester: AxiosInstance;

    constructor(baseURL: string, props?: BaseGatewayOptions) {
        this.requester = axios.create({
            baseURL,
            ...props,
        });

        // mock(this.requester, baseURL);
    }

    protected handleError(error: any): Promise<boolean> {
        return Promise.resolve(false);
    }

    protected async request<T>(url: string, method: string, data?: any): Promise<T | null> {
        try {
            console.log(`🔵 Sending ${method} request to: ${this.requester.defaults.baseURL}${url}`);
    
            const response = await this.requester.request<T>({
                method,
                url,
                ...data,
            });
    
            console.log(`🟢 Full API Response:`, response);
            console.log(`🟢 Extracted Response Data:`, response.data);
    
            return response.data || null;  // Ensures we always return something
        } catch (error) {
            console.error(`❌ API Request Error:`, error.message);
    
            if (error.response) {
                console.error(`❌ API Error Status:`, error.response.status);
                console.error(`❌ API Error Data:`, error.response.data);
            }
    
            return null; // Prevents `undefined`
        }
    }
}
