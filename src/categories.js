import React from 'react';
import Category from './Category';
import { filterStudiesByMapQuery } from './model/filterStudies';

function Categories({studies, superCategory}) {

  const superCategories = {
    'cell': {'query': 'Sample Type:cell',
            'label': 'Cell - IDR',
            'title': 'Welcome to Cell-IDR'},
    'tissue': {'query': 'Sample Type:tissue',
            'label': 'Tissue - IDR',
            'title': 'Welcome to Tissue-IDR'},
  }

  const categories = [
    {"label": "Most Recent", "index": 0, "query": "LAST10:date"},
    {"label": "Time-lapse imaging", "index": 1, "query": "Study Type:time OR Study Type:5D OR Study Type:3D-tracking"},
    {"label": "Light sheet fluorescence microscopy", "index": 2, "query": "Study Type:light sheet"},
    {"label": "Protein localization studies", "index": 3, "query": "Study Type:protein localization"},
    {"label": "Digital pathology imaging", "index": 4, "query":"Study Type:histology"},
    {"label": "Yeast studies", "index": 5, "query": "Organism: Saccharomyces cerevisiae OR Organism:Schizosaccharomyces pombe"},
    {"label": "High-content screening (human)", "index": 6, "query": "Organism:Homo sapiens AND Study Type:high content screen"}
  ];

  // If we got a 'superCategory' from URL, check it is valid...
  if (superCategory !== undefined) {
    if (superCategories[superCategory]) {
      let query = superCategories[superCategory].query;
      studies = filterStudiesByMapQuery(studies, query);
    } else {
      // superCategory not supported ~ 404
      return <h2>Category '{superCategory}' not found</h2>
    }
  }

  return (
    <div id="studies" className="row horizontal">
    {categories.map(category => (
        <Category
        key={category.label}
        data={category}
        studies={studies} />
    ))}
    </div>
  );
}

export default Categories;
