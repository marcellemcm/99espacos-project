let map;
let geocoder;
let addressSu = document.getElementById("address-sugestion");
let latForm = document.getElementById("lat");
let lngForm = document.getElementById("lng");
let lat;
let lng;
let addressForm = document.getElementById("address-inp");
let addressVal;
let divCards = document.getElementById("div-cards");
let latSearch = divCards.getElementsByClassName("mark-lat");
let longSearch = divCards.getElementsByClassName("mark-long");
let mapTitle = divCards.getElementsByClassName("map-title-name");

const initMap = () => {
  let markesArray = [];
  [...longSearch].forEach((ele, index) => {
    markesArray.push({
      lng: ele.attributes.value.nodeValue,
      lat: latSearch[index].attributes.value.nodeValue,
      title: mapTitle[index].attributes.value.nodeValue
    });
  });

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -23.5648726, lng: -46.658529 },
    zoom: 15
  });
  markesArray.forEach(el => {
    let marker = new google.maps.Marker({
      map: map,
      position: { lng: parseFloat(el.lng), lat: parseFloat(el.lat) },
      title: el.title
    });
  });
};

function codeAddress() {
  let address = document.getElementById("address-input").value;
  geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: address }, function(results, status) {
    if (status == "OK") {
      addressSu.innerHTML = `<button onclick="fillForm()"> ${results[0].formatted_address}</button>`;
      lat = results[0].geometry.location.lat();
      lng = results[0].geometry.location.lng();
      addressVal = results[0].formatted_address;
      // map.setCenter(results[0].geometry.location);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function fillForm() {
  latForm.value = lat;
  lngForm.value = lng;
  addressForm.value = addressVal;
}

initMap();
