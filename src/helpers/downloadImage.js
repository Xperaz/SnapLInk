export const downloadImage = (url, title) => {
  const imageUrl = url;
  const fileName = title;

  const anchor = document.createElement("a");
  anchor.href = imageUrl;
  anchor.download = fileName;

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};
