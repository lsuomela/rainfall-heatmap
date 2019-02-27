import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Heatmap from './Heatmap';

class App extends Component {
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Rainfall in Tampere
        </header>
        <Heatmap/>
      </div>
    );
  }
}

export default App;
