import React, { Component, Fragment } from "react";
import axios from "axios";
import store from "../../store";
import { tokenConfig } from "../../actions/auth";
import ButterToast from "butter-toast/dist/lean.min.js";
import MyAlert from "../common/MyAlert";
import { Link } from "react-router-dom";

export default class ReportedMistakes extends Component {
  state = {
    count: "",
    nextPage: "",
    mistakesList: [],
    dataLoaded: false,
  };

  convertSlugToSpecies = (species) => {
    return (species.charAt(0).toUpperCase() + species.slice(1)).replace(
      "-",
      " "
    );
  };

  hideMistake = (mistake_id) => {
    axios
      .patch(`/api/mistakeReports/${mistake_id}/`, tokenConfig(store.getState))
      .then((res) => {
        let mistakes = this.state.mistakesList;
        mistakes.splice(
          mistakes.findIndex((v) => v.id === mistake_id),
          1
        );
        this.setState({ mistakesList: mistakes });
      })
      .catch((err) => {
        console.log(err);
        ButterToast.raise({
          content: (
            <MyAlert
              type="error"
              message="Nie udało sie usunąć zgłoszenia"
              dismiss
            />
          ),
        });
      });
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
            mistakesList: [...this.state.mistakesList, ...res.data.results],
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
      .get("/api/mistakeReports/", tokenConfig(store.getState))
      .then((res) => {
        this.setState({
          count: res.data.count,
          nextPage: res.data.next,
          mistakesList: res.data.results,
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
    const { mistakesList, count, dataLoaded } = this.state;

    return (
      <div className="added-comments-tab">
        <div className="added-comments-header">
          <h2 className="added-species-title">Zgłoszenia o błędach:</h2>
          {count !== 0 && (
            <div className="added-comments-counter">
              Liczba zgłoszonych błędów: {count}
            </div>
          )}
        </div>
        {!dataLoaded && <div className="loading"></div>}
        {dataLoaded && !mistakesList.length && (
          <div className="nothing-to-see-here">
            Obecnie nie ma żadnych zgłoszonych błędów
          </div>
        )}
        {dataLoaded && (
          <div className="added-comments-list">
            {mistakesList.map((mistake) => (
              <div key={mistake.id} className="comment">
                <div className="comment-content">
                  <div className="comment-meta">
                    <Link
                      to={`/species/${mistake.subject}`}
                      className="comment-species"
                    >
                      {this.convertSlugToSpecies(mistake.subject)}
                    </Link>
                    <span className="comment-date">
                      {new Date(mistake.date).toLocaleString("pl-PL")}
                    </span>
                  </div>
                  <div className="comment-text">{mistake.text}</div>
                  <div className="comment-options">
                    <div
                      className="delete-comment"
                      onClick={() => {
                        this.hideMistake(mistake.id);
                      }}
                    >
                      Usuń
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
