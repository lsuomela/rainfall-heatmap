import data from './data/tampere.json';

/** Interface for units of data */
export interface Data {
  date: Date,
  value: number,
}

/** Store for holding and manipulating data */
class Store {
  /** Map for holding data */
  private values: Map<number, Data[]> = new Map<number, Data[]>();

  /** Load data from imported data source */
  loadData = () => {
    for (const day of data) {
      // create arrays to hold each years data
      if (!this.values.has(day.y)) {
        this.values.set(day.y, []);
      }
      // format data into object<Data>
      const entry = {
        date: new Date(Date.UTC(day.y, day.m, day.d)),
        value: Math.max(0, day.rainfall), // remove negative values
      }
      // add the entry to the array for the corresponding year
      this.values.get(day.y).push(entry);
    }
  }

  /** 
   * Returns data from given year
   * @param year - The year for which to get data
   * @returns An array of the objects in {@link values} under key `year`
   */
  getData = (year: number): Data[] => {
    return this.values.get(year);
  }

  /** 
   * Gets the year range for which data is available
   * @returns Array of keys in {@link values}
   */
  getRange = (): number[] => {
    return Array.from(this.values.keys());
  }
}

export default new Store();
