export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors?: any[];
}

export const successResponse = <T>(
  data: T | null,
  message: string
): ApiResponse<T> => ({
  success: true,
  data,
  message,
});

export const errorResponse = (
  code: string,
  message: string,
  errors?: any[]
): ApiResponse<null> => ({
  success: false,
  data: null,
  message,
  errors,
});
