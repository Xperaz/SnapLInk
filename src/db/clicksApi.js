import supabase from "./supabase";
import { UAParser } from "ua-parser-js";

export const getClicksForUrls = async (urlIds) => {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to load Clicks");
  }

  return data;
};

const parser = new UAParser("user-agent");

export const storeClicks = async ({ id, original_url }) => {
  try {
    const res = parser.getResult();
    const device = res.type || "desktop";

    const response = await fetch("https://ipapi.co/8.8.8.8/json");
    const { city, country_name: country } = await response.json();

    await supabase.from("clicks").insert({
      url_id: id,
      city: city,
      country: country,
      device: device,
    });

    window.location.href = original_url;
  } catch (error) {
    console.error("error recording clicks: ", error);
  }
};

export const getClicksForUrl = async (url_id) => {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to load stats.");
  }

  return data;
};
