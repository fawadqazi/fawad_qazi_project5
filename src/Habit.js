import React from 'react';

const Habit = ({ habit, updateDay, deleteHabit }) => {
   function isDisabled(date) {
      if (date !== new Date().toLocaleDateString()) {
         return true;
      }
      return false;
   }

   return (
      <li className="habit clearfix">
         <button className="accordian-trigger">{habit[1].habit}<span className="side-bar-plus">
            <i class="fas fa-plus"></i><span class="visually-hidden">Click to expand navigation options</span></span>
         </button>
         <ul className="habit-days">
            {habit[1].days.map((day, i) => {
               return (
                  <li key={habit[0] + '_habit' + i} className="habit-content">
                     <label htmlFor="">{Object.keys(day)[0]}</label>
                     <label htmlFor="">{day[Object.keys(day)[0]]}</label>
                     <label htmlFor={habit[0] + '__' + i} className="container" >
                        <input id={habit[0] + '__' + i} type="checkbox" checked={day.complete} onChange={updateDay}
                           disabled={isDisabled(day.date)} />
                        <span className="checkmark"></span>
                     </label>
                  </li>
               )
            })}
         </ul>
         
         <button id={habit[0]} onClick={deleteHabit}>Delete</button>
      </li>
   )
}

export default Habit;

