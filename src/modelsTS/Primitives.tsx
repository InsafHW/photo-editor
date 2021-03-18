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
  type: 'triangle',
  fillColor: string
}

type Ellipse = {
  topLeft: Point,
  size: SizeBox,
  type: 'ellipse',
  fillColor: string
}

type Primitive = Rectangle | Triangle | Ellipse;

type Area = {
  topLeft: Point,
  size: SizeBox
}

export type {
  Rectangle,
  Triangle,
  Ellipse,
  Primitive,
  Area
}