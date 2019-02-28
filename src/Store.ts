import data from './data/tampere.json';

/** Interface for units of data */
export interface Data {
  date: Date,
  value: number,
}

/**
 * Mobx store for holding and manipulating data
 */
class Store {
  /** Map for data */
  values: Map<number, Data[]> = new Map<number, Data[]>();

  /** Load data from imported data source */
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
      /* Format data => Object<Data> */
      const entry = {
        date: new Date(Date.UTC(day.y, day.m, day.d)),
        value: day.rainfall,
      }      
      this.values.get(day.y).push(entry);
    }
  }

  /**
   * Returns data from given year
   * @param year The year for which to get data
   * @returns Data from year
   */
  getData = (year: number): Data[] => {
    return this.values.get(year);
  }
}

export default new Store();