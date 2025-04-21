import { useEffect, useState } from "react";

export const useUserProducts = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:4444/api/userProducts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        setData(result);
      } catch (e) {
        console.error("Ошибка:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { data, setData, isLoading, setIsLoading };
};
