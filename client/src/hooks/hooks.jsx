import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useErrors = async (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) fallback();
        else {
          toast.error(error?.data?.message || "Oops! Something went wrong");
        }
      }
    });
  }, [errors]);
};

const useSearchHandler = (searchAPI, setRows) => {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (props) => {
    if (!props) return;

    const toastId = toast.loading("Searching...");
    setIsSearching(true);

    setTimeout(async () => {
      try {
        const response = await searchAPI({
          ...props,
        });
        if (response?.data?.success) {
          setRows(response?.data?.message);
          toast.success(`${response?.data?.message?.length} Results found`, {
            id: toastId,
          });
        } else {
          toast.error(response?.data?.message || "No results found", {
            id: toastId,
          });
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.data?.message || "An error occurred", {
          id: toastId,
        });
      } finally {
        setIsSearching(false);
      }
    }, [2000]);
  };

  return { handleSearch, isSearching };
};

export { useErrors, useSearchHandler };
