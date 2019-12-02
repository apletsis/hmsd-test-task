import React, { Component } from 'react';

const withGeolocation = (WrappedComponent) => {
  return class extends Component {
    getLocationTimeout = 5000;
    geoLocationOptions = {
      timeout: this.getLocationTimeout,
    }

    state = {
      geoCurrentPosition: {},
    }

    componentDidMount() {
      if(this.checkIsGeolocationSupported()) {
        navigator.geolocation.getCurrentPosition(this.geoLocationSuccess, this.geoLocationError, this.geoLocationOptions);
      }
    }

    geoLocationSuccess = (position) => {
      this.setState({
        geoCurrentPosition: position,
      });
    }

    geoLocationError = () => {
      console.error('Sorry, your browser doesn\'t support Geolocaiton API');
    }

    checkIsGeolocationSupported = () => {
      return !!navigator.geolocation;
    }

    render() {
      const { geoCurrentPosition } = this.state;

      return (
        <WrappedComponent
          isGeolocationSupported={this.checkIsGeolocationSupported()}
          geoCurrentPosition={geoCurrentPosition}
        />
      )
    }
  }
}

export default withGeolocation;
