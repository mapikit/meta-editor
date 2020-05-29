import React from "react";
import { store } from ".";
import { observer } from "mobx-react";

@observer
class Anothercomponent extends React.Component {
  render () : React.ReactElement {
    return <p> {"anotherComponent"} {store.foo} </p>;
  }
}

export default Anothercomponent;
