// Variables globales para almacenar datos y controlar la paginación
let allCountries = [];
let filteredCountries = [];
let displayedCount = 12;

// Función para mostrar las tarjetas de países
function displayCountries(countries) {
  const mainContent = document.getElementById('mainContent');
  mainContent.innerHTML = '';
  const countriesToDisplay = countries.slice(0, displayedCount);
  
  countriesToDisplay.forEach(country => {
    const card = document.createElement('country-card');
    card.data = country;
    mainContent.appendChild(card);
  });

  // Mostrar o ocultar el botón "Mostrar más"
  const loadMoreBtn = document.getElementById('loadMore');
  loadMoreBtn.style.display = countries.length > displayedCount ? 'block' : 'none';
}

// Función para filtrar países según la búsqueda
function filterCountries() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  if (searchTerm) {
    filteredCountries = allCountries.filter(country =>
      country.name.common.toLowerCase().includes(searchTerm)
    );
  } else {
    filteredCountries = [...allCountries].sort(() => 0.5 - Math.random());
  }
  displayedCount = 12;
  displayCountries(filteredCountries);
}

// Web Component para cada tarjeta de país (vista resumen)
class CountryCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set data(country) {
    this.country = country;
    this.render();
  }

  render() {
    const flagSrc = this.country.flags.png || this.country.flags.svg || '';
    const countryName = this.country.name.common || 'Desconocido';
    const capital = this.country.capital ? this.country.capital[0] : 'N/A';
    const population = this.country.population ? this.country.population.toLocaleString() : 'N/A';
    const languages = this.country.languages ? Object.values(this.country.languages).join(', ') : 'N/A';

    this.shadowRoot.innerHTML = `
      <style>
        .card {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
          text-align: center;
          display: flex;
          flex-direction: column;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        img {
          width: 100%;
          height: auto;
          aspect-ratio: 4 / 3;
          object-fit: cover;
        }
        .card-content {
          padding: 1rem;
        }
        .card-content h3 {
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }
        .card-content p {
          margin: 0.25rem 0;
          font-size: 0.9rem;
        }
      </style>
      <div class="card">
        <img src="${flagSrc}" alt="Bandera de ${countryName}">
        <div class="card-content">
          <h3>${countryName}</h3>
          <p>Capital: ${capital}</p>
          <p>Población: ${population}</p>
          <p>Idioma: ${languages}</p>
        </div>
      </div>
    `;

    // Al hacer clic, se abre el modal detallado
    this.shadowRoot.querySelector('.card').addEventListener('click', () => {
      openDetailModal(this.country);
    });
  }
}

customElements.define('country-card', CountryCard);

// Función para abrir el modal de detalles y llenar la información
function openDetailModal(country) {
  document.getElementById('detailCountryName').textContent = country.name.common;
  document.getElementById('officialName').textContent = country.name.official;
  document.getElementById('capital').textContent = country.capital ? country.capital[0] : 'N/A';
  document.getElementById('region').textContent = country.region || 'N/A';
  document.getElementById('subregion').textContent = country.subregion || 'N/A';
  document.getElementById('population').textContent = country.population ? country.population.toLocaleString() : 'N/A';
  document.getElementById('area').textContent = country.area ? country.area + ' km²' : 'N/A';
  document.getElementById('latlng').textContent = country.latlng ? country.latlng.join(', ') : 'N/A';
  document.getElementById('borders').textContent = country.borders ? country.borders.join(', ') : 'N/A';
  document.getElementById('timezones').textContent = country.timezones ? country.timezones.join(', ') : 'N/A';
  document.getElementById('languages').textContent = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
  document.getElementById('currencies').textContent = country.currencies 
    ? Object.values(country.currencies).map(c => c.name + ' (' + c.symbol + ')').join(', ')
    : 'N/A';
  document.getElementById('codes').textContent = `CCA2: ${country.cca2}, CCA3: ${country.cca3}`;
  document.getElementById('flagImage').src = country.flags.png || country.flags.svg || '';

  document.getElementById('detailModal').style.display = 'flex';
}

// Eventos para cerrar el modal de detalles
document.querySelector('.detail-modal .close').addEventListener('click', () => {
  document.getElementById('detailModal').style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target.id === 'detailModal') {
    document.getElementById('detailModal').style.display = 'none';
  }
});

// Cargar datos de la API
fetch('https://restcountries.com/v3.1/all')
  .then(response => response.json())
  .then(data => {
    allCountries = data;
    filteredCountries = [...allCountries].sort(() => 0.5 - Math.random());
    displayCountries(filteredCountries);
  })
  .catch(error => console.error('Error al obtener los países:', error));

// Eventos para el buscador y botón "Mostrar más"
document.getElementById('searchInput').addEventListener('input', filterCountries);
document.getElementById('loadMore').addEventListener('click', () => {
  displayedCount += 12;
  displayCountries(filteredCountries);
});
