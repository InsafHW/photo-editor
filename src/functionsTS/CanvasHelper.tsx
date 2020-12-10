import { Editor } from '../modelsTS/Editor';

export function clearCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (ctx)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function redrawCanvas(Editor: Editor, canvas: HTMLCanvasElement) {
  clearCanvas(canvas);
  const ctx = canvas.getContext('2d');
  if (ctx)
    ctx.putImageData(Editor.canvas, 0, 0);
}