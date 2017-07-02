import axios from 'axios'
import bows from 'bows'
import ColorHash from 'color-hash'
import * as topojson from 'topojson-client'
const log = bows('index')
const colorHash = new ColorHash()

window.L.mapbox.accessToken = 'pk.eyJ1IjoidGhldHVyaW5nbWFjaGluZSIsImEiOiIxMjljNzFlOWNiMjZkZWIyNjYxMjViN2Q5NzRhYWRjYSJ9.-LqvR7mvElcVL3rSkB11mQ'

const map = window.L.mapbox.map('map', 'mapbox.streets')
    .setView([-30, 137], 5)

axios.get('data/perms.json').then((response) => {
  const layerGroups = {}
  response.data
    .map(route => route.distance)
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a,b) => Number.parseInt(a) - Number.parseInt(b))
    .forEach(distance => layerGroups[distance] = window.L.layerGroup().addTo(map))

  response.data.forEach((route) => {
    const layerGroup = layerGroups[route.distance]

    route.topoJson.forEach(topo => {
      axios.get(topo).then((topoJsonResponse) => {
        const topoJson = topoJsonResponse.data
        const geoJson = topojson.feature(topoJson, topoJson.objects[Object.keys(topoJson.objects)[0]])
        const layer = window.L.geoJson(
          geoJson,
          {style: {color: colorHash.hex(route.name)}}
        ).bindPopup(`<a href="${route.links[0]}">${route.name}</a><br/>${route.description}`)
        layerGroup.addLayer(layer)
      })
    })
  })

  window.L.control.layers(null, layerGroups, {collapsed: false}).addTo(map)
}).catch((error) => {
  log(error)
})
