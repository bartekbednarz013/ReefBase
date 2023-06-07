import React, { Component, Fragment } from "react";
import axios from "axios";
import ButterToast from "butter-toast";
import MyAlert from "../common/MyAlert";
import { Navigate, useParams } from "react-router-dom";

export default function Activation() {
  const { link } = useParams();

  return <ActivationComp link={link} />;
}

class ActivationComp extends Component {
  state = {
    activated: false,
  };

  componentDidMount() {
    const { link } = this.props;
    axios
      .post(`/api/auth/activateAccount`, { link: link })
      .then((res) => {
        ButterToast.raise({
          content: (
            <MyAlert
              type="alert"
              title="Konto zostało aktywowane!"
              message="Możesz sie zalogować"
              dismiss
            />
          ),
        });
        this.setState({
          activated: true,
        });
      })
      .catch((err) => {
        ButterToast.raise({
          content: (
            <MyAlert
              type="error"
              message="Nie udało sie aktywować Twojego konta"
              dismiss
            />
          ),
        });
      });
  }

  render() {
    const { activated } = this.state;

    if (activated) {
      return <Navigate to="/login" />;
    }
    return (
      <div>
        Trwa aktywacja Twojego konta...<div className="loading"></div>
      </div>
    );
  }
}
