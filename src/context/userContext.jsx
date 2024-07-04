import { createContext, useEffect, useContext } from "react";
import useFetch from "@/hooks/useFetch";
import { getCurrentUser } from "@/db/userApi";

const userContext = createContext();

// eslint-disable-next-line react/prop-types
const UserProvider = ({ children }) => {
  const { data: user, isLoading, fn: fetchUser } = useFetch(getCurrentUser);

  const isAuthenticated = user?.role === "authenticated";

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <userContext.Provider
      value={{ user, fetchUser, isLoading, isAuthenticated }}
    >
      {children}
    </userContext.Provider>
  );
};

export const UserState = () => {
  return useContext(userContext);
};

export default UserProvider;
