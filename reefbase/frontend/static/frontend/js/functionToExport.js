export const hideSearchInput = () => {
  if (desktop.matches) {
    hideSearchSuggestions();
  } else {
    upperSearch.style["opacity"] = "1";
    lowerSearch.style["height"] = "0";
    uncheckedBurger();
  }
};

export const hideSearchSuggestions = () => {
  if (desktop.matches) {
    searchSuggestions.style["height"] = "0";
  }
};

export const showSearchSuggestions = () => {
  if (desktop.matches) {
    searchSuggestions.style["height"] = "fit-content";
  }
};

export const showClassification = () => {
  const desktop = window.matchMedia("(min-width: 960px)");
  if (desktop.matches) {
    document.getElementById("classification-checkbox").checked = true;
  }
};


export const convertStringToArray = (string) => {
  let str = string.replaceAll('  ', ' ');
  str = str.replaceAll(', ', ',');
  str = str.replaceAll('; ', ',');
  str = str.replaceAll(';', ',');
  let arr = str.split(',');
  arr = arr.filter(n => n);
  return arr;
}