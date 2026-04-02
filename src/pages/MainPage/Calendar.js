import React from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "../../styles/Calendar.css";

const CustomCalendar = () => {
    return (
        <div className="calendar-container">
            <Calendar/>
        </div>
    );
};

export default CustomCalendar;