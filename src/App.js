import React from 'react';
import { AbsoluteLink as Link } from './router/wrappers';
// Use a customised foundation.css - ported from IDR
import './css/foundation.min.css';
import './css/openmicroscopy.css';
import './css/idr.css';
import './css/studies.css';
import { ReactComponent as Logo } from './logo-idr.svg';
import Studies from './Studies';

function App() {

  let hrStyle = {
    height:0, margin: '8px'
  }
  return (
    <div>
      <div className="main-nav-bar top-bar" id="main-menu">
        <div className="top-bar-left">
          <ul className="dropdown menu" data-dropdown-menu="219f5j-dropdown-menu" role="menubar">
            <li role="menuitem">
              <Link to="/" className="logo">
                <Logo />
              </Link>
            </li>
            <li role="menuitem">
              <a href="/cell/">
                Cell - IDR
              </a>
            </li>
            <li role="menuitem">
              <a href="/tissue/">
                Tissue - IDR
              </a>
            </li>
          </ul>
        </div>
      </div>
      <hr className="whitespace" style={hrStyle} />
      <div className="row columns text-center">
        <h1>Welcome to IDR</h1>
        <p>
          The Image Data Resource (IDR) is a public repository of image datasets from published scientific studies,
          <br />
          where the community can submit, search and access high-quality bio-image data.
        </p>
      </div>

      <Studies />
    </div>
  );
}

export default App;
