
import React from 'react';
import { AbsoluteLink as Link } from "./router/wrappers";

export default ({superCategory, superCategories}) => {

  // Hide image links if we have a superCategory
  let scStyle = {'display': superCategory ? 'none': 'block'};

  superCategories = superCategories || {};

  let links = [];
  
  for (let category in superCategories) {
    links.push({
      ...superCategories[category],
      id: category
    });
  }

  return (
    <div className="row horizontal super_categories"
      style={scStyle}>
      <div className="small-0 medium-1 large-2 columns">&nbsp;</div>
      {
        links.map(category => (
          <Link
            to={`/${category.id}/`}
            key={category.id}
            className="scLink">
            <div className="small-12 medium-5 large-4 columns">
              <img
                alt={`Example from ${ category.label }`}
                className="thumbnail" src={category.image} />
              <div className="img_overlay">
                <span className="overlay_text">{category.label}</span>
              </div>
            </div>
          </Link>
        ))
      }
  
      <div className="small-2 medium-2 large-2 columns"></div>  
    </div>
  )
}
