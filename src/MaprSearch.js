import React, { useState, useEffect } from 'react';
import { filterStudiesByMaprResponse } from './model/filterStudies';
import { BASE_URL, loadMaprStudies, getStudyValue } from './model/fetchData';

function Search({studies, query}) {

  const [loading, setLoading] = useState(true);
  const [maprResults, setMaprResults] = useState([]);

  let key = query.split(':')[0].replace('mapr_', '');
  let value = query.split(':')[1];
  
  useEffect(() => {
    const fetchData = async () => {
      // Load studies, then load map annotations and thumbnails for them
      let results = await loadMaprStudies(key, value);
      setLoading(false);
      setMaprResults(results);
    };
    fetchData();
  }, []);

  if (loading || studies.length === 0) {
    return (<div>Finding images with {key}: {value}...</div>);
  }

  // filter studies by results
  // maprResults is a list e.g. [{term:Top2, projects:[], screens:[]}, {term: TOP2...}
  let studiesByTerm = maprResults.map(data => filterStudiesByMaprResponse(studies, data));
  let terms = maprResults.map(r => r.term);
  let imageCount = studiesByTerm.reduce((count, studies) => {
    return count + studies.reduce((count, study) => count + study.imageCount, 0);
  }, 0);
  let studyCount = studiesByTerm.reduce((count, studies) => count + studies.length, 0);

  if (studyCount === 0) {
    return (<div>No matching studies. Try (TODO: other) IDR.</div>)
  }

  return (
    <div className="small-12 small-centered medium-12 medium-centered text-center columns">
      <p className="filterMessage">
       Found <strong>{imageCount}</strong> images
       with <strong>{key}</strong>: <strong>{terms.join('/')}
       </strong> in <strong>{studyCount}</strong> studies
      </p>

      { studiesByTerm.map((studies, idx) => (
        <div>
          <h2>{terms[idx]}</h2>
          <table style={{ marginTop: 20}}>
            <tbody>
              <tr>
                <th>Study ID</th>
                <th>Organism</th>
                <th>Image count</th>
                <th>Title</th>
                <th>Sample Images</th>
                <th>Link</th>
              </tr>
              {studies.map(study => (
                <tr>
                  <td>
                    <a target="_blank" rel="noopener noreferrer"
                        href={`${ BASE_URL}mapr/${ key }/?value=${ terms[idx] }&show=${study.objId}`}>
                      {study.objId}
                    </a>
                  </td>
                  <td>{ getStudyValue(study, 'Organism') }</td>
                  <td>{ study.imageCount }</td>
                  <td title={ study.title }>
                    { study.title.slice(0,40) }{ study.title.length > 40 ? '...' : '' }
                  </td>
                  <td class="exampleImages"></td>
                  <td class="exampleImagesLink"><a target="_blank" href="/mapr/gene/?value=TOP2&amp;show=plate-101">
                    more...
                  </a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      </div>
  );
}

export default Search;
