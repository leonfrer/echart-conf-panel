#### 构建和设置

```bash
# install dependencies
yarn

# serve with hot reload at localhost:3000
yarn start

# build for production with minification
yarn build

```

## 技术点

- React
- Ant Design
- react-grid-layout
- echarts

## echarts 文档注记

使用 option 定义每个图，其中

### series

是指：一组数值以及他们映射成的图。包含的要素至少有：一组数值、图表类型（series.type）、以及其他的关于这些数据如何映射成图的参数。

### component

echarts 中各种内容，被抽象为“组件”

charts 中至少有这些组件：xAxis（直角坐标系 X 轴）、yAxis（直角坐标系 Y 轴）、grid（直角坐标系底板）、angleAxis（极坐标系角度轴）、radiusAxis（极坐标系半径轴）、polar（极坐标系底板）、geo（地理坐标系）、dataZoom（数据区缩放组件）、visualMap（视觉映射组件）、tooltip（提示框组件）、toolbox（工具栏组件）、series（系列）

![component](https://echarts.apache.org/zh/documents/asset/img/basic-concepts-overview/components.jpg)
