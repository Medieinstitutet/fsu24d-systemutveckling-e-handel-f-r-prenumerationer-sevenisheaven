export type Users = {
  _id: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phone: string;
  country: string;
  city: string;
  street_address: string;
  postal_code: string;
  subscription_id: {
    _id: string;
    level_name: string;
    tier: number;
  } | null;
  token: string;
};

export interface IUserCreate {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phone: string;
  country: string;
  city: string;
  street_address: string;
  postal_code: string;
  subscription_id: string;
}

export interface IUserUpdate {
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  country: string;
  city: string;
  street_address: string;
  postal_code: string;
  subscription_id: string | null;
}
