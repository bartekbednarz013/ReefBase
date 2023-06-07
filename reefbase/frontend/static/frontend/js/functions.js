const body = document.body;
const lowerSearch = document.querySelector('.lower-search');
const upperSearch = document.querySelector('.upper-search');
const burgerCheck = document.getElementById('burger-checkbox');
const navside = document.querySelector('.navside');
const searchInput = document.querySelector('.search-input');
const searchSuggestions = document.querySelector('.search-suggestions-wrapper');
const searchButton = document.querySelector('.search-button');
const cancelSearch = document.querySelector('.cancel-search');
const root = document.documentElement;
const upArrow = document.querySelector('.go-up-arrow');
const lightSwitch = document.querySelector('.light-mode-switch');
const light = document.querySelector('.light-on');

const preferLightMode = window.matchMedia('(prefers-color-scheme: light)');
const preferDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
const desktop = window.matchMedia('(min-width: 960px)');

function showSearchInput() {
  if (upperSearch.style['opacity'] !== '0') {
    searchInput.focus();
    uncheckedBurger();
    if (desktop.matches) {
      lowerSearch.style['width'] =
        'calc(var(--search-input-width) + var(--search-box-height))';
      upperSearch.style['z-index'] = '-1';
    } else {
      //for mobile
      upperSearch.style['opacity'] = '0';
      lowerSearch.style['height'] = 'calc(100% - var(--total-nav-height))';
      disableScroll();
    }
  }
}

function hideSearchInput() {
  searchBoxVisible = false;
  upperSearch.style['opacity'] = '1';
  lowerSearch.style['height'] = '0';
  enableScroll();
}

function showSearchSuggestions() {
  if (desktop.matches) {
    searchSuggestions.style['height'] = 'fit-content';
  }
}

function hideSearchSuggestions() {
  searchSuggestions.style['height'] = '0';
}

function searchBoxHider() {
  if (desktop.matches) {
    hideSearchSuggestions();
  } else {
    hideSearchInput();
  }
}

upperSearch.addEventListener('click', showSearchInput);

cancelSearch.addEventListener('click', searchBoxHider);

lowerSearch.addEventListener('focusin', showSearchSuggestions);

if (desktop.matches) {
  lowerSearch.addEventListener('focusout', hider);
  function hider(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      if (desktop.matches) {
        hideSearchSuggestions();
      } else {
        hideSearchInput();
      }
    }
  }
}

function uncheckedBurger() {
  if (!desktop.matches) {
    burgerCheck.checked = false;
    navsideShowHide();
  }
}

function navsideShowHide() {
  if (burgerCheck.checked) {
    searchBoxHider();
    navside.style['left'] = '0';
    disableScroll();
  } else {
    navside.style['left'] = '-100%';
    enableScroll();
  }
}

burgerCheck.addEventListener('change', navsideShowHide);

function disableScroll() {
  body.style['overflow'] = 'hidden';
}

function enableScroll() {
  body.style['overflow'] = 'visible';
}

function hideFixed() {
  searchBoxHider();
  uncheckedBurger();
}

upArrow.addEventListener('click', scrollToTop);

function scrollToTop() {
  root.scrollTo({ top: 0, behavior: 'smooth' });
}

if (preferLightMode.matches) {
  light.style['opacity'] = '0';
} else if (preferDarkMode.matches) {
  light.style['opacity'] = '1';
}

lightSwitch.addEventListener('click', changeLightMode);

function changeLightMode() {
  if (light.style['opacity'] == '0') {
    root.style.setProperty('--color', 'var(--dark-color)');
    root.style.setProperty(
      '--background-color',
      'var(--dark-background-color)'
    );
    root.style.setProperty(
      '--navside-item-shadow',
      'var(--dark-navside-item-shadow)'
    );
    root.style.setProperty(
      '--navside-item-shadow-hover',
      'var(--dark-navside-item-shadow-hover)'
    );
    root.style.setProperty(
      '--category-background-color',
      'var(--dark-category-background-color)'
    );
    root.style.setProperty(
      '--input-text-background-color',
      'var(--dark-input-text-background-color)'
    );
    root.style.setProperty('--button-color', 'var(--dark-button-color)');
    root.style.setProperty('--link-color', 'var(--dark-link-color)');
    root.style.setProperty(
      '--search-lines-color',
      'var(--dark-search-lines-color)'
    );
    light.style['opacity'] = '1';
  } else {
    root.style.setProperty('--color', 'var(--light-color)');
    root.style.setProperty(
      '--background-color',
      'var(--light-background-color)'
    );
    root.style.setProperty(
      '--navside-item-shadow',
      'var(--light-navside-item-shadow)'
    );
    root.style.setProperty(
      '--navside-item-shadow-hover',
      'var(--light-navside-item-shadow-hover)'
    );
    root.style.setProperty(
      '--category-background-color',
      'var(--light-category-background-color)'
    );
    root.style.setProperty(
      '--input-text-background-color',
      'var(--light-input-text-background-color)'
    );
    root.style.setProperty('--button-color', 'var(--light-button-color)');
    root.style.setProperty('--link-color', 'var(--light-link-color)');
    root.style.setProperty(
      '--search-lines-color',
      'var(--light-search-lines-color)'
    );
    light.style['opacity'] = '0';
  }
}

var links = document.getElementsByClassName('navside-link');
for (var i = 0; i < links.length; i++) {
  var link = links[i];
  link.addEventListener('click', uncheckedBurger);
}

//znaleźć lepszą nazwę
var clickables = document.getElementsByClassName('hide-fixed-if-click');
for (var i = 0; i < clickables.length; i++) {
  var clickable = clickables[i];
  clickable.addEventListener('click', hideFixed);
}
