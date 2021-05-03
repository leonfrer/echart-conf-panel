import React, { PureComponent } from "react";
import { Modal, Layout, Button, Input, Form, Divider, Select } from "antd";
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
      layouts: this.getFromLS("layouts") || {},
      widgets: [],
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
    this.getOpiton = this.getOpiton.bind(this);
  }

  componentDidMount() {}

  componentDidUpdate() {
    this.timeId = setInterval(() => this.updateWidgets(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timeId);
  }

  updateWidgets() {
    console.log("update");
    let widgets = this.state.widgets;
    if (!!!widgets.length) {
      return;
    }
    for (let i = 0; i < widgets.length; i++) {
      widgets[i].option.series[0].data = [200, 200, 200, 200, 200, 200, 200];
      // let optionKeys = Object.keys(widgets[i].option);
      // optionKeys.filter((key) => key.endsWith("url"));
      // console.log(optionKeys);
    }
    this.setState({
      widgets: widgets,
    });
  }

  getOpiton(i) {
    console.log(i);
    return this.state.widgets[i].option;
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
      return (
        <div key={l.i} data-grid={l}>
          <span className="remove" onClick={this.onRemoveItem.bind(this, i)}>
            x
          </span>
          <ReactEcharts
            option={this.getOpiton(i)}
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
    this.setState({
      widgets: this.state.widgets.concat({
        ...addItem,
        // type,
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
  ncvcvnmnwq;
  // get data
  getData = (url, defaultData) => {
    let data = "";
    axios({
      url: corsServerUrl + url,
      method: "GET",
    }).then((res) => {
      console.log(res);
      if (!!res.data && res.data.success) {
        data = res.data.data;
      }
    });
    if (data === "") {
      data = defaultData;
    }
  };

  // 柱状图添加表单
  barFormCancel() {
    this.setState({ barModalVisible: false });
  }
  barFormFinish(form) {
    console.log(form);
    // todo
    this.setState({ barModalVisible: false });
    this.formRef.current.resetFields();
  }

  // 折线添加表单
  lineFormCancel() {
    this.setState({ lineModalVisible: false });
  }
  lineFormFinish(form) {
    // console.log(form);
    let xData = JSON.parse(form.xData);
    let data = JSON.parse(form.defaultData);
    console.log("data: " + data);
    console.log("xData: " + xData);

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
      xAxis_data_url: form.xDataUrl,
      series_1_data_url: form.url,
    };
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
            width={700}
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
            ></Form>
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
            width={700}
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
              <Form.Item
                name="titleText"
                label="图表标题"
                style={{
                  display: "inline-block",
                  width: "40%",
                }}
              >
                <Input />
              </Form.Item>

              <Divider />

              <Form.Item
                name="defaultData"
                label="默认数据（数据Url请求失败时展示）"
                style={{
                  display: "inline-block",
                  width: "40%",
                }}
              >
                {/* todo 验证 */}
                <Input placeholder="[150, 230, 224, 218, 135, 147, 260]" />
              </Form.Item>
              <Form.Item
                name="url"
                label="数据Url"
                style={{
                  display: "inline-block",
                  width: "40%",
                }}
              >
                <Input placeholder="example：{success: true, data: [...]}" />
              </Form.Item>

              <Divider />

              <Form.Item
                name="xData"
                label="x轴下标数据（x轴Url无数据时展示）"
                style={{
                  display: "inline-block",
                  width: "40%",
                }}
              >
                <Input placeholder="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" />
              </Form.Item>
              <Form.Item
                name="xDataUrl"
                label="x轴下标数据Url"
                style={{
                  display: "inline-block",
                  width: "40%",
                }}
              >
                <Input placeholder="example: {success: true, data: [...]}" />
              </Form.Item>
              <Form.Item
                name="xType"
                label="x坐标轴类型"
                style={{
                  display: "inline-block",
                  width: "40%",
                }}
                initialValue="category"
              >
                <Select style={{ width: 230 }} allowClear>
                  <Select.Option value="value">数值轴</Select.Option>
                  <Select.Option value="category">类目轴</Select.Option>
                  <Select.Option value="time">时间轴</Select.Option>
                  <Select.Option value="log">对数轴</Select.Option>
                </Select>
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
            ></Form>
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
            ></Form>
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
