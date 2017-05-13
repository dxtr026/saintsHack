import React, { Component } from 'react'
import Highcharts from 'react-highcharts'
import HighLight from 'react-highlight'

// class Graph extends Component {
//   render ( ) {
//     return (
//      <ReactHighcharts config={}/>
//     )
//   }
// }

const createConfig = (data, fileName) => {
  // debugger
  const series = []
  const categories = []

  if (data.answer) {
    const keys = Object.keys(data.answer)
    keys.forEach((k, i) => {
      console.log()
      categories.push(parseInt(((i + 1) * 100) / keys.length, 10))
      series.push(data.answer[k].probability)
    })

    function getTooltip () {
      return keys[this.index]
    }

    const config = {
      title: `Sentiment Analysis for ${fileName} - ${data.overall_sentiment}`,
      xAxis: {
        categories: categories
      },
      series: [{
        data: series,
        type: 'spline'
      }],
      tooltip: {
        pointFormatter: getTooltip,
        style: {'white-space': 'normal', width: '300px'}
      }
    }
    return config
  }
  return null
}

const Graph = (props) => {
  const config = createConfig(props.sentimentData, props.fileName)
  return (
    <div>
      {config
        ? <Highcharts config={config} />
        : null
      }
    </div>
  )
}

export default Graph
