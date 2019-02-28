import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './App.css';
import Heatmap from './Heatmap';
import store, { Data } from './ObservableStore';
import { toJS } from 'mobx';

const App = observer( class App extends Component {
  state = {
    year: 2018,
  }

  componentDidMount() {
    store.loadData();
    store.setDataToRender(this.state.year);
  }
  
  /**
   * Sets the year for which to render data
   */
  setYear = (y: number) => {
    this.setState({
      year: y,
    });
    store.setDataToRender(this.state.year);
  }

  render() {
    const { year } = this.state;    
    return (
      <div className="App">
        <header className="App-header">
          {`Rainfall in Tampere in ${year}`}
        </header>
        <div className='yearSelection'>
          {Array.from( store.values.keys() ).map((key: number) =>
            <div key={key} onClick={ e => this.setYear(key)} className={year==key?'selectedYear':null}>
              {key}
            </div>
          )}
        </div>
        <Heatmap data={toJS(store.dataToRender)} />
      </div>
    );
  }
})

export default App;
