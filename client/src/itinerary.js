import React from 'react';
import ReactDOM from 'react-dom';
import Itinerary from './Components/Itinerary';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <Itinerary />
  </BrowserRouter>,
  document.getElementById('root')
);

reportWebVitals();
