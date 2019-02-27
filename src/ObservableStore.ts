import { observable, action, toJS, decorate } from 'mobx';
import data from './data/tampere';

export interface Data {
  date: Date,
  rainfall: number,
}

/**
 * Observable mobx store for holding and manipulating data
 */
class ObservableStore {
  /** Data */
  values: Data[] = [];

  /** Data to be rendered */
  dataToRender: Data[] = [];

  /** Set data from defined data source */
  loadData = () => {
    for (let day of data) {
      console.log(day);
      
      this.values.push({
        date: new Date(Date.UTC(day.y, day.m, day.d)), // convert date strings to Date objects
        rainfall: day.rainfall,
      });
    }
  }

  /**
   * Returns data
   * @return {!Object<Date, number>} Date and the corresponding data
   *//* 
  getData = () => {
    return toJS(this.dataToRender);
  } */

  /**
   * Sets the data to be rendered according to the selected dates
   */
  @action
  setDataToRender = (start: Date, end: Date) => {
    for (let x of this.values) {
      if (start <= x.date && x.date <= end) {        
        this.dataToRender.push(x);
      }
    }
  }
}

decorate(ObservableStore, {
  dataToRender: observable,
  setDataToRender: action,
})

export default new ObservableStore();