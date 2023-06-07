import React, { Component } from 'react';

export default class Home extends Component {
  // componentDidMount() {
  //   document.body.style["background-image"] = "url(media/images/bg.jpg)";
  // }

  // componentWillUnmount() {
  //   document.body.style.backgroundImage = "none";
  // }

  render() {
    return (
      <div className="home-container">
        <div className="home-title">
          <p>Witamy na</p>
          <h2>ReefBase</h2>
        </div>
      </div>
    );
  }
}
