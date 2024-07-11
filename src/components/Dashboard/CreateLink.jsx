import { UserState } from "@/context/userContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Error from "../Shared/Error";
import { Card } from "../ui/card";
import { useEffect, useRef, useState } from "react";
import { object, string } from "yup";
import { QRCode } from "react-qrcode-logo";
import useFetch from "@/hooks/useFetch";
import { createUrl } from "@/db/urlsApi";
import { BeatLoader } from "react-spinners";

const CreateLink = () => {
  const { user } = UserState();
  const ref = useRef();
  const navigate = useNavigate();
  let [searchParam, setSearchParam] = useSearchParams();
  const longUrl = searchParam.get("createNew");
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longUrl ? longUrl : "",
    customUrl: "",
  });

  const schema = object().shape({
    title: string().required("Title is Required"),
    longUrl: string().url("Must be a valid URL").required("URL Required"),
    customUrl: string(),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const {
    isLoading,
    error,
    data,
    fn: createUrlFn,
  } = useFetch(createUrl, { ...formValues, user_id: user?.id });

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0].id}`);
    }
  }, [error, data]);

  const createNewLink = async () => {
    setErrors([]);
    try {
      await schema.validate(formValues, { abortEarly: false });
      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));

      await createUrlFn(blob);
    } catch (errs) {
      const newErrors = {};

      errs?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <Dialog
      defaultOpen={longUrl}
      onOpenChange={(res) => {
        if (!res) {
          setSearchParam({});
        }
        setFormValues({
          longUrl: "",
        });
      }}
    >
      <DialogTrigger>
        <Button variant="destructive">Create Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">
            Create New Link
          </DialogTitle>
        </DialogHeader>
        {formValues?.longUrl && (
          <QRCode value={formValues?.longUrl} size={250} ref={ref} />
        )}
        <Input
          id="title"
          placeholder="Short Link's Title"
          value={formValues.title}
          onChange={handleChange}
        />
        {errors.title && <Error message={errors.title} />}

        <Input
          id="longUrl"
          placeholder="Enter your Long URL"
          value={formValues.longUrl}
          onChange={handleChange}
        />
        {errors.longUrl && <Error message={errors.longUrl} />}

        <div className="flex items-center gap-2">
          <Card className="p-2">{import.meta.env.VITE_SHORTER_URL_BASE}</Card> /
          <Input
            id="customUrl"
            placeholder="Enter your Custom URL (Optional)"
            value={formValues.customUrl}
            onChange={handleChange}
          />
        </div>
        {error && <Error message={error.message} />}
        <DialogFooter className="flex sm:justify-start">
          <Button
            disable={!isLoading}
            onClick={createNewLink}
            variant="destructive"
          >
            {isLoading ? <BeatLoader size={10} color="#37b7d7" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;
