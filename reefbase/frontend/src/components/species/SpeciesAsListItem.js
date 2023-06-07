import React from "react";
import { Link } from "react-router-dom";
import ProgressiveImage from "../common/ProgressiveImage";

const SpeciesAsListItem = (props) => {
  return (
    <Link to={props.linkTo} className="species-as-list-item">
      {/* <img src={props.image} /> */}
      <ProgressiveImage src={props.image} placeholder={props.image_thumbnail} />
      <h2>{props.species}</h2>
    </Link>
  );
};

export default SpeciesAsListItem;
