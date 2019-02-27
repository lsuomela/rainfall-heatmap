import React, { Component } from 'react';
import { decorate, toJS } from 'mobx';
import { observer } from 'mobx-react';
import DatePicker from 'react-datepicker';
import CalendarHeatmap from 'react-calendar-heatmap';

import "react-datepicker/dist/react-datepicker.css";
import 'react-calendar-heatmap/dist/styles.css';
import './App.css';

import store, { Data } from './ObservableStore';

const Heatmap =  observer( class Heatmap extends Component {
  state = {
    startDate: undefined as Date,
    endDate: undefined as Date,
    selectedStart: new Date,
    selectedEnd: new Date,
  }

  componentDidMount() {
    store.loadData();
  }

  /**
   * Sets start date selected on datepicker
   */
  setStartDate = (date: Date) => {
    this.setState({
      selectedStart: date,
    });
  }

  /**
   * Sets start date selected on datepicker
   */
  setEndDate = (date: Date) => {
    this.setState({
      selectedEnd: date,
    });
  }

  /**
   * Submits selected dates to store, triggering render
   */
  submitDates = () => {
    console.log('setting');
    
    const {selectedStart, selectedEnd} = this.state;
    store.setDataToRender(selectedStart, selectedEnd);
  }

  render() {

    const { startDate, endDate } = this.state;
    const values: Data[] = toJS(store.dataToRender);

    return (
      <div>
        <div>
          <DatePicker
            name='selectedStart'
            selected={this.state.selectedStart}
            onChange={this.setStartDate}
          />
          <DatePicker
            name='selectedEnd'
            selected={this.state.selectedEnd}
            onChange={this.setEndDate}
          />
        </div>
        
        <button
          value="Show data"
          onClick={this.submitDates}
        />

        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={values}
          classForValue={(value) => {
            if (!value) {
              return 'color-empty';
            }
            return `color-scale-${value.rainfall}`;
          }}
        />
      </div>
      
    )
  }
})

export default Heatmap;