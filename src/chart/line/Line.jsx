import React, { Component } from "react";
// 引入ECharts主模块
import * as echarts from "echarts";

class Line extends Component {
  componentDidMount() {
    var chartDom = document.getElementById("main");
    var myChart = echarts.init(chartDom);
    // 绘制Echarts实例所需要的数据

    var data = [];

    for (let i = 0; i <= 360; i++) {
      let t = (i / 180) * Math.PI;
      let r = Math.sin(2 * t) * Math.cos(2 * t);
      data.push([r, i]);
    }
    let option = {
      title: {
        text: "极坐标双数值轴",
      },
      legend: {
        data: ["line"],
      },
      polar: {
        center: ["50%", "54%"],
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      angleAxis: {
        type: "value",
        startAngle: 0,
      },
      radiusAxis: {
        min: 0,
      },
      series: [
        {
          coordinateSystem: "polar",
          name: "line",
          type: "line",
          showSymbol: false,
          data: data,
        },
      ],
      animationDuration: 2000,
    };
    option && myChart.setOption(option);
  }
  render() {
    //渲染需要陈放Echart实例的容器元素
    return <div id="main" style={{width: 1000, height: 600}}/>;
  }
}
export default Line;
