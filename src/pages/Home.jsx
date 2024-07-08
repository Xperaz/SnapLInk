import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import banner from "@/assets/banner.png";
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
      <img src={banner} alt="SnapLink Banner" className="w-5/6 my-11 mx-11" />

      <Accordion type="single" collapsible className="w-full md:px-11">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is SnapLink ?</AccordionTrigger>
          <AccordionContent>
            A URL shortener is a tool that takes a long URL and converts it into
            a shorter, more manageable link that redirects to the original URL.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>How does SnapLink work?</AccordionTrigger>
          <AccordionContent>
            When you enter a long URL into a URL shortener, it generates a
            unique short URL. When someone clicks on the short URL, they are
            redirected to the original long URL.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Can I customize the short URL?</AccordionTrigger>
          <AccordionContent>
            Some URL shorteners allow you to customize the short URL to make it
            more meaningful and easier to remember.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>Why should I use SnapLink?</AccordionTrigger>
          <AccordionContent>
            Short URLs are easier to share, especially on social media platforms
            with character limits. They also look cleaner and can help with
            tracking click-through rates and other analytics.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Home;
