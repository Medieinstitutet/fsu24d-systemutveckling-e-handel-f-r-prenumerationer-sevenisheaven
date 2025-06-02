import { useEffect, useState } from "react";
import { fetchSubscriptions } from "../services/subscriptionServices";
import { getFromLocalStorage } from "../utils/localStorage";
export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState(() => {
    const cachedSubscriptions = getFromLocalStorage("subscriptions");
    return cachedSubscriptions ? cachedSubscriptions : [];
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const cachedSubscriptions = getFromLocalStorage("subscriptions");
    if (cachedSubscriptions) {
      setSubscriptions(cachedSubscriptions);
      return;
    }
    getAllSubscriptionsHandler();
  }, []);

  const getAllSubscriptionsHandler = async () => {
    setLoading(true);
    try {
      const data = await fetchSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      setError("Error fetching subscription");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    getAllSubscriptionsHandler,
    subscriptions,
    loading,
    error,
  };
};
