import * as types from "../types/KNNTypes";

export function deleteLabelColor(classColor) {
  return {
    type: types.DELETE_LABEL_COLOR,
    classColor
  };
}

export function addLabelColor(classColor) {
  return {
    type: types.ADD_LABEL_COLOR,
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
