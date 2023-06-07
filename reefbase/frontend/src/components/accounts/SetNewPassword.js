import React, { Component, Fragment } from "react";
import axios from "axios";
import ButterToast from "butter-toast";
import MyAlert from "../common/MyAlert";
import { Navigate, useParams } from "react-router-dom";

export default function SetNewPassword() {
  const { link } = useParams();

  return <SetNewPasswordComp link={link} />;
}

class SetNewPasswordComp extends Component {
  state = {
    password: "",
    password2: "",
    passwordChanged: false,
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
    const { link } = this.props;
    if (password !== password2) {
      ButterToast.raise({
        content: (
          <MyAlert type="error" message="Podane hasła muszą być takie same!" />
        ),
      });
    } else {
      axios
        .post(`/api/auth/setNewPassword`, {
          link: link,
          password: password,
        })
        .then((res) => {
          ButterToast.raise({
            content: (
              <MyAlert type="alert" title={res.data.detail} dismiss />
            ),
          });
          this.setState({
            passwordChanged: true,
          });
        })
        .catch((err) => {
          ButterToast.raise({
            content: (
              <MyAlert
                type="error"
                message={err.response.data.detail}
                dismiss
              />
            ),
          });
        });
      this.setState({ password: "", password2: "" });
    }
  };

  render() {
    const { password, password2, passwordChanged } = this.state;

    if (passwordChanged) {
      return <Navigate to="/login" />;
    }
    return (
      <div className="login-outer-wrapper">
        <div className="login-wrapper">
          <div className="login-header">Ustaw nowe hasło</div>
          <form className="login-form" onSubmit={this.changePassword}>
            <div className="form-field">
              <label htmlFor="password">Hasło</label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={this.onChange}
                className="password-form-input"
                value={password}
                required
                minLength="6"
              />
            </div>
            <div className="form-field field-before-show-password">
              <label htmlFor="password2">Potwierdź hasło</label>
              <input
                type="password"
                id="password2"
                name="password2"
                className="login-form-input"
                onChange={this.onChange}
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
                value="Ustaw nowe hasło"
                className="login-register-submit"
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}
