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
import { useEffect, useState } from "react";
import { mixed, object, string } from "yup";
import useFetch from "@/hooks/useFetch";
import { signup } from "@/db/apiAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserState } from "@/context/userContext";

const Signup = () => {
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });

  const { data, isLoading, error, fn: signupFn } = useFetch(signup, formData);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const { fetchUser } = UserState();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    // console.log(files[0]);
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSignup = async () => {
    setErrors([]);
    try {
      const schema = object({
        name: string().required("Name is Required"),
        email: string().email("Invalid Email").required("Email is Required"),
        password: string()
          .min(6, "Password must be at least 6 characters")
          .required(),
        profile_pic: mixed().required("File is required"),
      });

      await schema.validate(formData, { abortEarly: false });

      await signupFn();
    } catch (error) {
      const newErrors = {};

      error?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  useEffect(() => {
    if (data && !error) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      fetchUser();
    }
  }, [isLoading, error, data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>
          Create new account if you haven&apos;t already
        </CardDescription>
        {error && <Error message={error} />}
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <Input
            name="name"
            type="name"
            value={formData.name}
            placeholder="Enter your name"
            onChange={handleInputChange}
          />
          {errors.name && <Error message={errors.name} />}
        </div>

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

        <div>
          <Input
            name="profile_pic"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
          />
          {errors.profile_pic && <Error message={errors.profile_pic} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSignup}>
          {isLoading ? (
            <BeatLoader size={10} color="#36d7b7" />
          ) : (
            "Create an Account"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Signup;
