import React, {useState} from 'react';
import { IoEllipseOutline, IoTriangleOutline, IoSquareOutline, IoColorFilterOutline, IoCutOutline } from "react-icons/io5"
import {SketchPicker} from "react-color"
import { BiText, BiSelection } from "react-icons/bi"
import { connect } from "react-redux";
import { Tool } from '../../modelsTS/Tool'
import * as actionTypes from "../../store/actions"
import classes from "./Toolbar.module.css"
import { Filter } from '../../modelsTS/Filter';
import ImportPhotoFromPC from './ImportPhotoFromPC/ImportPhotoFromPC';
import ImportFromWebcamera from "./ImportFromWebcamera/ImporFromWebcamera"
import ExportToPC from "./ExportToPC/ExportToPC"
import CreateNewHolst from "./CreateNewHolst/CreateNewHolst"

const Toolbar = (props: any) => {
  const [showFilters, setShowFilters] = useState(false);
  let trCls = null, crcCls = null, rectCls = null, textCls = null, areaCls = null, filterCls = null;
  switch (props.tool) {
    case Tool.triangle:
      trCls = classes.active;
      break;
    case Tool.rectangle:
      rectCls = classes.active;
      break;
    case Tool.ellipse:
      crcCls = classes.active;
      break;
    case Tool.text:
      textCls = classes.active;
      break;
    case Tool.area:
      areaCls = classes.active;
      break;
    case Tool.filter:
      filterCls = classes.active;
      break;
    default:
      break;
  }

  const applyFilterHandler = (color: Filter) => {
    props.applyFilter(color);
    props.changeTool(Tool.rectangle);
    setShowFilters(false);
  }

  return (
    <div className={classes.Wrapper}>
      <div className={classes.TopBar}>
        <CreateNewHolst />
        <ImportPhotoFromPC style={{marginTop: '20px'}}/>
        <ImportFromWebcamera />
        <ExportToPC />
      </div>
      <div className={classes.Toolbar}>
        <IoTriangleOutline 
            className={[classes.tool, trCls, classes.triangle].join(' ')} 
            size="2em" onClick={() => props.changeTool(Tool.triangle)} 
        />
        <IoEllipseOutline 
            className={[classes.tool, crcCls].join(' ')} 
            size="2em" 
            onClick={() => props.changeTool(Tool.ellipse)}
        />
        <IoSquareOutline 
            className={[classes.tool, rectCls].join(' ')} 
            size="2em" 
            onClick={() => props.changeTool(Tool.rectangle)}
        />
        <BiText 
            className={[classes.tool, textCls].join(' ')} 
            size="2em" 
            onClick={() => props.changeTool(Tool.text)}/>
        <IoColorFilterOutline 
            className={[classes.tool, filterCls].join(' ')} 
            size="2em" 
            onClick={() => {
              setShowFilters(!showFilters)
              props.changeTool(Tool.filter)
            }}
        />
        <IoCutOutline 
            className={classes.tool} 
            size="2em" 
            onClick={() => props.tool === 'area' ? props.deleteSelectedArea() : alert('Выделите область!')}
        />
        <BiSelection 
            className={[classes.tool, areaCls].join(' ')} 
            size="2em" 
            onClick={() => props.changeTool(Tool.area)}
        />
    </div>
    {showFilters ? (
      <div className={classes.FilterMenu}>
        <div className={[classes.Filter, classes.Grey].join(' ')} onClick={() => applyFilterHandler(Filter.grey)}></div>
        <div className={[classes.Filter, classes.Red].join(' ')} onClick={() => applyFilterHandler(Filter.red)}></div>
        <div className={[classes.Filter, classes.Green].join(' ')} onClick={() => applyFilterHandler(Filter.green)}></div>
        <div className={[classes.Filter, classes.Blue].join(' ')} onClick={() => applyFilterHandler(Filter.blue)}></div>
      </div>
    ) : null}
    {
      trCls || rectCls || crcCls || textCls ? (
        <div className={classes.FillColorMenu}>
          <SketchPicker color={props.fillColor} onChange={(color) => props.changeFillColor(color.hex)}/>
        </div>
      ) : null
    }
    {textCls ? (
      <div className={classes.textMenu}>
        <span>Размер текста...</span>
        <input type="number" min="1" max="150" value={props.fontSize} onChange={(e) => props.changeFontSize(+e.target.value)}/>
        <textarea placeholder="Введите текст..." value={props.text} onChange={(e) => props.changeText(e.target.value)}></textarea>
      </div>
    ) : null}
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    tool: state.editor.present.currentTool,
    fillColor: state.view.fillColor,
    text: state.view.text,
    fontSize: state.view.fontSize
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    changeTool: (newTool: any) => dispatch({type: actionTypes.CHANGE_CURRENT_TOOL, tool: newTool}),
    deleteSelectedArea: () => dispatch({type: actionTypes.DELETE_SELECTED_AREA}),
    changeText: (text: string) => dispatch({type: actionTypes.CHANGE_TEXT, value: text}),
    changeFillColor: (color: any) => dispatch({type: actionTypes.CHANGE_FILL_COLOR, value: color}),
    changeFontSize: (size: number) => dispatch({type: actionTypes.CHANGE_FONT_SIZE, value: size}),
    applyFilter: (color: Filter) => dispatch({type: actionTypes.APPLY_FILTER, color: color})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);