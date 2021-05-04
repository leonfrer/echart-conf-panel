import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import DragLayout from "./DragLayout";
import Exhibition from "./Exhibition";

function App() {
  return (
    <div>
      <Switch>
        <Route path="/edit">
          <DragLayout />
        </Route>
        <Route path="/exhibition">
          <Exhibition />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
