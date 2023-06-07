import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Coral from '../../../static/frontend/icons/svg/coral.svg';
import Fish from '../../../static/frontend/icons/svg/fish.svg';
import Octopus from '../../../static/frontend/icons/svg/octopus.svg';
import Starfish from '../../../static/frontend/icons/svg/starfish.svg';
import Crab from '../../../static/frontend/icons/svg/izocrab.svg';
import Anemone from '../../../static/frontend/icons/svg/anemone.svg';

export default class CategoryCarousel extends Component {
  render() {
    return (
      <div className="category-carousel">
        <div className="cc-categories">
          <Category
            name="Ryby"
            description="Zmiennocieplne kręgowce, oddychające skrzelami i posiadające płetwy"
            icon={<Fish />}
            linkTo="/category/fish"
          />
          <Category
            name="Skorupiaki"
            description="Bezkręgowce posiadające segmentowane ciało pokryte chitynowym oskórkiem"
            icon={<Crab />}
            linkTo="/category/crustaceans"
          />
          <Category
            name="Mięczaki"
            description="Bezkręgowce posiadające miękkie, niesegmentowane ciało"
            icon={<Octopus />}
            linkTo="/category/molluscs"
          />
          <Category
            name="Szkarłupnie"
            description="Bezkręgowce wtórouste o wtórnej symetrii promienistej"
            icon={<Starfish />}
            linkTo="/category/echinoderms"
          />
          <Category
            name="Miękkie"
            description="Koralowce nieposiadające wapiennego szkieletu"
            icon={<Coral />}
            linkTo="/category/soft"
          />
          <Category
            name="SPS"
            description="Koralowce małopolipowe posiadające wapienny szkielet"
            icon={<Coral />}
            linkTo="/category/sps"
          />
          <Category
            name="LPS"
            description="Koralowce wielkopolipowe posiadające wapienny szkielet"
            icon={<Coral />}
            linkTo="/category/lps"
          />
          <Category
            name="NPS"
            description="Koralowce nieposiadające fotosyntezujących zooksantelli"
            icon={<Coral />}
            linkTo="/category/nps"
          />
          <Category
            name="Ukwiały"
            description="Bezszkieletowe, osiadłe lub półosiadłe koralowce sześciopromienne"
            icon={<Anemone />}
            linkTo="/category/anemones"
          />
        </div>
        <div className="cc-mask"></div>
      </div>
    );
  }
}

const Category = (props) => {
  return (
    <Link to={props.linkTo} className="cc-category">
      <div className="cc-category-main">
        <div className="cc-category-icon">{props.icon}</div>
        <h1 className="cc-category-name">{props.name}</h1>
      </div>
      <p className="cc-category-short-description">{props.description}</p>
    </Link>
  );
};
