import React, { Component } from 'react';

import Button from './components/Button';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>App.js</code> and save to reload.
        </p>
        <Button />
      </div>
    );
  }
}

export default App;