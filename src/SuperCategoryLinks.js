
import React from 'react';

export default ({superCategory, superCategories}) => {

  // Hide image links if we have a superCategory
  let scStyle = {'display': superCategory ? 'none': 'block'};

  return (
    <div className="row horizontal super_categories"
      style={scStyle}>
      <div className="small-0 medium-1 large-2 columns">&nbsp;</div>
      
      <a href="cell/" className="scLink">
        <div className="small-12 medium-5 large-4 columns">
          <img className="thumbnail" src="https://idr.openmicroscopy.org/webgateway/render_image/122770/0/0/" />
          <div className="img_overlay">
            <span className="overlay_text">Cell - IDR</span>
          </div>
        </div>
      </a>
  
      <a href="tissue/" className="scLink">
        <div className="small-12 medium-5 large-4 columns">
          <img className="thumbnail" src="https://idr.openmicroscopy.org/webgateway/render_image_region/5470164/0/0/?region=1024,1024,696,520" />
          <div className="img_overlay">
            <span className="overlay_text">Tissue - IDR</span>
          </div>
        </div>
      </a>
  
      <div className="small-2 medium-2 large-2 columns"></div>  
    </div>
  )
}
