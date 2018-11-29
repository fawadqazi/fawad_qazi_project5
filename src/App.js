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
                  {habit[1].days.map((day) => {
                    return(
                      <div>
                        <p>{day.day}</p>
                        <input type="checkbox" checked={day.complete}/>
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
