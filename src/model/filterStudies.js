
export function filterStudiesByMapQuery(studies, query) {
  if (query.startsWith("FIRST") || query.startsWith("LAST")) {
    // E.g. query is 'FIRST10:date' sort by 'date' and return first 10
    let limit = parseInt(query.replace('FIRST', '').replace('LAST', ''));
    let attr = query.split(':')[1];
    let desc = query.startsWith("FIRST") ? -1 : 1;
    // first filter studies, remove those that don't have 'attr'
    let sorted = studies
      .filter(study => study[attr] !== undefined)
      .sort((a, b) => {
        return a[attr] < b[attr] ? desc : a[attr] > b[attr] ? -desc : 0;
      });
    return sorted.slice(0, limit);
  }

  let matches = studies.filter(study => {
    // If no key-values loaded, filter out
    if (!study.mapValues) {
      return false;
    }
    let match = false;
    // first split query by AND and OR
    let ors = query.split(' OR ');
    ors.forEach(term => {
      let allAnds = true;
      let ands = term.split(' AND ');
      ands.forEach(mustMatch => {
        let queryKeyValue = mustMatch.split(":");
        let valueMatch = false;
        // check all key-values (may be duplicate keys) for value that matches
        for (let i=0; i<study.mapValues.length; i++){
          let kv = study.mapValues[i];
          if (kv[0] === queryKeyValue[0]) {
            let value = queryKeyValue[1].trim();
            if (value.substr(0, 4) === 'NOT ') {
              value = value.replace('NOT ', '');
              if (kv[1].toLowerCase().indexOf(value.toLowerCase()) === -1) {
                valueMatch = true;
              }
            } else if (kv[1].toLowerCase().indexOf(value.toLowerCase()) > -1) {
              valueMatch = true;
            }
          }
        }
        // if not found, then our AND term fails
        if (!valueMatch) {
          allAnds = false;
        }
      });
      if (allAnds) {
        match = true;
      }
    });
    return match;
  });
  return matches;
}

export function getStudyValues(study, key) {
  if (!study.mapValues) {
    return [];
  }
  let matches = [];
  for (let i=0; i<study.mapValues.length; i++){
    let kv = study.mapValues[i];
    if (kv[0] === key) {
      matches.push(kv[1]);
    }
  }
  return matches;
}

export function getStudiesNames(studies, filterQuery) {
  let names = studies.map(s => s.Name);
  if (filterQuery) {
    names = names.filter(name => name.toLowerCase().indexOf(filterQuery) > -1);
  }
  names.sort((a, b) => a.toLowerCase() > b.toLowerCase() ? 1: -1);
  return names;
}

export function getKeyValueAutoComplete(studies, key, inputText) {
  inputText = inputText.toLowerCase();
  // Get values for key from each study
  let values = []
  studies.forEach(study => {
    let v = getStudyValues(study, key);
    for (let i=0; i<v.length; i++) {
      values.push(v[i]);
    }
  });
  // We want values that match inputText
  // Except for "Publication Authors", where we want words
  // Create dict of {lowercaseValue: origCaseValue}
  let matchCounts = values.reduce((prev, value) => {
    let matches = [];
    if (key === "Publication Authors") {
      // Split surnames, ignoring AN initials.
      let names = value.split(/,| and | & /)
        .map(n => {
          // Want the surname from e.g. 'Jan Ellenberg' or 'Held M' or 'Øyvind Ødegård-Fougner'
          let words = n.split(" ").filter(w => w.match(/[a-z]/g));
          if (words && words.length === 1) return words[0];  // Surname only
          return (words && words.length > 1) ? words.slice(1).join(" ") : '';
      }).filter(w => w.length > 0);
      matches = names.filter(name => name.toLowerCase().indexOf(inputText) > -1);
    } else if (value.toLowerCase().indexOf(inputText) > -1) {
      matches.push(value);
    }
    matches.forEach(match => {
      if (!prev[match.toLowerCase()]) {
        // key is lowercase, value is original case
        prev[match.toLowerCase()] = {value: match, count: 0};
      }
      // also keep count of matches
      prev[match.toLowerCase()].count++;
    });

    return prev;
  }, {});

  // Make into list and sort by:
  // match at start of phrase > match at start of word > other match
  let matchList = [];
  for (key in matchCounts) {
    let matchScore = 1;
    if (key.indexOf(inputText) === 0) {
      // best match if our text STARTS WITH inputText
      matchScore = 3;
    } else if (key.indexOf(" " + inputText) > -1) {
      // next best if a WORD starts with inputText
      matchScore = 2;
    }
    // Make a list of sort score, orig text (NOT lowercase keys) and count
    matchList.push([matchScore,
                    matchCounts[key].value,
                    matchCounts[key].count]);
  }

  // Sort by the matchScore (hightest first)
  matchList.sort(function(a, b) {
    if (a[0] < b[0]) return 1;
    if (a[0] > b[0]) return -1;
    // equal score. Sort by value (lowest first)
    if (a[1].toLowerCase() > b[1].toLowerCase()) return 1;
    return -1;
  });

  // Return the matches
  return matchList
    .map(m => {
      // Auto-complete uses {label: 'X (n)', value: 'X'}
      return {label: `${ m[1] } (${ m[2] })`, value: m[1]}
    })
    .filter(m => m.value.length > 0);
}

export function filterStudiesByMaprResponse(studies, data) {
  // filter studies by 'screens' and 'projects'
  let imageCounts = {};
  data.screens.forEach(s => {imageCounts[`screen-${ s.id }`] = s.extra.counter});
  data.projects.forEach(s => {imageCounts[`project-${ s.id }`] = s.extra.counter});

  let filterFunc = study => {
    return imageCounts.hasOwnProperty(study.objId);
  }

  let filteredStudies = studies
    .filter(filterFunc)
    .map(study => {
      return {...study, imageCount: imageCounts[study.objId]}
    });
  return filteredStudies;
}
