export function downloadToPC(imgData: ImageData): void {
  const canvas = document.createElement('canvas');
  canvas.width = imgData.width;
  canvas.height = imgData.height
  const ctx = canvas.getContext('2d');
  if (ctx)
  ctx.putImageData(imgData, 0, 0);
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.href = canvas.toDataURL();
  a.download = 'image.png';
  a.click();
  document.body.removeChild(a);
}