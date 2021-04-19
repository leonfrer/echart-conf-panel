import React from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import Button from "@material-ui/core/Button";
// import { makeStyles } from "@material-ui/core/styles";
import Line from "./chart/Line";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const originalLayouts = getFromLS("layouts") || {};

/**
 * This layout demonstrates how to sync multiple responsive layouts to localstorage.
 */
export default function ResponsiveLocalStorageLayout() {
  const itemsTemplate = [0, 1, 2, 3, 4].map((i, key, list) => {
    return {
      i: i.toString(),
      x: i * 2,
      y: 0,
      w: 2,
      h: 2,
      add: i === list.length - 1,
    };
  });

  const [addItemModalOpen, setAddItemModalOpen] = React.useState(false);
  const [layouts, setLayouts] = React.useState(
    JSON.parse(JSON.stringify(originalLayouts))
  );
  const [items, setItems] = React.useState(itemsTemplate);

  const createElement = (el) => {
    const removeStyle = {
      position: "absolute",
      right: "2px",
      top: 0,
      cursor: "pointer",
    };
    const i = el.add ? "+" : el.i;
    return (
      <div key={i} data-grid={el}>
        {el.add ? (
          <span
            className="add text"
            onClick={onAddItem}
            title="You can add an item by clicking here, too."
          >
            Add +
          </span>
        ) : (
          <span className="text">{i}</span>
        )}
        <span
          className="remove"
          style={removeStyle}
          onClick={this.onRemoveItem.bind(this, i)}
        >
          x
        </span>
      </div>
    );
  };

  const openAddItemModal = () => {
    setAddItemModalOpen(true);
  };

  const onAddItem = () => {
    console.log("add item");
  };

  const resetLayout = () => {
    setLayouts(originalLayouts);
  };

  const onLayoutChange = (layout, layouts) => {
    saveToLS("layouts", layouts);
    setLayouts({ layouts: layouts });
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => resetLayout()}>
        重置模板
      </Button>
      <Button variant="contained" color="primary" onClick={onAddItem}>
        添加模块
      </Button>

      <ResponsiveReactGridLayout
        className="layout"
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        layouts={layouts}
        onLayoutChange={(layout, layouts) => onLayoutChange(layout, layouts)}
      >
        <div key="1" data-grid={{ w: 6, h: 16, x: 0, y: 0 }}>
          <Line />
        </div>
        <div key="2" data-grid={{ w: 2, h: 3, x: 2, y: 0, minW: 2, minH: 3 }}>
          <span className="text">2</span>
        </div>
        <div key="3" data-grid={{ w: 2, h: 3, x: 4, y: 0, minW: 2, minH: 3 }}>
          <span className="text">3</span>
        </div>
        <div key="4" data-grid={{ w: 2, h: 3, x: 6, y: 0, minW: 2, minH: 3 }}>
          <span className="text">4</span>
        </div>
        <div key="5" data-grid={{ w: 2, h: 3, x: 8, y: 0, minW: 2, minH: 3 }}>
          <span className="text">5</span>
        </div>
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
