import { Point } from './Point';
import { SizeBox } from './SizeBox';

type ImageUI = {
  topLeft: Point,
  size: SizeBox,
  src: string,
  type: 'image'
}

export type {
  ImageUI
}