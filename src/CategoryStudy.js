import React from 'react';
import { BASE_URL } from './model/fetchData';

function CategoryStudy({study}) {

  let studyStyle = {}
  if (study.thumbnail) {
    studyStyle['backgroundImage'] = `url("${ study.thumbnail }")`;
  }

  return (
    <div key={study.objId} className="row study">
      <div>{study.id}</div>
      <div className="studyImage" style={studyStyle}>
        <a target="_blank" rel="noopener noreferrer" href={`${ BASE_URL }webclient/?show=${ study.objId }`}>
          <div>
            <div className="studyText">
              <p title="We provide a user-friendly 3D editing tool to rapidly correct segmentation errors.  We test our method alongside other previously-published user-friendly methods, with focus on mid-gestation embryos, 3D cultures of pluripotent stem cells and pluripotent stem cell-derived neural rosettes.">
                {study.title}
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}

export default CategoryStudy;
