import React, { Component, Fragment } from "react";
import axios from "axios";
import store from "../../store";
import { tokenConfig } from "../../actions/auth";
import ButterToast from "butter-toast/dist/lean.min.js";
import MyAlert from "../common/MyAlert";
import { Link } from "react-router-dom";

export default class AddedComments extends Component {
  state = {
    count: "",
    nextPage: "",
    comments: [],
    dataLoaded: false,
  };

  convertSpeciesToSlug = (species) => {
    return species.toLowerCase().replace(" ", "-");
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
            comments: [...this.state.comments, ...res.data.results],
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
      .get("/api/auth/userComments", tokenConfig(store.getState))
      .then((res) => {
        this.setState({
          count: res.data.count,
          nextPage: res.data.next,
          comments: res.data.results,
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
    const { comments, dataLoaded, count } = this.state;

    return (
      <div className="added-comments-tab">
        <div className="added-comments-header">
          <h2 className="added-species-title">
            Oto dodane przez Ciebie komentarze
          </h2>
          {count != 0 && (
            <div className="added-comments-counter">
              Liczba dodanych komentarzy: {count}
            </div>
          )}
        </div>
        {!dataLoaded && <div className="loading"></div>}
        {dataLoaded && !comments.length && (
          <div className="nothing-to-see-here">
            Nie dodano jeszcze żadnego komentarza
          </div>
        )}
        {dataLoaded && (
          <div className="added-comments-list">
            {comments.map((comment) => (
              <Comment
                key={comment.id}
                species={comment.species.species}
                slug={comment.species.slug}
                text={comment.text}
                date={comment.date}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

const Comment = (props) => {
  return (
    <div className="comment">
      <div className="comment-content">
        <div className="comment-meta">
          <Link to={`/species/${props.slug}`} className="comment-species">
            {props.species}
          </Link>
          <span className="comment-date">
            {new Date(props.date).toLocaleString("pl-PL")}
          </span>
        </div>
        <div className="comment-text">{props.text}</div>
      </div>
    </div>
  );
};
