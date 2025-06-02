export type Userd = {
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
  token: string;
};

export interface ICustomerCreate {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phone: string;
  country: string;
  city: string;
  street_address: string;
  postal_code: string;
  /* token: string; */
}

export interface ICustomerUpdate {
  firstname: string;
  lastname: string;
  phone: string;
  street_address: string;
  postal_code: string;
  city: string;
  country: string;
  token: string;
}
