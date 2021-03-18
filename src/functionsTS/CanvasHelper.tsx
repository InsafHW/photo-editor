import {SelObj} from "../modelsTS/SelObj"
import {Rectangle, Ellipse, Triangle, Primitive} from "../modelsTS/Primitives"
import { TextUI } from '../modelsTS/TextUI';

export function drawRectangle(object: Rectangle, ctx: CanvasRenderingContext2D | undefined | null): void {
  ctx?.fillRect(object.topLeft.x, object.topLeft.y, object.size.width, object.size.height);
}

export function drawEllipse(object: Ellipse, ctx: CanvasRenderingContext2D | undefined | null): void {
  let radiusX = object.size.width / 2;
  let radiusY = object.size.height / 2;
  let centerX = object.topLeft.x + radiusX;
  let centerY = object.topLeft.y + radiusY;
  ctx?.beginPath();
  ctx?.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx?.fill();
}

export function drawTriangle(object: Triangle, ctx: CanvasRenderingContext2D | undefined | null): void {
  ctx?.beginPath();
  ctx?.moveTo(object.topLeft.x, object.topLeft.y + object.size.height);
  ctx?.lineTo(object.topLeft.x + object.size.width / 2, object.topLeft.y);
  ctx?.lineTo(object.topLeft.x + object.size.width, object.topLeft.y + object.size.height);
  ctx?.lineTo(object.topLeft.x, object.topLeft.y + object.size.height);
  ctx?.fill();
}

export function drawText(object: TextUI, ctx: CanvasRenderingContext2D | undefined | null): void {
  if (!object.text || !ctx) return;
  let x = object.text.split('\n');
  for (let i = 0; i < x.length; i++) {
    ctx?.fillText(x[i], object.topLeft.x, object.topLeft.y + object.fontSize * (i + 1));
  }
}

export function redraw(ctx: CanvasRenderingContext2D |null | undefined, data: ImageData, width: number, height: number): void {
  ctx?.clearRect(0, 0, width, height);
  ctx?.putImageData(data, 0, 0);
}

export function drawPrimitive(ctx: CanvasRenderingContext2D |null | undefined, object: Primitive): void {
  if (!ctx) return;
  switch (object.type) {
    case SelObj.ellipse:
      drawEllipse(object as Ellipse, ctx);
      break;
    case SelObj.triangle:
      drawTriangle(object as Triangle, ctx);
      break;
    case SelObj.rectangle:
      drawRectangle(object as Rectangle, ctx);
      break;
    default:
      break;
  }
}