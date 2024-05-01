import React, { useState } from "react";
import Calendar from "react-calendar"; 
import "react-calendar/dist/Calendar.css"; 

// Define a functional component named DailyCheckIn
const DailyCheckIn = () => {
  // Define state variable 'selectedDate' using useState hook
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Define a function to handle date change events
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Render the DailyCheckIn component
  return (
    <div>
      <h2>Daily Check-in</h2>
      <Calendar
        onChange={handleDateChange} 
        value={selectedDate} 
        tileClassName="study-day" 
      />
    </div>
  );
};

export default DailyCheckIn;
