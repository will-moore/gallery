// First we get gallery_settings. This contains BASE_URL
// which is then used for other calls to load data.
export async function fetchSettings() {
  let url = window.GALLERY_INDEX + "gallery_settings/";
  return await fetch(url)
    .then(response => response.json())
    .then(data => {
      return data;
    });
}
export function getStudyValue(study, key) {
  if (!study.mapValues) return;
  for (let i = 0; i < study.mapValues.length; i++) {
    let kv = study.mapValues[i];
    if (kv[0] === key) {
      return kv[1];
    }
  }
}

export async function fetchStudies(base_url) {
  // Load Projects AND Screens, sort them and render...
  let studies = await Promise.all([
    fetch(base_url + "api/v0/m/projects/?childCount=true"),
    fetch(base_url + "api/v0/m/screens/?childCount=true")
  ])
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(([projects, screens]) => {
      let studies = projects.data;
      studies = studies.concat(screens.data);

      // ignore empty studies with no images
      studies = studies.filter(study => study["omero:childCount"] > 0);

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
        study.id = study["@id"];
        study.type = study["@type"].split("#")[1].toLowerCase();
        study.objId = `${study.type}-${study.id}`;
        return study;
      });
      return studies;
    });
  return studies;
}

export async function loadStudiesMapAnnotations(studies, base_url) {
  let url = base_url + "webclient/api/annotations/?type=map";
  let data = studies.map(study => `${study.type}=${study.id}`).join("&");
  url += "&" + data;
  return await fetch(url)
    .then(response => response.json())
    .then(data => {
      // populate the studies array...
      // dict of {'project-1' : key-values}
      let annsByParentId = {};
      data.annotations.forEach(ann => {
        let key = ann.link.parent.class; // 'ProjectI'
        key = key.substr(0, key.length - 1).toLowerCase();
        key += "-" + ann.link.parent.id; // project-1
        if (!annsByParentId[key]) {
          annsByParentId[key] = [];
        }
        annsByParentId[key] = annsByParentId[key].concat(ann.values);
      });
      // Add mapValues to studies...
      studies = studies.map(study => {
        // immutable - create copy
        study = { ...study };
        let key = `${study["@type"].split("#")[1].toLowerCase()}-${
          study["@id"]
        }`;
        let values = annsByParentId[key];
        if (values) {
          study.mapValues = values;
          let releaseDate = getStudyValue(study, "Release Date");
          if (releaseDate) {
            study.date = new Date(releaseDate);
            if (isNaN(study.date.getTime())) {
              study.date = undefined;
            }
          }
          study.title = getStudyValue(study, "Publication Title");
        }
        return study;
      });
      return studies;
    });
}

export async function loadStudiesThumbnails(studies, base_url) {
  let url = base_url + "gallery-api/thumbnails/";

  let toFind = studies.map(study => `${study.type}=${study.id}`);
  return await fetch(url + "?" + toFind.join("&"))
    .then(response => response.json())
    .then(data => {
      return studies.map(study => {
        // immutable - copy...
        study = { ...study };
        if (data[study.objId]) {
          study.image = data[study.objId].image;
          study.thumbnail = data[study.objId].thumbnail;
        }
        return study;
      });
    });
}

export async function loadMaprAutocomplete(key, value, base_url) {
  let url = `${base_url}mapr/api/autocomplete/${key}/`;
  url += `?value=${value.toLowerCase()}&query=true`;
  let matches = await fetch(url).then(response => response.json());
  return matches;
}

export async function loadMaprStudies(key, value, base_url) {
  // Get all terms that match (NOT case_sensitive)
  let url = `${base_url}mapr/api/${key}/?value=${value}&case_sensitive=false&orphaned=true`;
  let data = await fetch(url).then(response => response.json());

  let maprTerms = data.maps.map(term => term.id);
  let termUrls = maprTerms.map(
    term => `${base_url}mapr/api/${key}/?value=${term}`
  );

  // Get results for All terms
  return await Promise.all(termUrls.map(url => fetch(url)))
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(responses => {
      // add term to each response
      return responses.map((rsp, i) => {
        return { ...rsp, term: maprTerms[i] };
      });
    });
}

function toTitleCase(text) {
  if (!text || text.length === 0) return text;
  return text[0].toUpperCase() + text.slice(1);
}

export function getStudyShortName(study, short_name_config) {
  let shortName = `${toTitleCase(study.type)}: ${study.id}`;
  if (short_name_config) {
    for (let i=0; i < short_name_config.length; i++) {
      let key = short_name_config[i]['key'];
      let value;
      let newShortName;
      if (key === 'Name' || key === 'Description') {
        value = study[key];
      }
      if (!value) {
        value = getStudyValue(study, key);
      }
      if (!value) {
        continue;
      }
      if (short_name_config[i]['regex'] && short_name_config[i]['template']) {
        let re = new RegExp(short_name_config[i]['regex']);
        let groups = re.exec(value);
        if (groups && groups.length > 1) {
          // template e.g. "{{1}}-{{2}}"
          let template = short_name_config[i]['template'];
          for (let g=0; g<groups.length; g++) {
            template = template.replace(`{{${g}}}`, groups[g]);
          }
          // strip out any unused {{2}} etc.
          newShortName = template.replace(/{{\d+}}/g, "");
        }
      } else {
        newShortName = value;
      }
      if (newShortName) {
        shortName = newShortName;
        break;
      }
    }
  }
  return shortName;
}
