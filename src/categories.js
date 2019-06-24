import React from 'react';
import Category from './Category';

function Categories({studies}) {

  const categories = [
    {"label": "Most Recent", "index": 0, "query": "LAST10:date"},
    {"label": "Time-lapse imaging", "index": 1, "query": "Study Type:time OR Study Type:5D OR Study Type:3D-tracking"},
    {"label": "Light sheet fluorescence microscopy", "index": 2, "query": "Study Type:light sheet"},
    {"label": "Protein localization studies", "index": 3, "query": "Study Type:protein localization"},
    {"label": "Digital pathology imaging", "index": 4, "query":"Study Type:histology"},
    {"label": "Yeast studies", "index": 5, "query": "Organism: Saccharomyces cerevisiae OR Organism:Schizosaccharomyces pombe"},
    {"label": "High-content screening (human)", "index": 6, "query": "Organism:Homo sapiens AND Study Type:high content screen"}
  ];

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
