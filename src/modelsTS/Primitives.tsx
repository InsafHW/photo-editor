import {Point} from "./Point"
import {SizeBox} from "./SizeBox"

type Rectangle = {
  topLeft: Point,
  size: SizeBox,
  type: 'rectangle',
  fillColor: string
}

type Triangle = {
  topLeft: Point,
  size: SizeBox,
  type: 'triangle' | 'area',
  fillColor: string
}

type Ellipse = {
  topLeft: Point,
  size: SizeBox,
  type: 'ellipse',
  fillColor: string
}

type Primitive = Rectangle | Triangle | Ellipse

export type {
  Primitive,
  Rectangle,
  Triangle,
  Ellipse
}