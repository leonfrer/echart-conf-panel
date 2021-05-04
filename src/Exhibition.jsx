import React from "react";
import _ from "lodash";
import ReactEcharts from "echarts-for-react";
import { WidthProvider, Responsive } from "react-grid-layout";
import Layout, { Content } from "antd/lib/layout/layout";
import axios from "axios";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const corsServerUrl = "http://localhost:8080/";

export default class Exhibition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layouts: this.getFromLS("layouts") || {},
      widgets: this.getFromLS("widgets") || [],
    };
  }

  componentDidMount() {
    this.timeId = setInterval(() => this.updateWidgets(), 8000);
  }

  componentWillUnmount() {
    clearInterval(this.timeId);
  }

  getFromLS(key) {
    let ls = {};
    if (global.localStorage) {
      try {
        ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
      } catch (e) {
        /*Ignore*/
      }
    }
    return ls[key];
  }

  saveToLS(key, value) {
    if (global.localStorage) {
      global.localStorage.setItem(
        "rgl-8",
        JSON.stringify({
          [key]: value,
        })
      );
    }
  }

  updateWidgets() {
    let widgets = _.cloneDeep(this.state.widgets);
    if (!!!widgets.length) {
      return;
    }
    for (let i = 0; i < widgets.length; i++) {
      let widget = _.cloneDeep(widgets[i]);
      let option = widget.option;
      let optionKeys = Object.keys(option);
      optionKeys = optionKeys.filter((key) => key.endsWith("_url"));
      if (optionKeys.length < 1) {
        continue;
      }
      for (let i = 0; i < optionKeys.length; i++) {
        const key = optionKeys[i];
        axios({
          url: corsServerUrl + option[key],
          method: "GET",
        })
          .then((res) => {
            if (!!res.data && res.data.success) {
              // todo 验证data
              let data = res.data.data;
              let ks = key.split("_");
              ks.pop();
              _.set(widget, ["option"].concat(ks), data);
            }
          })
          .catch((err) => {});
      }
      widgets[i] = widget;
    }
    this.setState({
      widgets: widgets,
    });
    this.saveToLS(widgets);
  }

  generateDOM = () => {
    return _.map(this.state.widgets, (l, i) => {
      return (
        <div key={l.i} data-grid={l}>
          <span className="remove" onClick={this.onRemoveItem.bind(this, i)}>
            x
          </span>
          <ReactEcharts
            option={l.option}
            notMerge={true}
            lazyUpdate={true}
            style={{ width: "100%", height: "100%" }}
            key={Date.now()}
          />
        </div>
      );
    });
  };

  onLayoutChange = (layout, layouts) => {
    this.saveToLS("layouts", layouts);
    this.setState({ layouts });
  };

  render() {
    return (
      <Layout>
        <Content style={{ marginTop: 44 }}>
          <div style={{ background: "#fff", padding: 20, minHeight: 800 }}>
            <ResponsiveReactGridLayout
              className="layout"
              {...this.props}
              layouts={this.state.layouts}
              onLayoutChange={(layout, layouts) =>
                this.onLayoutChange(layout, layouts)
              }
            >
              {this.generateDOM()}
            </ResponsiveReactGridLayout>
          </div>
        </Content>
      </Layout>
    );
  }
}
