import * as types from "../types/DTreeTypes";
import { List } from "immutable";

export function addFeature(
  feature,
  classes = List(["Sample"]),
  continousClasses = List([false, 0, 100])
) {
  return {
    type: types.ADD_FEATURE,
    feature,
    classes,
    continousClasses
  };
}

export function deleteFeature(feature) {
  return {
    type: types.DELETE_FEATURE,
    feature
  };
}

export function addFeatureClass(feature, modify) {
  return {
    type: types.ADD_FEATURE_CLASS,
    feature,
    modify
  };
}

export function deleteFeatureClass(feature, modify) {
  return {
    type: types.DELETE_FEATURE_CLASS,
    feature,
    modify
  };
}

export function deleteLabelClass(className) {
  return {
    type: types.DELETE_LABEL_CLASS,
    className
  };
}

export function addLabelClass(className) {
  return {
    type: types.ADD_LABEL_CLASS,
    className
  };
}

export function changeLabelName(newName) {
  return {
    type: types.CHANGE_LABEL_NAME,
    newName
  };
}

export function editFeatureName(oldName, newName) {
  return {
    type: types.EDIT_FEATURE_NAME,
    oldName,
    newName
  };
}

export function setContinousAttributeRange(feature, bottomRange, topRange) {
  return {
    type: types.SET_CONTINOUS_ATTRIBUTE_RANGE,
    feature,
    bottomRange,
    topRange
  };
}

export function toggleContinousAttribute(feature) {
  return {
    type: types.TOGGLE_CONTINOUS_ATTRIBUTE,
    feature
  };
}

export function clearAllAttributes() {
  return {
    type: types.CLEAR_ALL_ATTRIBUTES
  };
}
