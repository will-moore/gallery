
import StudiesModel from './model';
import { renderStudyKeys, loadMaprConfig, renderStudy } from './util';

// loaded below
let mapr_settings = {};

// Model for loading Projects, Screens and their Map Annotations
let model = new StudiesModel();


// ----- event handling --------

document.getElementById('maprConfig').onchange = (event) => {
  document.getElementById('maprQuery').value = '';
  let value = event.target.value.replace('mapr_', '');
  let placeholder = mapr_settings[value] ? mapr_settings[value].default[0] : value;
  document.getElementById('maprQuery').placeholder = placeholder;
  // Show all autocomplete options...
  $("#maprQuery").focus();
  renderCategories();
}

document.getElementById('maprQuery').onfocus = (event) => {
  $("#maprQuery").autocomplete("search", event.target.value);
}

// ------ AUTO-COMPLETE -------------------

function showSpinner() {
  document.getElementById('spinner').style.visibility = 'visible';
}
function hideSpinner() {
  document.getElementById('spinner').style.visibility = 'hidden';
}

$("#maprQuery")
  .keyup(event => {
    if (event.which == 13) {
      let configId = document.getElementById("maprConfig").value;
      document.location.href = `search/?query=${ configId }:${ event.target.value }`;
    }
  })
  .autocomplete({
    autoFocus: false,
    delay: 1000,
    source: function( request, response ) {

        // if configId is not from mapr, we filter on mapValues...
        let configId = document.getElementById("maprConfig").value;
        if (configId.indexOf('mapr_') != 0) {

          let matches;
          if (configId === 'Name') {
            matches = model.getStudiesNames(request.term);
          } else {
            matches = model.getKeyValueAutoComplete(configId, request.term);
          }
          response(matches);
          return;
        }

        // Don't handle empty query for mapr
        if (request.term.length == 0) {
          return;
        }

        // Auto-complete to filter by mapr...
        configId = configId.replace('mapr_', '');
        let case_sensitive = false;

        let requestData = {
            case_sensitive: case_sensitive,
            '_': CACHE_BUSTER,    // CORS cache-buster
        }
        let url;
        if (request.term.length === 0) {
          // Try to list all top-level values.
          // This works for 'wild-card' configs where number of values is small e.g. Organism
          // But will return empty list for e.g. Gene
          url = `${ BASE_URL }/mapr/api/${ configId }/`;
          requestData.orphaned = true
        } else {
          // Find auto-complete matches
          url = `${ BASE_URL }/mapr/api/autocomplete/${ configId }/`;
          requestData.value = case_sensitive ? request.term : request.term.toLowerCase();
          requestData.query = true;   // use a 'like' HQL query
        }
        showSpinner();
        $.ajax({
            dataType: "json",
            type : 'GET',
            url: url,
            data: requestData,
            success: function(data) {
                hideSpinner();
                if (request.term.length === 0) {
                  // Top-level terms in 'maps'
                  if (data.maps && data.maps.length > 0) {
                    let terms = data.maps.map(m => m.id);
                    terms.sort();
                    response(terms);
                  }
                }
                else if (data.length > 0) {
                    response( $.map( data, function(item) {
                        return item;
                    }));
                } else {
                   response([{ label: 'No results found.', value: -1 }]);
                }
            },
            error: function(data) {
                hideSpinner();
                response([{ label: 'Error occured.', value: -1 }]);
            }
        });
    },
    minLength: 0,
    open: function() {},
    close: function() {
        // $(this).val('');
        return false;
    },
    focus: function(event,ui) {},
    select: function(event, ui) {
        let configId = document.getElementById("maprConfig").value;
        document.location.href = `search/?query=${ configId }:${ ui.item.value }`;
        return false;
    }
}).data("ui-autocomplete")._renderItem = function( ul, item ) {
    return $( "<li>" )
        .append( "<a>" + item.label + "</a>" )
        .appendTo( ul );
}

// ------------ Render -------------------------

function renderCategories() {
  document.getElementById('studies').innerHTML = "";

  let categories = Object.keys(CATEGORY_QUERIES);
   // Sort by index
  categories.sort(function(a, b) {
    let idxA = CATEGORY_QUERIES[a].index;
    let idxB = CATEGORY_QUERIES[b].index;
    return (idxA > idxB ? 1 : idxA < idxB ? -1 : 0);
  });
  
  categories.forEach(category => {
    let cat = CATEGORY_QUERIES[category];
    let query = cat.query;

    // Find matching studies
    let matches = model.filterStudiesByMapQuery(query);
    if (matches.length == 0) return;

    var div = document.createElement( "div" );
    div.innerHTML = `<h1 title="${query}">${cat.label} (${ matches.length })</h1>
      <div style="width100%; overflow:auto; background: white">
        <div id="${cat.label}" style="width: 5000px"></div>
      </div>
    `;
    div.className = "row";
    document.getElementById('studies').appendChild(div);

    // By default, we link to the study itself in IDR...
    let linkFunc = (studyData) => {
      let type = studyData['@type'].split('#')[1].toLowerCase();
      return `${ BASE_URL }/webclient/?show=${ type }-${ studyData['@id'] }`;
    }
    let htmlFunc = studyHtml;
    matches.forEach(study => renderStudy(study, cat.label, linkFunc, htmlFunc));
  });

  // Now we iterate all Studies in DOM, loading image ID for link and thumbnail
  model.loadStudyThumbnails();
}


loadMaprConfig((settings) => {
  mapr_settings = settings;
});

renderStudyKeys();


// ----------- Load / Filter Studies --------------------

// Do the loading and renderCategories() when done...
model.loadStudies(() => {
  // Immediately filter by Super category
  if (SUPER_CATEGORY && SUPER_CATEGORY.query) {
    model.studies = model.filterStudiesByMapQuery(SUPER_CATEGORY.query);
  }
  renderCategories();
});

