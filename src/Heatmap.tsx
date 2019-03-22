import React, { PureComponent, createRef } from 'react';
import * as d3 from 'd3';
import { Data } from './Store';
import './css/Heatmap.css';

/** Define props for <Chart> */
interface Chart {
  data: Data[],
}

/** Renders a heatmap as an SVG-chart */
class Heatmap extends PureComponent<Chart> {
  /** Attribute for cell size */
  private cellSize = 17;
  /** Reference to the element where chart will render */
  private chartRef = createRef<SVGSVGElement>();
  /** Reference to the element where legend will render */
  private legendRef = createRef<SVGSVGElement>();

  /** Draw the chart and static elements when component mounts */
  componentDidMount() {
    this.drawStatic();
    this.draw();
  }
  
  /** Draw new chart when component updates with new props */
  componentDidUpdate() {
    d3.select(this.chartRef.current).selectAll('.dynamic').remove();
    this.draw();
  }

  /** Clear on unmount */
  componentWillUnmount() {
    d3.selectAll('svg').selectAll('*').remove();
  }

  /** Returns the day of the week of a date
    * @param d - Input date
    * @returns The zero-based index of `d` in an ISO 8601 -week
    */
  countDay = (d: Date): number => (d.getUTCDay() + 6) % 7;

  /** Draws static elements */
  drawStatic = () => {
    const rectColour = d3.scaleSequential(d3.interpolateBlues).domain([0, 7]);

    // labels for days of the week
    d3.select(this.chartRef.current).append('g')
        .attr('text-anchor', 'end')
      .selectAll('text')
      .data((d3.range(7)).map((i: number): Date => new Date(2000, 0, i)))
      .join('text')
        .attr('x', -5)
        .attr('y',
            (d: Date): number => (this.countDay(d) + 0.5) * this.cellSize)
        .attr('dy', '0.31em')
        .text((d: Date): string => 'SMTWTFS'[d.getUTCDay()]);

    // legend
    const legend = d3.select(this.legendRef.current).append('g');
    const width = 6;

    // draw squares
    legend.selectAll('rect')
      .data((): number[] => d3.range(8))
      .join('rect')
        .attr('width', this.cellSize/4)
        .attr('height', this.cellSize/4)
        .attr('x', (d: number): number => d * width)
        .attr('fill', (d: number): string => rectColour(d));

    // values as text
    legend.append('g')
      .selectAll('text')
      .data((): number[] => d3.range(8))
      .join('text')
        .attr('class', 'legend')
        .attr('x', (d: number): number => 0.3 + d * width)
        .attr('y', 7.8)
        .text((d: number): string => 
          d < 4
            ? `\xa0${d*3}`
            : d === 7
              ? `${d*3}+`
              : `${d*3}`
        );

    // unit below values
    legend.append('text')
        .attr('id', 'unit')
        .attr('class', 'legend')
        .attr('x', 23.2)
        .attr('y', 13)
        .text('(mm)');
  }

  /** Function for drawing the heatmap with data from props */
  draw = () => {
    const dayGap = 1.5; // width of gap between days
    const { data } = this.props;
    const cellSize = this.cellSize;
    const year = data[0].date.getUTCFullYear();
    const chart = d3.select(this.chartRef.current).append('g');
    const rectColour = d3.scaleSequential(d3.interpolateBlues).domain([0, 21]);

    // for squares' on hover -legend
    const valueFormat = d3.format('.3'); // 3 digits
    const dateFormat = d3.utcFormat('%-d.%-m.%Y'); // dd.mm.yyyy
    
    // year in top left corner
    chart.append('text')
        .attr('class', 'dynamic')
        .attr('x', -5)
        .attr('y', -5)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'end')
        .text(year);

    // squares and on hover legend
    chart.append('g')
        .attr('class', 'dynamic')
      .selectAll('rect')
      .data(data)
      .join('rect')
        .attr('width', cellSize - dayGap)
        .attr('height', cellSize - dayGap)
        .attr('x', (d: Data): number =>
            d3.utcMonday.count(d3.utcYear(d.date), d.date)*cellSize + dayGap/2)
        .attr('y', (d: Data): number =>
            this.countDay(d.date)*cellSize + dayGap/2)
        .attr('fill', (d: Data): string => rectColour(d.value))
      .append('title')
        .text((d: Data): string =>
            `${dateFormat(d.date)}\n${valueFormat(d.value)}mm`);
    
    // path for the gaps between months
    const monthGapPath = (d: Date): string => {
      const day = this.countDay(d);
      // count weeks from the beginning of the year to d
      const w = d3.utcMonday.count(d3.utcYear(d), d);
      return (
        `${day === 0
          ? `M${w * cellSize},0` // if month starts with monday
          : `M${(w + 1) * cellSize},0V${day * cellSize}\
              H${w * cellSize}`}V${7 * cellSize}`
      );
    }

    // elements for each month
    const month = chart.append('g')
        .attr('class', 'dynamic')
      .selectAll('g')
      .data(d3.utcMonths(
          d3.utcMonth(data[0].date), data[data.length - 1].date))
      .join('g');

    // gap between months
    month.filter((d: any, i: any) => i).append('path')
        .attr('stroke-width', dayGap) // width
        .attr('d', monthGapPath);

    // labels for months
    month.append('text')
        .attr('x', (d: Date): number => d3.utcMonday.count(
            d3.utcYear(d), d3.utcMonday.ceil(d))*cellSize + 1.4*cellSize)
        .attr('y', -5)
        .text(d3.utcFormat('%b')); // 3 char month names
  }

  render() {
    return (
      <div>
        <div className='svgContainer' >
          <svg
            ref={this.chartRef}
            className='svgContent'
            viewBox={`-56 -20 1000 300`}
            preserveAspectRatio='xMidYMid meet'
          />
        </div>
        <div className='svgContainer'>
          <svg
            ref={this.legendRef}
            className='svgContent'
            viewBox={`-361 -10 500 25`}
            preserveAspectRatio='xMidYMid meet'
          />
        </div>
      </div>
    )
  }
}

export default Heatmap;
