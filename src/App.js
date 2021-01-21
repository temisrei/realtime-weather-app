import React, { useState, useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { ThemeProvider } from '@emotion/react';
import { getMoment } from "./utils/helpers";
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
const LOCATION_NAME = '高雄';
const LOCATION_NAME_FORECAST = '高雄市';

function App() {
  const [currentTheme, setCurrentTheme] = useState('light');

  const moment = useMemo(() => getMoment(LOCATION_NAME_FORECAST), []);

  const [weatherElement, fetchData] = useWeatherAPI({
    authorizationKey: AUTHORIZATION_KEY,
    locationName: LOCATION_NAME,
    locationNameForecast: LOCATION_NAME_FORECAST,
  });

  useEffect(() => {
    setCurrentTheme((moment === 'day') ? 'light' : 'dark');
  }, [moment]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <WeatherCard
          weatherElement={weatherElement}
          moment={moment}
          fetchData={fetchData}
        />
        <WeatherSetting />
      </Container>
    </ThemeProvider>
  );
}

export default App;
