import React from "react";
import styled from "@emotion/styled";
import { ReactComponent as DayCloudyIcon } from "./../images/day-cloudy.svg";

const IconContainer = styled.div`
  flex-basis: 30%;
  svg {
    max-height: 110px;
  }
`;

const WeatherIcon = () => {
  return (
    <IconContainer>
      <DayCloudyIcon />
    </IconContainer>
  );
};

export default WeatherIcon;
