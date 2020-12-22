export function drawRectangle(object: any, ctx: CanvasRenderingContext2D | undefined | null): void {
  ctx?.fillRect(object.topLeft.x, object.topLeft.y, object.size.width, object.size.height);
}

export function drawEllipse(object: any, ctx: CanvasRenderingContext2D | undefined | null): void {
  let radiusX = object.size.width / 2;
  let radiusY = object.size.height / 2;
  let centerX = object.topLeft.x + radiusX;
  let centerY = object.topLeft.y + radiusY;
  ctx?.beginPath();
  ctx?.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx?.fill();
}

export function drawTriangle(object: any, ctx: CanvasRenderingContext2D | undefined | null): void {
  ctx?.beginPath();
  ctx?.moveTo(object.topLeft.x, object.topLeft.y + object.size.height);
  ctx?.lineTo(object.topLeft.x + object.size.width / 2, object.topLeft.y);
  ctx?.lineTo(object.topLeft.x + object.size.width, object.topLeft.y + object.size.height);
  ctx?.lineTo(object.topLeft.x, object.topLeft.y + object.size.height);
  ctx?.fill();
}