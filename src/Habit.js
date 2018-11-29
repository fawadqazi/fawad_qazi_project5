import React from 'react';

const Habit = ({habit, updateDay }) => {
   return(
      <div>
         <h2>{habit[1].habit}</h2>
         {habit[1].days.map((day, i) => {
            return (
               <div key={habit[0] +'_habit'+ i}>
                  <label htmlFor={habit[0] + '_' + i}>{day.day}</label>
                  <input id={habit[0] + '_' + i} type="checkbox" checked={day.complete} onChange={updateDay} />
               </div>
            )
         })}
      </div>
   )
}

export default Habit;