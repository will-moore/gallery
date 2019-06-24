import React, {useState, useEffect} from 'react';
// Use a customised foundation.css - ported from IDR
import './css/foundation.min.css';
import './css/openmicroscopy.css';
import './css/idr.css';
import './css/studies.css';
import Studies from './Studies';
import TopBarLeft from './TopBarLeft';
import { fetchSettings } from './model/fetchData';
import { SettingsProvider } from './model/context';

function App() {

  // http://localhost:4080/gallery/gallery_settings/
  const [gallerySettings, setGallerySettings] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      // Load settings....
      let settings = await fetchSettings();
      setGallerySettings(settings);
    };

    fetchData();
  }, []);

  let hrStyle = {
    height:0, margin: '8px'
  }
  return (
    <SettingsProvider value={gallerySettings}>
      <div className="main-nav-bar top-bar" id="main-menu">
        <TopBarLeft></TopBarLeft>
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
    </SettingsProvider>
  );
}

export default App;
