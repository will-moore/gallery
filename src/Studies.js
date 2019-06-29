import React, { useContext, useState, useEffect } from 'react';
import { Router } from "@reach/router"
import SettingsContext from './model/context';
import Categories from './Categories';
import Search from './Search';
import SearchForm from './SearchForm';
import { fetchStudies,
         loadStudiesMapAnnotations,
         loadStudiesThumbnails } from './model/fetchData';
import { BASEPATH } from './router/wrappers';

function Studies() {

  const gallerySettings = useContext(SettingsContext);
  const base_url = gallerySettings.BASE_URL;

  const [data, setData] = useState({ studies: [] });

  useEffect(() => {
    const fetchData = async () => {
      if (!base_url) return;
      // Load studies, then load map annotations and thumbnails for them
      let studies = await fetchStudies(base_url);
      studies = await loadStudiesMapAnnotations(studies, base_url);
      studies = await loadStudiesThumbnails(studies, base_url);
      setData({studies});
    };

    fetchData();
  }, [base_url]);

  return (
    <div className="row column">
      <SearchForm
        studies={data.studies}
      />
      <Router primary={false} basepath={BASEPATH}>
        <Categories
          path="/"
          studies={data.studies}
        />
        <Categories
          path="/:superCategory/"
          studies={data.studies}
        />
        <Search
          path="/search/"
          studies={data.studies}
        />
      </Router>
    </div>
  );
}

export default Studies;
