/* eslint-disable @typescript-eslint/no-unused-vars */
import {Primitive} from "./Primitives"
import { TextUI } from './TextUI'
import { ImageUI } from './ImagUI'
import {Filter} from "./Filter"

export enum Tool {
  rectangle = 'rectangle',
  triangle = 'triangle',
  ellipse = 'ellipse',
  text = 'text',
  area = 'area'
}

type Editor = {
  canvas: ImageData,
  selectedObject: Primitive | TextUI | ImageUI | null,
  filterColor: Filter | null,
  currentTool: Tool,
  currentId: number
}

export type {
  Editor
}