import { UserState } from "@/context/userContext";
import { getClicksForUrl } from "@/db/clicksApi";
import { getUrl } from "@/db/urlsApi";
import useFetch from "@/hooks/useFetch";
import { LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Copy, Download, Trash } from "lucide-react";
import { BeatLoader } from "react-spinners";
import { deleteUrl } from "@/db/urlsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Location from "@/components/Link/Location";
import DeviceStats from "@/components/Link/DeviceStats";
import { downloadImage } from "@/helpers/downloadImage";

const Link = () => {
  const { id } = useParams();
  const { user } = UserState();
  const navigate = useNavigate();
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (isLinkCopied) {
      timeoutId = setTimeout(() => {
        setIsLinkCopied(false);
      }, 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [isLinkCopied]);

  const {
    data: urlData,
    error,
    isLoading,
    fn: getUrlFn,
  } = useFetch(getUrl, {
    id,
    user_id: user?.id,
  });

  const {
    data: urlClicks,
    isLoading: isUrlClicksLoading,
    fn: getUrlClicksFn,
  } = useFetch(getClicksForUrl, id);

  useEffect(() => {
    getUrlFn();
    getUrlClicksFn();

    if (error) {
      navigate("/dashboard");
    }
  }, []);

  const { isLoading: isLoadingDelete, fn: deleteUrlFn } = useFetch(
    deleteUrl,
    urlData?.id
  );

  let link = "";
  if (urlData) {
    link = urlData?.custom_url ? urlData?.custom_url : urlData?.short_url;
  }
  return (
    <>
      {(isLoading || isUrlClicksLoading) && (
        <BarLoader className="mb-4" width={"100%"} color="#36b7d7" />
      )}

      <div className="flex flex-col sm:flex-row gap-8 justify-between">
        <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5 flex-wrap">
          <span className="text-6xl font-extrabold hover:underline cursor-pointer">
            {urlData?.title}
          </span>
          <a
            className="text-2xl xl:text-4xl text-blue-400 font-bold hover:underline cursor-pointer w-full truncate"
            href={`${import.meta.env.VITE_SHORTER_URL_BASE}${link}`}
            target="_blank"
          >{`${import.meta.env.VITE_SHORTER_URL_BASE}${link}`}</a>

          <a
            className="flex items-center gap-1 hover:underline cursor-pointer w-full overflow-hidden"
            href={urlData?.original_url}
            target="_blank"
          >
            <LinkIcon className="p-1" />
            {urlData?.original_url}
          </a>
          <span className="flex items-end font-extralight text-sm">
            {new Date(urlData?.created_at).toLocaleString()}
          </span>

          <div className="flex gap-2 relative">
            {isLinkCopied && (
              <p className="text-green-400 absolute -top-8">Copied!</p>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                try {
                  navigator.clipboard.writeText(
                    `${import.meta.env.VITE_SHORTER_URL_BASE}${
                      urlData?.short_url
                    }`
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
              onClick={() => downloadImage(urlData?.qr, urlData?.title)}
            >
              <Download />
            </Button>
            <Button variant="ghost" onClick={() => deleteUrlFn()}>
              {isLoadingDelete ? (
                <BeatLoader size={5} color="#fff" />
              ) : (
                <Trash />
              )}
            </Button>
          </div>
          <img
            src={urlData?.qr}
            alt="qr code image"
            className="w-full self-center sm:self-start p-1 object-contain ring ring-blue-500"
          />
        </div>

        <Card className="w-2/5">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold">Stats</CardTitle>
          </CardHeader>

          {urlClicks && urlClicks?.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{urlClicks?.length}</p>
                </CardContent>
              </Card>

              <CardTitle>Location Data</CardTitle>
              <Location stats={urlClicks} />
              <CardTitle>Device Info</CardTitle>
              <DeviceStats stats={urlClicks} />
            </CardContent>
          ) : (
            <CardContent>
              {isUrlClicksLoading ? "Loading Statistics" : "Not Statistics Yet"}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default Link;
