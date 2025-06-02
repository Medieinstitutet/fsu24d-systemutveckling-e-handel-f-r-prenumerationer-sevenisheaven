import { CountrySelect } from "./CountrySelect";

interface CustomerFormProps {
  user: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    phone: string;
    country: string;
    city: string;
    street_address: string;
   postal_code: string;
  };
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

export const CustomerForm = ({ user, setUser }: CustomerFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form>
      <h3>Login Details</h3>
      <input
        name="email"
        placeholder="E-mail"
        type="text"
        value={user.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        value={user.password}
        onChange={handleChange}
        required
      />
      <h3>Personal Information</h3>
      <input
        name="firstname"
        placeholder="Firstname"
        type="text"
        value={user.firstname}
        onChange={handleChange}
        required
      />
      <input
        name="lastname"
        placeholder="Lastname"
        type="text"
        value={user.lastname}
        onChange={handleChange}
        required
      />
      <input
        name="phone"
        placeholder="Phonenumber"
        type="text"
        value={user.phone}
        onChange={handleChange}
        required
      />
      <h3>Shipping Address</h3>
      <select
        name="country"
        value={user.country}
        onChange={handleChange}
        required
      >
        <CountrySelect />
      </select>
      <input
        name="city"
        placeholder="City"
        type="text"
        value={user.city}
        onChange={handleChange}
        required
      />
      <input
        name="street_address"
        placeholder="Address"
        type="text"
        value={user.street_address}
        onChange={handleChange}
        required
      />
      <input
        name="postal_code"
        placeholder="Postal Code"
        type="text"
        value={user.postal_code}
        onChange={handleChange}
        required
      />
    </form>
  );
};