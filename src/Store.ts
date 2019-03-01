import data from './data/tampere.json';

/** Interface for units of data */
export interface Data {
  date: Date,
  value: number,
}

/**
 * Store for holding and manipulating data
 */
class Store {
  /** @private Map for data */
  values_: Map<number, Data[]> = new Map<number, Data[]>();

  /** Load data from imported data source */
  loadData = () => {
    for (let day of data) {
      /* Create arrays to hold each years data */
      if (!this.values_.has(day.y)) {
        this.values_.set(day.y, []);
      }
      /* Remove negative values from rainfall */
      if (day.rainfall < 0) {
        day.rainfall = 0;
      }
      /* Format data into Object<Data> */
      const entry = {
        date: new Date(Date.UTC(day.y, day.m, day.d)),
        value: day.rainfall,
      }      
      this.values_.get(day.y).push(entry);
    }
  }

  /**
   * Returns data from given year
   * @param year The year for which to get data
   * @returns Data from year
   */
  getData = (year: number): Data[] => {
    return this.values_.get(year);
  }

  /** 
   * Gets the year range from which data is available
   * @returns Keys from values_
   */
  getRange = (): number[] => {
    return Array.from(this.values_.keys());
  }

}

export default new Store();