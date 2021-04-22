import React from "react";
import ResponsiveLocalStorageLayout from "./GridComposer";
import BasicLine from "./chart/line/BasicLine";

class App extends React.Component {
  render() {
    return (
      <div>
        <ResponsiveLocalStorageLayout />
        {/* <BasicLine /> */}
      </div>
    );
  }
}

export default App;
