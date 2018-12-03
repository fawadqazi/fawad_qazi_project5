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
      days: [],
      habitList: {},
      user: null,
      habitArray: []
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

  handleDate = (e) => {
    this.checkDate();
    const nameOfDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let habitDays = [];
    let habitDateDigits = [];
    let habitDates = [];

    let date = new Date(e.target.value + 'T12:00:00.000Z');
    habitDays.push(nameOfDays[date.getDay()]);
    habitDateDigits.push(date.getDate());
    habitDates.push(new Date(date));

    for (let i = 1; i <= 6; i++) {
      date.setDate(date.getDate() + 1);
      habitDates.push(new Date(date));
      habitDays.push(nameOfDays[date.getDay()]);
      habitDateDigits.push(date.getDate());
    }

    for (let i = 0; i < habitDateDigits.length; i++) {
      this.state.habitArray.push({
        [habitDays[i]]: habitDateDigits[i],
        complete: false,
        date: habitDates[i].toLocaleDateString()
      })
    }
    // console.log(this.state.habitArray);
    this.setState({
      days: this.state.habitArray
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

  checkDate = () => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById('startDate').setAttribute('min', today);
  }

  render() {
    return (
      <div className="App">
          {this.state.user ?
          <div className="user-page">
            <div className="header">
              <h2 className="page-header">Habit Tracker</h2>
              <button className="btn-user button" onClick={this.logout}>Log Out</button>
            </div>
            <div className="wrapper">
              <form action="" onSubmit={this.handleSubmit}>
                <label htmlFor="habit">Habit:</label>
                <input type="text" placeholder="Habit" id="habit" value={this.state.habit} onChange={this.handleChange} required />
                <input id="startDate" placeholder="mm/dd/yyyy" type="date" onChange={this.handleDate} min="1899-01-01" required />
                <input type="submit" value="Add Habit" />
              </form>
              <ul className="habit-list">
                {this.state.habitList ?
                  Object.entries(this.state.habitList).map((habit) => (
                    <Habit
                      key={habit[0]}
                      habit={habit}
                      updateDay={this.updateDay}
                      deleteHabit={this.deleteHabit}
                      updateContent={this.updateContent}
                    />
                  ))
                  : null}
              </ul>
            </div>
          </div>
            :
            <div className="guest-header">
              <div className="wrapper">
                <div className="landing">
                  <h1 className="app-header">Habit Tracker</h1>
                  <button className="button" onClick={this.login}>Log In</button>
                </div>
              </div>
            </div>
          }
            
      </div>
    );
  }
}

export default App;
