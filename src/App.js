import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase';
import Habit from './Habit';

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
    // attach event listener to the firebase so session is maintained even after refresh
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

  // when the start date is selected, it generates arrays for name of days and date and then creates an object to push on firebase
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
    this.setState({
      days: this.state.habitArray,
    })
  }

  // when the form is submitted the newHabit object is pushed to the firebase
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
      habitArray: []
    })
    document.getElementById('startDate').value = '';
  }

  // when a checkbox is checked or unchecked, it is updated on firebase
  updateDay = (e) => {
    const firebaseKey = (e.target.id).split('__')[0];
    const indexOfDay = (e.target.id).split('__').pop().split(';')[0];
    let dayValue = !e.target.checked;
    const habitRef = firebase.database().ref(`users/${this.state.user.uid}/${firebaseKey}/days/${indexOfDay}`);
    habitRef.update({
      complete: !dayValue
    });
  }

  // when login button is clicked, google auth window pops up
  login = () => {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }

  // when login button is clicked, google auth window pops up
  guest = () => {
    firebase.auth().signInAnonymously()
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }

  // when logout is clicked, session is ended by clearing the user 
  logout = () => {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }

  // if a habit is deleted
  deleteHabit = (e) => {
    e.preventDefault();
    const firebaseKey = e.target.id;
    const habitRef = firebase.database().ref(`users/${this.state.user.uid}/${firebaseKey}`);
    habitRef.remove();
  }

  // a check to make sure that the minimum date to start a habit should be today and in the future and no previous date can be selected
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
          // if user is not null after successfull login show the form to add habit and habits already added
          <div className="user-page">
            <div className="header">
              <h2 className="page-header">Habit Tracker</h2>
              <button className="btn-user button desk-logout" onClick={this.logout}>Log Out</button>
              <i className="fas fa-sign-out-alt mobile-logout" onClick={this.logout}></i><span className="visually-hidden">Click to log out</span>
            </div>
            <div className="wrapper">
              <form action="" onSubmit={this.handleSubmit}>
                <label htmlFor="habit" className="label-text">Habit:</label>
                <input type="text" className="input-text" placeholder="Habit" id="habit" value={this.state.habit} onChange={this.handleChange} maxLength="15" autoComplete="off" required/>
                <label htmlFor="startDate" className="label-text">Start Date:</label>
                <input id="startDate" className="input-text" placeholder="mm/dd/yyyy" type="date" onChange={this.handleDate} min="1899-01-01" autoComplete="off" required />
                <input className="button btn-user" type="submit" value="Track" />
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
            // if the user is not logged in show guest landing page
            <div className="guest-header">
              <div className="wrapper">
                <div className="landing">
                  <h1 className="app-header">Habit Tracker</h1>
                  <button className="button" onClick={this.login}>Log In</button>
                  <a className="guest-link" onClick={this.guest}>Try as Guest</a>
                </div>
              </div>
            </div>
          }       
      </div>
    );
  }
}

export default App;
