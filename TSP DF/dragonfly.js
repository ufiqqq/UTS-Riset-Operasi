let map;
let markers = [];
let routeLayer;
let chart;
let cities = [
    {name: "Surabaya", lat: -7.2575, lng: 112.7521},
    {name: "Malang", lat: -7.9839, lng: 112.6214},
    {name: "Blitar", lat: -8.0954, lng: 112.1611},
    {name: "Kediri", lat: -7.8483, lng: 112.0160},
    {name: "Madiun", lat: -7.6296, lng: 111.5233},
    {name: "Bojonegoro", lat: -7.1500, lng: 111.8810},
    {name: "Jember", lat: -8.1845, lng: 113.6681},
    {name: "Banyuwangi", lat: -8.2192, lng: 114.3691},
    {name: "Mojokerto", lat: -7.4724, lng: 112.4381},
    {name: "Pasuruan", lat: -7.6451, lng: 112.9076}
];

const numDragonflies = 50;
const maxIterations = 100;
let dragonflies = [];
let globalBest;
let iterationData = [];

class Dragonfly {
    constructor() {
        this.position = shuffle([...Array(cities.length).keys()]);
        this.bestPosition = [...this.position];
        this.bestDistance = this.calculateDistance();
    }

    calculateDistance() {
        let distance = 0;
        for (let i = 0; i < this.position.length - 1; i++) {
            distance += getDistance(cities[this.position[i]], cities[this.position[i + 1]]);
        }
        distance += getDistance(cities[this.position[this.position.length - 1]], cities[this.position[0]]);
        return distance;
    }

    updatePersonalBest() {
        const currentDistance = this.calculateDistance();
        if (currentDistance < this.bestDistance) {
            this.bestDistance = currentDistance;
            this.bestPosition = [...this.position];
        }
    }

    updatePosition(globalBestPosition) {
        const attractionStrength = 0.8; // How strongly they move towards the best-known position
        const explorationFactor = 0.2; // Exploration factor to avoid stagnation
        
        // Move towards the global best and introduce randomness for exploration
        for (let i = 0; i < this.position.length; i++) {
            const rand = Math.random();

            if (rand < attractionStrength) {
                // Move closer to the global best
                [this.position[i], this.position[(i + 1) % this.position.length]] = 
                    [this.position[(i + 1) % this.position.length], this.position[i]];
            } else if (rand < (attractionStrength + explorationFactor)) {
                // Explore randomly
                [this.position[i], this.position[(i + 2) % this.position.length]] = 
                    [this.position[(i + 2) % this.position.length], this.position[i]];
            }
        }
    }
}

function initMap() {
    map = L.map('map').setView([-7.5, 112.5], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
    }).addTo(map);

    cities.forEach(city => {
        const marker = L.marker([city.lat, city.lng]).addTo(map)
            .bindPopup(city.name);
        markers.push(marker);
    });
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getDistance(city1, city2) {
    const R = 6371;
    const dLat = (city2.lat - city1.lat) * Math.PI / 180;
    const dLng = (city2.lng - city1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(city1.lat * Math.PI / 180) * Math.cos(city2.lat * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function solveTSP() {
    initializeDragonflies();
    globalBest = { position: null, distance: Infinity };
    iterationData = [];

    initChart();

    runIterations(0);
}

function initializeDragonflies() {
    dragonflies = [];
    for (let i = 0; i < numDragonflies; i++) {
        dragonflies.push(new Dragonfly());
    }
}

function runIterations(iteration) {
    if (iteration >= maxIterations) {
        return;
    }

    for (let dragonfly of dragonflies) {
        dragonfly.updatePosition(globalBest.position || dragonfly.bestPosition);
        dragonfly.updatePersonalBest();

        if (dragonfly.bestDistance < globalBest.distance) {
            globalBest.position = [...dragonfly.bestPosition];
            globalBest.distance = dragonfly.bestDistance;
        }
    }

    iterationData.push(globalBest.distance);
    updateChart(iteration);

    drawRoute(globalBest.position);

    document.getElementById('result').innerHTML = `Best Distance at iteration ${iteration + 1}: ${globalBest.distance.toFixed(2)} km`;

    setTimeout(() => runIterations(iteration + 1), 500);
}

function drawRoute(route) {
    if (routeLayer) {
        map.removeLayer(routeLayer);
    }

    const latlngs = route.map(index => [cities[index].lat, cities[index].lng]);
    latlngs.push(latlngs[0]);

    routeLayer = L.polyline(latlngs, { color: 'blue' }).addTo(map);
    map.fitBounds(routeLayer.getBounds());
}

function initChart() {
    const ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Best Distance per Iteration',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Iteration'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Distance (km)'
                    }
                }
            }
        }
    });
}

function updateChart(iteration) {
    chart.data.labels.push(iteration + 1);
    chart.data.datasets[0].data.push(iterationData[iteration]);
    chart.update();
}

initMap();
