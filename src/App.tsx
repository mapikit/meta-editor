import * as React from "react";
import { observer } from "mobx-react";
import { Store } from "./store";
import Anothercomponent from "./AnotherComponent";

@observer
class App extends React.Component<{ store : Store }> {
  private store : Store;
  private interval : NodeJS.Timeout;

  constructor (props : { store : Store }) {
    super(props);

    this.store = props.store;

    this.interval = setInterval(() => { this.store.foo += 1; }, 500);
  }

  componentWillUnmount () : void {
    clearInterval(this.interval);
  }

  render () : React.ReactElement {
    return <h1> <Anothercomponent /> </h1>;
  }
}

export default App;
