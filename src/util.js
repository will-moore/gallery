
import {getStudyValue} from './model'

export function renderStudyKeys() {
  let html = FILTER_KEYS
      .map(key => {
        if (key.label && key.value) {
          return `<option value="${ key.value }">${ key.label }</option>`
        }
        return `<option value="${ key }">${ key }</option>`
      })
      .join("\n");
  document.getElementById('studyKeys').innerHTML = html;
}

// Load MAPR config
export function loadMaprConfig(callback) {
  fetch(GALLERY_INDEX + 'idr/mapr/config/')
  .then(response => response.json())
  .then(data => {
    let mapr_settings = data;

    let html = FILTER_MAPR_KEYS.map(key => {
      let config = mapr_settings[key];
      if (config) {
        return `<option value="mapr_${ key }">${ config.label }</option>`;
      } else {
        return "";
      }
    }).join("\n");
    document.getElementById('maprKeys').innerHTML = html;

    if (callback) {
      callback(mapr_settings);
    }
  });
}

export function renderStudy(studyData, elementId, linkFunc, htmlFunc) {

  // Add Project or Screen to the page
  // If filterKey, try to render the Key: Value
  let titleRe = /Publication Title\n(.+)[\n]?/
  // let descRe = /Experiment Description\n(.+)[\n]?/
  let desc = studyData.Description;
  let match = titleRe.exec(desc);
  let title = match ? match[1] : '';
  let type = studyData['@type'].split('#')[1].toLowerCase();
  let studyLink = linkFunc(studyData);
  // save for later
  studyData.title = title;

  if (title.length >0) {
     desc = desc.split(title)[1];
   }
  // First line is e.g. "Screen Description". Show NEXT line only.
  let studyDesc = "";
  if (desc) {
    studyDesc = desc.split('\n').filter(l => l.length > 0)[1];
  }

  let idrId = studyData.Name.split('-')[0];  // idr0001
  let authors = getStudyValue(studyData, "Publication Authors") || "";

  // Function (and template) are defined where used in index.html
  let html = htmlFunc(studyLink, studyDesc, idrId, title, authors, BASE_URL)

  var div = document.createElement( "div" );
  div.innerHTML = html;
  div.className = "row study ";
  div.dataset.obj_type = type;
  div.dataset.obj_id = studyData['@id'];
  document.getElementById(elementId).appendChild(div);
}
