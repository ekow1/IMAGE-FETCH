let displayedItems = 12; // The number of items to initially display
let searchQuery = ''; 
let currentData = []; 

const apiKey = 'VHzIk49rehGHfGvWxGghXHGpyGY3g89gC7gdcd41ar44e4bdC8FfMGAk';

const buttonMore = document.querySelector('.more');
const buttonLess = document.querySelector('.less');
const search = document.querySelector('#effect5');

function animateCards(cards, interval) {
  let index = 0;
  const timer = setInterval(() => {
    if (index < cards.length) {
      cards[index].style.opacity = 1;
      index++;
    } else {
      clearInterval(timer);
    }
  }, interval);
}

function updateCard(limit) {
  let apiUri;
  if (searchQuery) {
    apiUri = `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=${limit}`;
  } else {
    apiUri = `https://api.pexels.com/v1/curated?per_page=${limit}`;
  }

  const xhr = new XMLHttpRequest();
  xhr.open('GET', apiUri, true);
  xhr.setRequestHeader('Authorization', apiKey);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      const data = response.photos;

      // If displayedItems is less than the current data length, it means we are viewing more items
      if (displayedItems < currentData.length) {
        const newItems = data.slice(currentData.length, displayedItems);
        currentData = currentData.concat(newItems);
      } else {
        currentData = data;
      }

      let cardsHtml = '';
      for (let i = 0; i < Math.min(limit, currentData.length); i++) {
        cardsHtml += displayData(currentData[i]);
      }

      const cardsContainer = document.querySelector('.cards');
      cardsContainer.innerHTML = cardsHtml;

      // Get all cards and set opacity to 0 for animation
      const cards = cardsContainer.querySelectorAll('.card');
      cards.forEach((card) => (card.style.opacity = 0));

      // Animate the cards after a delay of 100ms for each card
      animateCards(cards, 100);
    } else {
      document.querySelector('.cards').innerHTML = '<h3>Error fetching data</h3>';
    }
  };

  xhr.onerror = function () {
    document.querySelector('.cards').innerHTML = '<h3>Error fetching data</h3>';
  };

  xhr.send();
}

function displayData(item) {
  return `
    <figure class="card">
      <img
        src="${item.src.medium}"
        alt="${item.photographer}"
        class="card__image "
      />
      <figcaption class="card__body">
        <h2 class="card__title">${item.photographer}</h2>
        <p class="card__description">
          ${item.photographer_url}
        </p>
      </figcaption>
    </figure>
  `;
}

function viewMore() {
  displayedItems += 4;
  updateCard(displayedItems);
}

function viewLess() {
  if (displayedItems >= 20) {
    displayedItems -= 12;
  } else if (displayedItems > 12 && displayedItems <= 16) {
    displayedItems -= 8;
  } else {
    displayedItems -= 4;
  }

  updateCard(displayedItems);
}

function handleSearch(event) {
  event.preventDefault(); // Prevent form submission and page reload
  const searchInput = document.getElementById('effect5');
  searchQuery = searchInput.value.trim();
  displayedItems = 12;
  updateCard(displayedItems);
}

buttonMore.addEventListener('click', viewMore);
buttonLess.addEventListener('click', viewLess);
search.addEventListener('input', handleSearch);

// Initially load the data with the initial limit and an empty search query
updateCard(displayedItems);
