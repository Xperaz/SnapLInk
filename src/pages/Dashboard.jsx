import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import Error from "@/components/Shared/Error";
import { UserState } from "@/context/userContext";
import useFetch from "@/hooks/useFetch";
import { getUrls } from "@/db/urlsApi";
import { getClicksForUrls } from "@/db/clicksApi";
import LinkCard from "@/components/Dashboard/LinkCard";
import CreateLink from "@/components/Dashboard/CreateLink";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = UserState();
  const {
    isLoading,
    error,
    data: urls,
    fn: urlsFn,
  } = useFetch(getUrls, user?.id);
  const {
    isLoading: isLoadingClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(
    getClicksForUrls,
    urls?.map((url) => url.id)
  );

  useEffect(() => {
    urlsFn();
  }, []);

  useEffect(() => {
    if (urls?.length) {
      fnClicks();
    }
  }, [urls?.length]);

  const filteredUrls = urls?.filter((url) =>
    url.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      {(isLoading || isLoadingClicks) && (
        <BarLoader width={"100%"} color="#37b7d7" />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks?.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <h1 className="text-4xl font-extrabold">My links</h1>
        <CreateLink />
      </div>

      <div className="relative">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className="absolute top-2 right-2" />
      </div>

      {error && <Error message={error.message} />}

      {(filteredUrls || []).map((url, i) => (
        <LinkCard key={url.id + i} url={url} fetchUrls={urlsFn}>
          {url.title}
        </LinkCard>
      ))}
    </div>
  );
};

export default Dashboard;
