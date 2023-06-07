import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";

export class Login extends Component {
  state = {
    username: "",
    password: "",
  };

  static propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.props.login(this.state.username, this.state.password);
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    if (this.props.isAuthenticated) {
      return <Navigate to="/account" />;
    }
    const { username, password } = this.state;
    return (
      <div className="login-outer-wrapper">
        <div className="login-wrapper">
          <div className="login-header">Zaloguj się</div>
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
              <div className="password-grid">
                <label htmlFor="password">Hasło</label>
                <div className="reset-password">
                  <Link to="/forgottenPassword" className="reset-password-link">
                    Zapomniałeś hasła?
                  </Link>
                </div>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                className="login-form-input"
                onChange={this.onChange}
                value={password}
                required
              />
            </div>
            <div className="form-field submit-field">
              <input
                type="submit"
                value="Zaloguj"
                className="login-register-submit"
              />
            </div>
          </form>
        </div>
        <div className="login-register-redirect">
          Nie masz jeszcze konta? <Link to="/register">Zarejestruj się</Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
