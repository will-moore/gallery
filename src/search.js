import React from 'react';
import CategoryStudy from './CategoryStudy';
import MaprSearch from './MaprSearch';
import { filterStudiesByMapQuery } from './model/filterStudies';
const queryString = require('query-string');

function Search({studies, location}) {

  let query = queryString.parse(location.search).query;

  if (query.startsWith('mapr_')) {
    return <MaprSearch
             studies={studies}
             query={query} />
  }

  let filteredStudies;
  if (query.split(':')[0] === 'Name') {
    let toMatch = query.split(':')[1].toLowerCase();
    filteredStudies = studies.filter(study => study.Name.toLowerCase().indexOf(toMatch) !== -1);
  } else {
    filteredStudies = filterStudiesByMapQuery(studies, query);
  }

  return (
    <div className="small-12 small-centered medium-12 medium-centered columns">
    <div id="studies" className="row horizontal studiesLayout">
      {filteredStudies.map(study => (
        <CategoryStudy key={study.objId}
                  study={study}
                />)
        )}
    </div>
    </div>
  );
}

export default Search;
