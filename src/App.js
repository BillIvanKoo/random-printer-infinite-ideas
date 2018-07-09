import React, { Component } from 'react';
import './App.css';

import AdminPage from "./components/AdminPage";
import GuestPage from "./components/GuestPage";

const {remote} = window.require('electron')
const {Menu, MenuItem} = remote

const PAGES = {
  admin: AdminPage,
  guest: GuestPage
}

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'guest'
    }
  }

  componentDidMount() {
    let that = this
    const menu = new Menu()
    menu.append(new MenuItem({label: 'Guest View', click() { that.changePage('guest') }}))
    menu.append(new MenuItem({label: 'Admin View', click() { that.changePage('admin') }}))
    window.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        menu.popup({window: remote.getCurrentWindow()})
      }, false)
  }

  changePage(page) {
    this.setState({
      currentPage: page
    })
  }

  render() {
    const Handler = PAGES[this.state.currentPage]
    return (
      <div className="App">
        <Handler/>
      </div>
    );
  }
}

export default App;
