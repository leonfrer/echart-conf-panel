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
const originalLayouts = getFromLS("layouts") || {};

/**
 * This layout demonstrates how to sync multiple responsive layouts to localstorage.
 */
export default function ResponsiveLocalStorageLayout() {
  const [layouts, setLayouts] = React.useState(
    JSON.parse(JSON.stringify(originalLayouts))
  );
  const [items, setItems] = React.useState(itemsTemplate);
  const [newCounter, setNewCounter] = React.useState(0);

  // 通过item创建grid内容
  // todo 需要修改
  const createElement = (el) => {
    const removeStyle = {
      position: "absolute",
      right: "2px",
      top: 0,
      cursor: "pointer",
    };
    const i = el.i;
    let content;
    const testOption = {
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 200],
          type: "line",
        },
      ],
    };
    if (el.chartKey === "BasicLine") {
      content = <BasicLine option={testOption} w={el.w} />;
    } else {
      content = i;
    }

    return (
      <div key={i} data-grid={el}>
        <span className="text">{content}</span>
        <span className="remove" style={removeStyle}>
          x
        </span>
      </div>
    );
  };

  // 往items中添加元素
  const onAddItem = () => {
    console.log("add item");
    setItems(
      items.concat({
        i: "n" + newCounter,
        x: (items.length * 2) % 12,
        y: Infinity,
        w: 2,
        h: 2,
      })
    );
    setNewCounter(newCounter + 1);
  };

  // 重置布局
  const resetLayout = () => {
    setLayouts(originalLayouts);
  };

  const onLayoutChange = (layout, layouts) => {
    // todo 保存到配置文件
    saveToLS("layouts", layouts);
    setLayouts({ layouts: layouts });
  };

  return (
    <div>
      <div>
        <div className="div-inline">
          <Button
            variant="contained"
            color="primary"
            onClick={() => resetLayout()}
          >
            重置模板
          </Button>
        </div>
        <div className="div-inline">
          <Button variant="contained" color="primary" onClick={onAddItem}>
            添加模块
          </Button>
        </div>
        <ItemSwitchDialog />
      </div>

      <ResponsiveReactGridLayout
        className="layout"
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        rowHeight={30}
        layouts={layouts}
        onLayoutChange={(layout, layouts) => onLayoutChange(layout, layouts)}
      >
        {_.map(items, (el) => createElement(el))}
      </ResponsiveReactGridLayout>
    </div>
  );
}

function getFromLS(key) {
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

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl-8",
      JSON.stringify({
        [key]: value,
      })
    );
  }
}
