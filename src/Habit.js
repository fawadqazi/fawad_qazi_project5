import React from 'react';

const Habit = ({ habit, updateDay, deleteHabit }) => {
   // console.log(habit);
   return (
      <div>
         <h2>{habit[1].habit}</h2>
         {habit[1].days.map((day, i) => {
            return (
               <div key={habit[0] + '_habit' + i}>
                  <label htmlFor={habit[0] + '__' + i}>{day.day}</label>
                  <input id={habit[0] + '__' + i} type="checkbox" checked={day.complete} onChange={updateDay} />                
               </div>
            )
         })}
         <button id={habit[0]} onClick={deleteHabit}>Delete</button>
      </div>
   )
}

export default Habit;

