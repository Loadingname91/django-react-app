import React from 'react';

// styles
import "./assets/css/bootstrap.min.css";
import "./assets/scss/paper-kit.scss";
import "./assets/demo/demo.css";


import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './components/Home';
import QuizInstructions from './components/quiz/QuizInstructions';
import Play from './components/quiz/play';
import QuizSummary from './components/quiz/QuizSummary.js'
import QuizInfo from './components/quiz/quizInfo.js'
import ProfilePage from "./components/quiz/userprofile.js"
import LoginReg from "./components/login/App.js"
import adminresults from "./components/quiz/adminuser.js"

import App from './App.js'


ReactDOM.render(
  <React.StrictMode>
      <Router>
      <div>
  
      <Route path = "/home/:slug" exact component = { Home } />
      <Route path = "/play/instructions/:slug" exact component = { QuizInstructions } />
      <Route path = "/play/quiz/:slug" exact component = {Play} ></Route>
      <Route path = "/play/quizsummary/:slug" exact component = {QuizSummary} ></Route>
      <Route path = "/info/:slug" exact component = {QuizInfo} ></Route>
      <Route path = "/userprofile" exact component = {ProfilePage} ></Route>

      <Route path = "/testroute" exact component = {adminresults} ></Route>
      
      <Route exact path="/login"component={LoginReg}/>
      
      
      <Route exact path="/"component={App}/>
      </div>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);







serviceWorker.unregister();
