import React from "react";
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GridComponent, LineChart, CanvasRenderer]);

export default function BasicLine(props) {
  React.useEffect(() => {
    let chartDom = document.getElementById("main");
    let myChart = echarts.init(chartDom);
    let option = props.option || {
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: "line",
        },
      ],
    };

    option && myChart.setOption(option);
  });

  let offsetWidth = document.body.offsetWidth;
  const col = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

  let width;
  if (offsetWidth >= 1200) {
    width = (offsetWidth * props.w) / col.lg;
  } else if (offsetWidth >= 992) {
    width = (offsetWidth * props.w) / col.md;
  } else if (offsetWidth >= 768) {
    width = (offsetWidth * props.w) / col.sm;
  } else if (offsetWidth >= 576) {
    width = (offsetWidth * props.w) / col.xs;
  } else {
    width = (offsetWidth * props.w) / col.xxs;
  }
  let style = { width: width, height: 300 };

  return <div id="main" style={style} />;
}
