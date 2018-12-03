import React from 'react';

const Habit = ({ habit, updateDay, deleteHabit}) => {
   // check to make sure that the staus of habit can be updated only on the day mentioned for the habit
   function isDisabled(date) {
      if (date !== new Date().toLocaleDateString()) {
         return true;
      }
      return false;
   }

   return (
      <li className="habit clearfix">
         <button className="accordian-trigger">{habit[1].habit}<span className="side-bar-plus">
            <i className="fas fa-plus"></i><span className="visually-hidden">Click to expand navigation options</span>
            <i id={habit[0]} onClick={deleteHabit} className="fas fa-trash-alt"></i><span className="visually-hidden">Click to delete the habit</span>
            </span>
         </button>
         <ul className="habit-days">
            {habit[1].days.map((day, i) => {
               // from the start date, 7 days for tracking are generated
               return (
                  <li key={habit[0] + '_habit' + i} className="habit-content">
                     <label className="day-name">{Object.keys(day)[0]}</label><span className="visually-hidden">shorthand for the name of day</span>
                     <label className="day-no">{day[Object.keys(day)[0]]}</label><span className="visually-hidden">Number for the day the habit needs to be tracked for. The date is {day.date}</span>
                     {/* based on the checkbox checked or not in firebase, it is shown on the tracker */}
                     <label htmlFor={habit[0] + '__' + i} className="container" >
                        <input id={habit[0] + '__' + i} type="checkbox" checked={day.complete} onChange={updateDay}
                           disabled={isDisabled(day.date)} />
                        <span className="checkmark"></span>
                     </label>
                  </li>
               )
            })}
         </ul>          
      </li>
   )
}

export default Habit;

