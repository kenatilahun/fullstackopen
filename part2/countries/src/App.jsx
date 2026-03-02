import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const CountriesList = ({ countries, onShow }) => (
  <div>
    {countries.map((country) => (
      <p key={country.cca3}>
        {country.name.common} <button onClick={() => onShow(country.name.common)}>show</button>
      </p>
    ))}
  </div>
)

const CountryDetails = ({ country, weather }) => {
  const languages = country.languages ? Object.values(country.languages) : []

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital {country.capital?.[0] ?? 'N/A'}</div>
      <div>area {country.area}</div>
      <h3>languages</h3>
      <ul>
        {languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags?.png} alt={`Flag of ${country.name.common}`} width="160" />

      <h3>Weather in {country.capital?.[0] ?? 'N/A'}</h3>
      {weather ? (
        <div>
          <div>temperature {weather.main.temp} Celsius</div>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <div>wind {weather.wind.speed} m/s</div>
        </div>
      ) : (
        <div>Weather data unavailable (set VITE_OPENWEATHER_KEY in .env)</div>
      )}
    </div>
  )
}

const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountryName, setSelectedCountryName] = useState(null)
  const [weather, setWeather] = useState(null)

  const weatherApiKey = import.meta.env.VITE_OPENWEATHER_KEY

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => {
        setAllCountries(response.data)
      })
  }, [])

  const matchedCountries = useMemo(() => {
    const query = filter.trim().toLowerCase()
    if (!query) {
      return []
    }

    return allCountries.filter((country) =>
      country.name.common.toLowerCase().includes(query),
    )
  }, [allCountries, filter])

  const countryToShow = useMemo(() => {
    if (selectedCountryName) {
      return allCountries.find((country) => country.name.common === selectedCountryName) || null
    }

    if (matchedCountries.length === 1) {
      return matchedCountries[0]
    }

    return null
  }, [allCountries, matchedCountries, selectedCountryName])

  useEffect(() => {
    if (!countryToShow || !countryToShow.capital?.[0] || !weatherApiKey) {
      setWeather(null)
      return
    }

    const capital = countryToShow.capital[0]
    axios
      .get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: capital,
          appid: weatherApiKey,
          units: 'metric',
        },
      })
      .then((response) => {
        setWeather(response.data)
      })
      .catch(() => {
        setWeather(null)
      })
  }, [countryToShow, weatherApiKey])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setSelectedCountryName(null)
  }

  return (
    <div>
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>

      {!filter.trim() ? null : matchedCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : countryToShow ? (
        <CountryDetails country={countryToShow} weather={weather} />
      ) : (
        <CountriesList countries={matchedCountries} onShow={setSelectedCountryName} />
      )}
    </div>
  )
}

export default App
