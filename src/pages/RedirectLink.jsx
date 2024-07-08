import { storeClicks } from "@/db/clicksApi";
import { getLongUrl } from "@/db/urlsApi";
import useFetch from "@/hooks/useFetch";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
  const { id } = useParams();

  const { data, isLoading, fn: getLongUrlFn } = useFetch(getLongUrl, id);
  const { isLoading: isStatsLoading, fn: statsFn } = useFetch(storeClicks, {
    id: data?.id,
    original_url: data?.original_url,
  });

  useEffect(() => {
    getLongUrlFn();
  }, []);

  useEffect(() => {
    if (!isLoading && data) {
      statsFn();
    }
  }, [isLoading, data]);

  if (isLoading || isStatsLoading) {
    return (
      <>
        <BarLoader width={"100%"} color="#37b7d7" />
        <br />
        Redirecting...
      </>
    );
  }

  return null;
};

export default RedirectLink;
