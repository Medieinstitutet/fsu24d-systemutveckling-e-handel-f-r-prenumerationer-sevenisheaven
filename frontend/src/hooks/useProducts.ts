import { FormEvent, useEffect, useState } from "react";
import { IProductCreate, IProductUpdate, Product } from "../models/Products";
import {
  createProduct,
  deleteProduct,
  fetchAllProducts,
  fetchProduct,
  updateProduct,
} from "../services/productServices";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const cachedProducts = getFromLocalStorage("products");
    return cachedProducts ? cachedProducts : [];
  });
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const cachedProducts = getFromLocalStorage("products");
    if (cachedProducts) {
      setProducts(cachedProducts);
      return;
    }
    fetchAllProductsHandler("", "", 1, 12);
  }, []);

  const fetchAllProductsHandler = async (
    searchName: string,
    category: string,
    page: number,
    limit: number
  ) => {
    setLoading(true);
    try {
      const data = await fetchAllProducts(searchName, category, page, limit);
      saveToLocalStorage("products", data.products);
      setProducts(data.products);
    } catch (error) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductByIdHandler = async (id: string) => {
    setLoading(true);
    try {
      const data = await fetchProduct(id);
      setProduct(data);
    } catch (error) {
      setError("Error fetching product");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createProductHandler = async (
    e: FormEvent,
    payload: IProductCreate
  ) => {
    e.preventDefault();
    setLoading(true);
    try {
      const createdProduct = await createProduct(payload);
      const updatedList = [...products, createdProduct];
      setProducts(updatedList);
      saveToLocalStorage("products", updatedList);
      await fetchAllProductsHandler("", "", 1, 100);
    } catch (error: unknown) {
      setError("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const updateProductHandler = async (
    e: FormEvent,
    id: string,
    productUpdate: IProductUpdate
  ) => {
    if (!productUpdate) return;
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await updateProduct(id, productUpdate);
      const updatedList = products.map((p) => (p._id === id ? updated : p));
      setProducts(updatedList);
      saveToLocalStorage("products", updatedList);
      await fetchAllProductsHandler("", "", 1, 100);
    } catch (error) {
      setError("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const deleteProductHandler = async (e: FormEvent, id: string) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteProduct(id);
      const updatedList = products.filter((product) => product._id !== id);
      setProducts(updatedList);
      saveToLocalStorage("products", updatedList);
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  return {
    createProductHandler,
    deleteProductHandler,
    updateProductHandler,
    fetchProductByIdHandler,
    fetchAllProductsHandler,
    products,
    product,
    loading,
    error,
  };
};
