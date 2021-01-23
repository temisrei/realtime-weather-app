import React, { useState, useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { ThemeProvider } from '@emotion/react';
import { getMoment, findLocation } from "./utils/helpers";
import WeatherCard from './views/WeatherCard';
import WeatherSetting from "./views/WeatherSetting";
import useWeatherAPI from "./hooks/useWeatherAPI";

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow: '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const AUTHORIZATION_KEY = 'CWB-D117CBB0-8922-40AA-98AB-55E055F1BBE0';

function App() {
  const [currentPage, setCurrentPage] = useState('WeatherCard');
  const [currentTheme, setCurrentTheme] = useState('light');
  const [currentCity, setCurrentCity] = useState('高雄市');

  const handleCurrentPageChage = (currentPage) => {
    setCurrentPage(currentPage);
  };

  const currentLocation = useMemo(() => findLocation(currentCity), [currentCity]);
  // { cityName: '高雄市', locationName: '高雄', sunriseCityName: '高雄市' }
  const { cityName, locationName, sunriseCityName } = currentLocation;

  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);

  const [weatherElement, fetchData] = useWeatherAPI({
    authorizationKey: AUTHORIZATION_KEY,
    locationName,
    locationNameForecast: cityName,
  });

  useEffect(() => {
    setCurrentTheme((moment === 'day') ? 'light' : 'dark');
  }, [moment]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === 'WeatherCard' && (<WeatherCard
          weatherElement={weatherElement}
          moment={moment}
          fetchData={fetchData}
          cityName={cityName}
          handleCurrentPageChage={handleCurrentPageChage}
        />)}
        {currentPage === 'WeatherSetting' && (<WeatherSetting 
          handleCurrentPageChage={handleCurrentPageChage}
        />)}
      </Container>
    </ThemeProvider>
  );
}

export default App;
