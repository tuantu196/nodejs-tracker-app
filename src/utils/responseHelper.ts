export interface ApiResponse<T= any> {
    success: boolean;
    message: string;
    data?: T|null;
    error?: string| null;
}

export const createResponse = <T = any>({
    success = true,
    message = '',
    data = null,
    error = null,
}: Partial<ApiResponse<T>>) : ApiResponse<T>=> {
    return {
        success,
        message,
        data,
        error,
    }
}