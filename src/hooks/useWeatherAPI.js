import { useState, useEffect, useCallback } from "react";

const fetchCurrentWeather = ({
  authorizationKey,
  locationName
}) => {
  // [打中央氣象局 API]
  // 把 fetch 拿到的 Promise 回傳出去
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`)
    .then((response) => response.json())
    .then((data) => {
      // 取得資料
      const locationData = data.records.location[0];

      // 過濾資料
      const weatherElements = locationData.weatherElement.reduce((neededElements, item) => {
        if (['WDSD', 'TEMP'].includes(item.elementName)) {
          neededElements[item.elementName] = item.elementValue;
        }
        return neededElements;
      }, {}); // {} is initialValue

      // [更新 React 資料狀態]
      // 改為將取得資料回傳出去，而不是直接 setSomething
      return {
        locationName: locationData.locationName,
        windSpeed: weatherElements.WDSD,
        temperature: weatherElements.TEMP,
        observationTime: locationData.time.obsTime,
      };
    });
};

const fetchWeatherForecast = ({
  authorizationKey,
  locationNameForecast
}) => {
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${locationNameForecast}`)
    .then((response) => response.json())
    .then((data) => {
      // 取得資料
      const locationData = data.records.location[0];
      // 過濾資料
      const weatherElements = locationData.weatherElement.reduce((neededElements, item) => {
        if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
          neededElements[item.elementName] = item.time[0].parameter;
        }
        return neededElements;
      }, {}); // {} is initialValue

      // [更新 React 資料狀態]
      // 改為將取得資料回傳出去，而不是直接 setSomething
      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName,
      };
    });
};

const useWeatherAPI = ({
  authorizationKey, locationName, locationNameForecast
}) => {
  const [weatherElement, setWeatherElement] = useState({
    locationName: '',
    description: '',
    windSpeed: 0,
    temperature: 0,
    rainPossibility: 0,
    observationTime: new Date(),
    weatherCode: 0,
    comfortability: '',
    isLoading: true,
  });

  const fetchData = useCallback(async () => {
    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    const [currentWeather, weatherForecast] = await Promise.all([
      fetchCurrentWeather({ authorizationKey, locationName }),
      fetchWeatherForecast({ authorizationKey, locationNameForecast })
    ]);

    // 把取得的資料，解構賦值後放入 setSomething
    setWeatherElement((prevState) => ({
      ...prevState,
      ...currentWeather,
      ...weatherForecast,
      isLoading: false,
    }));
  }, [authorizationKey, locationName, locationNameForecast]);

  useEffect(() => { fetchData() }, [fetchData]);

  return [weatherElement, fetchData];
};

export default useWeatherAPI;