import React, { useContext } from "react";
import { AbsoluteLink as Link } from "../router/wrappers";
import { ReactComponent as Logo } from "../omero-logo.svg";
import SettingsContext from "../model/context";

export default function TopBarLeft() {
  const gallerySettings = useContext(SettingsContext);

  console.log('gallerySettingsLeft', gallerySettings);

  let topLinks = [];
  if (gallerySettings.SUPER_CATEGORIES) {
    for (let category in gallerySettings.SUPER_CATEGORIES) {
      topLinks.push({
        ...gallerySettings.SUPER_CATEGORIES[category],
        id: category
      });
    }
  }
  let logo = <Logo />;
  if (gallerySettings.TOP_LEFT_LOGO && gallerySettings.TOP_LEFT_LOGO.src) {
    logo = <img alt="logo" src={gallerySettings.TOP_LEFT_LOGO.src} />;
  }

  return (
    <div className="top-bar-left">
      <ul
        className="dropdown menu"
        data-dropdown-menu="219f5j-dropdown-menu"
        role="menubar"
      >
        <li role="menuitem">
          <Link to="/" className="logo">
            {logo}
          </Link>
        </li>
        {topLinks.map(category => (
          <li key={category.id} role="menuitem">
            <Link to={`/${category.id}/`}>{category.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
