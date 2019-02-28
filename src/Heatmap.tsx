import React, { Component } from 'react';
import { observer } from 'mobx-react';
import * as d3 from 'd3';
import { Data } from './ObservableStore';
import './App.css';

interface Chart {
  data: Data[],
}

const Heatmap =  observer( class Heatmap extends Component<Chart> {
  state = {
    data: this.props.data,
    cellSize: 17,
    /* Set color and interpolation range */
    color: d3.scaleSequential(d3.interpolateBlues).domain([0, 25]),
    valueFormat: d3.format('.3'), // display values with 3 digits
    dateFormat: d3.utcFormat('%-d.%-m.%Y'), // for onHover legend
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    if (this.props.data != this.state.data) {
      this.setState({
        data: this.props.data
      });
    }
    this.draw();
  }

  /**
   * Function for drawing the heatmap with data from store
   */
  draw = () => {
    const data = this.props.data;
    const { cellSize, dateFormat, valueFormat, color } = this.state;

    const countDay = (d: any) => (d.getUTCDay() + 6) % 7;
    const formatDay = (d: any) => 'SMTWTFS'[d.getUTCDay()];

    /* Create path for months */
    const pathMonth = (t: any) => {
      const n = 7;
      const d = Math.max(0, Math.min(n, countDay(t)));
      const w = d3.utcMonday.count(d3.utcYear(t), t);
      return `${d === 0 ? `M${w * cellSize},0`
          : d === n ? `M${(w + 1) * cellSize},0`
          : `M${(w + 1) * cellSize},0V${d * cellSize}\
            H${w * cellSize}`}V${n * cellSize}`;
    }

    const years = d3.nest()
      .key((d: Data) => d.date.getUTCFullYear())
      .entries(data)
      .reverse();

    /* Select the element to which the chart will render */
    const svg = d3.select(this.refs.chart)
        .style('font', '10px sans-serif')

    const year = svg.selectAll('g')
      .data(years)
      .join('g')
        .attr('transform', (d: any, i: number) => 
          `translate(40,${(cellSize*9*i) + (cellSize*1.5)})`);

    /* Show year in top left corner */
    year.append('text')
        .attr('x', -5)
        .attr('y', -5)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'end')
        .text((d: any) => d.key);

    /* Render a square for each date */
    year.append('g')
        .attr('text-anchor', 'end')
      .selectAll('text')
      .data((d3.range(7)).map((i: number) => new Date(2015, 0, i)))
      .join('text')
        .attr('x', -5)
        .attr('y', (d: any) => (countDay(d) + 0.5) * cellSize)
        .attr('dy', '0.31em')
        .text(formatDay);

    /* Render rectangle and on hover legend */
    year.append('g')
      .selectAll('rect')
      .data((d: any) => d.values)
      .join('rect')
        .attr('width', cellSize - 1)
        .attr('height', cellSize - 1)
        .attr('x', (d: Data) => d3.utcMonday.count(d3.utcYear(d.date), d.date) * cellSize + 0.5)
        .attr('y', (d: Data) => countDay(d.date) * cellSize + 0.5)
        .attr('fill', (d: Data) => color(d.value))
      .append('title')
        .text((d: Data) => `${dateFormat(d.date)}\n${valueFormat(d.value)}mm`);

    const month = year.append('g')
      .selectAll('g')
      .data((d: any) => d3.utcMonths(d3.utcMonth(d.values[0].date), d.values[d.values.length - 1].date))
      .join('g');

    month.filter((d: any, i: number) => i).append('path')
        .attr('fill', 'none')
        .attr('stroke', '#fff')
        .attr('stroke-width', 3)
        .attr('d', pathMonth);

    month.append('text')
        .attr('x', (d: Data) => d3.utcMonday.count(d3.utcYear(d), d3.utcMonday.ceil(d)) * cellSize + 2)
        .attr('y', -5)
        .text(d3.utcFormat('%b'));
/* 
    return svg.node(); */
  }

  render() {
    d3.select(this.refs.chart).selectAll("*").remove();
    return (
      <div ref='container' className='svg-container' >
        <svg
          ref='chart'
          className='svg-content'
          viewBox='-70 0 1100 400'
          preserveAspectRatio='xMidYMid meet'
        />
      </div>
    )
  }
})

export default Heatmap;