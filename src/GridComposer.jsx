import React from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import _ from "lodash";
import Button from "@material-ui/core/Button";
// import { makeStyles } from "@material-ui/core/styles";

import ItemSwitchDialog from "./ItemSwithDialog";
import itemsTemplate from "./conf/defaultItems.json";
import "./GridComposer.css";
import BasicLine from "./chart/line/BasicLine";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

function generateLayout() {
  return _.map(_.range(0, 10), function (item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: Math.round(Math.random() * 5) * 2,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
      static: Math.random() < 0.05,
    };
  });
}

export default class ResponsiveLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layouts: { lg: generateLayout() },
      mounted: false,
      currentBreakpoint: "lg",
    };
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.generateDOM = this.generateDOM.bind(this);
  }

  componentDidMount() {
    this.setState({
      mounted: true,
    });
  }

  onBreakpointChange(breakpoint) {
    this.setState({
      currentBreakpoint: breakpoint,
    });
  }

  onLayoutChange(layout, layouts) {
    console.log("layout changed");
  }

  generateDOM() {
    console.log("dom rerender");
    return _.map(this.state.layouts.lg, function (l, i) {
      return (
        <div key={i} className={l.static ? "static" : ""}>
          {l.static ? (
            <span
              className="text"
              title="This item is static and cannot be removed or resized."
            >
              Static - {i}
            </span>
          ) : (
            <span className="text">{i}</span>
          )}
        </div>
      );
    });
  }

  render() {
    const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

    return (
      <div>
        <div>
          {/* <div className="div-inline">
            <Button variant="contained" color="primary" onClick={resetLayout}>
              重置模板
            </Button>
          </div> */}
          {/* <div className="div-inline">
            <Button variant="contained" color="primary" onClick={onAddItem}>
              添加模块
            </Button>
          </div> */}
          <ItemSwitchDialog />
        </div>

        <ResponsiveReactGridLayout
          className="layout"
          cols={cols}
          // breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          rowHeight={30}
          layouts={this.state.layouts}
          useCSSTransforms={this.state.mounted}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={(layout, layouts) =>
            this.onLayoutChange(layout, layouts)
          }
        >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}
