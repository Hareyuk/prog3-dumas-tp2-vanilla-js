let markersAll = []; //array con todos los markers
let lastFilterSelected = "";
let map = "";
let clickedNearest = false;
let markerMostNear;

window.initMap = () => {

  // The location of Uluru
  //const maimo = { lat: -34.78504, lng: -58.62823 };
  const example = { lat: -34.624921, lng: -58.424549 };

  // The map, centered at Uluru
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: example,
    styles: styles,
    streetViewControl: false,

    fullscreenControl: false,

    mapTypeControlOptions: {
      mapTypeIds: [],
    },

    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_CENTER,
    },
  });

  fetchMarkers(map);
}
// The marker, positioned at Uluru
//const marker = new google.maps.Marker({position: maimo, map: map});


const buttonShowNearest = document.querySelector(".showNearest");
buttonShowNearest.addEventListener('click', (e) => {
  e.preventDefault();
  getLocation();
})
//FILTROS, tomado de Lean
//Traigo elementos del DOM
const handleFilterGaming = document.querySelector(".juegos");
const handleFilterArticles = document.querySelector(".articulos");
const handleFilterCards = document.querySelector(".cartas");

//Eventos de click de los filtros
handleFilterGaming.addEventListener("click", (e) => {
  e.preventDefault();
  addMarkerFiltered("Juegos");
  changeClassButtons("Juegos");
});
handleFilterArticles.addEventListener("click", (e) => {
  e.preventDefault();
  addMarkerFiltered("Articulos");
  changeClassButtons("Articulos");
});
handleFilterCards.addEventListener("click", (e) => {
  e.preventDefault();
  addMarkerFiltered("Cartas");
  changeClassButtons("Cartas");
});

//Agrego los markers filtrados según filtro (markerType)
const addMarkerFiltered = (markerType) => {
  markersAll.forEach((marker) => {
    marker.setMap(null); //Quita todos los markers del mapa
  });
  const markerFiltered = markersAll.filter(
    (markerItem) => markerItem.customInfo.type === markerType
  );
  markerFiltered.forEach((marker) => {
    marker.setMap(map);
  });
};

const changeClassButtons = (type) => {
  if (lastFilterSelected == type || type == "empty") {
    //Añado todos los markers de nuevo
    markersAll.forEach((markerItem) => markerItem.setMap(map));
    handleFilterGaming.classList.remove("not_selected");
    handleFilterArticles.classList.remove("not_selected");
    handleFilterCards.classList.remove("not_selected");
    lastFilterSelected = "";
  }
  else {
    lastFilterSelected = type;
    //cambio opacidad de los botones no elegidos
    switch (type) {
      case "Juegos":
        handleFilterGaming.classList.remove("not_selected");
        handleFilterArticles.classList.add("not_selected");
        handleFilterCards.classList.add("not_selected");
        break;

      case "Articulos":
        handleFilterGaming.classList.add("not_selected");
        handleFilterArticles.classList.remove("not_selected");
        handleFilterCards.classList.add("not_selected");
        break;
      case "Cartas":
        handleFilterGaming.classList.add("not_selected");
        handleFilterArticles.classList.add("not_selected");
        handleFilterCards.classList.remove("not_selected");
        break;
      default:
        handleFilterGaming.classList.add("not_selected");
        handleFilterArticles.classList.add("not_selected");
        handleFilterCards.classList.add("not_selected");
        break;
    }
  }
};

const fetchMarkers = async (map) => {
  try {
    const response = await fetch("https://prog3-dumas-tp2-backend.now.sh/tiendajuegos");

    const json = await response.json();

    json.forEach((marker) => {
      addMarker(map, marker);
    });
  } catch (error) {
    console.log(error);
  }
};

const addMarker = (map, marker) => {
  console.log(marker);
  const { lat, lng, website, name, type, description } = marker;

  const contentString = `<div><h2>${name}</h2><h3>${type}</h3><p>${description}</p><address><a target="_blank" href='${website}'>${
    website != "#" ? website : "Sin sitio web"
    }</a></address></div>`;
  var infowindow = new google.maps.InfoWindow({
    content: contentString,
  });
  const icons = {
    Juegos: "assets/img/gaming.png",
    Articulos: "assets/img/articles.png",
    Cartas: "assets/img/cards.png",
  };

  const markerItem = new google.maps.Marker({
    position: { lat: parseFloat(lat), lng: parseFloat(lng) },
    icon: icons[type],
    map: map,
    title: name,
    customInfo: { type: type, name: name },
  });
  markerItem.setMap(map);
  markerItem.addListener("click", function () {
    infowindow.open(map, markerItem);
  });
  //Agrego mi nuevo marker (objeto marker, no json marker, a mi array para filtros)
  markersAll.push(markerItem);
};

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showNearestLocation);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

const showNearestLocation = (position) => {
  //if(!clickedNearest){
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    let minDistance = 99999;
    markersAll.forEach((markerItem) => {
      const { lat, lng } = markerItem.position;
      const distanceLat = (userLat - lat()) ** 2;
      const distanceLng = (userLng - lng()) ** 2;
      let distanceFinal = (distanceLat + distanceLng)
      //distanceFinal = Math.pow(distanceFinal, 1/2);
      distanceFinal = Math.sqrt(distanceFinal);
      if (distanceFinal < minDistance) {
        minDistance = distanceFinal;
        markerMostNear = markerItem;
      }
    });
    console.log("El mas cerca es ", markerMostNear.customInfo.name);
    clickedNearest= true;
    let markerNearestDiv = document.querySelector(`div[title='${markerMostNear.title}']`);
    let markerNearestImg = document.querySelector(`div[title='${markerMostNear.title}'] img`);
    //changeIconNearest(markerNearestImg, markerNearestDiv);
  //}
  //I call them for only showing all markers again
  changeClassButtons("empty");
  map.setCenter(markerMostNear.getPosition());
  map.setZoom(20);
}
/*

const changeIconNearest = (elementImg, parentDiv) => {
  const src = elementImg.getAttribute("src");
  const halfString = src.replace(".png", "");
  elementImg.src = halfString + "_big.png";
  parentDiv.classList.add("nearest");
}
*/