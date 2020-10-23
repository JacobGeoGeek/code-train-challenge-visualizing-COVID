const mappa = new Mappa("Leaflet");

let covidData;
let myMap;

const options = {
  lat: 0,
  lng: 0,
  zoom: 1.5,
  style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
};

function getCovidData() {
  fetch("https://rapidapi.p.rapidapi.com/api", {
    method: "GET",
    headers: {
      "x-rapidapi-host": "corona-virus-world-and-india-data.p.rapidapi.com",
      "x-rapidapi-key": "9Zn0q7vRfkmshAkYYPYUbwWPNRBep19vtwSjsn8daKMRir7wq4",
    },
  })
    .then((response) => response.json())
    .then((response) => {
      covidData = response;
    })
    .catch((err) => {
      console.error(err);
    });
}

function preload() {
  getCovidData();
}

function setup() {
  canvas = createCanvas(800, 800);

  myMap = mappa.tileMap(options);
  // Overlay the canvas over the tile map
  myMap.overlay(canvas);
}

function draw() {
  clear();
  const nigeria = myMap.latLngToPixel(11.396396, 5.076543);
  // Using that position, draw an ellipse
  ellipse(nigeria.x, nigeria.y, 20, 20);
}
