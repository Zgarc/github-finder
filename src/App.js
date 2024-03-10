import React, { Component, Fragment } from "react";
import Navbar from "./components/layout/Navbar";
import "./App.css";
import Users from "./components/users/Users";
import Alert from "./components/layout/Alert";
import Search from "./components/users/Search";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import About from "./components/pages/About";
import User from "./components/users/User";

class App extends Component {
  state = {
    users: [],
    user: {},
    loading: false,
    alert: null,
  };

  // Search Github users
  searchUsers = async (text) => {
    this.setState({ loading: true });
    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&client_id=
      ${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=
      ${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );

    this.setState({ users: res.data.items, loading: false });
  };

  getUser = async (login) => {
    this.setState({ loading: true });
    const res = await axios.get(
      `https://api.github.com/users/${login}?client_id=
      ${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=
      ${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );

    this.setState({ user: res.data, loading: false });
  };

  clearUsers = () => this.setState({ users: [], loading: false });

  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } });

    setTimeout(() => this.setState({ alert: null }), 5000);
  };

  render() {
    const { users, user, loading } = this.state;
    return (
      <Router>
        <div className="App">
          <Navbar icon="fab fa-github" title="Github Finder" />
          <div className="container">
            <Alert alert={this.state.alert} />
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => (
                  <Fragment>
                    <Search
                      searchUsers={this.searchUsers}
                      clearUsers={this.clearUsers}
                      showClear={users.length > 0 ? true : false}
                      setAlert={this.setAlert}
                    />
                    <Users loading={loading} users={users} />
                  </Fragment>
                )}
              />
              <Route exact path="/about" component={About} />
              <Route
                exact
                path="/user/:username"
                element={<User getUser={this.getUser} loading={loading} />}
              />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
