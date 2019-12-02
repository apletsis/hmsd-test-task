import React, { Component } from 'react';
import withGeolocation from '../../hoc/withGeolocation';
import InputRange from 'react-input-range';

import WeatherService from '../../services/WeatherService';

import './WeatherInfo.scss';
import 'react-input-range/lib/css/index.css';

class WeatherInfo extends Component {

  temperatureHue = {
    min: 180,   // #00ffff
    mid: 58,    // #fff700
    max: 33,    // #ff8c00
  };

  inputMaxRange = 30;
  inputMidRange = 10;
  inputMinRange = -10;

  state = {
    positionKey: 0,
    iconID: 0,
    inputValue: 1,
    imgAlt: ''
  }

  getWeatherDetails = async (positionKey) => {
    try {
      const weatherDetails = await WeatherService.currentCondition(positionKey);

      this.setState({
        iconID: weatherDetails.iconId,
        inputValue: weatherDetails.temperature,
        imgAlt: weatherDetails.imgAlt
      });

    } catch (error) {
      console.error(error);
    }
  }

  getPositionKey = async (geoCurrentPosition) => {
    const { coords: { latitude, longitude }} = geoCurrentPosition;

    try {
      const positionKey = await WeatherService.geopositionSearch(latitude, longitude);

      //localStorage.setItem('accuweather_position_key', positionKey)
      this.setState({
        positionKey //positionKey: positionKey
      });

      this.getWeatherDetails(this.state.positionKey);

    } catch (error) {
      console.error(error);
    }
  }

  calculateHue = (temperature) => {
    const minHue = this.temperatureHue.min;
    const midHue = this.temperatureHue.mid;
    const maxHue = this.temperatureHue.max;

    if(temperature <= this.inputMinRange) {
      return minHue;
    } else if(temperature >= this.inputMaxRange) {
      return maxHue;
    } else if(temperature > this.inputMinRange && temperature <= this.inputMiddleRange) {
      const tempKoef = (temperature - this.inputMinRange)/(this.inputMiddleRange - this.inputMinRange);
      return minHue + (midHue - minHue) * tempKoef;
    } else if(temperature > this.inputMiddleRange && temperature <= this.inputMaxRange) {
      const tempKoef = (temperature - this.inputMiddleRange)/(this.inputMaxRange - this.inputMiddleRange);
      return midHue + (maxHue - midHue) * tempKoef;
    }
  }

  calculateBackgroundColor = (temperature) => {
    const saturationLightness = '100%, 50%';
    const huePrecision = 2;
    return `hsl(${this.calculateHue(temperature).toFixed(huePrecision)}, ${saturationLightness})`;
  }

  onInputChange = (inputValue) => {
    this.setState({
      inputValue,
    })
  }

  componentDidUpdate(prevProps) {
    const { geoCurrentPosition } = this.props;
    const { geoCurrentPosition: prevGeoPosition } = prevProps;

    if(geoCurrentPosition && geoCurrentPosition !== prevGeoPosition) {
      this.getPositionKey(geoCurrentPosition);
    }
  }

  render() {

    const { inputValue, imgAlt } = this.state;
    const backgroundStyle = {backgroundColor: this.calculateBackgroundColor(inputValue)};
    const iconPath = `https://developer.accuweather.com/sites/default/files/${this.state.iconID < 10 && this.state.iconID >= 1 ? `0${this.state.iconID}` : this.state.iconID}-s.png`;

      return (
        <React.Fragment>
          <div className={'weather-info_container'} style={backgroundStyle}>
            <img className={'weather_icon'} src={iconPath} alt={imgAlt} />
          </div>
          <div className={'slider_container'}>
            <InputRange
              maxValue={this.inputMaxRange}
              minValue={this.inputMinRange}
              value={inputValue}
              onChange={this.onInputChange}
          />
          </div>
        </React.Fragment>
      );
  }
}

export default withGeolocation(WeatherInfo);