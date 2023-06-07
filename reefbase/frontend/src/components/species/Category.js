import React, { Component, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ButterToast from 'butter-toast/dist/lean.min.js';
import MyAlert from '../common/MyAlert';
import SpeciesAsListItem from './SpeciesAsListItem';

import Coral from '../../../static/frontend/icons/svg/coral.svg';
import Fish from '../../../static/frontend/icons/svg/fish.svg';
import Crab from '../../../static/frontend/icons/svg/izocrab.svg';
import Octopus from '../../../static/frontend/icons/svg/octopus.svg';
import Starfish from '../../../static/frontend/icons/svg/starfish.svg';
import Anemone from '../../../static/frontend/icons/svg/anemone.svg';

export default function Category() {
  const { slug } = useParams();

  const categories = [
    {
      slug: 'fish',
      name: 'Ryby',
      description:
        'Zmiennocieplne, wodne kręgowce, oddychające skrzelami i poruszające się za pomocą płetw',
      icon: <Fish />,
    },
    {
      slug: 'soft',
      name: 'Koralowce miękkie',
      description: 'Koralowce nieposiadające wapiennego szkieletu',
      icon: <Coral />,
    },
    {
      slug: 'sps',
      name: 'Koralowce SPS',
      description: 'Koralowce twarde małopolipowe',
      icon: <Coral />,
    },
    {
      slug: 'lps',
      name: 'Koralowce LPS',
      description: 'Koralowce twarde wielkopolipowe',
      icon: <Coral />,
    },
    {
      slug: 'nps',
      name: 'Koralowce NPS',
      description: 'Koralowce nieposiadające fotosyntezujących zooksantelli',
      icon: <Coral />,
    },
    {
      slug: 'anemones',
      name: 'Ukwiały',
      description:
        'Bezszkieletowe, osiadłe lub półosiadłe koralowce sześciopromienne',
      icon: <Anemone />,
    },
    {
      slug: 'crustaceans',
      name: 'Skorupiaki',
      description:
        'Bezkręgowce posiadające segmentowane ciało pokryte chitynowym oskórkiem',
      icon: <Crab />,
    },
    {
      slug: 'molluscs',
      name: 'Mięczaki',
      description: 'Bezkręgowce posiadające miękkie, niesegmentowane ciało',
      icon: <Octopus />,
    },
    {
      slug: 'echinoderms',
      name: 'Szkarłupnie',
      description: 'Bezkręgowce wtórouste o wtórnej symetrii promienistej',
      icon: <Starfish />,
    },
  ];

  for (let i = 0; i < categories.length; i++) {
    if (slug === categories[i].slug) {
      return (
        <CategoryComp
          slug={slug}
          name={categories[i].name}
          description={categories[i].description}
          icon={categories[i].icon}
        />
      );
    }
  }

  return <CategoryComp slug={slug} description="Taka kategoria nie istnieje" />;
}

class CategoryComp extends Component {
  state = {
    species: [],
    dataLoaded: false,
    slug: '',
    nextPage: '',
    loadingActive: false,
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

  componentDidMount() {
    axios
      .get(`/api/category/${this.props.slug}`)
      .then((res) => {
        this.setState({
          species: res.data.results,
          dataLoaded: true,
          slug: this.props.slug,
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
    window.addEventListener('scroll', this.loadMore);
  }

  componentDidUpdate() {
    if (this.props.slug != this.state.slug) {
      axios
        .get(`/api/category/${this.props.slug}`)
        .then((res) => {
          this.setState({
            species: res.data.results,
            dataLoaded: true,
            slug: this.props.slug,
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
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.loadMore);
  }

  render() {
    const { species, dataLoaded } = this.state;

    return (
      <div className="category-container">
        <div className="category-header">
          <div className="category-name-wrapper">
            <div className="category-icon">{this.props.icon}</div>
            <div className="category-name">
              <h1>{this.props.name}</h1>
            </div>
          </div>
          <p className="category-description">{this.props.description}</p>
        </div>
        {!dataLoaded && <div className="loading"></div>}
        {dataLoaded && !species.length && (
          <div className="category-species-list">
            Baza nie zawiera gatunków należących do tej kategorii
          </div>
        )}
        {dataLoaded && (
          <div className="category-species-list">
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
    );
  }
}
