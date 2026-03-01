export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<{message: string}>;
  onGoToRegister: () => void;
};

export interface RegisterFormProps {
  onSubmit: (
    email: string,
    password: string,
  ) => Promise<{email: string}>;
  onGoToLogin: () => void;
  loading?: boolean;
}

export interface GlobalModalProps {
  isVisible: boolean;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};