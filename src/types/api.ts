export interface ApiValidationErrorDetails {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
}

export interface ApiErrorResponse {
  error: string;
  details?: ApiValidationErrorDetails;
}
