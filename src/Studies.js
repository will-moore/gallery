import React, { useState, useEffect } from 'react';
import { Router } from "@reach/router"
import Categories from './Categories';
import Search from './Search';
import SearchForm from './SearchForm';
import { fetchStudies,
         loadStudiesMapAnnotations,
         loadStudiesThumbnails } from './model/fetchData';
import { BASEPATH } from './router/wrappers';

function Studies() {

  const [data, setData] = useState({ studies: [] });

  useEffect(() => {
    const fetchData = async () => {

      // Load studies, then load map annotations and thumbnails for them
      let studies = await fetchStudies();
      studies = await loadStudiesMapAnnotations(studies);
      studies = await loadStudiesThumbnails(studies);
      setData({studies});
    };

    fetchData();
  }, []);

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
        <Search
          path="/search/"
          studies={data.studies}
        />
      </Router>
    </div>
  );
}

export default Studies;
