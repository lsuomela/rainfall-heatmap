import React, { PureComponent, createRef } from 'react';
import * as d3 from 'd3';
import { Data } from './Store';
import './css/Heatmap.css';

/** Define props for <Chart> */
interface Chart {
  data: Data[],
}

/* Square formatting */
const cellSize = 17;
const color = d3.scaleSequential(d3.interpolateBlues).domain([0, 21]);
const legendColor = d3.scaleSequential(d3.interpolateBlues).domain([0, 7]);

/* Get index of the day of the week of d */
const countDay = (d: Date): number => (d.getUTCDay() + 6) % 7;

/** Class for rendering heatmap */
class Heatmap extends PureComponent<Chart> {

  /** Element where chart will render */
  private chartRef = createRef<SVGSVGElement>();

  /** Element where legend will render */
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

  /** Draws static elements */
  drawStatic = () => {

    /* Labels for days of the week */
    d3.select(this.chartRef.current).append('g')
        .attr('text-anchor', 'end')
      .selectAll('text')
      .data((d3.range(7)).map((i: number): Date => new Date(2000, 0, i)))
      .join('text')
        .attr('x', -5)
        .attr('y', (d: Date): number => (countDay(d) + 0.5) * cellSize)
        .attr('dy', '0.31em')
        .text((d: Date): string => 'SMTWTFS'[d.getUTCDay()]);

    /* Legend */
    const legend = d3.select(this.legendRef.current).append('g');
    const width = 6;

    /* Draw squares */
    legend.selectAll('rect')
      .data((): number[] => d3.range(8))
      .join('rect')
        .attr('width', cellSize/4)
        .attr('height', cellSize/4)
        .attr('x', (d: number): number => d * width)
        .attr('fill', (d: number): string => legendColor(d));

    /* Values as text */
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

    /* Unit below values */
    legend.append('text')
        .attr('id', 'unit')
        .attr('class', 'legend')
        .attr('x', 23.2)
        .attr('y', 13)
        .text('(mm)');
  }

  /** Function for drawing the heatmap with data from props */
  draw = () => {
    const { data } = this.props;
    const year = data[0].date.getUTCFullYear();
    const dayGap = 1.5; // width of gap between days
    const chart = d3.select(this.chartRef.current).append('g');

    /* For squares' on hover -legend */
    const valueFormat = d3.format('.3'); // 3 digits
    const dateFormat = d3.utcFormat('%-d.%-m.%Y'); // dd.mm.yyyy
    
    /* Year in top left corner */
    chart.append('text')
        .attr('class', 'dynamic')
        .attr('x', -5)
        .attr('y', -5)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'end')
        .text(year);

    /* Squares and on hover legend */
    chart.append('g')
        .attr('class', 'dynamic')
      .selectAll('rect')
      .data(data)
      .join('rect')
        .attr('width', cellSize - dayGap)
        .attr('height', cellSize - dayGap)
        .attr('x', (d: Data): number =>
            d3.utcMonday.count(d3.utcYear(d.date), d.date)*cellSize + dayGap/2)
        .attr('y', (d: Data): number => countDay(d.date)*cellSize + dayGap/2)
        .attr('fill', (d: Data): string => color(d.value))
      .append('title')
        .text((d: Data): string =>
            `${dateFormat(d.date)}\n${valueFormat(d.value)}mm`);
    
    /* Path for the gaps between months */
    const monthGapPath = (d: Date): string => {
      const day = countDay(d);
      /* Count weeks from the beginning of the year to d */
      const w = d3.utcMonday.count(d3.utcYear(d), d);
      return (
        `${day === 0
          ? `M${w * cellSize},0` // if month starts with monday
          : `M${(w + 1) * cellSize},0V${day * cellSize}\
              H${w * cellSize}`}V${7 * cellSize}`
      );
    }

    /* Elements for each month */
    const month = chart.append('g')
        .attr('class', 'dynamic')
      .selectAll('g')
      .data(d3.utcMonths(
          d3.utcMonth(data[0].date), data[data.length - 1].date))
      .join('g');

    /* Gap between months */
    month.filter((d: any, i: any) => i).append('path')
        .attr('stroke-width', dayGap) // width
        .attr('d', monthGapPath);

    /* Labels for months */
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
