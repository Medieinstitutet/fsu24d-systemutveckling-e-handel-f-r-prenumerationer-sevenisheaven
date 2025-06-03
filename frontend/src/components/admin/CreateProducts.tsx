import { FormEvent, useState } from "react";
import { IProductCreate } from "../../models/Products";

interface CreateProductsProps {
  onCreate: (e: FormEvent, payload: IProductCreate) => void | Promise<void>;
}

export const CreateProducts = ({ onCreate }: CreateProductsProps) => {
  const [addImg, setAddImg] = useState<Boolean>(false);
  const [payload, setPayload] = useState<IProductCreate>({
    product_name: "",
    description: "",
    stock:1,
    subscription_id: "",
    image: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await onCreate(e, payload);
    } finally {
      setPayload({
        product_name: "",
        description: "",
        stock:1,
        subscription_id: "",
        image: "",
      });
      setAddImg(false);
    }
  };

  return (
    <div className="fifty">
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Product Name"
          value={payload.product_name}
          maxLength={100}
          required
          onChange={(e) =>
            setPayload((prev) => ({ ...prev, product_name: e.target.value }))
          }
        />
        <input
          placeholder="Product Description"
          value={payload.description}
          onChange={(e) =>
            setPayload((prev) => ({ ...prev, description: e.target.value }))
          }
          required
        />
         <input
          type="number"
          maxLength={9999}
          min={0}
          placeholder="Stock"
          required
          onChange={(e) =>
            setPayload((prev) => ({ ...prev, stock: Number(e.target.value) }))
          }
        />
        <input
          placeholder="Product Description"
          value={payload.description}
          onChange={(e) =>
            setPayload((prev) => ({ ...prev, description: e.target.value }))
          }
          required
        />
        <select
          required
          value={payload.subscription_id}
          onChange={(e) =>
            setPayload((prev) => ({ ...prev, subscription_id: e.target.value }))
          }
        >
          <option value="" disabled>
            Subscription Level
          </option>
          <option value="68380950c659b1a48ce18927">Sock Emergency</option>
          <option value="68380992c659b1a48ce18928">Sock & Roll</option>
          <option value="683809b3c659b1a48ce18929">Sock Royalty</option>
        </select>
        <input
          placeholder="Product Image Link"
          value={payload.image}
          maxLength={200}
          required
          onChange={(e) => {
            setPayload((prev) => ({ ...prev, image: e.target.value }));
            setAddImg(true);
          }}
        />
        <button type="submit">Add New Product</button>
      </form>
      <div id="create-product-image-div">
        {addImg ? (
          <img
            id="create-product-image"
            src={payload.image}
            alt="product image"
          />
        ) : (
          <h4>
            <i>Image will appear here</i>
          </h4>
        )}
      </div>
    </div>
  );
};
