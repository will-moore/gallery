
export const BASE_URL = "http://idr.openmicroscopy.org/";

export function getStudyValue(study, key) {
  if (!study.mapValues) return;
  for (let i=0; i<study.mapValues.length; i++){
    let kv = study.mapValues[i];
    if (kv[0] === key) {
      return kv[1];
    }
  }
}

export async function fetchStudies() {
  // Load Projects AND Screens, sort them and render...
  let studies = await Promise.all([
    fetch(BASE_URL + "api/v0/m/projects/?childCount=true"),
    fetch(BASE_URL + "api/v0/m/screens/?childCount=true"),
  ]).then(responses =>
    Promise.all(responses.map(res => res.json()))
    ).then(([projects, screens]) => {
      let studies = projects.data;
      studies = studies.concat(screens.data);
      
      // ignore empty studies with no images
      studies = studies.filter(study => study['omero:childCount'] > 0);
      
      // sort by name, reverse
      studies.sort(function(a, b) {
        var nameA = a.Name.toUpperCase();
        var nameB = b.Name.toUpperCase();
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        // names must be equal
        return 0;
      });
      
      // Add 'id', 'type' ("project"), studyId ("screen-1") to each
      studies = studies.map(study => {
        study.id = study['@id'];
        study.type = study['@type'].split('#')[1].toLowerCase();
        study.objId = `${ study.type }-${ study.id }`;
        return study;
      });
      return studies;
    });
  return studies;
}
  
  export async function loadStudiesMapAnnotations(studies) {
    let url = BASE_URL + "webclient/api/annotations/?type=map";
    let data = studies
      .map(study => `${ study.type }=${ study.id }`)
      .join("&");
    url += '&' + data;
    return await fetch(url)
      .then(response => response.json())
      .then(data => {
        // populate the studies array...
        // dict of {'project-1' : key-values}
        let annsByParentId = {};
        data.annotations.forEach(ann => {
          let key = ann.link.parent.class;  // 'ProjectI'
          key = key.substr(0, key.length-1).toLowerCase();
          key += '-' + ann.link.parent.id;  // project-1
          if (!annsByParentId[key]) {
            annsByParentId[key] = [];
          }
          annsByParentId[key] = annsByParentId[key].concat(ann.values);
        });
        // Add mapValues to studies...
        studies = studies.map(study => {
          // immutable - create copy
          study = {...study};
          let key = `${ study['@type'].split('#')[1].toLowerCase() }-${ study['@id'] }`;
          let values = annsByParentId[key];
          if (values) {
            study.mapValues = values;
            let releaseDate = getStudyValue(study, 'Release Date');
            if (releaseDate) {
              study.date = new Date(releaseDate);
              if (isNaN(study.date.getTime())) {
                study.date = undefined;
              }
            }
            study.title = getStudyValue(study, 'Publication Title');
          }
          return study;
        });
        return studies;
      });
  }

  export async function loadStudiesThumbnails(studies) {
    let url = BASE_URL + "gallery-api/thumbnails/";
  
    let toFind = studies.map(study => `${ study.type }=${ study.id }`);
    return await fetch(url + '?' + toFind.join('&'))
      .then(response => response.json())
      .then(data => {
        return studies.map(study => {
          // immutable - copy...
          study = {...study};
          if (data[study.objId]) {
            study.image = data[study.objId].image;
            study.thumbnail = data[study.objId].thumbnail;
          }
          return study;
        })
      });
  }

  export async function loadMaprAutocomplete(key, value) {
    let url = `${ BASE_URL }mapr/api/autocomplete/${ key }/`;
    url += `?value=${ value.toLowerCase() }&query=true`;
    let matches = await fetch(url).then(response => response.json());
    return matches;
  }

  export async function loadMaprStudies(key, value) {  
    // Get all terms that match (NOT case_sensitive)
    let url = `${ BASE_URL }mapr/api/${ key }/?value=${ value }&case_sensitive=false&orphaned=true`;
    let data = await fetch(url).then(response => response.json());
    
    let maprTerms = data.maps.map(term => term.id);
    let termUrls = maprTerms.map(term => `${ BASE_URL }mapr/api/${ key }/?value=${ term }`);

    // Get results for All terms
    return await Promise.all(termUrls.map(url => fetch(url)))
      .then(responses => Promise.all(responses.map(res => res.json())))
      .then((responses) => {
        // add term to each response
        return responses.map((rsp, i) => {
          return {...rsp, term: maprTerms[i]}
        })
      })
  }
