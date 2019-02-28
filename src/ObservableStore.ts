import { observable, action, toJS, decorate } from 'mobx';
import data from './data/tampere';

/** Interface for units of data */
export interface Data {
  date: Date,
  value: number,
}

/**
 * Observable mobx store for holding and manipulating data
 */
class ObservableStore {
  /** Data */
  values: Map<number, Object[]> = new Map<number, Object[]>();

  /** Data to be rendered */
  dataToRender: Data[] = [];

  /** Set data from defined data source */
  loadData = () => {
    for (let day of data) {
      /* Create arrays to hold each years data */
      if (!this.values.has(day.y)) {
        this.values.set(day.y, []);
      }
      /* Remove negative values from rainfall */
      if (day.rainfall < 0) {
        day.rainfall = 0;
      }
      const entry = {
        date: new Date(Date.UTC(day.y, day.m, day.d)), // convert date strings to Date objects
        value: day.rainfall,
      }
      this.values.get(day.y).push(entry);
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
  setDataToRender = (year: number) => {
    for (let x of this.values.get(year)) {
      this.dataToRender.push(x as Data);
    }
  }
}

decorate(ObservableStore, {
  dataToRender: observable,
  setDataToRender: action,
})

export default new ObservableStore();