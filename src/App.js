import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { ReactComponent as DayCloudyIcon } from "./images/day-cloudy.svg";
import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as RefreshIcon } from "./images/refresh.svg";
import { ReactComponent as LoadingIcon } from "./images/loading.svg";
import { ThemeProvider } from '@emotion/react';
import dayjs from "dayjs";

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  display: flex;  
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  display: inline-flex;
  align-items: flex-end;
  font-size: 12px;
  color: ${({ theme }) => theme.textColor};
  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
`;

const DayCloudy = styled(DayCloudyIcon)`
  flex-basis: 30%;
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

function App() {
  console.log('Invoke function component');
  const [currentTheme, setCurrentTheme] = useState('light');
  
  // 先定義會使用到的資料狀態
  const [currentWeather, setCurrentWeather] = useState({
    locationName: '高雄市',
    description: '晴時多雲',
    windSpeed: 1.6,
    temperature: 18.5,
    rainPossibility: 48.3,
    observationTime: '2021-01-18 11:09:00',
    isLoading: true,
  });

  useEffect(() => {
    console.log('execute function in useEffect');
    fetchCurrentWeather();
  }, []);

  const fetchCurrentWeather = () => {
    setCurrentWeather((prevState) => ({
        ...prevState,
        isLoading: true,
      }));

    // 打中央氣象局 API
    fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`)
      .then((response) => response.json())
      .then((data) => {
        // 取得資料
        const locationData = data.records.location[0];
        // console.log('locationData', locationData);

        // 過濾資料
        const weatherElements = locationData.weatherElement.reduce((neededElements, item) => {
          if (['WDSD', 'TEMP'].includes(item.elementName)) {
            neededElements[item.elementName] = item.elementValue;
          }
          return neededElements;
        }, {}); // {} is initialValue
        // console.log('weatherElements', weatherElements);

        // 更新 React 資料狀態
        setCurrentWeather({
          locationName: locationData.locationName,
          description: '晴時多雲',
          windSpeed: weatherElements.WDSD,
          temperature: weatherElements.TEMP,
          rainPossibility: 48.3,
          observationTime: locationData.time.obsTime,
          isLoading: false,
        })
      });
  };

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {console.log('render')}
        <WeatherCard>
          <Location>{currentWeather.locationName}</Location>
          <Description>{currentWeather.description}</Description>
          <CurrentWeather>
            <Temperature>
              {Math.round(currentWeather.temperature)} <Celsius>°C</Celsius>
            </Temperature>
            <DayCloudy />
          </CurrentWeather>
          <AirFlow>
            <AirFlowIcon /> {currentWeather.windSpeed} m/h
          </AirFlow>
          <Rain>
            <RainIcon /> {currentWeather.rainPossibility}%
          </Rain>
          <Refresh onClick={fetchCurrentWeather}>
            最後觀測時間：
            {new Intl.DateTimeFormat('zh-TW', {
              hour: 'numeric',
              minute: 'numeric',
            }).format(dayjs(currentWeather.observationTime))}
            {' '}
            {currentWeather.isLoading ? <LoadingIcon /> : <RefreshIcon />}
          </Refresh>
        </WeatherCard>
      </Container>
    </ThemeProvider>
  );
}

export default App;
