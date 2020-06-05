import React , {Component, Fragment} from "react"
import { Link } from 'react-router-dom';
import AuthService from '../../components/AuthService.js';
import withAuth from '../../components/withAuth.js'

//style
import '../../index.css';
import'../../styles/styles.scss';
import '../../../node_modules/@mdi/font/css/materialdesignicons.min.css';
import '../../../node_modules/materialize-css/dist/css/materialize.min.css';
import '../../../node_modules/materialize-css/dist/js/materialize.min.js';

const auth = new AuthService()

class QuizSummary extends Component {

    constructor(props){
        localStorage.removeItem('countdowntimer')
        super(props)
        this.state = {
            name : "",
            score : 0,
            quizname : "",
            numberOfQuestions : null,
            negativemarking : true,
            description : "",
            usersanswers :null,
            image : null,
            loading : true,
            already_submitted : null
        }
    }

   
    componentDidMount(){

        if(this.state.loading){
            
            const state = this.props.history.location.state
            const profile = this.props.profile
            const val  = window.location.pathname
            let url =  val.substr(val.lastIndexOf('/')+1)
         //   console.log("FETCHING DATA ")
         //   console.log(profile)
        //    console.log(state)
            fetch("http://127.0.0.1:8000/views/quizzes/"+url+"/submit/",{
                method:'POST',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json',
                    'Authorization':'Token ' + profile.token,
    
                },
                body:JSON.stringify({
                    answer:state.answer,
                    question:state.question,
                    quiztaker:state.quiztaker//convert to strings
                })
            }).catch( e=>{console.log("Server error " +String(e))
                            auth.logout()
                            alert("come back later server error")
                            this.props.history.push('/login')})
            .then(response => response.json())
            .then(result => {
            //   console.log("See Response hereeeeeeeeeee")
              
            //   console.log(result)
               if(result.detail){
                auth.logout()
                this.props.history.push("/login")
              }
              
               if (!result.message){
                this.setState({
                    score : result.score,
                    name :  profile.user,
                    quizname : result.name,
                    numberOfQuestions : state.numberofQuestions,
                    negativemarking :  result.negative_marking,
                    description :  result.description,
                    usersanswers :  result.quiztaker_set.usersanswer_set,
                    image : result.image,
                    loading : false
                        })
               }
                else {
                    this.setState({
                        already_submitted : true,
                        loading : false
                      })
                }
                

               
                        
                 })




                   }

        
}


    render(){
        //console.log(this.props.location)
      //  console.log('datataatatattatattatatattatatattata')
      // console.log(this.props.history.location.state)


       if (this.state.loading){
           return(<div><h2>Loading</h2></div>)
       }
       
        //console.log(this.props.location.state.approx_questions)
        const state  = this.state
        //console.log(this.props)
        //const {state} = this.props.location
        let stats , remark


        if (state.name === ""){
            stats = <h3>Stats not available take a quiz</h3>
            return (
                <Fragment>
                    <h3 className = "no-stats">Sorry {stats}</h3>
                    <section>
                    <ul>
                        <li>
                            <Link to ="/" >Back to Home</Link>
                        </li>
                    </ul>
                </section>
                </Fragment>
            )
        }
        if (state.score<=30)
            remark  = "You need more practice"
        else if (state.score >30 & state.score <=50)
            remark = "Better luck next time!"
        else if (state.score >=50 && state.score <=80)
            remark = "You can do Better!!"
        else 
            remark  = "You are a genius!!"

      
           // console.log("the number of questions are ")
          //  console.log(this.state.numberOfQuestions)
         // console.log("STATE VALUE IS ")
        //  console.log(this.state)
        //  console.log(this.state.usersanswers)
         
        
          var count = 0

            
                

        stats =  (
                <div>
                <div>
                    <span className = "mdi mdi-check-circle-outline success-icon"></span>                
                </div>
                <h1>Quiz has ended </h1>
                <div className = "container stats">
                    <h4>{remark}!</h4>
                    <h4>{state.name}</h4>
                    <h5>Event Name : {state.quizname}</h5>
                    <span className = " left">No of questions taken :</span>
                    <span className = "right">{this.state.numberOfQuestions}</span><br />
                    <span className = " left">Negative marking:</span>
                    <span className = "right">{this.state.negativemarking ? "YES":"NO"}</span><br />
                    <span className = " left">Number of Answered questions:</span>
                    <span className = "right">{this.state.numberOfQuestions === 0 ? 0 : count}</span><br />
                    
                </div>
                <section>
                    <ul>
                        <li>
                            <Link to ="/" >Back to Home</Link>
                        </li>
                       
                    </ul>
                </section>
                </div> 
        )
        
        return (
            <Fragment>
                <div className = "quiz-summary">
                {stats}
                </div>
            </Fragment>
        )

      
    }


}

export default withAuth(QuizSummary)