import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

class WeatherService {
  async geopositionSearch(lat, long) {
    const response = await axios.get(`${API_BASE_URL}locations/v1/cities/geoposition/search?apikey=${API_KEY}&q=${lat},${long}&language=en-us&details=true`);
    return response.data.Key;
  }

  async currentCondition(locationKey) {
    const response = await axios.get(`${API_BASE_URL}currentconditions/v1/${locationKey}?apikey=${API_KEY}&details=true`);

    const currentData = {
      iconId: response.data[0].WeatherIcon,
      temperature: response.data[0].RealFeelTemperature.Metric.Value,
      imgAlt: response.data[0].WeatherText
    }

    return currentData;
  }
}

export default new WeatherService();