
import React, { useContext, useState } from "react";
import SettingsContext from "../model/context";

export default function TopBarRight() {

    // get links from settings
    const gallerySettings = useContext(SettingsContext);
    let links = gallerySettings.TOP_RIGHT_LINKS || [];

    // Mouse-over menu to set-active (show dropdown)
    const [activeIndex, setActiveIndex] = useState(-1);

    // We use timeout to improve usability (same as foundation menu behaviour)
    let timer;
    function handleMouseover(index) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            setActiveIndex(index);
        }, 300);
    }
    function handleMouseout() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            setActiveIndex(-1);
        }, 300);
    }

    return (
        <div className="top-bar-right">
            <ul className="dropdown menu" role="menubar">
                {links.map((link, idx) => (
                    <li onMouseOver={() => handleMouseover(idx)}
                        onMouseOut={handleMouseout}
                        key={link.text}
                        className="has-submenu is-dropdown-submenu-parent opens-left" role="menuitem" aria-haspopup="true" aria-label="About" data-is-click="false">
                        <a href="/about/index.html" tabIndex="0">{link.text}</a>
                        <ul className={`${ activeIndex === idx ? 'js-dropdown-active' : ''} submenu menu vertical is-dropdown-submenu first-sub`}
                            role="menu">
                            {link.submenu.map(menuItem => (
                                <li key={menuItem.text}>
                                    <a href={menuItem.href}>{menuItem.text}</a>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    )
}
