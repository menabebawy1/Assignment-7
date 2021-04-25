import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Components/Home';
import UserProfile from './Components/UserProfile';
import LogIn from './Components/LogIn';
import Debits from './Components/Debits';
import Credits from './Components/Credits';

class App extends Component {
  constructor() {
    super();

    this.state = {
      accountBalance: 0,
      currentUser: {
        userName: 'joe_shmo',
        memberSince: '07/23/96',
      },
      credits: [],
      debits: [],
    };
  }

  //run the api calls
  async componentDidMount() {
    await this.handleGetCredits();
    await this.handleGetDebits();
    this.handleCalculateNewBalance();
  }

  handleCalculateNewBalance = () => {
    let newAccountBalance = this.state.accountBalance;
    this.state.debits.forEach((transaction) => {
      newAccountBalance -= transaction.amount;
      //console.log('Each debit transaction amount:' + transaction.amount);
    });
    this.state.credits.forEach((transaction) => {
      newAccountBalance += transaction.amount;
      //console.log('Each credit transaction amount:' + transaction.amount);
    });

    this.setState({ accountBalance: newAccountBalance });
  };

  //This API Call gets the Credits
  handleGetCredits = async () => {
    await fetch(`https://moj-api.herokuapp.com/credits`)
      .then((res) => res.json())
      .then((json) => {
        this.setState({ credits: json });
      })
      .catch((err) => {
        return 0;
      });
  };

  // This API Call gets the Debits
  handleGetDebits = async () => {
    await fetch(`https://moj-api.herokuapp.com/debits`)
      .then((res) => res.json())
      .then((json) => {
        this.setState({ debits: json });
      })
      .catch((err) => {
        return 0;
      });
  };

  mockLogIn = (logInInfo) => {
    const newUser = { ...this.state.currentUser };
    newUser.userName = logInInfo.userName;
    this.setState({ currentUser: newUser });
  };

  // function to add to this.state.credit array
  addCreditsArray = (description, amount, date) => {
    var tempobj = { description: description, amount: amount, date: date };
    this.state.credits.push(tempobj);
  };

  // function to add to this.state.debit array
  addDebitsArray = (description, amount, date) => {
    var tempobj = { description: description, amount: amount, date: date };
    this.state.debits.push(tempobj);
  };

  render() {
    const HomeComponent = () => (
      <Home accountBalance={this.state.accountBalance} />
    );

    const UserProfileComponent = () => (
      <UserProfile
        userName={this.state.currentUser.userName}
        memberSince={this.state.currentUser.memberSince}
      />
    );

    const LogInComponent = () => (
      <LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />
    );

    const DebitsComponent = () => (
      <Debits
        accountBalance={this.state.accountBalance}
        debits={this.state.debits}
        addDebitsArray={this.addDebitsArray}
      />
    );

    const CreditsComponent = () => (
      <Credits
        accountBalance={this.state.accountBalance}
        credits={this.state.credits}
        addCreditsArray={this.addCreditsArray}
      />
    );

    return (
      <Router>
        <Switch>
          <Route exact path='/' render={HomeComponent} />
          <Route exact path='/userProfile' render={UserProfileComponent} />
          <Route exact path='/login' render={LogInComponent} />
          <Route exact path='/debits' render={DebitsComponent} />
          <Route exact path='/credits' render={CreditsComponent} />
        </Switch>
      </Router>
    );
  }
}

export default App;
