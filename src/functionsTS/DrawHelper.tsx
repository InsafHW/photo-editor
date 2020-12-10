import { ImageUI } from '../modelsTS/ImagUI';
import { Ellipse, Rectangle, Triangle } from "../modelsTS/Primitives"
import { TextUI } from '../modelsTS/TextUI';

export function drawEllipse(ellipseObj: Ellipse, canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx)
    return;
  ctx.fillStyle = ellipseObj.fillColor;
  const center = {
    x: ellipseObj.topLeft.x + ellipseObj.size.width / 2,
    y: ellipseObj.topLeft.y + ellipseObj.size.height / 2
  };
  const radiusX = ellipseObj.size.width / 2;
  const radiusY = ellipseObj.size.height / 2;
  const rotation = 0;
  const startAngle = 0;
  const endAngle = Math.PI * 2;
  ctx.beginPath();
  ctx.ellipse(
    center.x,
    center.y,
    radiusX,
    radiusY,
    rotation,
    startAngle,
    endAngle
  );
  ctx.fill();
}

export function drawRectangle(rectangleObj: Rectangle, canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  ctx.fillStyle = rectangleObj.fillColor;
  const x = rectangleObj.topLeft.x;
  const y = rectangleObj.topLeft.y;
  const width = rectangleObj.size.width;
  const height = rectangleObj.size.height;
  ctx.fillRect(x, y, width, height);
}

export function drawTriangle(triangleObj: Triangle, canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx)
    return;
  ctx.fillStyle = triangleObj.fillColor;
  const a = {
    x: triangleObj.topLeft.x,
    y: triangleObj.topLeft.y + triangleObj.size.height
  };
  const b = {
    x: triangleObj.topLeft.x + triangleObj.size.width / 2,
    y: triangleObj.topLeft.y
  };
  const c = {
    x: triangleObj.topLeft.x + triangleObj.size.width,
    y: triangleObj.topLeft.y + triangleObj.size.height
  };
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.lineTo(c.x, c.y);
  ctx.lineTo(a.x, a.y);
  ctx.fill();
}

export function drawText(textObj: TextUI, canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx)
    return;
  ctx.font = `normal ${textObj.fontSize}px Open-sans, sans-serif`;
  ctx.fillStyle = textObj.fillColor;
  ctx.fillText(textObj.text, textObj.topLeft.x, textObj.topLeft.y);
}

export function drawImage(imageObj: ImageUI, canvas: HTMLCanvasElement): void {
  console.log('[EXPORTING]', imageObj)
  const ctx = canvas.getContext('2d');
  if (!ctx)
    return;
  const img = new Image();
  img.src = imageObj.src;
  img.onload = () => {
    ctx.drawImage(img, imageObj.topLeft.x, imageObj.topLeft.y, imageObj.size.width, imageObj.size.height);
  };
}