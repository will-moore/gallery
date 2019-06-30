import React, { useContext } from "react";
import Category from "./Category";
import SearchForm from "./SearchForm";
import { filterStudiesByMapQuery } from "./model/filterStudies";
import SettingsContext from "./model/context";

function Categories({ studies, superCategory }) {
  const gallerySettings = useContext(SettingsContext);

  let categories = [];
  // If not configured, won't see any list of categories.
  if (gallerySettings.CATEGORY_QUERIES) {
    for (let category in gallerySettings.CATEGORY_QUERIES) {
      categories.push({
        ...gallerySettings.CATEGORY_QUERIES[category],
        id: category
      });
    }
    categories.sort((a, b) => {
      return a.index > b.index ? 1 : -1;
    });
  }

  let title = gallerySettings.GALLERY_TITLE || "OMERO.Gallery";

  // If we got a 'superCategory' from URL, check it is valid...
  if (superCategory !== undefined && gallerySettings.SUPER_CATEGORIES) {
    const superCategories = gallerySettings.SUPER_CATEGORIES;
    if (superCategories[superCategory]) {
      title = superCategories[superCategory].title;
      let query = superCategories[superCategory].query;
      studies = filterStudiesByMapQuery(studies, query);
    } else {
      // superCategory not found ~ 404
      return <h2>Category '{superCategory}' not found</h2>;
    }
  }

  return (
    <React.Fragment>
    <div className="row columns text-center">
      <h1>{ title }</h1>
      <p>
        The Image Data Resource (IDR) is a public repository of image datasets
        from published scientific studies,
        <br />
        where the community can submit, search and access high-quality
        bio-image data.
      </p>
    </div>
    <SearchForm studies={studies} />
    <div id="studies" className="row horizontal">
      {categories.map(category => (
        <Category key={category.label} data={category} studies={studies} />
      ))}
    </div>
    </React.Fragment>
  );
}

export default Categories;
