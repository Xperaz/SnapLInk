import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import banner from "@/assets/banner.jpeg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [originalUrl, setOriginalUrl] = useState();
  const navigate = useNavigate();

  const handleShortner = (e) => {
    e.preventDefault();
    if (originalUrl) navigate(`/auth?createNew=${originalUrl}`);
  };
  return (
    <div className="flex flex-col items-center">
      <h1 className="my-10 sm:my-10 text-3xl sm:text-6xl lg:text-7xl text-white text-center font-extrabold">
        The only URL Shortener <br /> you&rsquo;ll need 👇{" "}
      </h1>
      <form
        className="sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2"
        onSubmit={handleShortner}
      >
        <Input
          type="url"
          value={originalUrl}
          placeholder="Enter your long url here..."
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="h-full flex-1 py-4 px-4"
        />
        <Button type="submit" className="h-full" variant="destructive">
          Shorten!
        </Button>
      </form>
      <img src={banner} alt="SnapLink Banner" className="w-full my-11 mx-11" />

      <Accordion type="single" collapsible className="w-full md:px-11">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Home;
