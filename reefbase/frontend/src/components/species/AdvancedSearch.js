import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ButterToast from 'butter-toast/dist/lean.min.js';
import MyAlert from '../common/MyAlert';
import SpeciesAsListItem from './SpeciesAsListItem';
import { convertStringToArray } from '../../../static/frontend/js/functionToExport';

export default class AdvancedSearch extends Component {
  state = {
    dataLoaded: false,
    searching: false,
    category: '',
    size: '',
    tank_size: '',
    distribution: '',
    food: '',
    picky_eater: '',
    reefsafe: '',
    regnum: '',
    phylum: '',
    classis: '',
    ordo: '',
    familia: '',
    genus: '',
    species: [],
    nextPage: '',
    loadingActive: false,
  };

  onCheckboxChange = (e) => {
    const checkboxNumber = e.target.id.slice(11);
    if (e.target.checked) {
      document
        .getElementById('ds-input' + checkboxNumber)
        .style.setProperty('display', 'block');
    } else {
      document
        .getElementById('ds-input' + checkboxNumber)
        .style.setProperty('display', 'none');
      const stateName = e.target.name.slice(0, -9);
      this.setState({ [stateName]: '' });
    }
  };

  onChange = (e) =>
    this.setState({
      [e.target.name]: e.target.value,
    });

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({ searching: true });

    let params = '';
    Object.entries(this.state).forEach(([key, value]) => {
      if (
        value !== '' &&
        key != 'dataLoaded' &&
        key != 'searching' &&
        key != 'species' &&
        key != 'nextPage' &&
        key != 'loadingActive'
      ) {
        if (key == 'distribution' || key == 'food') {
          let val = convertStringToArray(value);
          val = val.join();
          params += '&' + key + '={' + val + '}';
        } else {
          params += '&' + key + '=' + value;
        }
      }
    });
    params = params.substring(1);
    axios
      .get(`/api/filter?${params}`)
      .then((res) => {
        this.setState({
          species: res.data.results,
          dataLoaded: true,
          nextPage: res.data.next,
        });
        document.getElementById('ds-results').scrollIntoView();
        window.addEventListener('scroll', this.loadMore);
      })
      .catch((err) => {
        ButterToast.raise({
          content: (
            <MyAlert
              type="error"
              message="Nie udało sie pobrać danych"
              dismiss
            />
          ),
        });
      });
  };

  loadMore = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 80 >=
        document.scrollingElement.scrollHeight &&
      this.state.nextPage &&
      !this.state.loadingActive
    ) {
      this.setState({ loadingActive: true });
      axios
        .get(this.state.nextPage)
        .then((res) => {
          this.setState({
            species: [...this.state.species, ...res.data.results],
            nextPage: res.data.next,
            loadingActive: false,
          });
        })
        .catch((err) => {
          ButterToast.raise({
            content: (
              <MyAlert
                type="error"
                message="Nie udało sie pobrać danych"
                dismiss
              />
            ),
          });
        });
    }
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.loadMore);
  }

  render() {
    const {
      species,
      dataLoaded,
      searching,
      category,
      size,
      tank_size,
      distribution,
      food,
      picky_eater,
      reefsafe,
      regnum,
      phylum,
      classis,
      ordo,
      familia,
      genus,
    } = this.state;

    return (
      <div className="detailed-search-container">
        <div className=" login-header ds-header">
          Wyszukiwarka szczegółowa
          <p>Znajdź zwierzęta pasujące do Twojego akwarium</p>
        </div>
        <div className="ds-content">
          <div className="ds-options-container">
            <h3>Wybierz parametry, po których chcesz szukać</h3>
            <div className="ds-options">
              <div className="ds-option">
                <input
                  type="checkbox"
                  id="ds-checkbox1"
                  name="category-checkbox"
                  onChange={this.onCheckboxChange}
                />
                <label htmlFor="ds-checkbox1">Kategoria</label>
              </div>
              <div className="ds-option">
                <input
                  type="checkbox"
                  id="ds-checkbox2"
                  name="size-checkbox"
                  onChange={this.onCheckboxChange}
                />
                <label htmlFor="ds-checkbox2">Osiągane rozmiary</label>
              </div>
              <div className="ds-option">
                <input
                  type="checkbox"
                  id="ds-checkbox3"
                  name="tank_size-checkbox"
                  onChange={this.onCheckboxChange}
                />
                <label htmlFor="ds-checkbox3">Pojemność akwarium</label>
              </div>
              <div className="ds-option">
                <input
                  type="checkbox"
                  id="ds-checkbox4"
                  name="regnum-checkbox"
                  onChange={this.onCheckboxChange}
                />
                <label htmlFor="ds-checkbox4">Królestwo</label>
              </div>
              <div className="ds-option">
                <input
                  type="checkbox"
                  id="ds-checkbox5"
                  name="phylum-checkbox"
                  onChange={this.onCheckboxChange}
                />
                <label htmlFor="ds-checkbox5">Typ</label>
              </div>
              <div className="ds-option">
                <input
                  type="checkbox"
                  id="ds-checkbox6"
                  name="classis-checkbox"
                  onChange={this.onCheckboxChange}
                />
                <label htmlFor="ds-checkbox6">Gromada</label>
              </div>
              <div className="ds-option">
                <input
                  type="checkbox"
                  id="ds-checkbox7"
                  name="ordo-checkbox"
                  onChange={this.onCheckboxChange}
                />
                <label htmlFor="ds-checkbox7">Rząd</label>
              </div>
              <div className="ds-option">
                <input
                  type="checkbox"
                  id="ds-checkbox8"
                  name="familia-checkbox"
                  onChange={this.onCheckboxChange}
                />
                <label htmlFor="ds-checkbox8">Rodzina</label>
              </div>
              <div className="ds-option">
                <input
                  type="checkbox"
                  id="ds-checkbox9"
                  name="genus-checkbox"
                  onChange={this.onCheckboxChange}
                />
                <label htmlFor="ds-checkbox9">Rodzaj</label>
              </div>
              <div className="ds-option">
                <input
                  type="checkbox"
                  id="ds-checkbox10"
                  name="distribution-checkbox"
                  onChange={this.onCheckboxChange}
                />
                <label htmlFor="ds-checkbox10">Występowanie</label>
              </div>
              <div className="ds-option">
                <input
                  type="checkbox"
                  id="ds-checkbox11"
                  name="food-checkbox"
                  onChange={this.onCheckboxChange}
                />
                <label htmlFor="ds-checkbox11">Pożywienie</label>
              </div>
              <div className="ds-option">
                <input
                  type="checkbox"
                  id="ds-checkbox12"
                  name="picky_eater-checkbox"
                  onChange={this.onCheckboxChange}
                />
                <label htmlFor="ds-checkbox12">Specjalista pokarmowy</label>
              </div>
              <div className="ds-option">
                <input
                  type="checkbox"
                  id="ds-checkbox13"
                  name="reefsafe-checkbox"
                  onChange={this.onCheckboxChange}
                />
                <label htmlFor="ds-checkbox13">Bezpieczny dla rafy</label>
              </div>
            </div>
          </div>
          <form className="ds-inputs-container" onSubmit={this.onSubmit}>
            <div className="ds-inputs">
              <div className="form-field ds-input" id="ds-input1">
                <label htmlFor="category">Kategoria</label>
                <select
                  id="category"
                  name="category"
                  onChange={this.onChange}
                  value={category}
                >
                  <option value="" disabled>
                    Wybierz
                  </option>
                  <option value="fish">Ryby</option>
                  <option value="soft">Miękkie</option>
                  <option value="sps">SPS</option>
                  <option value="lps">LPS</option>
                  <option value="nps">NPS</option>
                  <option value="anemones">Ukwiały</option>
                  <option value="crustaceans">Skorupiaki</option>
                  <option value="molluscs">Mięczaki</option>
                  <option value="echinoderms">Szkarłupnie</option>
                </select>
              </div>
              <div className="form-field ds-input" id="ds-input2">
                <label htmlFor="size">Osiągane rozmiary [cm]</label>
                <input
                  type="number"
                  min="0"
                  id="size"
                  name="size"
                  onChange={this.onChange}
                  value={size}
                />
              </div>
              <div className="form-field ds-input" id="ds-input3">
                <label htmlFor="tank_size">Pojemność akwarium [l]</label>
                <input
                  type="number"
                  min="0"
                  id="tank_size"
                  name="tank_size"
                  onChange={this.onChange}
                  value={tank_size}
                />
              </div>
              <div className="form-field ds-input" id="ds-input4">
                <label htmlFor="regnum">Królestwo</label>
                <input
                  type="text"
                  id="regnum"
                  name="regnum"
                  onChange={this.onChange}
                  value={regnum}
                />
              </div>
              <div className="form-field ds-input" id="ds-input5">
                <label htmlFor="phylum">Typ</label>
                <input
                  type="text"
                  id="phylum"
                  name="phylum"
                  onChange={this.onChange}
                  value={phylum}
                />
              </div>
              <div className="form-field ds-input" id="ds-input6">
                <label htmlFor="classis">Gromada</label>
                <input
                  type="text"
                  id="classis"
                  name="classis"
                  onChange={this.onChange}
                  value={classis}
                />
              </div>
              <div className="form-field ds-input" id="ds-input7">
                <label htmlFor="ordo">Rząd</label>
                <input
                  type="text"
                  id="ordo"
                  name="ordo"
                  onChange={this.onChange}
                  value={ordo}
                />
              </div>
              <div className="form-field ds-input" id="ds-input8">
                <label htmlFor="familia">Rodzina</label>
                <input
                  type="text"
                  id="familia"
                  name="familia"
                  onChange={this.onChange}
                  value={familia}
                />
              </div>
              <div className="form-field ds-input" id="ds-input9">
                <label htmlFor="genus">Rodzaj</label>
                <input
                  type="text"
                  id="genus"
                  name="genus"
                  onChange={this.onChange}
                  value={genus}
                />
              </div>
              <div className="form-field ds-input" id="ds-input10">
                <label htmlFor="distribution">Występowanie</label>
                <input
                  type="text"
                  id="distribution"
                  name="distribution"
                  onChange={this.onChange}
                  value={distribution}
                />
              </div>
              <div className="form-field ds-input" id="ds-input11">
                <label htmlFor="food">Pożywienie</label>
                <input
                  type="text"
                  id="food"
                  name="food"
                  onChange={this.onChange}
                  value={food}
                />
              </div>
              <div className="form-field ds-input" id="ds-input12">
                <label htmlFor="picky_eater">Specjalista pokarmowy</label>
                <select
                  id="picky_eater"
                  name="picky_eater"
                  onChange={this.onChange}
                  value={picky_eater}
                >
                  <option value="" disabled>
                    Wybierz
                  </option>
                  <option value={false}>nie</option>
                  <option value={true}>tak</option>
                </select>
              </div>
              <div className="form-field ds-input" id="ds-input13">
                <label htmlFor="reefsafe">Bezpieczny dla rafy</label>
                <select
                  id="reefsafe"
                  name="reefsafe"
                  onChange={this.onChange}
                  value={reefsafe}
                >
                  <option value="" disabled>
                    Wybierz
                  </option>
                  <option value={false}>nie</option>
                  <option value={true}>tak</option>
                </select>
              </div>
            </div>
            <div className="form-field  ds-submit-field">
              <input type="submit" value="Szukaj" />
            </div>
          </form>
        </div>
        <div className="ds-results" id="ds-results">
          {!dataLoaded && searching && <div className="loading"></div>}
          {dataLoaded && searching && !species.length && (
            <div className="ds-species-list">
              Brak gatunków spełniających wymagania
            </div>
          )}
          {dataLoaded && (
            <div className="ds-species-list">
              {species.map((species) => (
                <SpeciesAsListItem
                  key={species.id}
                  linkTo={`/species/${species.slug}`}
                  species={species.species}
                  image={species.image}
                  image_thumbnail={species.image_thumbnail}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}
