import React, { Component } from 'react';
import axios from 'axios';
import ButterToast from 'butter-toast/dist/lean.min.js';
import MyAlert from '../common/MyAlert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { convertStringToArray } from '../../../static/frontend/js/functionToExport';

export class Form extends Component {
  state = {
    slug: '',
    species: '',
    category: '',
    size: '',
    min_tank: '',
    distribution: '',
    food: '',
    picky_eater: false,
    reefsafe: true,
    regnum: '',
    phylum: '',
    classis: '',
    ordo: '',
    familia: '',
    genus: '',
    image: '',
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onCategoryChange = (e) => {
    this.setState({ category: e.target.value });
    if (
      e.target.value == 'soft' ||
      e.target.value == 'sps' ||
      e.target.value == 'lps' ||
      e.target.value == 'nps'
    ) {
      document.querySelector('.size-field').style['display'] = 'none';
      document.querySelector('.min-tank-field').style['display'] = 'none';
      document.querySelector('.picky-eater-field').style['display'] = 'none';
      document.querySelector('.reefsafe-field').style['display'] = 'none';
      document.getElementById('min_tank').required = false;
      document.getElementById('size').required = false;
    } else {
      document.querySelector('.size-field').style['display'] = 'block';
      document.querySelector('.min-tank-field').style['display'] = 'block';
      document.querySelector('.picky-eater-field').style['display'] = 'block';
      document.querySelector('.reefsafe-field').style['display'] = 'block';
      document.getElementById('min_tank').required = true;
      document.getElementById('size').required = true;
    }
  };

  onSpeciesChange = (e) => {
    this.setState({
      species: e.target.value,
      slug: e.target.value.replace(/\s+/g, '-').toLowerCase(),
    });
  };

  imageHandler = (e) => {
    const file = e.target.files[0];
    const imagePreview = document.querySelector('.imagePreview');
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|)$/i;
    if (file != undefined) {
      if (!allowedExtensions.exec(e.target.value)[0]) {
        e.target.value = null;
        this.setState({ image: '' });
        imagePreview.style['display'] = 'none';
        ButterToast.raise({
          content: (
            <MyAlert
              type="error"
              message="Niewłaściwy format pliku. Akceptowane formaty: .jpg, .jpeg, .png"
            />
          ),
        });
      } else {
        if (file.size / 1000000 <= 5) {
          imagePreview.src = URL.createObjectURL(file);
          imagePreview.style['display'] = 'block';
          this.setState({ image: file });
        } else {
          e.target.value = null;
          this.setState({ image: '' });
          imagePreview.style['display'] = 'none';
          const message =
            'Dodany plik jest za duży: ' +
            (file.size / 1000000).toFixed(2) +
            ' MB' +
            '. Maksymalny rozmiar pliku to 1MB.';
          ButterToast.raise({
            content: <MyAlert type="error" message={message} />,
          });
        }
      }
    } else {
      imagePreview.style['display'] = 'none';
      this.setState({ image: '' });
    }
  };

  onSubmit = (e) => {
    e.preventDefault();

    if (this.props.auth.isAuthenticated) {
      let data = new FormData();

      Object.entries(this.state).forEach(([key, value]) => {
        if (key == 'image') {
          const prevFilename = value.name;
          const extension = prevFilename.slice(
            ((prevFilename.lastIndexOf('.') - 1) >>> 0) + 2
          );
          const filename = this.state.slug + '.' + extension;
          data.append(key, value, filename);
        } else if (key == 'distribution' || key == 'food') {
          const val = convertStringToArray(value);
          val.forEach((item) => {
            data.append(key, item);
          });
        } else {
          data.append(key, value);
        }
      });
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      config.headers['Authorization'] = `Token ${this.props.auth.token}`;
      axios
        .post(`/api/species/`, data, config)
        .then((res) => {
          ButterToast.raise({
            content: (
              <MyAlert
                type="alert"
                title="Pomyślnie dodano"
                message="Gatunek pojawi się w bazie po zatwierdzenu przez administratora"
                dismiss
              />
            ),
          });
          this.setState({
            slug: '',
            species: '',
            category: '',
            size: '',
            min_tank: '',
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
            image: '',
          });
          document.querySelector('.imagePreview').style['display'] = 'none';
          document.getElementById('image').value = null;
        })
        .catch((err) => {
          if (err.response.data.slug) {
            ButterToast.raise({
              content: (
                <MyAlert
                  type="error"
                  message="Ten gatunek znajduje się już w bazie lub czeka na zatwierdzenie przez administratora"
                />
              ),
            });
          } else {
            ButterToast.raise({
              content: <MyAlert type="error" message="Coś poszło nie tak..." />,
            });
          }
        });
    } else {
      ButterToast.raise({
        content: (
          <MyAlert
            type="error"
            message="Żeby dodać nowy gatunek musisz być zalogowany"
          />
        ),
      });
    }
  };

  render() {
    const {
      species,
      category,
      size,
      min_tank,
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

    const { isAuthenticated } = this.props.auth;

    return (
      <div className="add-species-container">
        {!isAuthenticated && (
          <div className="login-required-info">
            Żeby dodać nowy gatunek, musisz być zalogowany
          </div>
        )}
        <div className="login-header">Dodaj nowy gatunek</div>
        <form onSubmit={this.onSubmit} className="add-species-form">
          <div className="main-fields-wrapper">
            <div className="form-field">
              <label htmlFor="name">Gatunek</label>
              <input
                type="text"
                id="species"
                name="species"
                onChange={this.onSpeciesChange}
                value={species}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="category">Kategoria</label>
              <select
                id="category"
                name="category"
                onChange={this.onCategoryChange}
                value={category}
                required
              >
                <option value="" disabled>
                  Wybierz kategorię
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
            <div className="form-field size-field">
              <label htmlFor="size">Osiągane rozmiary [cm]</label>
              <input
                type="number"
                min="0"
                step="any"
                id="size"
                name="size"
                onChange={this.onChange}
                value={size}
              />
            </div>
            <div className="form-field min-tank-field">
              <label htmlFor="min_tank">Minimalna pojemność akwarium [l]</label>
              <input
                type="number"
                min="0"
                id="min_tank"
                name="min_tank"
                onChange={this.onChange}
                value={min_tank}
              />
            </div>
            <div className="form-field">
              <label htmlFor="distribution">Występowanie</label>
              <textarea
                rows="2"
                id="distribution"
                name="distribution"
                onChange={this.onChange}
                value={distribution}
                required
              ></textarea>
            </div>
            <div className="form-field">
              <label htmlFor="food">Pożywienie</label>
              <textarea
                rows="2"
                id="food"
                name="food"
                onChange={this.onChange}
                value={food}
                required
              ></textarea>
            </div>
          </div>
          <div className="form-field species-image-form-field">
            <label htmlFor="image">Zdjęcie</label>
            <img className="imagePreview" src="#" />
            <input
              type="file"
              accept="image/*"
              id="image"
              name="image"
              onChange={this.imageHandler}
              className="species-image-input"
              required
            />
          </div>
          <div className="form-field picky-eater-field">
            <label htmlFor="picky_eater">Specjalista pokarmowy</label>
            <select
              id="picky_eater"
              name="picky_eater"
              onChange={this.onChange}
              value={picky_eater}
            >
              <option value={false}>nie</option>
              <option value={true}>tak</option>
            </select>
          </div>
          <div className="form-field reefsafe-field">
            <label htmlFor="reefsafe">Bezpieczny dla rafy</label>
            <select
              id="reefsafe"
              name="reefsafe"
              onChange={this.onChange}
              value={reefsafe}
            >
              <option value={true}>tak</option>
              <option value={false}>nie</option>
            </select>
          </div>
          <div className="classification-fields-wrapper">
            <span className="classification-fields-header">
              Kategorie systematyczne
            </span>
            <div className="form-field">
              <label htmlFor="regnum">Królestwo</label>
              <input
                type="text"
                id="regnum"
                name="regnum"
                onChange={this.onChange}
                value={regnum}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="phylum">Typ</label>
              <input
                type="text"
                id="phylum"
                name="phylum"
                onChange={this.onChange}
                value={phylum}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="classis">Gromada</label>
              <input
                type="text"
                id="classis"
                name="classis"
                onChange={this.onChange}
                value={classis}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="ordo">Rząd</label>
              <input
                type="text"
                id="ordo"
                name="ordo"
                onChange={this.onChange}
                value={ordo}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="familia">Rodzina</label>
              <input
                type="text"
                id="familia"
                name="familia"
                onChange={this.onChange}
                value={familia}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="genus">Rodzaj</label>
              <input
                type="text"
                id="genus"
                name="genus"
                onChange={this.onChange}
                value={genus}
                required
              />
            </div>
          </div>

          <div className="form-field submit-field">
            <input type="submit" value="Dodaj" />
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ auth: state.authReducer });

export default connect(mapStateToProps)(Form);
