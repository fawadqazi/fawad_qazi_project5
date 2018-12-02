import React from 'react';

const Habit = ({ habit, updateDay, deleteHabit }) => {
   function isDisabled(date) {
      if (date !== new Date().toLocaleDateString()) {
         return true;
      }
      return false;
   }
   return (
      <div>
         <h2>{habit[1].habit}</h2>
         {habit[1].days.map((day, i) => {
            console.log(day);
            return (
               <div key={habit[0] + '_habit' + i}>
                  <label htmlFor={habit[0] + '__' + i}>{Object.keys(day)[0]} {day[Object.keys(day)[0]]}</label>
                  <input id={habit[0] + '__' + i} type="checkbox" checked={day.complete} onChange={updateDay} 
                  disabled={isDisabled(day.date)} />                
               </div>
            )
         })}
         <button id={habit[0]} onClick={deleteHabit}>Delete</button>
      </div>
   )
}

export default Habit;

