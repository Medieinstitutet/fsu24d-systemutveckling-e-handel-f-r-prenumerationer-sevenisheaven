import { FormEvent, useState } from "react";
import { IProductUpdate, Product } from "../../models/Products";
import { Star } from "lucide-react";

interface IDisplayAdminProductProps {
  p: Product;
  onUpdate: (e: FormEvent, id: string, updated: IProductUpdate) => void;
  onDelete: (e: FormEvent, id: string) => void;
}

export const DisplayAdminProduct = ({
  p,
  onUpdate,
  onDelete,
}: IDisplayAdminProductProps) => {
  const [toUpdate, setToUpdate] = useState(false);
  const [payload, setPayload] = useState<IProductUpdate>({
    ...p,
    subscription_id: {
      _id: p.subscription_id?._id || "",
      level_name: p.subscription_id?.level_name || "",
      tier: p.subscription_id?.tier || 0,
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (JSON.stringify(payload) === JSON.stringify(p)) {
      setToUpdate(false);
      return;
    }
    onUpdate(e, p._id, payload);
    setToUpdate(false);
  };

  const levelName = p.subscription_id?.level_name;

  const getStarColor = (level?: string) => {
    switch (level) {
      case "Sock Emergency":
        return "#CD7F32";
      case "Sock & Roll":
        return "#C0C0C0";
      case "Sock Royalty":
        return "#FFD700";
      default:
        return "#cccccc"; // fallback
    }
  };

  return (
    <article className="product-article-admin" key={p._id}>
      <Star className="star" fill={getStarColor(levelName)} />
      <img src={p.image} />
      <form onSubmit={handleSubmit}>
        <input disabled value={`Id: ${p._id}`} />
        {!toUpdate ? (
          <>
            <input disabled value={`Image: ${p.image}`} />
            <input disabled value={`Name: ${p.product_name}`} />
            <input disabled value={`Desc: ${p.description}`} />
             <input disabled value={`Stock: ${p.stock} `}
              />
            <input
              disabled
              value={`Level: ${p.subscription_id?.level_name ?? "Unknown"}`}
            />
            <div>
              <button
                style={{ color: "orange" }}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setToUpdate(true);
                }}
              >
                Update
              </button>
              <button
                style={{ color: "red" }}
                type="button"
                onClick={(e) => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this product?"
                    )
                  ) {
                    onDelete(e, p._id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              name="image"
              value={payload.image}
              maxLength={200}
              onChange={(e) =>
                setPayload((prev) => ({
                  ...prev,
                  image: e.target.value,
                }))
              }
            />
            <input
              name="product_name"
              value={payload.product_name}
              maxLength={100}
              onChange={(e) =>
                setPayload((prev) => ({
                  ...prev,
                  product_name: e.target.value,
                }))
              }
            />
            <input
              name="description"
              value={payload.description}
              onChange={(e) =>
                setPayload((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              />
              <input
                name="stock"
                type="number"
                className="input-small"
                value={payload.stock}
                max={9999}
                min={0}
                onChange={(e) =>
                  setPayload((prev) => ({
                    ...prev,
                    stock: Number(e.target.value),
                  }))
                }
              />
            <select
              required
              value={payload.subscription_id._id}
              onChange={(e) =>
                setPayload((prev) => ({
                  ...prev,
                  subscription_id: {
                    ...prev.subscription_id,
                    _id: e.target.value,
                  },
                }))
              }
            >
              <option value="" disabled>
                Subscription Level
              </option>
              <option value="68380950c659b1a48ce18927">Sock Emergency</option>
              <option value="68380992c659b1a48ce18928">Sock & Roll</option>
              <option value="683809b3c659b1a48ce18929">Sock Royalty</option>
            </select>
            <div className="to-cart">
              <button style={{ color: "green" }} type="submit">
                Save
              </button>
              <button type="button" onClick={() => setToUpdate(false)}>
                Cancel
              </button>
            </div>
          </>
        )}
      </form>
    </article>
  );
};