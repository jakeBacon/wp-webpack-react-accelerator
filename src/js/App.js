import React from 'react';
import testImage from './../images/instagram.svg';

const App = () => {
  return (
    <div className="app center-align">
      <header className="app-header">
        <h1 className="app-title">Welcome to the The Webpack Wordpress React Accelerator test page!  🎉</h1>
      </header>
      <p className="app-intro">
        To get started, edit the JS and SCSS files indside <code>src/js</code> and <code>src/scss</code>. Save your changes and reload the page to see the magic.
      </p>
      <a href="https://www.instagram.com/ajukreizidigital/">
        <img src={testImage} alt="Awesome picture" />
      </a>
    </div>
  );
}

export default App;