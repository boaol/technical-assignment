const e = React.createElement;

/**
 * create a custom L.Control takes two callback function, `enable()` and `disable()`
 * use to switch between `Enable Edit` and `Disable Edit`
 *
 * @param {(map)=>void} enable enable edit function
 * @param {(map)=>void} disable disable edit function
 * @returns
 */
const setupEditCommand = (enable, disable) => {
  const enabledText = "Disable Edit";
  const disabledText = "Enable Edit";
  return L.Control.extend({
    options: {
      position: "topright",
    },
    onAdd: function (map) {
      const controlDiv = L.DomUtil.create(
        "div",
        "leaflet-draw-toolbar leaflet-bar leaflet-control-toggle-edit"
      );
      controlDiv.innerHTML = enabledText;
      L.DomEvent.addListener(controlDiv, "click", L.DomEvent.stopPropagation)
        .addListener(controlDiv, "click", L.DomEvent.preventDefault)
        .addListener(controlDiv, "click", function () {
          if (controlDiv.innerHTML === enabledText) {
            controlDiv.innerHTML = disabledText;
            disable(map);
          } else {
            controlDiv.innerHTML = enabledText;
            enable(map);
          }
        });

      return controlDiv;
    },
  });
};

// mapConfig, tileConfig, searchConfig, drawConfig, editControl
class App extends React.Component {
  constructor(props) {
    super(props);
    this.map = null;
  }

  /**
   *
   * @param {object} mapConfig
   * eg. { containerId: "map", center: [-33.8651, 151.2093], zoom: 13}
   */
  initMap(mapConfig) {
    this.map = L.map(mapConfig.containerId).setView(
      mapConfig.center,
      mapConfig.zoom
    );
  }

  /**
   * create tile layer with given config
   * and add to map
   *
   * @param {object} tileConfig tileConfig.urlTemplate: string, tileConfig.options?: L.TileLayerOptions
   */
  setupTileLayer(tileConfig) {
    this.map.addLayer(
      new L.tileLayer(tileConfig.urlTemplate, tileConfig.options)
    );
  }

  /**
   * create search control with given config
   * and add to map
   * @param {SearchConfig} searchConfig for `leaflet-search` plugin
   */
  setupSearchControl(searchConfig) {
    this.map.addControl(new L.Control.Search(searchConfig));
  }

  setupDrawnItemsLayer() {
    const self = this;
    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);
    this.map.on(L.Draw.Event.CREATED, function (e) {
      // TODO - 'layer' is deprecated.
      self.drawnItems.addLayer(e.layer);
    });
  }

  /**
   * drawControlFull - control panel with draw and edit edabled
   * drawControlDraw - control panel with draw enabled and edit disable
   *
   * 1.init two drawControl use to switch between enable/disable edit status
   * 2.add drawControlFull to the map by default
   * 3.use `EditControl` panel to switch edit status
   */
  setupDrawControl(drawConfig) {
    this.drawControlFull = new L.Control.Draw({
      edit: { ...drawConfig.edit, featureGroup: this.drawnItems },
      draw: drawConfig.draw,
    });
    this.drawControlDraw = new L.Control.Draw({
      edit: false,
      draw: drawConfig.draw,
    });
    this.map.addControl(this.drawControlFull);
  }

  /**
   * setupEditCommand and add to map
   *
   * enable edit:  1.remove `drawControlDraw` control from map,
   *               2.add `drawControlFull` control to map
   * disable edit: 1.remove `drawControlFull` control from map,
   *               2.add `drawControlDraw` control to map
   */
  setupEditControl() {
    L.Control.Command = setupEditCommand(
      (map) => {
        this.drawControlDraw.remove();
        this.drawControlFull.addTo(map);
      },
      (map) => {
        this.drawControlFull.remove();
        this.drawControlDraw.addTo(map);
      }
    );
    this.map.addControl(new L.Control.Command());
  }

  componentDidMount() {
    const { mapConfig, tileConfig, searchConfig, drawConfig, editControl } =
      this.props;

    // add init map
    this.initMap(mapConfig);

    // add tile layer
    this.setupTileLayer(tileConfig);

    // add search control if searchConfig exists
    searchConfig && this.setupSearchControl(searchConfig);

    // add featureGroup to store editable layers if drawConfig exists
    drawConfig && this.setupDrawnItemsLayer(drawConfig);

    // add draw control with edit function by default  if drawConfig exists
    drawConfig && this.setupDrawControl(drawConfig);

    // add control for enable/disable edit function  if drawControl exists and editControl enabled
    drawConfig && editControl && this.setupEditControl();
  }

  render() {
    return e("div", { id: "map" });
  }
}

ReactDOM.render(
  e(App, {
    mapConfig,
    tileConfig,
    searchConfig,
    drawConfig,
    editControl: true,
  }),
  document.querySelector("#root")
);
