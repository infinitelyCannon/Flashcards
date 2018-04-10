import React, { Component } from 'react';
import logo from './logo.svg';
import './materialize.min.css';
import './index.css';
import Navbar from './Navbar';

class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <div>
          <p>Hello World!</p>
          <a className="btn-floating btn-large waves-effect FABs"><i className="material-icons">add</i></a>
        </div>
      </div>
    );
  }
}

export default App;
