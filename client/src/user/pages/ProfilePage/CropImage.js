// cropImage.js
export default function getCroppedImg(imageSrc, pixelCrop) {
  const canvas = document.createElement("canvas");
  const image = new Image();
  image.src = imageSrc;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const ctx = canvas.getContext("2d");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const croppedUrl = URL.createObjectURL(blob);
        resolve(croppedUrl);
      }, "image/jpeg");
    };

    image.onerror = (err) => reject(err);
  });
}
