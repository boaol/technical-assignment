# technical-assignment

## library

use leaflet for mapping component, implemented following features

- create new polygons
- edit existing polygons
- drag a polygon to another location on the map
- search and zoom to a location via a search bar
- delete polygons
- disable/enable the ability to edit polygons

## plugins

- leaflet.draw
- leaflet.draw.drag
- leaflet-search

## files

### index.html

- load react, react dom scripts,
- load leaflet and leaflet plugins
- load app component and config
- add div#root container for react component

### config.js

initial configs for the map, passed in as props

### app.js

a react component, used to initialize and setup map
