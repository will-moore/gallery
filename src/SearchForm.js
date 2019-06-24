import React, { useState } from 'react';
import Autocomplete from 'react-autocomplete';
import { absoluteNavigate as navigate } from "./router/wrappers";
import { loadMaprAutocomplete } from './model/fetchData';

import { getKeyValueAutoComplete, getStudiesNames } from './model/filterStudies';

let debounceTimeout;

function SearchForm({studies}) {

  let menuStyle = {
    position: 'absolute',
    boxSizing: 'border-box',
    width: '100%',
    background: 'white',
    border: '1px solid #cccccc',
    zIndex: 100,
    paddingLeft: 6,
  }

  const [searchKey, setSearchKey] = useState('Name');
  const [searchValue, setSearchValue] = useState('');
  const [maprAutocompleteItems, setMaprAutocompleteItems] = useState([]);
  const [loading, setLoading] = useState(false);

  let handleKeyChange = (event) => {
    setSearchKey(event.target.value);
    // clear previous search value
    setSearchValue('');
    setMaprAutocompleteItems([]);
  }

  let handleAutocompleteChange = (event, value) => {
    setSearchValue(value);
    // If MAPR, need to update autocomplete options here if value.length > 1...
    value = value.trim();
    if (searchKey.startsWith('mapr_')) {
      if (value.length < 2) {
        setMaprAutocompleteItems([]);
        return;
      }
      // debounce
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      debounceTimeout = setTimeout(() => {
        let maprKey = searchKey.replace('mapr_', '');
        // show spinner
        setLoading(true);
        loadMaprAutocomplete(maprKey, value)
          .then(items => {
            setLoading(false);
            setMaprAutocompleteItems(items);
          });
      }, 500);
    }
  }

  let handleSelect = (value) => {
    setSearchValue(value);
    navigate(`/search/?query=${ searchKey }:${ value }`);
  }

  let handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/search/?query=${ searchKey }:${ searchValue }`);
  }

  let autocompleteItems;
  // If MAPR query, need to use loaded data...
  if (searchKey.startsWith('mapr_')) {
    autocompleteItems = maprAutocompleteItems;
  } else if (searchKey === 'Name') {
    autocompleteItems = getStudiesNames(studies, searchValue)
      .map(n => ({label:n, value:n}))
  } else {
    autocompleteItems = getKeyValueAutoComplete(studies, searchKey, searchValue);
  }

  return (
    <div className="row horizontal">
      <form onSubmit={handleSubmit}>
        <div className="small-12 medium-12 large-2 columns">
          <h2 className="search-by">Search by:</h2>
        </div>
        <div className="small-12 medium-4 large-3 columns">
          <select value={searchKey} id="maprConfig" onChange={handleKeyChange}>
            <optgroup id="studyKeys" label="Study Attributes">
              <option value="Name">Name (IDR number)</option>
              <option value="Imaging Method">Imaging Method</option>
              <option value="License">License</option>
              <option value="Organism">Organism</option>
              <option value="Publication Authors">Publication Authors</option>
              <option value="Publication Title">Publication Title</option>
              <option value="Screen Technology Type">Screen Technology Type</option>
              <option value="Screen Type">Screen Type</option>
              <option value="Study Type">Study Type</option>
            </optgroup>
            <optgroup id="maprKeys" label="Image Attributes"><option value="mapr_antibody">Antibody</option>
              <option value="mapr_cellline">Cell Lines</option>
              <option value="mapr_gene">Gene</option>
              <option value="mapr_phenotype">Phenotype</option>
              <option value="mapr_sirna">siRNA</option>
            </optgroup>
          </select>
        </div>
        <div className="small-12 medium-8 large-7 columns" style={{position:'relative'}}>
        <Autocomplete
          value={searchValue}
          wrapperStyle={{ position: 'relative', display: 'inline-block', width: '100%'}}
          items={autocompleteItems}
          getItemValue={(item) => item.value}
          onChange={handleAutocompleteChange}
          onSelect={handleSelect}
          renderInput={(props) => (
            <input
              type="text" {...props}
              placeholder="Type to filter values..."
              style={{'margin':0}} />
          )}
          renderMenu={children => (
            <div style={menuStyle}>
              {children}
            </div>
          )}
          renderItem={(item, isHighlighted) => (
            <div
              className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
              key={item.value}
            >{item.label || item.value}</div>
          )}
          />

          {loading && <svg id="spinner" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sync" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-sync fa-w-16 fa-spin fa-lg"><path fill="currentColor" d="M440.65 12.57l4 82.77A247.16 247.16 0 0 0 255.83 8C134.73 8 33.91 94.92 12.29 209.82A12 12 0 0 0 24.09 224h49.05a12 12 0 0 0 11.67-9.26 175.91 175.91 0 0 1 317-56.94l-101.46-4.86a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12H500a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12h-47.37a12 12 0 0 0-11.98 12.57zM255.83 432a175.61 175.61 0 0 1-146-77.8l101.8 4.87a12 12 0 0 0 12.57-12v-47.4a12 12 0 0 0-12-12H12a12 12 0 0 0-12 12V500a12 12 0 0 0 12 12h47.35a12 12 0 0 0 12-12.6l-4.15-82.57A247.17 247.17 0 0 0 255.83 504c121.11 0 221.93-86.92 243.55-201.82a12 12 0 0 0-11.8-14.18h-49.05a12 12 0 0 0-11.67 9.26A175.86 175.86 0 0 1 255.83 432z"></path></svg>}
        </div>
      </form>
    </div>
  );
}

export default SearchForm
;