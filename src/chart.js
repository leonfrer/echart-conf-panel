export function getBarChart() {
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: ["2014", "2015", "2016", "2017", "2018", "2019"],
        axisLine: {
          lineStyle: {
            color: "#8FA3B7", //y轴颜色
          },
        },
        axisLabel: {
          show: true,
          color: "#6D6D6D",
        },
        axisTick: { show: false },
      },
    ],
    yAxis: [
      {
        type: "value",
        splitLine: { show: false },
        //max: 700,
        splitNumber: 3,
        axisTick: { show: false },
        axisLine: {
          lineStyle: {
            color: "#8FA3B7", //y轴颜色
          },
        },
        axisLabel: {
          show: true,

          color: "#6D6D6D",
        },
      },
    ],
    series: [
      {
        name: "a",
        type: "bar",
        barWidth: "40%",
        itemStyle: {
          color: "#FAD610",
        },
        stack: "信息",
        data: [320, 132, 101, 134, 90, 30],
      },
      {
        name: "b",
        type: "bar",
        itemStyle: {
          color: "#27ECCE",
        },
        stack: "信息",
        data: [220, 182, 191, 234, 290, 230],
      },
      {
        name: "c",
        type: "bar",
        itemStyle: {
          color: "#4DB3F5",
        },
        stack: "信息",
        data: [150, 132, 201, 154, 90, 130],
      },
    ],
  };
  return option;
}

export function getLineChart() {
  //option
  // const option = {
  //   color: ["#D53A35"],
  //   tooltip: {
  //     trigger: "axis",
  //     //formatter: "{b} <br> 合格率: {c}%"
  //   },
  //   grid: {
  //     left: "3%",
  //     right: "4%",
  //     bottom: "3%",
  //     containLabel: true,
  //   },
  //   xAxis: {
  //     type: "category",
  //     name: "",
  //     boundaryGap: false,
  //     axisLine: {
  //       show: false,
  //       lineStyle: {
  //         color: "#525252",
  //       },
  //     },
  //     axisTick: {
  //       show: false,
  //     },
  //     axisLabel: {
  //       color: "#525252",
  //     },
  //     data: [
  //       "01",
  //       "02",
  //       "03",
  //       "04",
  //       "05",
  //       "06",
  //       "07",
  //       "08",
  //       "09",
  //       "10",
  //       "11",
  //       "12",
  //       "13",
  //       "14",
  //       "15",
  //       "16",
  //       "17",
  //       "18",
  //       "19",
  //       "20",
  //       "21",
  //       "22",
  //       "23",
  //       "24",
  //     ],
  //   },
  //   yAxis: {
  //     type: "value",
  //     name: "",
  //     axisLine: {
  //       show: false,
  //     },
  //     axisTick: {
  //       show: false,
  //     },
  //     axisLabel: {
  //       color: "#525252",
  //     },
  //     splitLine: {
  //       lineStyle: {
  //         type: "dotted",
  //         color: "#AAA", //F3F3F3
  //       },
  //     },
  //   },
  //   series: [
  //     {
  //       name: "a",
  //       type: "line",
  //       symbol: "circle",
  //       data: [
  //         100,
  //         120,
  //         132,
  //         101,
  //         134,
  //         90,
  //         230,
  //         210,
  //         80,
  //         20,
  //         90,
  //         210,
  //         200,
  //         100,
  //         120,
  //         132,
  //         101,
  //         134,
  //         90,
  //         230,
  //         210,
  //         80,
  //         20,
  //         90,
  //       ],
  //     },
  //   ],
  // };
  const option = {
    title: {
      text: "折线图堆叠",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "邮件营销",
        type: "line",
        stack: "总量",
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: "联盟广告",
        type: "line",
        stack: "总量",
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: "视频广告",
        type: "line",
        stack: "总量",
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: "直接访问",
        type: "line",
        stack: "总量",
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: "搜索引擎",
        type: "line",
        stack: "总量",
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
  };
  return option;
}

export function getPieChart() {
  //option
  const option = {
    color: ["#3AA1FF", "#36CBCB", "#4ECB73", "#FBD338"],
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    series: [
      {
        name: "消费能力",
        type: "pie",
        radius: ["40%", "55%"],
        center: ["50%", "55%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderColor: "#FFFFFF",
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            name: "a",
            value: "20",
          },
          {
            name: "b",
            value: "40",
          },
          {
            name: "c",
            value: "10",
          },
          {
            name: "d",
            value: "10",
          },
        ],
      },
    ],
  };
  return option;
}
