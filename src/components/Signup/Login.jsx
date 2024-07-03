import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { BeatLoader } from "react-spinners";
import Error from "../Shared/Error";
import { useState } from "react";
import { object, string } from "yup";

const Login = () => {
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setErrors([]);
    try {
      const schema = object({
        email: string().email("Invalid Email").required("Email Required"),
        password: string()
          .min(6, "Password must be at least 6 characters")
          .required(),
      });

      await schema.validate(formData, { abortEarly: false });

      // Api call
    } catch (error) {
      const newErrors = {};

      error?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  const isLoading = true;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
        <Error message="Something went wrong" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <Input
            name="email"
            type="email"
            value={formData.email}
            placeholder="Enter Your Email"
            onChange={handleInputChange}
          />
          {errors.email && <Error message={errors.email} />}
        </div>

        <div>
          <Input
            name="password"
            type="password"
            value={formData.password}
            placeholder="Enter Your Password"
            onChange={handleInputChange}
          />
          {errors.password && <Error message={errors.password} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogin}>
          {isLoading ? <BeatLoader size={10} color="#36d7b7" /> : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;
