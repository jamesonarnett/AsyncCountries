"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

///////////////////////////////////////

const getCountry = (country) => {
  const request = new XMLHttpRequest();
  request.open("GET", `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  request.addEventListener("load", () => {
    let [response] = JSON.parse(request.responseText);
    console.log(response);

    const html = `
    <article class="country">
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
    countriesContainer.style.opacity = 1;
  });
};

getCountry("usa");
getCountry("canada");
getCountry("ireland");
getCountry("india");
getCountry("mexico");
