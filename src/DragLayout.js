import React, { PureComponent } from "react";
import { Modal, Layout, Button, Input, Form } from "antd";
import { WidthProvider, Responsive } from "react-grid-layout";
import _ from "lodash";
import ReactEcharts from "echarts-for-react";
import { getBarChart, getLineChart, getPieChart } from "./chart";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const { Header, Content } = Layout;
const { TextArea } = Input;

export default class DragLayout extends PureComponent {
  static defaultProps = {
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 100,
  };

  constructor(props) {
    super(props);

    this.state = {
      layouts: this.getFromLS("layouts") || {},
      widgets: [],
      customModalVisible: false,
    };
    this.customFormCancel = this.customFormCancel.bind(this);
    this.customFormFinish = this.customFormFinish.bind(this);
  }

  formRef = React.createRef();

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
  generateDOM = () => {
    return _.map(this.state.widgets, (l, i) => {
      let option;
      if (l.type === "bar") {
        option = getBarChart();
      } else if (l.type === "line") {
        option = getLineChart();
      } else if (l.type === "pie") {
        option = getPieChart();
      } else if (l.type === "custom") {
        option = l.option;
      }
      return (
        <div key={l.i} data-grid={l}>
          <span className="remove" onClick={this.onRemoveItem.bind(this, i)}>
            x
          </span>
          <ReactEcharts
            option={option}
            notMerge={true}
            lazyUpdate={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      );
    });
  };

  addChart(type, option) {
    const addItem = {
      x: (this.state.widgets.length * 3) % (this.state.cols || 12),
      y: Infinity, // puts it at the bottom
      w: 3,
      h: 2,
      i: new Date().getTime().toString(),
    };
    this.setState({
      widgets: this.state.widgets.concat({
        ...addItem,
        type,
        option,
      }),
    });
  }

  onRemoveItem(i) {
    console.log(this.state.widgets);
    this.setState({
      widgets: this.state.widgets.filter((item, index) => index !== i),
    });
  }

  onLayoutChange(layout, layouts) {
    this.saveToLS("layouts", layouts);
    this.setState({ layouts });
  }

  // 自定义添加表单
  customFormCancel() {
    this.setState({ customModalVisible: false });
  }
  customFormFinish(form) {
    console.log(form.option);
    this.addChart("custom", JSON.parse(form.option));
    this.setState({ customModalVisible: false });
    this.formRef.current.resetFields();
  }

  render() {
    return (
      <Layout>
        <Header
          style={{
            position: "fixed",
            zIndex: 1,
            width: "100%",
            padding: "0 30px",
          }}
        >
          <Button
            type="primary"
            style={{ marginRight: "7px" }}
            onClick={this.addChart.bind(this, "bar")}
          >
            添加柱状图
          </Button>
          <Button
            type="primary"
            style={{ marginRight: "7px" }}
            onClick={this.addChart.bind(this, "line")}
          >
            添加折线图
          </Button>
          <Button
            type="primary"
            style={{ marginRight: "7px" }}
            onClick={this.addChart.bind(this, "pie")}
          >
            添加饼图
          </Button>
          <Button
            type="primary"
            style={{ marginRight: "7px" }}
            onClick={() => {
              this.setState({ customModalVisible: true });
            }}
          >
            自定义添加
          </Button>
          <Modal
            title="自定义规则"
            visible={this.state.customModalVisible}
            onOk={() => {}}
            onCancel={this.customFormCancel}
            destroyOnClose={true}
            // okButtonProps={{ disabled: true }}
            // cancelButtonProps={{ disabled: false }}
            footer={null}
          >
            <Form
              layout="vertical"
              name="form_in_modal"
              ref={this.formRef}
              onFinish={this.customFormFinish}
            >
              <Form.Item
                name="option"
                label="option js"
                rules={[
                  {
                    required: true,
                    message: "请输入option",
                  },
                ]}
              >
                <TextArea rows={6} />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: "7px" }}
              >
                保存
              </Button>
              <Button
                type="primary"
                onClick={this.customFormCancel}
                style={{ marginRight: "7px" }}
              >
                取消
              </Button>
            </Form>
          </Modal>
        </Header>
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
