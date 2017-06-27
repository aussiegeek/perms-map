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
  response.data.forEach((route) => {
    let distance = route.distance
    if (route.distance === '') {
      distance = 'Unknown'
    }

    if (layerGroups[distance] === undefined) {
      layerGroups[distance] = window.L.layerGroup().addTo(map)
    }

    const layerGroup = layerGroups[distance]

    route.topoJson.forEach(topo => {
      axios.get(topo).then((topoJsonResponse) => {
        const topoJson = topoJsonResponse.data
        const geoJson = topojson.feature(topoJson, topoJson.objects[Object.keys(topoJson.objects)[0]])
        console.log(route)
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
