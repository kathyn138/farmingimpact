import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import html2canvas from 'html2canvas';
import CalendarDay from '../CalendarDay';
import './CalendarContainer.css';
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

function CalendarContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [calendar, setCalendar] = useState([]);
  const cartStoreData = useSelector((store) => store.cart);

  useEffect(
    function generateCalendarWhenMounted() {
      async function generateCalendar() {
        if (cartStoreData.length) {
          let calendarResponse = await axios.post(
            `${BASE_URL}/calendar`,
            cartStoreData
          );
          setCalendar(calendarResponse.data);
          setIsLoading(false);
        }
      }
      generateCalendar();
    },
    [cartStoreData]
  );

  let days = Object.keys(calendar).map((d) => {
    if (calendar[d].length) {
      if (d !== 'any') {
        return <CalendarDay key={d} day={d} items={calendar[d]} />;
      } else {
        return (
          <div className="row any-row">
            <CalendarDay key={d} day={d} items={calendar[d]} />
          </div>
        );
      }
    }
    return null;
  });

  let calendarBody = (
    <React.Fragment>
      <div className="row calendar-days">{days}</div>
      <div className="row">
        <div className="col">
          <button
            type="button"
            className="btn btn-create-screenshot"
            onClick={createScreenshot}
          >
            Generate Screenshot
          </button>
        </div>
      </div>
    </React.Fragment>
  );

  let loadingMessage = (
    <div className="row align-items-center">
      <div className="col">
        <img
          src="https://cdn.discordapp.com/attachments/709286174879121519/1085312524930535504/E2-VnlpXwAozntb.png?ex=65e78d8e&is=65d5188e&hm=5160422808099e5b935ab3327a67801713d660e525ebba51fe609d64a37b9cfd&"
          alt=""
        ></img>
      </div>
      <div className="col">
        <p>No items in calendar yet!</p>
        <p>Select some characters or weapons to get started.</p>
      </div>
    </div>
  );

  let display = isLoading ? loadingMessage : calendarBody;

  function createScreenshot() {
    html2canvas(document.querySelector('.calendar-days'), {
      useCORS: true,
    }).then((canvas) => {
      canvas.toBlob(function (blob) {
        window.saveAs(blob, 'calendar.png');
      });
    });
  }

  return (
    <div className="col-8 text-center calendar-container">
      <div className="row">
        <h3 className="calendar-container-title">
          <b>Calendar</b>
        </h3>
      </div>
      <div className="row calendar-container-body">{display}</div>
    </div>
  );
}

export default CalendarContainer;
