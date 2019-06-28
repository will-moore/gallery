import React, { useContext } from 'react';
import Category from './Category';
import { filterStudiesByMapQuery } from './model/filterStudies';
import SettingsContext from './model/context';

function Categories({studies, superCategory}) {

  const gallerySettings = useContext(SettingsContext)

  let categories = [];
  // If not configured, won't see any list of categories.
  if (gallerySettings.CATEGORY_QUERIES) {
    for (let category in gallerySettings.CATEGORY_QUERIES) {
      categories.push({...gallerySettings.CATEGORY_QUERIES[category], id:category})
    }
  }

  // If we got a 'superCategory' from URL, check it is valid...
  if (superCategory !== undefined) {
    const superCategories = gallerySettings.SUPER_CATEGORIES;
    if (superCategories[superCategory]) {
      let query = superCategories[superCategory].query;
      studies = filterStudiesByMapQuery(studies, query);
    } else {
      // superCategory not found ~ 404
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
