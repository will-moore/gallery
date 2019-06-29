import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "typeface-nunito";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// This will get set correctly in views.py
window.GALLERY_INDEX = "http://localhost:4080/gallery/";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
