import React, { Component } from 'react';
import './css/App.css';
import Heatmap from './Heatmap';
import store from './Store';

/** Class for choosing which years data to render */
class App extends Component {
  state = {
    year: 2018,
    loaded: false,
  }

  /** On mount load data into store and check localStorage */
  componentDidMount() {
    store.loadData();
    if (localStorage.hasOwnProperty("year")) {
      this.setState({
        year: parseInt(localStorage.getItem("year")),
      });
    }
    this.setState({ loaded: true });
  }
  
  /** Sets the year for which to render data
   * @param y Year from which to get data
   */
  setYear = (y: number) => {
    if (y != this.state.year) {
      this.setState({ year: y });
      localStorage.setItem("year", y.toString())
    }
  }

  render() {    
    const { year } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          {`Rainfall in Tampere in ${year}`}
        </header>

        {/* Render after data has been loaded */}
        {this.state.loaded &&
        <div>
          <div className='yearSelection'>
            {/* Map years from which data is available to buttons */}
            {store.getRange().map((key: number) =>
              <div
                key={key}
                onClick={e => this.setYear(key)}
                className={ year===key ? 'selectedYear' : null }
              >
                {key}
              </div>
            )}
          </div>
          <Heatmap data={store.getData(year)} />
        </div>
        }

      </div>
    );
  }
}

export default App;
