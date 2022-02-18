"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

///////////////////////////////////////

const renderErr = (msg) => {
  countriesContainer.insertAdjacentText("beforeend", msg);
};

const renderCountry = (response, className = "") => {
  const html = `
  <article class="country ${className}">
  <img class="country-img" src="${response.flags.png}" />
  <div class="country-data">
  <h3 class="country-name">${response.name.official}</h3>
  <h4 class="country-region">${response.region}</h4>
  <p class="country-row"><span>👫</span>${
    (+response.population / 1000000).toFixed(1) + "m"
  }</p>
  <p class="country-row"><span>🗣️</span>${Object.keys(
    response.languages
  )[0].toUpperCase()}</p>
  <p class="country-row"><span>💰</span>${
    Object.keys(response.currencies)[0]
  }</p>
  </div>
  </article>
`;

  countriesContainer.insertAdjacentHTML("beforeend", html);
};

// const getCountryAndNeighbor = (country) => {
//   const request = new XMLHttpRequest();
//   request.open("GET", `https://restcountries.com/v3.1/name/${country}`);
//   request.send();

//   request.addEventListener("load", () => {
//     let [response] = JSON.parse(request.responseText);
//     console.log(response);

//     renderCountry(response);

//     //Get neighbor country & render

//     const [neighbor] = response.borders;
//     if (!neighbor) return;

//     const request2 = new XMLHttpRequest();
//     request2.open("GET", `https://restcountries.com/v3.1/alpha/${neighbor}`);
//     request2.send();

//     request2.addEventListener("load", () => {
//       let [response2] = JSON.parse(request2.responseText);
//       console.log(response2);

//       renderCountry(response2, "neighbor");
//     });
//   });
// };

// getCountryAndNeighbor("ireland");

const getCountry = (country) => {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then((response) => response.json())
    .then((data) => {
      renderCountry(data[0]);

      //neighboring country
      const neighbor = data[0].borders[0];
      if (!neighbor) return;
      return fetch(`https://restcountries.com/v3.1/alpha/${neighbor}`);
    })
    .then((response) => response.json())
    .then((data) => renderCountry(data[0], "neighbor"))
    .catch((err) => {
      console.log(err);
      renderErr(`Something went wrong... ${err.message}...Try again`);
    })
    .finally(() => {
      //load animations here
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener("click", () => {
  getCountry("ireland");
});
