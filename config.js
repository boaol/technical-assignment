const sydney = [-33.8651, 151.2093];

const mapConfig = {
  containerId: "map",
  center: sydney,
  zoom: 13,
};

const tileConfig = {
  urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  options: {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
};

const searchConfig = {
  url: "https://nominatim.openstreetmap.org/search?format=json&q={s}",
  jsonpParam: "json_callback",
  propertyName: "display_name",
  propertyLoc: ["lat", "lon"],
  marker: false,
  autoCollapse: true,
  autoType: false,
  minLength: 2,
  zoom: 14,
};

const drawConfig = {
  edit: { moveMarkers: true },
  draw: {
    polyline: false,
    circlemarker: false,
    marker: false,
    rectangle: false,
    circle: false,
  },
};
