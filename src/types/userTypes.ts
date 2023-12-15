export interface userRegisterType {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface userSignInType {
  email: string;
  password: string;
}

export interface userType {
  name: string;
  id: number;
  iat: number;
  exp: number;
}
