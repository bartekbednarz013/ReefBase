import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import store from "../../store";
import { tokenConfig } from "../../actions/auth";
import { changePassword, deleteAccount } from "../../actions/auth";
import ButterToast from "butter-toast/dist/lean.min.js";
import MyAlert from "../common/MyAlert";

export class Settings extends Component {
  state = {
    password: "",
    password2: "",
    dataLoaded: false,
  };

  static propTypes = {
    changePassword: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  openPasswordChanger = () => {
    document.querySelector(".show-change-password-button").style.display =
      "none";
    document.querySelector(".change-password-form").style.display = "block";
    document.getElementById("password").focus();
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

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

  changePassword = (e) => {
    e.preventDefault();
    const { password, password2 } = this.state;
    if (password !== password2) {
      ButterToast.raise({
        content: (
          <MyAlert type="error" message="Podane hasła muszą być takie same!" />
        ),
      });
    } else {
      this.props.changePassword(password);
      this.setState({ password: "", password2: "" });
      document.querySelector(".show-change-password-button").style.display =
        "block";
      document.querySelector(".change-password-form").style.display = "none";
    }
  };

  openAccountDeleter = () => {
    document.querySelector(".show-delete-account-button").style.display =
      "none";
    document.querySelector(".delete-account-form").style.display = "block";
  };

  deleteAccount = (e) => {
    e.preventDefault();
    this.props.deleteAccount();
  };

  componentDidMount() {
    axios
      .get("/api/auth/cpltuser", tokenConfig(store.getState))
      .then((res) => {
        this.setState({
          dataLoaded: true,
          username: res.data.username,
          email: res.data.email,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          date_joined: res.data.date_joined,
          last_login: res.data.last_login,
          id: res.data.id,
        });
      })
      .catch((err) => {
        ButterToast.raise({
          content: (
            <MyAlert
              type="error"
              message="Nie udało sie pobrać danych użytkownika."
              dismiss
            />
          ),
        });
      });
  }

  render() {
    const {
      dataLoaded,
      username,
      first_name,
      last_name,
      email,
      date_joined,
      last_login,
      password,
      password2,
    } = this.state;

    return (
      <div className="settings-tab">
        <div className="user-info">
          <h2 className="user-info-title">Informacje o Twoim koncie</h2>
          <div className="user-info-wrapper">
            <div className="user-info-inner-wrapper">
              <div className="user-info-field">
                <h3>Nazwa użytkownika</h3>
                <p>{dataLoaded && (username)}</p>
              </div>
              {first_name !== "" && last_name !== "" && (
                <div className="user-info-field">
                  <h3>Imię i nazwisko</h3>
                  <p>{dataLoaded && (first_name, last_name)}</p>
                </div>
              )}
              <div className="user-info-field">
                <h3>Adres email</h3>
                <p>{dataLoaded && (email)}</p>
              </div>
              <div className="user-info-field">
                <h3>Data rejestracji</h3>
                <p>{dataLoaded && (new Date(date_joined).toLocaleString("pl-PL"))}</p>
              </div>
              {last_login !== null && (
                <div className="user-info-field">
                  <h3>Ostatnie logowanie</h3>
                  <p>{dataLoaded && (new Date(last_login).toLocaleString("pl-PL"))}</p>
                </div>
              )}
            </div>
            <div className="user-info-inner-wrapper">
              <div className="user-info-field">
                <h3>Hasło</h3>
                <p
                  onClick={this.openPasswordChanger}
                  className="show-change-password-button"
                >
                  Zmień hasło
                </p>
                <form
                  onSubmit={this.changePassword}
                  className="change-password-form"
                >
                  <div className="form-field">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      onChange={this.onChange}
                      className="login-form-input"
                      value={password}
                      required
                      placeholder="Wpisz nowe hasło"
                      minLength="6"
                    />
                  </div>
                  <div className="form-field">
                    <input
                      type="password"
                      id="password2"
                      name="password2"
                      onChange={this.onChange}
                      className="login-form-input"
                      value={password2}
                      required
                      placeholder="Potwierdź nowe hasło"
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
                      value="Ustaw nowe hasło"
                      className="login-register-submit"
                    />
                  </div>
                </form>
              </div>
              <div className="user-info-field">
                <h3>Konto</h3>
                <p
                  onClick={this.openAccountDeleter}
                  className="show-delete-account-button"
                >
                  Usuń konto
                </p>
                <form
                  onSubmit={this.deleteAccount}
                  className="delete-account-form"
                >
                  <div className="delete-account-input">
                    <input
                      type="checkbox"
                      id="delete-account-checkbox"
                      name="delete-account-checkbox"
                      className="login-form-input"
                      required
                    />
                    <label htmlFor="delete-account-checkbox">
                      Chcę usunąć moje konto.
                    </label>
                  </div>
                  <div className="form-field submit-field">
                    <input
                      type="submit"
                      value="Usuń moje konto"
                      className="login-register-submit"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
});

export default connect(mapStateToProps, { changePassword, deleteAccount })(
  Settings
);
