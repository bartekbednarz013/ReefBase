import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import store from "../../store";
import { tokenConfig } from "../../actions/auth";
import ButterToast from "butter-toast/dist/lean.min.js";
import MyAlert from "../common/MyAlert";
import SpeciesAsListItem from "../species/SpeciesAsListItem";

export default class AddedSpecies extends Component {
  state = {
    count: "",
    nextPage: "",
    species: [],
    dataLoaded: false,
  };

  loadMore = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 80 >=
        document.scrollingElement.scrollHeight &&
      this.state.nextPage
    ) {
      axios
        .get(this.state.nextPage)
        .then((res) => {
          this.setState({
            species: [...this.state.species, ...res.data.results],
            nextPage: res.data.next,
          });
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

  componentDidMount() {
    axios
      .get("/api/auth/userSpecies", tokenConfig(store.getState))
      .then((res) => {
        this.setState({
          count: res.data.count,
          nextPage: res.data.next,
          species: res.data.results,
          dataLoaded: true,
        });
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
    window.addEventListener("scroll", this.loadMore);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.loadMore);
  }

  render() {
    const { species, dataLoaded, count } = this.state;

    return (
      <div className="added-species-tab">
        <div className="added-species-header">
          <h2 className="added-species-title">
            Oto dodane przez Ciebie gatunki
          </h2>
          {count !== 0 && (
            <div className="added-species-counter">
              Liczba dodanych gatunków: {count}
            </div>
          )}
        </div>
        {!dataLoaded && <div className="loading"></div>}
        {dataLoaded && !species.length && (
          <div className="nothing-to-see-here">
            Nie dodano jeszcze żadnego gatunku
          </div>
        )}
        {dataLoaded && (
          <div className="category-species-list">
            {species.map((species) => (
              <SpeciesAsListItem
                key={species.id}
                linkTo={`/species/${species.slug}`}
                species={species.species}
                image={species.image}
                image_thumbnail={species.image_thumbnail}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}
