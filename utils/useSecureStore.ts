import * as SecureStore from "expo-secure-store";
import { useEffect, useState, useCallback } from "react";

export function useSecureStore<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  // Load value on mount
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(key);

        if (!isMounted) return;

        if (stored !== null) {
          setValue(JSON.parse(stored));
        } else {
          await SecureStore.setItemAsync(
            key,
            JSON.stringify(initialValue)
          );
          setValue(initialValue);
        }
      } catch (error) {
        console.error("SecureStore error:", error);
        setValue(initialValue);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [key]);

  // Update value
  const setStoredValue = useCallback(
    async (newValue: T) => {
      try {
        await SecureStore.setItemAsync(
          key,
          JSON.stringify(newValue)
        );
        setValue(newValue);
      } catch (error) {
        console.error("SecureStore set error:", error);
      }
    },
    [key]
  );

  // Remove value
  const removeStoredValue = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(key);
      setValue(null);
    } catch (error) {
      console.error("SecureStore delete error:", error);
    }
  }, [key]);

  return {
    value,
    setValue: setStoredValue,
    removeValue: removeStoredValue,
    loading,
  };
}
