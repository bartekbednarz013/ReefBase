import React, { Component, Fragment } from "react";
import ButterToast, {
  POS_BOTTOM,
  POS_LEFT,
} from "butter-toast/dist/lean.min.js";
import AuthAlerts from "../accounts/AuthAlerts";

export default class AlertsTray extends Component {
  render() {
    const position = { horizontal: POS_LEFT, vertical: POS_BOTTOM };
    var style = {};
    const desktop = window.matchMedia("(min-width: 960px)");
    if (desktop.matches) {
      style = {
        left: "calc(var(--main-margin)*0.5 - 10px)",
        bottom: "calc(var(--main-margin)*0.5)",
      };
    } else {
      style = {
        left: "max((100% - var(--mobile-alert-width))/2 - 10px, 0px)",
        bottom: "calc(var(--bottom-bar-height) + var(--main-margin)*0.5)",
      };
    }

    return (
      <Fragment>
        <ButterToast
          className="alerts-tray"
          position={position}
          timeout={6000}
          style={style}
        />
        <AuthAlerts />
      </Fragment>
    );
  }
}
