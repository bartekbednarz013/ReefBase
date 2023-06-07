import PropTypes from "prop-types";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import ButterToast from "butter-toast/dist/lean.min.js";
import MyAlert from "../common/MyAlert";

export class AuthAlerts extends Component {
  static propTypes = { error: PropTypes.object.isRequired };

  componentDidUpdate(prevProps) {
    const { error } = this.props;

    // console.log(error);

    // invalid username/password
    if (error.data.non_field_errors) {
      ButterToast.raise({
        content: (
          <MyAlert
            type="error"
            message={error.data.non_field_errors.join()}
            dismiss
          />
        ),
      });
    }

    // username already exists
    if (error.data.username) {
      ButterToast.raise({
        content: (
          <MyAlert type="error" message={error.data.username.join()} dismiss />
        ),
      });
    }

    // invalid email/already used
    if (error.data.email) {
      let message = "";
      if (
        error.data.email.join() ===
        "Istnieje już użytkownik z tą wartością pola adres e-mail."
      ) {
        message = "Użytkownik z takim adresem e-mail już istnieje.";
      } else {
        message = error.data.email.join();
      }
      ButterToast.raise({
        content: <MyAlert type="error" message={message} dismiss />,
      });
    }

    // account deleted, password changed, etc.
    if (error.data.detail && error.status != 401) {
      ButterToast.raise({
        content: <MyAlert type="alert" title={error.data.detail} dismiss />,
      });
    }

    if (error.status == 500) {
      // internal error server
      ButterToast.raise({
        content: (
          <MyAlert
            type="error"
            message="Wystąpił problem z serwerem. Spróbuj ponownie później."
            dismiss
          />
        ),
      });
    }
  }

  render() {
    return <Fragment />;
  }
}

const mapStateToProps = (state) => ({
  error: state.errorsReducer,
});

export default connect(mapStateToProps)(AuthAlerts);
