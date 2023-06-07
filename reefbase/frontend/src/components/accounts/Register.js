import React, { Component, Fragment } from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { register } from "../../actions/auth";
import ButterToast from "butter-toast/dist/lean.min.js";
import MyAlert from "../common/MyAlert";

export class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    password2: "",
    afterRegister: false,
    showMessage: false,
  };

  static propTypes = {
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    serverResponse: PropTypes.object,
  };

  showPassword = () => {
    const showPasswordCheckbox = document.getElementById("showPassword");
    if (showPasswordCheckbox.checked) {
      document.getElementById("password").type = "text";
      document.getElementById("password2").type = "text";
    } else {
      document.getElementById("password").type = "password";
      document.getElementById("password2").type = "password";
    }
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { username, email, password, password2 } = this.state;
    if (password !== password2) {
      ButterToast.raise({
        content: (
          <MyAlert type="error" message="Hasła muszą być takie same!" dismiss />
        ),
      });
    } else {
      const newUser = {
        username,
        email,
        password,
      };
      this.props.register(newUser);
      this.setState({ afterRegister: true });
    }
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  componentDidUpdate() {
    if (this.state.showMessage == false) {
      if (
        this.props.serverResponse.detail == "Nowe konto zostało utworzone." &&
        this.state.afterRegister
      ) {
        this.setState({ showMessage: true });
      }
    }
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Navigate to="/account" />;
    }

    const { username, email, password, password2, showMessage } = this.state;
    return (
      <Fragment>
        {showMessage && (
          <div className="registered-successfully">
            <div className="login-header">Konto zostało utworzone.</div>
            Aktywuj konto korzystając z linku, który został wysłany na Twój
            adres email.
          </div>
        )}
        {!showMessage && (
          <div className="login-outer-wrapper">
            <div className="login-wrapper">
              <div className="login-header">Załóż nowe konto</div>
              <form className="login-form" onSubmit={this.onSubmit}>
                <div className="form-field">
                  <label htmlFor="username">Login</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    onChange={this.onChange}
                    className="login-form-input"
                    value={username}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={this.onChange}
                    className="login-form-input"
                    value={email}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="password">Hasło</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    onChange={this.onChange}
                    className="login-form-input"
                    value={password}
                    required
                    minLength="6"
                  />
                </div>

                <div className="form-field field-before-show-password">
                  <label htmlFor="password2">Powtórz hasło</label>
                  <input
                    type="password"
                    id="password2"
                    name="password2"
                    onChange={this.onChange}
                    className="login-form-input"
                    value={password2}
                    required
                    minLength="6"
                  />
                </div>
                <div className="show-password">
                  <input
                    type="checkbox"
                    id="showPassword"
                    name="showPassword"
                    onChange={this.showPassword}
                    className="login-form-input"
                    placeholder="Pokaż hasło"
                  />
                  <label htmlFor="showPassword">Pokaż hasło</label>
                </div>
                <div className="form-field submit-field">
                  <input
                    type="submit"
                    value="Zarejestruj"
                    className="login-register-submit"
                  />
                </div>
              </form>
            </div>
            <div className="login-register-redirect">
              Masz już konto? <Link to="/login">Zaloguj się</Link>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  serverResponse: state.errorsReducer.data,
});

export default connect(mapStateToProps, { register })(Register);
