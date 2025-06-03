import { useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import { CreateProducts } from "../components/admin/CreateProducts";
import { DisplayAdminProduct } from "../components/admin/DisplayAdminProduct";


export const AdminProducts = () => {
  const {
    products,
    fetchAllProductsHandler,
    createProductHandler,
    updateProductHandler,
    deleteProductHandler,
  } = useProducts();

  useEffect(() => {
    fetchAllProductsHandler("", 1, 12);
  }, []);

  return (
    <>
      <div>
        <h2>Add New Product</h2>
        <CreateProducts onCreate={createProductHandler} />
      </div>
      <hr />
      <div>
        <h2>Products</h2>
        <section className="products-list">
          {products && products.length > 0 ? (
            products.map((p) => (
              <DisplayAdminProduct
                p={p}
                onUpdate={updateProductHandler}
                onDelete={deleteProductHandler}
              />
            ))
          ) : (
            <h2>No products found</h2>
          )}
        </section>
      </div>
    </>
  );
};
