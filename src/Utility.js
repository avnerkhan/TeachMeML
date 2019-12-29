/*
  Utility functions used throughout the application
*/

import React from "react";
import {
  Popover,
  OverlayTrigger,
  Image,
  Nav,
  Navbar,
  Tooltip
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Back from "./Images/back.png";
import Icon from "./Images/icon.png";
import { MarkSeries } from "react-vis";

// Euclidean distance function that returns orginal point and distance
export function euclidFunction(pointOne, pointTwo) {
  let xDistance = pointOne.x - pointTwo.x;
  let yDistance = pointOne.y - pointTwo.y;
  xDistance *= xDistance;
  yDistance *= yDistance;
  const totalDistance = Math.sqrt(xDistance + yDistance);
  return { orginalPoint: pointOne, distance: totalDistance };
}

// Generates random underterimend data and adds them to the plot
export function generateRandomUndetermined(length = 20, max = 100) {
  let toReturn = [];
  for (let i = 0; i < length; i++) {
    const randomX = Math.floor(Math.random() * max);
    const randomY = Math.floor(Math.random() * max);
    toReturn.push({ x: randomX, y: randomY });
  }
  return toReturn;
}

// Comparator function for KNN and Clustering
export function comparator(entryOne, entryTwo) {
  if (entryOne.distance < entryTwo.distance) {
    return -1;
  }
  if (entryOne.distance > entryTwo.distance) {
    return 1;
  }

  return 0;
}

// Just returns an array of ints from lowerBound to upperBound
export function arrayRange(lowerBound, upperBound) {
  return Array.from(new Array(upperBound), (x, i) => i + lowerBound);
}

// Content for info button
function showInformationSlide(title, text) {
  return (
    <Popover id="popover-basic">
      <h3 as="h3">{title}</h3>
      <div>{text}</div>
    </Popover>
  );
}

export function roundToTwoDecimalPlaces(num) {
  return Math.round(num * 100) / 100;
}

// Displays the info button
export function displayInfoButton(title, text, placement) {
  return (
    <OverlayTrigger
      trigger="click"
      placement={placement}
      overlay={showInformationSlide(title, text)}
    >
      <Image src={Icon} style={{ width: 20 }} />
    </OverlayTrigger>
  );
}

// Link/button back to base page
export function showBackToAlgorithimPage() {
  return (
    <Link to="/">
      <Nav>
        <Image src={Back} className="small-photo" />
      </Nav>
    </Link>
  );
}

// Link/button back to base page, but is an entire nav bar itself
export function showBasicBackNavBar() {
  return (
    <Navbar fixed="top" bg="dark" variant="dark">
      {showBackToAlgorithimPage()}
    </Navbar>
  );
}

// get coordinate based on click and bounds
export function calculateScale(coordClick, bound, scale) {
  const offset = coordClick - bound;
  return (offset / scale) * 100;
}

export function showPictureWithOverlay(
  condition,
  overlayText,
  callback,
  image
) {
  return condition ? (
    <OverlayTrigger
      trigger="hover"
      placement="bottom"
      overlay={<Tooltip>{overlayText}</Tooltip>}
    >
      <Nav.Link onClick={callback}>
        <Image src={image} className="small-photo" />
      </Nav.Link>
    </OverlayTrigger>
  ) : null;
}

export function showNavBar(functionList) {
  return (
    <Navbar fixed="top" bg="dark" variant="dark">
      {[...functionList]}
    </Navbar>
  );
}

export function showMarkSeries(
  color,
  data,
  callbackClick = () => {},
  callbackOut = () => {},
  callbackOver = () => {}
) {
  return (
    <MarkSeries
      className="mark-series-example"
      strokeWidth={2}
      opacity="0.8"
      sizeRange={[0, 100]}
      color={color}
      data={data}
      onValueClick={callbackClick}
      onValueMouseOut={callbackOut}
      onValueMouseOver={callbackOver}
    />
  );
}
