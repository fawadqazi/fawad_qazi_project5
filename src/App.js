import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase';
import Habit from './Habit';

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
      habitList: {},
      user: null

    }
  }

  componentDidMount() {
    // attach event listener to the firebase
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
        const userDBRef = firebase.database().ref(`users/${this.state.user.uid}`)
        userDBRef.on('value', (snapshot) => {
          // console.log(snapshot.val());
          this.setState({
            habitList: snapshot.val()
          })
        })
      }
    });
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
      days: this.state.days,
      email: this.state.user.email
    }
    const userDBRef = firebase.database().ref(`users/${this.state.user.uid}`);
    userDBRef.push(newHabit);
    // clear the form
    this.setState({
      habit: "",
    })
  }

  updateDay = (e) => {
    const firebaseKey = (e.target.id).split('__')[0];
    const indexOfDay = (e.target.id).split('__').pop().split(';')[0];
    let dayValue = !e.target.checked;
    // console.log(this.state.user.uid);
    // console.log(firebaseKey);
    // console.log(indexOfDay);
    // console.log(e.target.id);
    const habitRef = firebase.database().ref(`users/${this.state.user.uid}/${firebaseKey}/days/${indexOfDay}`);
    habitRef.update({
      complete: !dayValue
    });

  }

  login = () => {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }

  logout = () => {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }

  deleteHabit = (e) => {
    e.preventDefault();
    const firebaseKey = e.target.id;
    const habitRef = firebase.database().ref(`users/${this.state.user.uid}/${firebaseKey}`);
    habitRef.remove();
  }

  render() {
    return (
      <div className="App">
        <h1>Habit Tracker</h1>
        {this.state.user ?
          <button onClick={this.logout}>Log Out</button>
          :
          <button onClick={this.login}>Log In</button>
        }
        {this.state.user ?
        <form action="" onSubmit={this.handleSubmit}>
          <label htmlFor="habit">Habit:</label>
          <input type="text" id="habit" value={this.state.habit} onChange={this.handleChange} />
          <input type="submit" value="Add Habit" />
        </form>
        : null
        }
        {this.state.user ?
          <section>
            {Object.entries(this.state.habitList).map((habit) => (
              <Habit
                key={habit[0]}
                habit={habit}
                updateDay={this.updateDay}
                deleteHabit={this.deleteHabit}
              />
            ))}
          </section>
          :
          <div>User must be logged in.</div>
        }
      </div>
    );
  }
}

export default App;
