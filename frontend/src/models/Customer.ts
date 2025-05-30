export type Customer = {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  street_address: string;
  postal_code: string;
  city: string;
  country: string;
};

export interface ICustomerCreate {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  street_address: string;
  postal_code: string;
  city: string;
  country: string;
}

export interface ICustomerUpdate {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  street_address: string;
  postal_code: string;
  city: string;
  country: string;
}
