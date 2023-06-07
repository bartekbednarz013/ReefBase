import React, { Component, Fragment } from "react";
import { Navigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import store from "../../store";
import { tokenConfig } from "../../actions/auth";
import ButterToast from "butter-toast";
import MyAlert from "../common/MyAlert";

export function MistakeReport({ auth }) {
  const { type, subject } = useParams();

  return <MistakeReportComp type={type} subject={subject} auth={auth} />;
}

MistakeReport.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ auth: state.authReducer });

export default connect(mapStateToProps)(MistakeReport);

class MistakeReportComp extends Component {
  state = {
    type: "",
    subject: "",
    text: "",
    reported: false,
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();
    const { type, subject, text } = this.state;

    axios
      .post(
        "/api/mistakeReports/",
        { type: type, subject: subject, text: text },
        tokenConfig(store.getState)
      )
      .then((res) => {
        this.setState({ reported: true });
      })
      .catch((err) => {
        ButterToast.raise({
          content: (
            <MyAlert
              type="error"
              message="Nie udało sie wysłać zgłoszenia"
              dismiss
            />
          ),
        });
      });
  };

  componentDidMount() {
    if (this.props.subject && this.props.auth.isAuthenticated) {
      this.setState({
        subject: this.props.subject,
      });
      document.getElementById("subject").readOnly = true;
    }
    this.setState({
      type: this.props.type,
    });
  }

  render() {
    const { subject, text, reported } = this.state;

    if (!this.props.auth.isAuthenticated) {
      // return <Navigate to="/login" />;
      return (
        // <div className="forgotten-password-info">
        //   Żeby dodać zgłoszenie, musisz być zalogowany.
        // </div>
        <div className="login-outer-wrapper">
          <div className="login-required-info">
            Żeby dodać zgłoszenie, musisz być zalogowany
          </div>
        </div>
      );
    }

    return (
      <Fragment>
        {reported && (
          <div className="forgotten-password-info">
            <div className="login-header">
              Twoje zgłoszenia o błędzie zostało przyjęte.
            </div>
            Zgłoszenie zostanie rozpatrzone przez administrację.
          </div>
        )}
        {!reported && (
          <div className="login-outer-wrapper">
            <div className="login-wrapper">
              <div className="login-header">Zgłoś błąd</div>
              <form className="login-form" onSubmit={this.onSubmit}>
                <div className="form-field">
                  <label htmlFor="subject">Temat</label>
                  <input
                    type="subject"
                    id="subject"
                    name="subject"
                    onChange={this.onChange}
                    className="login-form-input"
                    value={subject}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="text">Treść zgłoszenia</label>
                  <textarea
                    name="text"
                    id="text"
                    rows="10"
                    onChange={this.onChange}
                    value={text}
                    required
                    placeholder="Opisz zauważony błąd"
                  ></textarea>
                </div>
                <div className="form-field submit-field">
                  <input
                    type="submit"
                    value="Zgłoś"
                    className="login-register-submit"
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}
