import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CategoryCarousel from './CategoryCarousel';
import Navside from './Navside';
import Search from './Search';
import AlertsTray from './AlertsTray';
import Home from '../../../static/frontend/icons/svg/home.svg';
import Add from '../../../static/frontend/icons/svg/add.svg';
import Account from '../../../static/frontend/icons/svg/account.svg';
import LightOn from '../../../static/frontend/icons/svg/lightOn.svg';
import LightOff from '../../../static/frontend/icons/svg/lightOff.svg';
import Arrow from '../../../static/frontend/icons/svg/arrow.svg';

export class Header extends Component {
  render() {
    return (
      <header>
        <div className="navbar">
          <div className="burger">
            <input type="checkbox" id="burger-checkbox" />
            <label className="burger-label" htmlFor="burger-checkbox">
              <span className="bar bar1"></span>
              <span className="bar bar2"></span>
              <span className="bar bar3"></span>
            </label>
          </div>
          <Link to="" className="logo hide-fixed-if-click">
            <h1>ReefBase</h1>
          </Link>
          <div className="inner-navbar-wrapper">
            <div className="navbar-item search-box">
              <Search />
            </div>
            <div className="bottom-bar">
              <div className="navbar-icons-wrapper">
                <Link
                  to=""
                  className="navbar-item home-link hide-fixed-if-click"
                >
                  <Home />
                </Link>
                <Link
                  to="/addSpecies"
                  className="navbar-item add-species-link  hide-fixed-if-click"
                >
                  <Add />
                </Link>
                <Link
                  to="/account"
                  className="navbar-item account-link  hide-fixed-if-click"
                >
                  <Account />
                </Link>
                <div className="navbar-item light-mode-switch">
                  <LightOn className="light-on" />
                  <LightOff className="light-off" />
                </div>
                <div className="go-up-arrow navbar-item">
                  <Arrow />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Navside />
        <div className="menu-turn"></div>
        <CategoryCarousel />
        <AlertsTray />
      </header>
    );
  }
}

export default Header;
