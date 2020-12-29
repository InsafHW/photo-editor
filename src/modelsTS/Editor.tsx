import {Rectangle, Triangle, Ellipse} from "./Primitives"
import { TextUI } from './TextUI'
import { ImageUI } from './ImagUI'
import {Filter} from "./Filter"
import {Tool} from "./Tool"

type Editor = {
  canvas: ImageData,
  selectedObject: Rectangle | Triangle | Ellipse | TextUI | ImageUI | null,
  filterColor: Filter | null,
  currentTool: Tool,
}

export type {
  Editor
}