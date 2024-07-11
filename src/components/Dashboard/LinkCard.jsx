import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Copy, Download, Trash } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { deleteUrl } from "@/db/urlsApi";
import { BeatLoader } from "react-spinners";
import { downloadImage } from "@/helpers/downloadImage";
import { useEffect, useState } from "react";

/* eslint-disable react/prop-types */
const LinkCard = ({ url, fetchUrls }) => {
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const { isLoading: isLoadingDelete, fn: deleteUrlFn } = useFetch(
    deleteUrl,
    url?.id
  );

  useEffect(() => {
    let timeoutId;
    if (isLinkCopied) {
      timeoutId = setTimeout(() => {
        setIsLinkCopied(false);
      }, 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [isLinkCopied]);

  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
      <img
        src={url?.qr}
        alt="qr code image"
        className="h-32 w-32 ring ring-blue-500 self-center"
      />

      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1 truncate">
        <span className="text-3xl font-extrabold hover:underline cursor-pointer truncate ">
          {url?.title}
        </span>
        <span className="text-2xl text-blue-400 font-bold hover:underline cursor-pointer truncate">
          {import.meta.env.VITE_SHORTER_URL_BASE}
          {url?.custom_url ? url?.custom_url : url?.short_url}
        </span>
        <span className="flex items-center gap-1 hover:underline cursor-pointer truncate">
          {url?.original_url}
        </span>
        <span className="flex items-end font-extrabold text-sm flex-1">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>

      <div className="flex gap-2">
        {isLinkCopied && <p className="text-green-400 mb-4">Copied!</p>}
        <Button
          variant="ghost"
          onClick={() => {
            try {
              navigator.clipboard.writeText(
                `${import.meta.env.VITE_SHORTER_URL_BASE}${url?.short_url}`
              );
              setIsLinkCopied(true);
            } catch (error) {
              console.error("unable to copy the link: ", error);
            }
          }}
        >
          <Copy />
        </Button>
        <Button
          variant="ghost"
          onClick={() => downloadImage(url?.qr, url?.title)}
        >
          <Download />
        </Button>
        <Button
          variant="ghost"
          onClick={() => deleteUrlFn().then(() => fetchUrls())}
        >
          {isLoadingDelete ? <BeatLoader size={5} color="#fff" /> : <Trash />}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
