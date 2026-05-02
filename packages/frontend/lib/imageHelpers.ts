/** Bakes CSS rotation into the image bytes before upload. */
export function applyRotation(dataUrl: string, degrees: number): Promise<string> {
  return new Promise((resolve) => {
    if (degrees === 0) {
      resolve(dataUrl);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const swap = degrees === 90 || degrees === 270;
      const canvas = document.createElement("canvas");
      canvas.width = swap ? img.height : img.width;
      canvas.height = swap ? img.width : img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((degrees * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.src = dataUrl;
  });
}

/** Converts a base64 data URL to a Blob. */
export function dataUrlToBlob(dataUrl: string): Blob {
  const [, base64] = dataUrl.split(",");
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return new Blob([bytes], { type: "image/jpeg" });
}
