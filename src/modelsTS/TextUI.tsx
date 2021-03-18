import {Point} from "./Point"
import { SizeBox } from './SizeBox'

type TextUI = {
  topLeft: Point,
  size: SizeBox,
  fillColor: string,
  fontSize: number,
  text: string,
  type: 'text'
}

export type {
  TextUI
}