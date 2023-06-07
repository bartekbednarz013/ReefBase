import React, { Component } from "react";
import { Navigate, Link, Outlet } from "react-router-dom";

export default class Admin extends Component {
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
    const { active_tab } = this.state;

    return (
      <div className="admin-tab">
        <div className="admin-header">
          <h2 className="admin-title">Panel administracyjny</h2>
        </div>
        <div className="account-tabs">
          <div className="account-tabs-links">
            <Link
              to="speciesToAccept"
              className="account-tab-link"
              id="species-to-acccept-tab"
              onClick={this.activateTab}
            >
              Gatunki do akceptacji
            </Link>
            <Link
              to="reportedMistakes"
              className="account-tab-link"
              id="reported mistakes-tab"
              onClick={this.activateTab}
            >
              Zgłoszone błędy
            </Link>
          </div>
          <div className="tab-content">
            {active_tab === "" && (
              <div className="starter-tab">
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
