import React, { PureComponent, createRef } from 'react';
import * as d3 from 'd3';
import { Data } from './Store';
import './css/Heatmap.css';

/** Define props for <Chart> */
interface Chart {
  data: Data[],
}

/** Class for rendering heatmap */
class Heatmap extends PureComponent<Chart> {
  state = {
    cellSize: 17,
    /* Set color and interpolation range */
    color: d3.scaleSequential(d3.interpolateBlues).domain([0, 22]),
    /* For squares' on hover -legend */
    valueFormat: d3.format('.3'), // 3 digits
    dateFormat: d3.utcFormat('%-d.%-m.%Y'), // dd.mm.yyyy
    dayGap: 1.2, // width of gap between days
  }

  /** Ref to element where chart will render */
  private svgRef = createRef<SVGSVGElement>();

  /** Draw the chart when component mounts */
  componentDidMount() { this.draw(); }
  
  /** Draw new chart when component updates with new props */
  componentDidUpdate() {
    d3.select(this.svgRef.current).selectAll("*").remove(); // clear old chart
    this.draw();
  }

  /** Clear chart on unmount */
  componentWillUnmount() {
    d3.select(this.svgRef.current).selectAll("*").remove();
  }

  /** Function for drawing the heatmap with data from props */
  draw = () => {
    const { data } = this.props;
    const { dayGap, cellSize, dateFormat, valueFormat, color } = this.state;
    const year = data[0].date.getUTCFullYear();
    
    /* Get day of the week of d */
    const countDay = (d: Date): number => (d.getUTCDay() + 6) % 7;

    /* Select the element to which the chart will render and link the data */
    const chart = d3.select(this.svgRef.current).selectAll('g')
      .data([{key: year, values: data}])
      .join('g');
    
    /* Year in top left corner */
    chart.append('text')
        .attr('x', -5)
        .attr('y', -5)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'end')
        .text(year);

    /* Labels for days */
    chart.append('g')
        .attr('text-anchor', 'end')
      .selectAll('text')
      .data((d3.range(7)).map((i: number) => new Date(year, 0, i)))
      .join('text')
        .attr('x', -5)
        .attr('y', (d: Date) => (countDay(d) + 0.5) * cellSize)
        .attr('dy', '0.31em')
        .text((d: Date) => 'SMTWTFS'[d.getUTCDay()]);

    /* Squares and on hover legend */
    chart.append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
        .attr('width', cellSize - dayGap)
        .attr('height', cellSize - dayGap)
        .attr('x', (d: Data) =>
            d3.utcMonday.count(d3.utcYear(d.date), d.date) * cellSize + dayGap/2)
        .attr('y', (d: Data) => countDay(d.date) * cellSize + dayGap/2)
        .attr('fill', (d: Data) => color(d.value))
      .append('title')
        .text((d: Data) =>
            `${dateFormat(d.date)}\n${valueFormat(d.value)}mm`);
    
    /* Path for the gaps between months */
    const monthGapPath = (d: Date) => {
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
      .selectAll('g')
      .data(d3.utcMonths(
          d3.utcMonth(data[0].date), data[data.length - 1].date))
      .join('g');

    /* Gap between months */
    month.filter((d: any, i: any) => i).append('path')
        .attr('stroke-width', dayGap*2) // width
        .attr('d', monthGapPath);

    /* Labels to months */
    month.append('text')
        .attr('x', (d: Date) => d3.utcMonday.count(
            d3.utcYear(d), d3.utcMonday.ceil(d)) * cellSize + 2)
        .attr('y', -5)
        .text(d3.utcFormat('%b')); // 3 char month names
  }

  render() {
    return (
      <div ref='container' className='svg-container' >
        <svg
          ref={this.svgRef}
          className='svg-content'
          /* Origin for render and x y ratio */
          viewBox={`-60 -20 1000 400`}
          preserveAspectRatio='xMidYMid meet'
        />
      </div>
    )
  }
}

export default Heatmap;
