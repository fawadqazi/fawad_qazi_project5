import React, { Component } from 'react';
import './App.css';
import firebase from './firebase';

// reference to the root of the database
const dbRef = firebase.database().ref();

class App extends Component {
  constructor() {
    super();
    this.state = {
      habit: "",
      days: [
        { "complete": false, day: "M" },
        { "complete": false, day: "T" },
        { "complete": false, day: "W" },
        { "complete": false, day: "T" },
        { "complete": false, day: "F" },
        { "complete": false, day: "S" },
        { "complete": false, day: "S" }
      ],
      habitList: {}
    }
  }

  componentDidMount() {
    // attach event listener to the firebase
    dbRef.on('value', (snapshot) => {
      this.setState({
        habitList: snapshot.val()
      })
    })
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // post our new habit to firebase
    const newHabit = {
      habit: this.state.habit,
      days: this.state.days
    }
    dbRef.push(newHabit);
    // clear the form
    this.setState({
      habit: "",
    })
  }

  updateDay = (e) => {
    const firebaseKey = (e.target.id).split('_')[0];
    const indexOfDay = (e.target.id).split('_').pop().split(';')[0];
    let dayValue = !e.target.checked;
    // dayValue = !dayValue;
    // console.log(!dayValue);
    console.log(firebaseKey);
    console.log(indexOfDay);
    const habitRef = firebase.database().ref(`/${firebaseKey}/days/${indexOfDay}`);
    habitRef.update({
      complete: !dayValue
    });

  }

  render() {
    return (
      <div className="App">
        <h1>Habit Tracker</h1>
        <form action="" onSubmit={this.handleSubmit}>
          <label htmlFor="habit">Habit:</label>
          <input type="text" id="habit" value={this.state.habit} onChange={this.handleChange} />
          <input type="submit" value="Add Habit" />
        </form>
        <section>
          {
            Object.entries(this.state.habitList).map((habit) => {
              console.log(habit);
              return (
                <div key={habit[0]}>
                  <h2>{habit[1].habit}</h2>
                  {habit[1].days.map((day,i) => {
                    return(
                      <div>
                        <label htmlFor={habit[0] + '_' + i}>{day.day}</label>
                        <input id={habit[0]+'_'+i} type="checkbox" checked={day.complete} onChange={this.updateDay}/>
                      </div>
                    )
                  })}
                </div>
              )
            })
          }
        </section>
      </div>
    );
  }
}

export default App;
