import React from 'react';
import { filterStudiesByMapQuery } from './model/filterStudies';
import CategoryStudy from './CategoryStudy';

function Category({data, studies}) {

  let categoryStudies = filterStudiesByMapQuery(studies, data.query);
  if (categoryStudies.length === 0) {
    return <span></span>
  }
  return (
    <div className="row">
        <h1>{data.label} ({ categoryStudies.length })</h1>
        <div className="category">
          <div>
            {categoryStudies.map(study => (
                <CategoryStudy key={study.objId}
                  study={study}
                />
            ))}
          </div>
        </div>
    </div>
  );
}

export default Category;
