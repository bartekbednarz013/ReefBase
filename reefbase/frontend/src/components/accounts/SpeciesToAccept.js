import React, { Component, Fragment } from 'react';
import axios from 'axios';
import store from '../../store';
import { tokenConfig } from '../../actions/auth';
import ButterToast from 'butter-toast/dist/lean.min.js';
import MyAlert from '../common/MyAlert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { convertStringToArray } from '../../../static/frontend/js/functionToExport';

export class SpeciesToAccept extends Component {
  state = {
    nextPage: '',
    speciesList: [],
    dataLoaded: false,
    activeSpeciesId: '',
    activeSpecies: {
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
      accepted: '',
      accepted_by: null,
    },
    prevImage: '',
    imageChanged: false,
    image_src: '',
    slug: '',
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  openEditor = (species) => {
    this.setState({
      activeSpeciesId: species.id,
      activeSpecies: species,
      prevImage: species.image,
      imageChanged: false,
      image_src: species.image,
      slug: species.slug,
    });
  };

  closeEditor = () => {
    let speciesList = this.state.speciesList;
    if (this.state.activeSpecies.accepted == true) {
      speciesList.splice(
        speciesList.findIndex((v) => v.id === this.state.activeSpeciesId),
        1
      );
    } else {
      const index = speciesList.findIndex(
        (v) => v.id === this.state.activeSpeciesId
      );
      let activeSpc = this.state.activeSpecies;
      activeSpc['image'] = this.state.image_src;
      speciesList[index] = activeSpc;
    }
    this.setState({ activeSpeciesId: '', speciesList: speciesList });
  };

  onChange = (e) => {
    let copyActiveSpecies = {
      ...this.state.activeSpecies,
      [e.target.name]: e.target.value,
    };
    this.setState({ activeSpecies: copyActiveSpecies });
  };

  onCategoryChange = (e) => {
    let copyActiveSpecies = {
      ...this.state.activeSpecies,
      category: e.target.value,
    };
    this.setState({ activeSpecies: copyActiveSpecies });
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
    let copyActiveSpecies = {
      ...this.state.activeSpecies,
      species: e.target.value,
      slug: e.target.value.replace(/\s+/g, '-').toLowerCase(),
    };
    this.setState({ activeSpecies: copyActiveSpecies });
  };

  imageHandle = (e) => {
    const file = e.target.files[0];
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|)$/i;
    if (file != undefined) {
      if (!allowedExtensions.exec(e.target.value)[0]) {
        e.target.value = null;
        ButterToast.raise({
          content: (
            <MyAlert
              type="error"
              message="Niewłaściwy format pliku. Akceptowane formaty: .jpg, .jpeg, .png"
            />
          ),
        });
      } else {
        if (file.size / 1000000 <= 1) {
          const img_url = URL.createObjectURL(file);
          let copyActiveSpecies = {
            ...this.state.activeSpecies,
            image: file,
          };
          this.setState({
            activeSpecies: copyActiveSpecies,
            imageChanged: true,
            image_src: img_url,
          });
          document.getElementById('image').required = true;
        } else {
          e.target.value = null;
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
    }
  };

  setBackPrevImage = () => {
    let copyActiveSpecies = {
      ...this.state.activeSpecies,
      image: this.state.prevImage,
    };
    this.setState({
      activeSpecies: copyActiveSpecies,
      imageChanged: false,
      image_src: this.state.prevImage,
    });
    document.getElementById('image').value = null;
    document.getElementById('image').required = false;
  };

  onAcceptSelectChange = (e) => {
    let copyActiveSpecies = null;
    if (e.target.value == 'true') {
      copyActiveSpecies = {
        ...this.state.activeSpecies,
        [e.target.name]: true,
        accepted_by: this.props.auth.user.id,
      };
    } else {
      copyActiveSpecies = {
        ...this.state.activeSpecies,
        [e.target.name]: false,
        accepted_by: null,
      };
    }
    this.setState({ activeSpecies: copyActiveSpecies });
  };

  updateSpecies = (e) => {
    e.preventDefault();

    const prepareData = () => {
      if (this.state.imageChanged) {
        let data = new FormData();
        Object.entries(this.state.activeSpecies).forEach(([key, value]) => {
          if (key == 'image') {
            const prevFilename = value.name;
            const extension = prevFilename.slice(
              ((prevFilename.lastIndexOf('.') - 1) >>> 0) + 2
            );
            const filename = this.state.slug + '.' + extension;
            data.append(key, value, filename);
          } else if (
            (key == 'distribution' || key == 'food') &&
            !(value instanceof Array)
          ) {
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
        return { data, config };
      } else {
        let data = {};
        Object.entries(this.state.activeSpecies).forEach(([key, value]) => {
          if (key != 'image') {
            if (
              (key == 'distribution' || key == 'food') &&
              !(value instanceof Array)
            ) {
              const val = convertStringToArray(value);
              data[key] = val;
            } else {
              data[key] = value;
            }
          }
        });
        const config = tokenConfig(store.getState);
        return { data, config };
      }
    };

    const { data, config } = prepareData();

    axios
      .put(`/api/species/${this.state.slug}/`, data, config)
      .then((res) => {
        let message = '';
        if (this.state.activeSpecies.accepted == true) {
          message = 'Gatunek został zaakceptowany';
        } else {
          message =
            'Zmiany zostały zapisane, ale gatunek nadal oczekuje na akceptację';
        }
        ButterToast.raise({
          content: <MyAlert type="alert" title={message} dismiss />,
        });
        this.closeEditor();
      })
      .catch((err) => {
        ButterToast.raise({
          content: <MyAlert type="error" message="Coś poszło nie tak..." />,
        });
      });
  };

  loadMore = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 80 >=
        document.scrollingElement.scrollHeight &&
      this.state.nextPage
    ) {
      axios
        .get(this.state.nextPage)
        .then((res) => {
          this.setState({
            speciesList: [...this.state.speciesList, ...res.data.results],
            nextPage: res.data.next,
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

  componentDidMount() {
    axios
      .get('/api/admin/unacceptedSpecies', tokenConfig(store.getState))
      .then((res) => {
        this.setState({
          nextPage: res.data.next,
          speciesList: res.data.results,
          dataLoaded: true,
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
    window.addEventListener('scroll', this.loadMore);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.loadMore);
  }

  render() {
    const {
      speciesList,
      activeSpeciesId,
      activeSpecies,
      image_src,
      imageChanged,
      dataLoaded,
    } = this.state;

    const count = speciesList.length;

    return (
      <div className="added-species-tab">
        <div className="added-species-header">
          <h2 className="added-species-title">
            Gatunki oczekujące na akceptację:
          </h2>
          {count !== 0 && (
            <div className="added-species-counter">
              Liczba gatunków oczekujących na akceptację: {count}
            </div>
          )}
        </div>
        {!dataLoaded && <div className="loading"></div>}
        {dataLoaded && !speciesList.length && (
          <div className="nothing-to-see-here">
            Obecnie nie ma żadnych gatunków oczekujących na akceptację
          </div>
        )}
        {dataLoaded && (
          <div className="category-species-list">
            {speciesList.map((species) => (
              <Fragment key={species.id}>
                <div
                  className="species-wrapper"
                  onClick={() => {
                    this.openEditor(species);
                  }}
                >
                  <Species species={species.species} image={species.image} />
                </div>
                {activeSpeciesId == species.id && (
                  <form
                    className="species-update-form"
                    onSubmit={this.updateSpecies}
                  >
                    <div className="main-fields-wrapper">
                      <div className="form-field">
                        <label htmlFor="name">Gatunek</label>
                        <input
                          type="text"
                          id="species"
                          name="species"
                          onChange={this.onSpeciesChange}
                          value={activeSpecies.species}
                          required
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="category">Kategoria</label>
                        <select
                          id="category"
                          name="category"
                          onChange={this.onCategoryChange}
                          value={activeSpecies.category}
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
                          value={activeSpecies.size}
                        />
                      </div>
                      <div className="form-field min-tank-field">
                        <label htmlFor="min_tank">
                          Minimalna pojemność akwarium [l]
                        </label>
                        <input
                          type="number"
                          id="min_tank"
                          name="min_tank"
                          onChange={this.onChange}
                          value={activeSpecies.min_tank}
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="distribution">Występowanie</label>
                        <textarea
                          rows="2"
                          id="distribution"
                          name="distribution"
                          onChange={this.onChange}
                          value={activeSpecies.distribution}
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
                          value={activeSpecies.food}
                          required
                        ></textarea>
                      </div>
                    </div>
                    <div className="form-field species-image-form-field">
                      <label htmlFor="image">Zdjęcie</label>
                      <img className="imagePreview" src={image_src} />
                      <input
                        type="file"
                        accept="image/*"
                        id="image"
                        name="image"
                        onChange={this.imageHandle}
                        className="species-image-input"
                      />
                      {imageChanged && (
                        <div
                          className="set-prev-image"
                          onClick={this.setBackPrevImage}
                        >
                          Przywróć zdjęcie ze zgłoszenia
                        </div>
                      )}
                    </div>
                    <div className="form-field picky-eater-field">
                      <label htmlFor="picky_eater">Specjalista pokarmowy</label>
                      <select
                        id="picky_eater"
                        name="picky_eater"
                        onChange={this.onChange}
                        value={activeSpecies.picky_eater}
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
                        value={activeSpecies.reefsafe}
                      >
                        <option value={false}>nie</option>
                        <option value={true}>tak</option>
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
                          value={activeSpecies.regnum}
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
                          value={activeSpecies.phylum}
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
                          value={activeSpecies.classis}
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
                          value={activeSpecies.ordo}
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
                          value={activeSpecies.familia}
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
                          value={activeSpecies.genus}
                          required
                        />
                      </div>
                    </div>
                    <div className="acceptation-wrapper">
                      <div className="form-field accepted-field">
                        <label htmlFor="accepted">Zaakceptowany</label>
                        <select
                          id="accepted"
                          name="accepted"
                          onChange={this.onAcceptSelectChange}
                          value={activeSpecies.accepted}
                        >
                          <option value="false">nie</option>
                          <option value="true">tak</option>
                        </select>
                      </div>
                      <div className="form-field submit-field">
                        <input type="submit" value="Zapisz" />
                      </div>
                      <div className="form-field submit-field">
                        <input
                          type="button"
                          className="cancel-changes"
                          value="Anuluj"
                          onClick={this.closeEditor}
                        />
                      </div>
                    </div>
                  </form>
                )}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ auth: state.authReducer });

export default connect(mapStateToProps)(SpeciesToAccept);

const Species = (props) => {
  return (
    <div className="species-as-list-item">
      <img src={props.image} />
      <h2>{props.species}</h2>
    </div>
  );
};
