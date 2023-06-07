import React, { Component, Fragment } from "react";
import axios from "axios";

export default class ForgottenPassword extends Component {
  state = {
    email: "",
    form_sent: false,
  };

  onChange = (e) => this.setState({ email: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();
    const email = this.state.email;
    axios.post("/api/auth/forgottenPassword", { email: email });
    this.setState({ form_sent: true });
  };

  render() {
    return (
      <Fragment>
        {this.state.form_sent && (
          <div className="forgotten-password-info">
            <div className="login-header">Wiadomość email została wysłana.</div>
            W swojej skrzynce mailowej znajdziesz wiadomość z linkiem do
            ustawienia nowego hasła.
          </div>
        )}
        {!this.state.form_sent && (
          <div className="login-outer-wrapper">
            <div className="login-wrapper">
              <div className="login-header">Odzyskiwanie hasła</div>
              <form className="login-form" onSubmit={this.onSubmit}>
                <div className="form-field email-field">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={this.onChange}
                    className="login-form-input"
                    value={this.state.email}
                    required
                    placeholder="Podaj swój email"
                  />
                </div>
                <div className="form-field submit-field">
                  <input
                    type="submit"
                    value="Odzyskaj hasło"
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
