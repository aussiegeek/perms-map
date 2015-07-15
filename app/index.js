import axios from 'axios';
import bows from 'bows';
const log = bows('index');
import ColorHash from 'color-hash';
const colorHash = new ColorHash();
import topojson from 'topojson';

window.L.mapbox.accessToken = 'pk.eyJ1IjoidGhldHVyaW5nbWFjaGluZSIsImEiOiIxMjljNzFlOWNiMjZkZWIyNjYxMjViN2Q5NzRhYWRjYSJ9.-LqvR7mvElcVL3rSkB11mQ';

const map = window.L.mapbox.map('map', 'mapbox.streets')
    .setView([-30, 137], 5);

axios.get('data/perms.json').then((response) => {
  const layerGroups = {};
  response.data.forEach((route)=>{
    let distance = route.distance;
    if (route.distance === '') {
      distance = 'Unknown';
    }

    if(layerGroups[distance] === undefined) {
      layerGroups[distance] = window.L.layerGroup().addTo(map);
    }

    const layerGroup = layerGroups[distance];

    axios.get(route.topoJson).then((topoJsonResponse) => {
      const topoJson = topoJsonResponse.data;
      const geoJson = topojson.feature(topoJson, topoJson.objects.stdin);
      const layer = window.L.geoJson(
        geoJson,
        {style: {color: colorHash.hex(route.name)}}
      ).bindPopup(`<a target='_blank' href='${route.link}>${route.name}</a><br/>${route.description}`);
      layerGroup.addLayer(layer);
    }).catch((error) => {
      log(error);
    });
  });

  window.L.control.layers(null, layerGroups, {collapsed: false}).addTo(map);
}).catch((error) => {
  log(error);
});
