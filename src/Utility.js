import React from "react";
import { Popover, OverlayTrigger, Image, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import Back from "./Images/back.png";
import Icon from "./Images/icon.png";

// Euclidean distance function that returns orginal point and distance
export function euclidFunction(pointOne, pointTwo) {
  let xDistance = pointOne.x - pointTwo.x;
  let yDistance = pointOne.y - pointTwo.y;
  xDistance *= xDistance;
  yDistance *= yDistance;
  const totalDistance = Math.sqrt(xDistance + yDistance);
  return { orginalPoint: pointOne, distance: totalDistance };
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
