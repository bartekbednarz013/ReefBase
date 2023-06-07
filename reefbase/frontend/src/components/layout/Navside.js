import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navside extends Component {
  render() {
    return (
      <div className="navside">
        <div className="navside-bg"></div>
        <div className="navside-wrapper">
          <div className="navside-header">
            <p>
              Baza wiedzy o organizmach morskich tworzona przez użytkowników.
            </p>
          </div>
          <nav className="navside-list-wrapper">
            <ul className="navside-list">
              <NavsideItem
                p="Chcesz pomóc rozbudowywać naszą bazę?"
                a="Dodaj opis nowego gatunku"
                aLinkTo="/addSpecies"
              />
              <NavsideItem
                p="Zastanawiasz się jakie zwierze pasuje do Twojego akwarium?"
                a="Sprawdź naszą szczegółową wyszukiwarkę"
                aLinkTo="/advancedSearch"
              />
              <NavsideItem
                p="Zauważyłeś błąd w aplikacji lub masz pomysł jak ją ulepszyć?"
                a="Zgłoś go tutaj"
                aLinkTo="/mistakeReport/app"
              />
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}

const NavsideItem = (props) => {
  return (
    <li className="navside-item">
      <p>{props.p}</p>
      <Link to={props.aLinkTo} className="navside-link">
        {props.a}
      </Link>
    </li>
  );
};
