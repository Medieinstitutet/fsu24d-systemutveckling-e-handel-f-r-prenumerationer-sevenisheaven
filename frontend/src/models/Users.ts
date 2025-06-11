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
  stripe_subscription_id: string | null;
  subscription_status: string;
  subscription_ends_at: string | null;
  retry_payment_url: string | null;
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
}

export interface IUserUpdate {
  firstname?: string;
  lastname?: string;
  phone?: string;
  street_address?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  token?: string;
  subscription_id?: string;
}
