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

// const getCountry = (country) => {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then((response => {
//       console.log(response)
//       if(!response.ok)
//       throw new Error(`Country not found ${response.status}`)
//     }))
//     .then((data) => {
//       renderCountry(data[0]);

//       //neighboring country
//       const neighbor = data[0].borders[0];
//       if (!neighbor) return;
//       return fetch(`https://restcountries.com/v3.1/alpha/${neighbor}`);
//     })
//     .then((response) => response.json())
//     .then((data) => renderCountry(data[0], "neighbor"))
//     .catch((err) => {
//       console.log(err);
//       renderErr(`Something went wrong... ${err.message}...Try again`);
//     })
//     .finally(() => {
//       //load animations here
//       countriesContainer.style.opacity = 1;
//     });
// };

const getJson = (url, errorMsg = "Something went wrong") => {
  return fetch(url).then((response) => {
    if (!response.ok)
      throw new Error(`${errorMsg}
    (${response.status})`);

    return response.json();
  });
};

const getCountry = (country) => {
  getJson(`https://restcountries.com/v3.1/name/${country}`, `Country not found`)
    .then((data) => {
      renderCountry(data[0]);

      const neighbor = data[0].borders[0];
      if (!neighbor) throw new Error("No Neighbor Found");

      return getJson(
        `https://restcountries.com/v3.1/alpha/${neighbor}`,
        `Country not found`
      );
    })
    .then((data) => renderCountry(data[0], "neighbor"))
    .catch((err) => {
      renderErr(`Something went wrong... ${err.message}...Try again`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

const whereAmI = () => {
  getPosition()
    .then((pos) => {
      const { latitude: lat, longitude: lon } = pos.coords;

      return fetch(`https://geocode.xyz/${lat},${lon}?geoit=json`);
    })
    .then((res) => {
      if (!res.ok)
        throw new Error("Too many requests. Please make 1 per 1 second");

      return res.json();
    })
    .then((data) => {
      console.log(data);

      getCountry(data.country);
    })
    .catch((err) => {
      renderErr(`Something went wrong ${err.message}...Try again`);
    });
};

// whereAmI(30.2266, -93.2174);
// whereAmI(19.037, 72.873);

const getPosition = () => {
  return new Promise((resolve, reject) => {
    // navigator.geolocation.getCurrentPosition(
    //   (position) => resolve(position),
    //   (err) => console.log(err)
    // );
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

btn.addEventListener("click", whereAmI);

// getPosition().then((pos) => console.log(pos));

//Playing with the Event loop

// console.log("Test Start");
// setTimeout(() => console.log("0 sec timer"), 0);
// Promise.resolve("Resolved Promise 1").then((res) => console.log(res));
// console.log("Test end");

// Promise.resolve("Resolved Promise 2").then((res) => {
//   for (let i = 0; i < 10000000000; i++) {}
//   console.log(res);
// });

// do you know the order they print?

// const lottery = new Promise((resolve, reject) => {
//   console.log("Time for the lottery!");
//   setTimeout(() => {
//     if (Math.random() >= 0.5) {
//       resolve("You win!");
//     } else {
//       reject(new Error("You lose!"));
//     }
//   }, 2000);
// });

// lottery.then((res) => console.log(res)).catch((err) => console.log(err));

// // Promisifying setTimeout
// const wait = (seconds) => {
//   return new Promise((resolve) => {
//     setTimeout(resolve, seconds * 1000);
//   });
// };

// wait(2)
//   .then(() => {
//     console.log("I waited 2 seconds");
//     return wait(1);
//   })
//   .then(() => {
//     console.log("I waited 3 seconds");
//   });
