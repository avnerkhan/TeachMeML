import * as types from "../types/KNNTypes";

export function deleteLabelClass(classColor) {
  return {
    type: types.DELETE_LABEL_CLASS,
    classColor
  };
}

export function addLabelClass(classColor) {
  return {
    type: types.ADD_LABEL_CLASS,
    classColor
  };
}

export function changeLabelColor(newColor, index) {
  return {
    type: types.CHANGE_LABEL_COLOR,
    newColor,
    index
  };
}
