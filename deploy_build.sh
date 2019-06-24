#!/bin/bash

#copy over html,css,js and templates
echo "Deploying built resources..."
mkdir -p omero_gallery/templates/gallery/
mkdir -p omero_gallery/static/gallery/

cp build/index.html omero_gallery/templates/gallery/
cp -r build/static/* omero_gallery/static/gallery
