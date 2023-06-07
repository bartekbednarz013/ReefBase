import React, { Component, Fragment } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import Header from './layout/Header';
import Home from './layout/Home';
import Form from './species/Form';
import Register from './accounts/Register';
import Login from './accounts/Login';
import Account from './accounts/Account';
import Category from './species/Category';
import Rank from './species/Rank';
import Species from './species/Species';
import AdvancedSearch from './species/AdvancedSearch';
import AddedSpecies from './accounts/AddedSpecies';
import AddedComments from './accounts/AddedComments';
import Settings from './accounts/Settings';
import Admin from './accounts/Admin';
import SpeciesToAccept from './accounts/SpeciesToAccept';
import ReportedMistakes from './accounts/ReportedMistakes';
import Activation from './accounts/Activation';
import ForgottenPassword from './accounts/ForgottenPassword';
import SetNewPassword from './accounts/SetNewPassword';
import MistakeReport from './common/MistakeReport';
import Edit from './species/Edit';

import ScrollToTop from './common/ScrollToTop';

import { Provider } from 'react-redux';
import store from '../store';
import { loadUser } from '../actions/auth';

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <HashRouter>
          <ScrollToTop />
          <Fragment>
            <Header />
            <div className="content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="activateAccount/:link" element={<Activation />} />
                <Route path="account" element={<Account />}>
                  <Route path="addedSpecies" element={<AddedSpecies />} />
                  <Route path="addedComments" element={<AddedComments />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="admin" element={<Admin />}>
                    <Route
                      path="speciesToAccept"
                      element={<SpeciesToAccept />}
                    />
                    <Route
                      path="reportedMistakes"
                      element={<ReportedMistakes />}
                    />
                  </Route>
                </Route>
                <Route
                  path="forgottenPassword"
                  element={<ForgottenPassword />}
                />
                <Route
                  path="setNewPassword/:link"
                  element={<SetNewPassword />}
                />
                <Route path="addSpecies" element={<Form />} />
                <Route path="species/:slug" element={<Species />} />
                <Route path="editSpecies/:slug" element={<Edit />} />
                <Route path="category/:slug" element={<Category />} />
                <Route path="rank/:slug" element={<Rank />} />
                <Route path="advancedSearch" element={<AdvancedSearch />} />
                <Route
                  path="mistakeReport/:type/:subject"
                  element={<MistakeReport />}
                />
                <Route path="mistakeReport/:type" element={<MistakeReport />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </div>
          </Fragment>
        </HashRouter>
      </Provider>
    );
  }
}

export default App;
