const mappa = new Mappa("Leaflet");

let covidData;
let myMap;
let countries;
let dataProcess = [];

const options = {
  lat: 0,
  lng: 0,
  zoom: 1.5,
  style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
};

function processData() {
  for (let row of countries.rows) {
    let countryName = row.get("name");
    let lat = row.get("latitude");
    let long = row.get("longitude");
    let countryStats = covidData.countries_stat.find((x) => x.country_name === countryName);

    if (countryStats) {
      let numberCases = Number(countryStats.cases.replace(/,/g, ""));
      let diameter = sqrt(numberCases);
      dataProcess.push({ countryName, lat, long, numberCases });
    }
  }
  let minCases = dataProcess.reduce((prev, curr) => (prev.numberCases < curr.numberCases ? prev : curr));
  let maxCases = dataProcess.reduce((prev, curr) => (prev.numberCases > curr.numberCases ? prev : curr));

  let minDiameter = sqrt(minCases.numberCases);
  let maxDiameter = sqrt(maxCases.numberCases);
  dataProcess.forEach((country) => {
    country.diameter = map(sqrt(country.numberCases), minDiameter, maxDiameter, 1, 30);
  });
}

function preload() {
  countries = loadTable("countries.csv", "csv", "header");
  httpDo(
    "https://rapidapi.p.rapidapi.com/api",
    {
      headers: {
        "x-rapidapi-host": "corona-virus-world-and-india-data.p.rapidapi.com",
        "x-rapidapi-key": "9Zn0q7vRfkmshAkYYPYUbwWPNRBep19vtwSjsn8daKMRir7wq4",
      },
    },
    function (res) {
      covidData = JSON.parse(res);
      processData();
    },
    function (err) {
      console.log(err);
    }
  );
}

function setup() {
  canvas = createCanvas(800, 800);

  myMap = mappa.tileMap(options);
  // Overlay the canvas over the tile map
  myMap.overlay(canvas);
}

function draw() {
  clear();
  if (dataProcess.length !== 0) {
    dataProcess.forEach((country) => {
      const pixel = myMap.latLngToPixel(country.lat, country.long);
      fill(255, 0, 200, 100);
      const scale = pow(2, myMap.zoom());
      ellipse(pixel.x, pixel.y, country.diameter * scale);
    });
  }
}
