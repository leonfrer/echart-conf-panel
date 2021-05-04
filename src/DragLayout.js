import React, { PureComponent } from "react";
import {
  Modal,
  Layout,
  Button,
  Input,
  Form,
  Divider,
  Select,
  Row,
  Col,
} from "antd";
import { WidthProvider, Responsive } from "react-grid-layout";
import _ from "lodash";
import ReactEcharts from "echarts-for-react";
import axios from "axios";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const { Header, Content } = Layout;
const { TextArea } = Input;

const corsServerUrl = "http://localhost:8080/";

export default class DragLayout extends PureComponent {
  static defaultProps = {
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 100,
  };

  constructor(props) {
    super(props);

    this.state = {
      // widgets: this.getLocalstorage("widgets") || [],
      widgets: [],
      layouts: this.getLocalstorage("layouts") || {},
      // layouts: {},
      customModalVisible: false,
      barModalVisible: false,
      lineModalVisible: false,
      pieModalVisible: false,
      scatterModalVisible: false,
      customJson: { value: "" },
    };
    this.customJsonChange = this.customJsonChange.bind(this);

    this.barFormCancel = this.barFormCancel.bind(this);
    this.barFormFinish = this.barFormFinish.bind(this);

    this.lineFormCancel = this.lineFormCancel.bind(this);
    this.lineFormFinish = this.lineFormFinish.bind(this);

    this.pieFormCancel = this.pieFormCancel.bind(this);
    this.pieFormFinish = this.pieFormFinish.bind(this);

    this.scatterFormCancel = this.scatterFormCancel.bind(this);
    this.scatterFormFinish = this.scatterFormFinish.bind(this);

    this.customFormCancel = this.customFormCancel.bind(this);
    this.customFormFinish = this.customFormFinish.bind(this);
  }

  componentDidMount() {
    if (this.getLocalstorage("widgets")) {
      let options = _.cloneDeep(this.getLocalstorage("widgets")).map(
        (widget) => widget.option
      );
      this.initCharts(options);
    }
    this.timeId = setInterval(() => this.updateWidgets(), 8000);
  }

  componentWillUnmount() {
    clearInterval(this.timeId);
  }

  updateWidgets() {
    let widgets = _.cloneDeep(this.state.widgets);
    if (!widgets.length) {
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
    this.saveToLocalstorage("widgets", widgets);
    this.setState({
      widgets: widgets,
    });
  }

  formRef = React.createRef();

  getLocalstorage(key) {
    let ls = "";
    if (global.localStorage) {
      try {
        ls = JSON.parse(global.localStorage.getItem(key)) || "";
      } catch (e) {
        /*Ignore*/
      }
    }
    return ls;
  }

  saveToLocalstorage(key, value) {
    if (global.localStorage) {
      global.localStorage.setItem(key, JSON.stringify(value));
    }
  }

  getFromLS(key) {
    let ls = "";
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
      let rgl_8 = global.localStorage.getItem("rgl-8");
      if (rgl_8) {
        rgl_8 = JSON.parse(rgl_8);
        rgl_8[key] = value;
        global.localStorage.setItem("rgl-8", JSON.stringify(value));
      } else {
        global.localStorage.setItem(
          "rgl-8",
          JSON.stringify({
            [key]: value,
          })
        );
      }
    }
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

  addChart(option) {
    const addItem = {
      x: (this.state.widgets.length * 3) % (this.state.cols || 12),
      y: Infinity, // puts it at the bottom
      w: 3,
      h: 2,
      i: new Date().getTime().toString(),
    };
    let widgets = this.state.widgets.concat({
      ...addItem,
      // type,
      option,
    });
    this.saveToLocalstorage("widgets", widgets);
    this.setState({
      widgets: widgets,
    });
  }

  initCharts(options) {
    let widgets = _.cloneDeep(this.state.widgets);
    options.forEach(
      (option, index) => {
        const addItem = {
          x: (index * 3) % (this.state.cols || 12),
          y: Infinity, // puts it at the bottom
          w: 3,
          h: 2,
          i: index.toString(),
        };
        widgets = widgets.concat({
          ...addItem,
          option,
        });
      },
      [this, widgets]
    );
    this.saveToLocalstorage("widgets", widgets);
    this.setState({
      widgets: widgets,
    });
  }

  onRemoveItem(i) {
    this.setState({
      widgets: this.state.widgets.filter((item, index) => index !== i),
    });
  }

  onLayoutChange(layout, layouts) {
    this.saveToLocalstorage("layouts", layouts);
    this.setState({ layouts });
  }

  // json格式验证
  validJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return {
        validateStatus: "error",
        errorMsg: "请输入json格式的文本",
      };
    }
    return {
      validateStatus: "success",
      errorMsg: null,
    };
  }

  // 柱状图添加表单
  barFormCancel() {
    this.setState({ barModalVisible: false });
  }
  barFormFinish(form) {
    let xAxis_data = JSON.parse(form.xAxis_data);
    let series_0_data = JSON.parse(form.series_0_data);
    let option = {
      xAxis: {
        type: "category",
        data: xAxis_data,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: series_0_data,
          type: "bar",
        },
      ],
    };
    Object.keys(form)
      .filter((url) => url.endsWith("_url"))
      .forEach(
        (url) => {
          if (!_.isEmpty(form[url])) {
            option[url] = form[url];
          }
        },
        [form, option]
      );
    this.addChart(option);
    this.setState({ barModalVisible: false });
    this.formRef.current.resetFields();
  }

  // 折线添加表单
  lineFormCancel() {
    this.setState({ lineModalVisible: false });
  }
  lineFormFinish(form) {
    let xData = JSON.parse(form.xAxis_data);
    let data = JSON.parse(form.series_0_data);

    let option = {
      xAxis: {
        type: form.xType,
        data: xData,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: data,
          type: "line",
        },
      ],
      title: {
        text: form.titleText,
      },
    };
    Object.keys(form)
      .filter((url) => url.endsWith("_url"))
      .forEach(
        (url) => {
          if (!_.isEmpty(form[url])) {
            option[url] = form[url];
          }
        },
        [form, option]
      );

    this.addChart(option);
    this.setState({ lineModalVisible: false });
    this.formRef.current.resetFields();
  }

  // 饼图添加表单
  pieFormCancel() {
    this.setState({ pieModalVisible: false });
  }
  pieFormFinish(form) {
    console.log(form);
    // todo
    this.setState({ pieModalVisible: false });
    this.formRef.current.resetFields();
  }

  // 散点图添加表单
  scatterFormCancel() {
    this.setState({ scatterModalVisible: false });
  }
  scatterFormFinish(form) {
    console.log(form);
    // todo
    this.setState({ scatterModalVisible: false });
    this.formRef.current.resetFields();
  }

  // 自定义添加表单
  customFormCancel() {
    this.setState({ customModalVisible: false });
  }
  customJsonChange(e) {
    let str = e.target.value;
    this.setState({ customJson: { ...this.validJson(str), str } });
  }
  customFormFinish(form) {
    this.addChart(JSON.parse(form.option));
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
            onClick={() => {
              this.setState({ barModalVisible: true });
            }}
          >
            添加柱状图
          </Button>
          <Modal
            title="添加柱状图"
            width={800}
            visible={this.state.barModalVisible}
            onCancel={this.barFormCancel}
            destroyOnClose={true}
            footer={null}
          >
            <Form
              layout="vertical"
              name="form_in_modal"
              ref={this.formRef}
              onFinish={this.barFormFinish}
            >
              <Row gutter={8}>
                <Col span={6}>
                  <Form.Item name="titleText" label="图表标题">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={8}>
                  <Form.Item name="series_0_data" label="默认数据">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="series_0_data_url" label="数据Url">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={8}>
                  <Form.Item name="xAxis_data" label="x轴默认数据">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="xAxis_data_url" label="x轴默认数据Url">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Divider />
              <Form.Item style={{ display: "inline-block" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: "20px" }}
                >
                  保存
                </Button>
                <Button
                  type="primary"
                  onClick={this.barFormCancel}
                  style={{ marginRight: "7px" }}
                >
                  取消
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Button
            type="primary"
            style={{ marginRight: "7px" }}
            onClick={() => {
              this.setState({ lineModalVisible: true });
            }}
          >
            添加折线图
          </Button>
          <Modal
            title="添加折线图"
            width={800}
            visible={this.state.lineModalVisible}
            onCancel={this.lineFormCancel}
            destroyOnClose={true}
            footer={null}
          >
            <Form
              layout="vertical"
              name="form_in_modal"
              ref={this.formRef}
              onFinish={this.lineFormFinish}
            >
              <Row gutter={8}>
                <Col span={6}>
                  <Form.Item name="titleText" label="图表标题">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={8}>
                  <Form.Item
                    name="series_0_data"
                    label="默认数据（数据Url请求失败时展示）"
                  >
                    <Input placeholder="[150, 230, 224, 218, 135, 147, 260]" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="series_0_data_url" label="数据Url">
                    <Input placeholder="return: {success: true, data: [...]}" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={4}>
                  <Form.Item
                    name="xType"
                    label="x坐标轴类型"
                    initialValue="category"
                  >
                    <Select allowClear>
                      <Select.Option value="value">数值轴</Select.Option>
                      <Select.Option value="category">类目轴</Select.Option>
                      <Select.Option value="time">时间轴</Select.Option>
                      <Select.Option value="log">对数轴</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item
                    name="xAxis_data"
                    label="x轴下标数据（x轴Url无数据时展示）"
                  >
                    <Input placeholder="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" />
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item name="xAxis_data_url" label="x轴下标数据Url">
                    <Input placeholder="return: {success: true, data: [...]}" />
                  </Form.Item>
                </Col>
              </Row>
              <Divider />
              <Form.Item style={{ display: "inline-block" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: "20px" }}
                >
                  保存
                </Button>
                <Button
                  type="primary"
                  onClick={this.lineFormCancel}
                  style={{ marginRight: "7px" }}
                >
                  取消
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Button
            type="primary"
            style={{ marginRight: "7px" }}
            onClick={() => {
              this.setState({
                pieModalVisible: true,
              });
            }}
          >
            添加饼图
          </Button>
          <Modal
            title="添加饼图"
            width={700}
            visible={this.state.pieModalVisible}
            onCancel={this.pieFormCancel}
            destroyOnClose={true}
            footer={null}
          >
            <Form
              layout="vertical"
              name="form_in_modal"
              ref={this.formRef}
              onFinish={this.pieFormFinish}
            >
              <Form.Item
                name="titleText"
                label="图表标题"
                style={{
                  display: "inline-block",
                  width: "20%",
                }}
              >
                <Input />
              </Form.Item>
              <Divider />
              <Form.Item style={{ display: "inline-block" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: "20px" }}
                >
                  保存
                </Button>
                <Button
                  type="primary"
                  onClick={this.pieFormCancel}
                  style={{ marginRight: "7px" }}
                >
                  取消
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Button
            type="primary"
            style={{ marginRight: "7px" }}
            onClick={() => {
              this.setState({
                scatterModalVisible: true,
              });
            }}
          >
            添加散点图
          </Button>
          <Modal
            title="添加散点图"
            width={700}
            visible={this.state.scatterModalVisible}
            onCancel={this.scatterFormCancel}
            destroyOnClose={true}
            footer={null}
          >
            <Form
              layout="vertical"
              name="form_in_modal"
              ref={this.formRef}
              onFinish={this.scatterFormFinish}
            >
              <Form.Item
                name="titleText"
                label="图表标题"
                style={{
                  display: "inline-block",
                  width: "20%",
                }}
              >
                <Input />
              </Form.Item>
              <Divider />
              <Form.Item style={{ display: "inline-block" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: "20px" }}
                >
                  保存
                </Button>
                <Button
                  type="primary"
                  onClick={this.scatterFormFinish}
                  style={{ marginRight: "7px" }}
                >
                  取消
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Button
            type="primary"
            style={{ marginRight: "7px" }}
            onClick={() => {}}
          >
            添加复合图
          </Button>
          <Button
            type="primary"
            style={{ marginRight: "7px" }}
            onClick={() => {
              this.setState({ customModalVisible: true });
            }}
          >
            自定义json添加
          </Button>
          <Modal
            title="自定义规则"
            visible={this.state.customModalVisible}
            onCancel={this.customFormCancel}
            destroyOnClose={true}
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
                validateStatus={this.state.customJson.validateStatus}
              >
                <TextArea
                  rows={6}
                  onChange={this.customJsonChange}
                  help={this.state.customJson.errorMsg}
                />
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
