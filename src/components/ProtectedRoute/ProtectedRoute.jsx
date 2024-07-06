import { UserState } from "@/context/userContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = UserState();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) return <BarLoader width={"100%"} color="#36d7b7" />;
  if (isAuthenticated) return children;
};

export default ProtectedRoute;
