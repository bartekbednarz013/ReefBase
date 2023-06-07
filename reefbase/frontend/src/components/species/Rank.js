import React, { Component, Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ButterToast from "butter-toast/dist/lean.min.js";
import MyAlert from "../common/MyAlert";
import SpeciesAsListItem from "./SpeciesAsListItem";

export default function Rank() {
  const { slug } = useParams();

  return <RankComp slug={slug} />;
}

class RankComp extends Component {
  state = {
    species: [],
    dataLoaded: false,
    slug: "",
    nextPage: "",
    loadingActive: false,
  };

  loadMore = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 80 >=
        document.scrollingElement.scrollHeight &&
      this.state.nextPage &&
      !this.state.loadingActive
    ) {
      this.setState({ loadingActive: true });
      axios
        .get(this.state.nextPage)
        .then((res) => {
          this.setState({
            species: [...this.state.species, ...res.data.results],
            nextPage: res.data.next,
            loadingActive: false,
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
      .get(`/api/rank/${this.props.slug}`)
      .then((res) => {
        this.setState({
          species: res.data.results,
          dataLoaded: true,
          slug: this.props.slug,
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
    window.addEventListener("scroll", this.loadMore);
  }

  componentDidUpdate() {
    if (this.props.slug != this.state.slug) {
      axios
        .get(`/api/rank/${this.props.slug}`)
        .then((res) => {
          this.setState({
            species: res.data.results,
            dataLoaded: true,
            slug: this.props.slug,
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
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.loadMore);
  }

  render() {
    const { species, dataLoaded } = this.state;
    //const rankName = this.props.slug.replace("-", /\s+/g);

    return (
      <div className="rank-container">
        <div className="rank-header">
          <h2 className="rank-h2">Takson:</h2>
          <h2 className="rank-name">{this.props.slug}</h2>
        </div>
        {!dataLoaded && <div className="loading"></div>}
        {dataLoaded && !species.length && (
          <div className="rank-species-list">
            Baza nie zawiera gatunków należących do tego taksonu
          </div>
        )}
        {dataLoaded && (
          <div className="rank-species-list">
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
