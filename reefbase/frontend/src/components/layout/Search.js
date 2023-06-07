import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import ProgressiveImage from '../common/ProgressiveImage.js';
import axios from 'axios';
import {
  hideSearchInput,
  showSearchSuggestions,
  hideSearchSuggestions,
} from '../../../static/frontend/js/functionToExport.js';
import Magnifier from '../../../static/frontend/icons/svg/magnifier.svg';
import X from '../../../static/frontend/icons/svg/x.svg';

export default class Search extends Component {
  state = {
    species: [],
    dataLoaded: false,
    UserTyped: false,
  };

  onChange = (e) => {
    if (e.target.value == '') {
      hideSearchSuggestions();
      this.setState({
        species: [],
        UserTyped: false,
        dataLoaded: false,
      });
    } else {
      showSearchSuggestions();
      this.setState({ UserTyped: true });
      axios
        .get(`/api/search?search=${e.target.value}`)
        .then((res) => {
          this.setState({ species: res.data.results, dataLoaded: true });
        })
        .catch((err) => {
          ButterToast.raise({
            content: (
              <MyAlert
                type="error"
                message="Nie udało sie pobrać danych"
                dismiss
              />
            ),
          });
        });
    }
  };

  render() {
    const { species, dataLoaded, UserTyped } = this.state;

    return (
      <Fragment>
        <div className="lower-search">
          <div className="search-wrap">
            <div className="cancel-search navbar-item">
              <X />
            </div>
            <form className="search-form" id="search-form">
              <input
                type="search"
                className="search-input"
                name="q"
                placeholder="Wpisz nazwę gatunku"
                onChange={this.onChange}
              />
            </form>
            <div className="search-button fake-search-button">
              <Magnifier className="search-icon" />
            </div>
          </div>
          <Link
            to="/advancedSearch"
            className="searchbox-detailed-search-link"
            onClick={hideSearchInput}
          >
            Szczegółowe wyszukiwanie
          </Link>
          <div className="search-suggestions-wrapper">
            {!dataLoaded && UserTyped && <div className="loading"></div>}
            {dataLoaded && !species.length && (
              <div className="no-results">Brak pasujących wyników</div>
            )}
            {dataLoaded && (
              <ul className="search-suggestion-list">
                {species.map((species) => (
                  <SearchSuggestion
                    key={species.id}
                    linkTo={`species/${species.slug}`}
                    species={species.species}
                    image={species.image}
                    image_thumbnail={species.image_thumbnail}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="upper-search">
          <button type="button" className="search-button">
            <Magnifier />
          </button>
        </div>
      </Fragment>
    );
  }
}

const SearchSuggestion = (props) => {
  return (
    <li>
      <Link
        to={props.linkTo}
        className="search-suggestion"
        onClick={hideSearchInput}
      >
        {/* <img src={props.image} /> */}
        <ProgressiveImage
          src={props.image}
          placeholder={props.image_thumbnail}
        />
        <h2>{props.species}</h2>
      </Link>
    </li>
  );
};
