export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  message?: string;
  username?: string;
  role?: string;
}