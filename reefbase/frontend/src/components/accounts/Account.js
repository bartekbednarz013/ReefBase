import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Navigate, Link, Outlet } from "react-router-dom";
import { logout } from "../../actions/auth";
import LogoutIcon from "../../../static/frontend/icons/svg/logout.svg";

export class Dashboard extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
  };

  state = {
    active_tab: "",
  };

  activateTab = (e) => {
    if (this.state.active_tab) {
      document
        .getElementById(this.state.active_tab)
        .classList.remove("account-tab-link-active");
    }

    this.setState({ active_tab: e.target.id });
    document
      .getElementById(e.target.id)
      .classList.add("account-tab-link-active");
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const { active_tab } = this.state;

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    } else {
      return (
        <div className="account-container">
          <div className="acccount-header">
            <div className="acccount-header-title">Twoje konto</div>
            <Link to="/" className="logout-link" onClick={this.props.logout}>
              <span>Wyloguj</span>
              <LogoutIcon />
            </Link>
          </div>
          <div className="account-tabs">
            <div className="account-tabs-links">
              <Link
                to="addedSpecies"
                className="account-tab-link"
                id="species-tab"
                onClick={this.activateTab}
              >
                Gatunki
              </Link>
              <Link
                to="addedComments"
                className="account-tab-link"
                id="comments-tab"
                onClick={this.activateTab}
              >
                Komentarze
              </Link>
              <Link
                to="settings"
                className="account-tab-link"
                id="settings-tab"
                onClick={this.activateTab}
              >
                Ustawienia
              </Link>
              {user.is_staff && (
                <Link
                  to="admin"
                  className="account-tab-link"
                  id="admin-tab"
                  onClick={this.activateTab}
                >
                  Admin
                </Link>
              )}
            </div>
            <div className="tab-content">
              {active_tab === "" && (
                <div className="starter-tab">
                  <h2>Cześć {user.username}!</h2>
                  <p>Wybierz jedną z powyższych zakładek</p>
                </div>
              )}
              <Outlet />
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({ auth: state.authReducer });

export default connect(mapStateToProps, { logout })(Dashboard);
