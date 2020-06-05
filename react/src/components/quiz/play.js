import React, { Component } from 'react';

//import axios from "axios"

//import questions from '../../questions.json';
//import questions from "../../django.json" 

//imports in array format
import isEmpty from '../../utils/is-empty';

import withAuth from '../../components/withAuth.js'
import AuthService from '../../components/AuthService';


//style
import '../../index.css';
import'../../styles/styles.scss';
import '../../../node_modules/@mdi/font/css/materialdesignicons.min.css';
import '../../../node_modules/materialize-css/dist/css/materialize.min.css';
import '../../../node_modules/materialize-css/dist/js/materialize.min.js';

import IndexNavbar from "../Navbars/IndexNavbar.js";
import DemoFooter from "../../components/Footers/DemoFooter.js";

const auth = new  AuthService()


class Play extends Component {
    constructor (props) {
       super(props);
       this.state = {
            quiz : null,
            isFetching: true,
            questions :null,      //this is like questions: questions (one is from import and other assigned.when key and value are same we can shorten them)
            previousQuestion: {},
            currentQuestion: {},
            nextQuestion: {},
            answer: '',
            answer_option:'',
            numberOfQuestions: 0,
            lastanswerid: null,
            currentQuestionIndex: 0,
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            hints: 0,
            fiftyFifty: 0,
            usedFiftyFifty: false,
            time:{},
            fail : false,
            colorstatsquestion:[],
            colorstatsanswer:[],
            mounted: true
       };
       this.interval = null
     
    }

    //call dispay method when our application loads
 async componentDidMount() {
     // // console.log(this.props)
       console.log("mounted")
        if (isEmpty(this.state.questions)){
           //calculating the url or slug 
        const val  = window.location.pathname
        let url =  val.substr(val.lastIndexOf('/')+1)
   
        fetch("http://127.0.0.1:8000/views/quizzes/"+url,{
            method:'GET',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization':'Token ' + this.props.profile.token,

            }})
        .then(response => response.json())
        .then(result => {
          //  console.log(result)
            if(result.detail ==="Invalid token."){
                this.auth.logout()
                this.props.history.push('/login')

            }
            if(result.detail){
                window.alert("you have not registerd")
                this.props.history.push("/")
            }
            this.setState({questions: result.quiz, isFetching: false})
        })
        .catch( e=>{console.log("Server error " +String(e))
                    auth.logout()
                    alert("come back later server error")
                    this.props.history.push('/login')})
        this.startTimer();
        }
        else{
            const { questions, currentQuestion, nextQuestion, previousQuestion,answer_option } = this.state
           // console.log(this.state.questions)
            this.displayQuestions(questions, currentQuestion, nextQuestion, previousQuestion,answer_option);
            this.startTimer();
        }
        
         
    }

    componentWillMount(){
        clearInterval(this.interval)
       
    }
    componentWillUnmount(){
        clearInterval(this.interval)
       // console.log("herererererer mou")
        this.setState({mounted:false})
    }
    
    
     


    displayQuestions = (questions = this.state.questions.question_set, currentQuestion, nextQuestion, previousQuestion , answer_option) => {
       // console.log("display")
        //console.log(questions[0])
        let { currentQuestionIndex } = this.state;  //set current question index
        if(!isEmpty(this.state.questions)) {        //refer is-empty file (check if questions array is empty)
            questions = this.state.questions.question_set;       //initializing parameters
            currentQuestion = questions[currentQuestionIndex];
            answer_option = currentQuestion.answer_set;
           // console.log(answer_option)
            nextQuestion = questions[currentQuestionIndex + 1];
            previousQuestion = questions[currentQuestionIndex - 1];
            this.setState({     //set these values in above state
                currentQuestion,        //since key and value have same name.
                nextQuestion,
                previousQuestion,
                answer_option,
                numberOfQuestions: questions.length,
            });
        }
    };



    handleOptionClick = (e) => {  //fire an event
        let answer = e.target.id
        let question 
        let quiztaker
        this.state.currentQuestion.id ? question = this.state.currentQuestion.id :
                                        question =  this.state.questions.question_set[0].id
         quiztaker = this.state.questions.quiztakers_set.id
        if (this.state.colorstatsquestion.includes(question)){
            const index = this.state.colorstatsquestion.indexOf(question)
            let val =  this.state.colorstatsanswer
            val[index] = answer            
            this.setState(val)

        }
        else{
            let ques_val = this.state.colorstatsquestion
            ques_val.push(question)
            let ans_val = this.state.colorstatsanswer
            ans_val.push(answer)
            this.setState({colorstatsquestion:ques_val,colorstatsanswer:ans_val})

        }

        const val  = window.location.pathname
        let url =  val.substr(val.lastIndexOf('/')+1)
        
        fetch("http://127.0.0.1:8000/views/save_answer/"+url+"/",{
            method:'PATCH',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization':'Token ' + this.props.profile.token,

            },
            body:JSON.stringify({
                answer:answer,
                question:question,
                quiztaker:quiztaker//convert to strings
            })
        })
        .then(response => response.json())
        .then(result => {
        })
        .catch( e=>{console.log("Server error " +String(e))
                    auth.logout()
                    alert("come back later server error")
                    this.props.history.push('/login')})
                    this.nextquestion(answer,question,quiztaker);
       
        
    }

    nextquestion = (answer,question,quiztaker) =>{
        if (this.state.mounted){
            this.setState (prevState => ({      //takes in first argument as previous state
                score: prevState.score + 1,      //update all corresponding state
                correctAnswers: prevState.correctAnswers + 1,
                currentQuestionIndex: prevState.currentQuestionIndex + 1,
                lastanswerid : answer
            }), () => {
                this.state.nextQuestion === undefined? this.endGame(answer,question,quiztaker) :
                    this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
                        }
            )
        }
    }




    handleNextButtonClick = () => {
        if(this.state.nextQuestion !== undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex + 1
            }),  () => {        //call dispalyquestion method to render another question
                this.displayQuestions(this.state.state, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            });
        }
    };



    handlePreviousButtonClick = () => {
        if(!isEmpty(this.state.previousQuestion) ) {
            // console.log("im here")
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex - 1
            }),  () => {        //call dispalyquestion method to render another question
                this.displayQuestions(this.state.state, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            });
        }
    };



    handleQuitButtonClick = () => {
        if (window.confirm('Are you sure you want to quit?')) {
            this.props.history.push('/');
        }
    };




    handleButtonClick = (e) => {
        switch (e.target.id)    {
            case 'next-button':
                this.handleNextButtonClick();
                break;
            case 'previous-button':
                this.handlePreviousButtonClick();
                break;
            case 'quit-button':
                this.handleQuitButtonClick();
                break;
            default: 
                break;
        }
    }


   




    


    endGame =  async (answer,question,quiztaker) =>{

        const playerStats = {
            'answer':answer,
            'question':question,
            'quiztaker':quiztaker,
            'numberofQuestions':this.state.numberOfQuestions

        }
        const val  = window.location.pathname
        let url =  val.substr(val.lastIndexOf('/')+1)
        if (!(answer&&question&&quiztaker)){
            // console.log("hereeeeeeeeeeeeeeeeeeeeeeeeeeee END game")
            this.state.lastanswerid ? playerStats.answer = this.state.lastanswerid:
                                      playerStats.answer = this.state.questions.question_set[0].answer_set[0].id
            this.state.currentQuestion.id ? playerStats.question = this.state.currentQuestion.id :
                                        playerStats.question =  this.state.questions.question_set[0].id
            playerStats.quiztaker = this.state.questions.quiztakers_set.id
        }
           this.props.history.push('/play/quizsummary/'+url,playerStats)  

              
    }






    startTimer = () =>  {
        var countDownTime
        const cookie = "countdowntimer"
        const savedtime = localStorage.getItem(cookie)
        if(!savedtime){
            countDownTime = Date.now() + 3600000;  
           localStorage.setItem(cookie,countDownTime)   
        }  
        else {
             countDownTime = savedtime
        }
        this.interval = setInterval(() => { 
            const now = new Date();
            const distance = countDownTime - now;

            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

         
        
            if (distance < 0)    {
                clearInterval(this.interval);
                this.setState({
                    time: {
                        minutes: 0,
                        seconds: 0
                        } 
                }, () => {
                    this.endGame(null,null,null)
                    //this.props.history.push('/');
                });
            } else {
                this.setState({
                    time: {
                        minutes,        //minutes and seconds get set to current value
                        seconds
                    }
                })
            }
        }, 1000);
    }

    
    render () { 
    
        if (this.state.isFetching ) {
        //    console.log("if here")
            return <div>loading...</div>;
          }
        var { 
                currentQuestion, 
                currentQuestionIndex, 
                numberOfQuestions,
                time,
                answer_option
            } = this.state;

        if (isEmpty(currentQuestion)){
           // 
          //  console.log('here setting up')
           // console.log(this.state.questions)
           
             currentQuestion = this.state.questions.question_set[0]
             numberOfQuestions = this.state.questions.question_set.length
             answer_option = this.state.questions.question_set[0].answer_set
           // console.log('set up')
        }
        
       // console.log('after')
       // console.log(isEmpty(currentQuestion))
       // console.log(currentQuestion)
       // console.log({}.length)
     //  console.log("COLORRRRRRRRRRRRRRRRRR OPTIONNNNNNNNNNNNNNNNNNNNNNNNNNN ")
       var color_option
       var colorbuffer_loaded
      // console.log(isEmpty(this.state.colorstatsquestion))
       if(!(this.state.colorstatsquestion.includes(this.state.currentQuestion.id))){
             colorbuffer_loaded  = true 
             color_option = this.state.questions.quiztakers_set.usersanswer_set
       }
       else{
         colorbuffer_loaded = false    
       }
       
        return (
            
            <div className = "mainpage-play">            
                
                <div className = "questions">
                <IndexNavbar/>
                    <h2>Quiz Mode</h2>
                    <div>
                        <p>
                            <span className = "left">{ currentQuestionIndex + 1 } of { numberOfQuestions }</span>
                            <center><span className = "right timer">{ time.minutes }:{ time.seconds }  <span className = "mdi mdi-clock-outline mdi-24px"></span></span> </center>
                        </p>
                    </div>
                    <h5>{ currentQuestion.label }</h5>
                    <div className = "options-container">
                    
                        <p onClick = { this.handleOptionClick } className = "option" id = {answer_option[0].id}
                            style ={{backgroundColor: colorbuffer_loaded? (color_option[currentQuestionIndex].answer === answer_option[0].id ?
                                "green" : "") : (this.state.colorstatsanswer.includes((answer_option[0].id).toString())? 
                                "green":"")}}>
                                    {  answer_option[0].label }</p>
                        <input type="hidden" value = {answer_option[0].id}/>



                        <p onClick = { this.handleOptionClick } className = "option" id = {answer_option[1].id}
                        style ={{backgroundColor: colorbuffer_loaded? (color_option[currentQuestionIndex].answer === answer_option[1].id ?
                            "green" : "") : (this.state.colorstatsanswer.includes((answer_option[1].id).toString())? 
                            "green":"")}}>
                        {  answer_option[1].label }</p>
                        <input type="hidden" value = {answer_option[1].id}/>
                    </div>


                    <div className = "options-container">
                        <p onClick = { this.handleOptionClick } className = "option" id = {answer_option[2].id}
                        style ={{backgroundColor: colorbuffer_loaded? (color_option[currentQuestionIndex].answer === answer_option[2].id ?
                            "green" : "") : (this.state.colorstatsanswer.includes((answer_option[2].id).toString())? 
                            "green":"")}}>
                        {answer_option[2].label }</p>


                        
                        <p onClick = { this.handleOptionClick } className = "option" id = {answer_option[3].id}
                        style ={{backgroundColor: colorbuffer_loaded? (color_option[currentQuestionIndex].answer === answer_option[3].id ?
                            "green" : "") : (this.state.colorstatsanswer.includes((answer_option[3].id).toString())? 
                            "green":"")}}>
                        {answer_option[3].label }</p>
                        
                    </div>

                    <div className = "button-container">
                        <button id = "previous-button" onClick = {this.handleButtonClick}>Previous</button>
                        <button id = "next-button" onClick = {this.handleButtonClick}>Next</button>
                        <button id = "quit-button" onClick = {this.handleButtonClick}>Quit</button>
                    </div>
                </div> 
                <DemoFooter/>
            </div>
           
        )
    }

        
}


export default withAuth(Play);