import React, { Component } from 'react';
import { geolocated } from 'react-geolocated';
import InputRange from 'react-input-range';

import './WeatherInfo.scss';
import 'react-input-range/lib/css/index.css';

class WeatherInfo extends Component {
    render() {
        return !this.props.isGeolocationAvailable ? (
          <div>Your browser does not support Geolocation</div>
        ) : !this.props.isGeolocationEnabled ? (
            <div>Geolocation is not enabled</div>
        ) : this.props.coords ? (
            <React.Fragment>
              <div className={'weather-info_container'}>
                <img className={'weather_icon'} src="" alt={'weather icon'} />
              </div>
              <div className={'slider_container'}>
                <InputRange
                  maxValue={this.inputMaxRange}
                  minValue={this.inputMinRange}
                  // value={inputValue}
                  onChange={this.onInputChange}
                />
              </div>
            </React.Fragment>
        ) : (
          <div>Getting the location data&hellip; </div>
        );
    }
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(WeatherInfo);