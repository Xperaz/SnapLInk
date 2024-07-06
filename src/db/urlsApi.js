import supabase from "./supabase";

export const getUrls = async (user_id) => {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to load URLs");
  }

  return data;
};

export const createUrl = async (
  { title, longUrl, customUrl, user_id },
  qrcode
) => {
  const shortUrl = Math.random().toString(36).substring(2, 6);
  const fileName = `qr-${shortUrl}`;

  const { error: storageError } = await supabase.storage
    .from("qrs")
    .upload(fileName, qrcode);

  const qr = `${
    import.meta.env.VITE_SUPABASE_URL
  }/storage/v1/object/public/qrs/${fileName}`;

  if (storageError) throw new Error(storageError.message);

  const { data, error } = await supabase
    .from("urls")
    .insert([
      {
        title,
        original_url: longUrl,
        custom_url: customUrl,
        user_id,
        short_url: shortUrl,
        qr,
      },
    ])
    .select();

  if (error) {
    console.error(error.message);
    throw new Error("Unable to create short URL please try again later");
  }

  return data;
};

export const deleteUrl = async (id) => {
  const { data, error } = await supabase.from("urls").delete().eq("id", id);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to delete this URL please try again later");
  }

  return data;
};
