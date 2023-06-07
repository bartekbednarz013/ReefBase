import React, { Component, Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Globe from "../../../static/frontend/icons/svg/globe.svg";
import ButterToast from "butter-toast";
import MyAlert from "../common/MyAlert";
import store from "../../store";
import { tokenConfig } from "../../actions/auth";
import ProgressiveImage from "../common/ProgressiveImage";

export function Species({ auth }) {
  const { slug } = useParams();
  return <SpeciesComp auth={auth} slug={slug} />;
}

Species.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ auth: state.authReducer });

export default connect(mapStateToProps)(Species);

class SpeciesComp extends Component {
  state = {
    species: Object,
    dataLoaded: false,
    slug: this.props.slug,
    comments: [],
    createdComment: "",
    parentId: "",
    replyTo: "",
    createdReply: "",
    notFound: false,
    showClassification: false,
    notAccepted: false,
  };

  deleteComment = (commentId) => {
    if (this.props.auth.isAuthenticated) {
      axios
        .delete(`/api/comments/${commentId}/`, tokenConfig(store.getState))
        .then((res) => {
          let comments = this.state.comments;
          comments.splice(
            comments.findIndex((v) => v.id === commentId),
            1
          );
          this.setState({ comments: comments });
          ButterToast.raise({
            content: (
              <MyAlert type="alert" title="Komentarz usunięty" dismiss />
            ),
          });
        })
        .catch((err) => {
          console.log(err.response.data);
          ButterToast.raise({
            content: (
              <MyAlert
                type="error"
                message="Nie udało sie usunąć komentarza"
                dismiss
              />
            ),
          });
        });
    }
  };

  writeComment = (e) => this.setState({ createdComment: e.target.value });

  addComment = (e) => {
    e.preventDefault();

    if (this.props.auth.isAuthenticated) {
      const comment = {species: this.state.species.id, text: this.state.createdComment,};

      axios
        .post(`/api/comments/`, comment, tokenConfig(store.getState))
        .then((res) => {
          this.setState({
            createdComment: "",
            comments: [...this.state.comments, res.data],
          });
          ButterToast.raise({
            content: <MyAlert type="alert" title="Dodano komentarz" dismiss />,
          });
        })
        .catch((err) => {
          ButterToast.raise({
            content: (
              <MyAlert
                type="error"
                message="Nie udało sie dodać komentarza"
                dismiss
              />
            ),
          });
        });
    } else {
      ButterToast.raise({
        content: (
          <MyAlert
            type="error"
            message="Musisz być zalogowany, żeby dodać komentarz"
            dismiss
          />
        ),
      });
    }
  };

  setReplyData = (parentId, replyTo, replyAuthorUsername) => {
    this.setState({
      parentId: parentId,
      replyTo: replyTo,
      createdReply: `@${replyAuthorUsername} `,
    });
  };

  writeReply = (e) => this.setState({ createdReply: e.target.value });

  addReply = (e) => {
    e.preventDefault();

    if (this.props.auth.isAuthenticated) {
      const reply = {
        species: this.state.species.id,
        parent: this.state.parentId,
        reply_to: this.state.replyTo,
        text: this.state.createdReply,
      };

      axios
        .post(`/api/comments/`, reply, tokenConfig(store.getState))
        .then((res) => {
          this.setState({
            createdReply: "",
            parentId: "",
            replyTo: "",
            comments: [...this.state.comments, res.data],
          });
          ButterToast.raise({
            content: <MyAlert type="alert" title="Dodano odpowiedź" dismiss />,
          });
        })
        .catch((err) => {
          console.log(err.response.data);
          ButterToast.raise({
            content: (
              <MyAlert
                type="error"
                message="Nie udało sie dodać odpowiedzi"
                dismiss
              />
            ),
          });
        });
    } else {
      ButterToast.raise({
        content: (
          <MyAlert
            type="error"
            message="Musisz być zalogowany, żeby dodać komentarz"
            dismiss
          />
        ),
      });
    }
  };

  moreImages = () => {
    window.open(
      `https://www.google.com/search?tbm=isch&q=${this.state.species.species}`
    );
  };

  onCheckboxChange = (e) => {
    this.setState({ showClassification: e.target.checked });
  };

  componentDidMount() {
    axios
      .get(`/api/species/${this.props.slug}/`)
      .then((res) => {
        if (res.status == 204) {
          this.setState({ notFound: false, notAccepted: true });
        } else {
          this.setState({
            species: res.data,
            comments: res.data.comments,
          });
        }
      })
      .catch((err) => {
        if (err.response.status == 404) {
          this.setState({ notFound: true, notAccepted: false });
        } else {
          ButterToast.raise({
            content: (
              <MyAlert
                type="error"
                message="Nie udało sie pobrać danych"
                dismiss
              />
            ),
          });
        }
      })
      .finally(() => {
        this.setState({ dataLoaded: true, slug: this.props.slug });
      });

    const desktop = window.matchMedia("(min-width: 960px)");
    if (desktop.matches) {
      this.setState({ showClassification: true });
    }
  }

  componentDidUpdate() {
    if (this.props.slug != this.state.slug) {
      axios
        .get(`/api/species/${this.props.slug}/`)
        .then((res) => {
          if (res.status == 204) {
            this.setState({ notFound: false, notAccepted: true });
          } else {
            this.setState({
              species: res.data,
              comments: res.data.comments,
            });
          }
        })
        .catch((err) => {
          if (err.response.status == 404) {
            this.setState({ notFound: true, notAccepted: false });
          } else {
            ButterToast.raise({
              content: (
                <MyAlert
                  type="error"
                  message="Nie udało sie pobrać danych"
                  dismiss
                />
              ),
            });
          }
        })
        .finally(() => {
          this.setState({ dataLoaded: true, slug: this.props.slug });
        });
    }
  }

  render() {
    const {
      species,
      dataLoaded,
      comments,
      createdComment,
      replyTo,
      createdReply,
      notFound,
      showClassification,
      notAccepted,
    } = this.state;

    const { isAuthenticated, user } = this.props.auth;

    let admin = false;
    let user_id = "";
    if (user) {
      admin = user.is_staff;
      user_id = user.id;
    }

    return (
      <div className="species-container">
        {!dataLoaded && !notFound && <div className="loading"></div>}
        {dataLoaded && notFound && !notAccepted && (
          <div className="species-not-found">
            <p>Niestety nasza baza nie zawiera informacji o tym gatunku.</p>
            <Link to={"/addSpecies"}>Jednak jeśli chcesz, możesz go dodać</Link>
          </div>
        )}
        {dataLoaded && !notFound && notAccepted && (
          <div className="species-not-found">
            <p>Gatunek oczekuje na zatwierdzenie przez moderatora.</p>
            <p>Zajrzyj tu za jakiś czas</p>
          </div>
        )}
        {dataLoaded && !notFound && !notAccepted && species.species && (
          <Fragment>
            <div className="species-header">
              {admin && (
                <Link
                  to={`/editSpecies/${species.slug}`}
                  className="edit-species"
                >
                  Edytuj
                </Link>
              )}
              {/* <img src={species.image} className="species-img" /> */}
              <ProgressiveImage
                src={species.image}
                placeholder={species.image_thumbnail}
              />
              <div
                className="more-images-link"
                id="linker"
                onClick={this.moreImages}
              >
                Zobacz więcej zdjęć
              </div>
            </div>
            <div className="species-content">
              <div className="species-name">
                <h2>{species.species}</h2>
              </div>

              <div className="species-info">
                {showClassification && (
                  <input
                    type="checkbox"
                    id="classification-checkbox"
                    onChange={this.onCheckboxChange}
                    checked
                  />
                )}
                {!showClassification && (
                  <input
                    type="checkbox"
                    id="classification-checkbox"
                    onChange={this.onCheckboxChange}
                  />
                )}
                <div className="classification-wrapper">
                  <label
                    className="classification-arrow"
                    htmlFor="classification-checkbox"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      viewBox="0 0 47.255 47.255"
                      fill="currentColor"
                    >
                      <path
                        d="M46.255,35.941c-0.256,0-0.512-0.098-0.707-0.293l-21.921-21.92l-21.92,21.92c-0.391,0.391-1.023,0.391-1.414,0
                  c-0.391-0.391-0.391-1.023,0-1.414L22.92,11.607c0.391-0.391,1.023-0.391,1.414,0l22.627,22.627c0.391,0.391,0.391,1.023,0,1.414
                  C46.767,35.844,46.511,35.941,46.255,35.941z"
                      />
                    </svg>
                  </label>
                  <div className="classification">
                    <div className="taxonomic-rank">
                      <h2>Królestwo</h2>
                      <Link to={`/rank/${species.regnum}`}>
                        {species.regnum}
                      </Link>
                    </div>
                    <div className="taxonomic-rank">
                      <h2>Typ</h2>
                      <Link to={`/rank/${species.phylum}`}>
                        {species.phylum}
                      </Link>
                    </div>
                    <div className="taxonomic-rank">
                      <h2>Gromada</h2>
                      <Link to={`/rank/${species.classis}`}>
                        {species.classis}
                      </Link>
                    </div>
                    <div className="taxonomic-rank">
                      <h2>Rząd</h2>
                      <Link to={`/rank/${species.ordo}`}>{species.ordo}</Link>
                    </div>
                    <div className="taxonomic-rank">
                      <h2>Rodzina</h2>
                      <Link to={`/rank/${species.familia}`}>
                        {species.familia}
                      </Link>
                    </div>
                    <div className="taxonomic-rank">
                      <h2>Rodzaj</h2>
                      <Link to={`/rank/${species.genus}`}>{species.genus}</Link>
                    </div>
                  </div>
                </div>
                <div className="species-props">
                  <div className="species-prop">
                    <div className="species-prop-icon">
                      <Globe />
                    </div>
                    <div>
                      <h2 className="species-prop-name">Występowanie</h2>
                      <p className="species-prop-value">
                        {species.distribution.join(', ')}
                      </p>
                    </div>
                  </div>
                  {species.size > 0 && (
                    <div className="species-prop">
                      <div className="species-prop-icon"></div>
                      <div>
                        <h2 className="species-prop-name">Osiągane rozmiary</h2>
                        <p className="species-prop-value">{species.size}cm</p>
                      </div>
                    </div>
                  )}
                  {species.min_tank > 0 && (
                    <div className="species-prop">
                      <div className="species-prop-icon"></div>
                      <div>
                        <h2 className="species-prop-name">
                          Minimalna wielkość zbiornika
                        </h2>
                        <p className="species-prop-value">
                          {species.min_tank}l
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="species-prop">
                    <div className="species-prop-icon"></div>
                    <div>
                      <h2 className="species-prop-name">Pożywienie</h2>
                      <p className="species-prop-value">{species.food.join(', ')}</p>
                    </div>
                  </div>
                  <div className="species-prop">
                    <div className="species-prop-icon"></div>
                    <div>
                      <h2 className="species-prop-name">
                        Specjalista pokarmowy
                      </h2>
                      {species.picky_eater && (
                        <p className="species-prop-value">tak</p>
                      )}
                      {!species.picky_eater && (
                        <p className="species-prop-value">nie</p>
                      )}
                    </div>
                  </div>
                  <div className="species-prop">
                    <div className="species-prop-icon"></div>
                    <div>
                      <h2 className="species-prop-name">Bezpieczny dla rafy</h2>
                      {species.reefsafe && (
                        <p className="species-prop-value">tak</p>
                      )}
                      {!species.reefsafe && (
                        <p className="species-prop-value">nie</p>
                      )}
                    </div>
                  </div>
                </div>
                {isAuthenticated && (
                  <div className="report-mistake">
                    <Link to={`/mistakeReport/species/${species.slug}`}>
                      Zgłoś
                    </Link>
                  </div>
                )}
              </div>
              <div className="comments-section">
                <div className="comments-section-header">
                  <h2>Komentarze</h2>
                  <p>
                    Masz doświadczenie w hodowli bądź chcesz się podzielić
                    opinią na temat tego gatunku?
                    <br />
                    Napisz poniżej!
                  </p>
                </div>
                <div className="comment-adder">
                  <form onSubmit={this.addComment}>
                    <div className="form-field">
                      <textarea
                        name="comment-textarea"
                        id="comment-textarea"
                        rows="4"
                        onChange={this.writeComment}
                        value={createdComment}
                        required
                      ></textarea>
                    </div>
                    <div className="form-field">
                      <button type="submit">Dodaj komentarz</button>
                    </div>
                  </form>
                  {!isAuthenticated && (
                    <div className="comment-adder-mask">
                      <div className="login-required-info">
                        Żeby dodać komentarz, musisz być zalogowany
                      </div>
                    </div>
                  )}
                </div>

                <div className="comments-list">
                  {comments.map((comment) => {
                    if (comment.parent == null)
                      return (
                        <div key={comment.id} className="comment">
                          <div className="comment-content">
                            <div className="comment-meta">
                              <span className="comment-author">
                                {comment.author.username}
                              </span>
                              <span className="comment-date">
                                {new Date(comment.date).toLocaleString("pl-PL")}
                              </span>
                            </div>
                            <div className="comment-text">{comment.text}</div>
                            <div className="comment-options">
                              {user_id === comment.author.id && (
                                <div
                                  className="delete-comment"
                                  onClick={() => {
                                    this.deleteComment(comment.id);
                                  }}
                                >
                                  Usuń
                                </div>
                              )}
                              {isAuthenticated && (
                                <div
                                  className="add-reply"
                                  onClick={() => {
                                    this.setReplyData(
                                      comment.id,
                                      comment.id,
                                      comment.author.username
                                    );
                                  }}
                                >
                                  Odpowiedz
                                </div>
                              )}
                            </div>
                          </div>
                          {replyTo == comment.id && (
                            <div className="reply-adder">
                              <form onSubmit={this.addReply}>
                                <div className="form-field">
                                  <textarea
                                    name="reply-textarea"
                                    id="reply-textarea"
                                    rows="3"
                                    onChange={this.writeReply}
                                    value={createdReply}
                                    required
                                  ></textarea>
                                </div>
                                <div className="form-field">
                                  <button type="submit">Dodaj odpowiedź</button>
                                </div>
                              </form>
                            </div>
                          )}
                          <div className="comment-replies">
                            {comments.map((reply) => {
                              if (reply.parent == comment.id)
                                return (
                                  <Fragment key={reply.id}>
                                    <div className="reply">
                                      <div className="comment-meta">
                                        <span className="comment-author">
                                          {reply.author.username}
                                        </span>
                                        <span className="comment-date">
                                          {new Date(reply.date).toLocaleString(
                                            "pl-PL"
                                          )}
                                        </span>
                                      </div>
                                      <div className="comment-text">
                                        {reply.text}
                                      </div>
                                      <div className="comment-options">
                                        {user_id === reply.author.id && (
                                          <div
                                            className="delete-comment"
                                            onClick={() => {
                                              this.deleteComment(reply.id);
                                            }}
                                          >
                                            Usuń
                                          </div>
                                        )}
                                        {isAuthenticated && (
                                          <div
                                            className="add-reply"
                                            onClick={() => {
                                              this.setReplyData(
                                                comment.id,
                                                reply.id,
                                                reply.author.username
                                              );
                                            }}
                                          >
                                            Odpowiedz
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    {replyTo == reply.id && (
                                      <div className="reply-adder">
                                        <form onSubmit={this.addReply}>
                                          <div className="form-field">
                                            <textarea
                                              name="reply-textarea"
                                              id="reply-textarea"
                                              rows="3"
                                              onChange={this.writeReply}
                                              value={createdReply}
                                            ></textarea>
                                          </div>
                                          <div className="form-field">
                                            <button type="submit">
                                              Dodaj odpowiedź
                                            </button>
                                          </div>
                                        </form>
                                      </div>
                                    )}
                                  </Fragment>
                                );
                            })}
                          </div>
                        </div>
                      );
                  })}
                </div>
              </div>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}
