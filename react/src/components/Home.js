import React, {Fragment} from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../components/AuthService';
import withAuth from '../components/withAuth';
//style
import '../index.css';
import'../styles/styles.scss';
import '../../node_modules/@mdi/font/css/materialdesignicons.min.css';
import '../../node_modules/materialize-css/dist/css/materialize.min.css';
import '../../node_modules/materialize-css/dist/js/materialize.min.js';


import IndexNavbar from "../components/Navbars/IndexNavbar.js";


const Auth = new AuthService();


class Home extends Component { 

    constructor(props){
        super(props)
        
        this.state = {
            loading : false,
            done : false,
            enrolled : true,
            quizname : null
        }
       
    }

    async componentDidMount(){
        this.setState({loading:true})
        
      //  console.log("TOKENEEEEEEEEEEE")
      //  console.log(token)
        const val  = window.location.pathname
        let url =  val.substr(val.lastIndexOf('/')+1)

     //   console.log(url)
        fetch("http://127.0.0.1:8000/site_users/user/",{
            method:'GET',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization':'Token ' + this.props.profile.token,

            }}).catch( e=>{console.log("Server error " )})
        .then(response => response.json())
        .then(result => {
            //console.log(result.quiz)
        //    console.log("THE RESULT IS ")
       //     console.log(result.events)
       //     console.log("MAINNNNNNNNNNNNNNNNNNNNNNNNNNNN DATAAAAAAAAAAAAAAAAAAAAAAAAA")
        //    console.log("TRUEEEEEEEEEEEEE OR FALSSSSSSSSSsss")
       //     console.log(result.events === "No events enrolled yet")
            if(result.events === "No events enrolled yet"){
                this.setState({loading:false,enrolled : false})
            }
            else if(result.detail ==="Invalid token."){
                //console.log(this.props.history)
                this.handleLogout()
            }
            else{
                const playrender = (result.events).filter(each=>each.completed&&each.slug === url)
                const name = (result.events).filter(each => each.slug === url)
                //console.log(playrender)
               // console.log(name)
                if(playrender.length !== 0){
                 //   console.log("HRERE")
                    this.setState({done:true,loading:false ,quizname : name[0].event_name})
                }
                else 
                    this.setState({loading:false , quizname: name[0].event_name})
              }
        })
       
    }

    handleLogout(){
        Auth.logout()
        this.props.history.replace('/login');
        }

  render(){

      //  console.log(this.props)
        if(!this.state.loading && this.state.enrolled){
            const val  = window.location.pathname
            let url =  val.substr(val.lastIndexOf('/')+1)
        return(
        <Fragment>
            <IndexNavbar/>
            <div id = "home">
                <section>
                    <div style = {{textAlign: 'center' }}>
                        <span className = "mdi mdi-cube-outline cube"></span>
                    </div>
                    <div id = "heading">
                        <h1 style ={{color:"white"}}>{this.state.quizname}</h1>
                        <h2>Welcome {this.props.profile.user}</h2>
                    </div>
                   
                    <div className = "play-button-container">
                        <ul>
                            <li>
                           
                            <Link className = "play-button first" to ={this.state.done? "":"/play/instructions/"+ url }>
                                                                    {this.state.done? "QUIZ Done":"play"}</Link>  
                            </li>
                            
                        </ul>
                    </div>
                    <div className = "auth-container">
                        <center>
                        <button className = "auth-buttons" id = "login-button"  onClick={this.handleLogout.bind(this)}>Log Out</button>
                        </center>
                    </div>
                </section>
            </div>
        </Fragment>
            );   
        }    
        
        else {
            if(!this.state.enrolled)
            
                return(
                    <div>
                    <IndexNavbar/>
                    <h3>Enroll first</h3>
                    </div>
                )
            return(
                <div>
                <IndexNavbar/>
                <h3>Loading</h3>
                </div>
            )
                
        }
   }

    


    

}


//export default App;
export default withAuth(Home)
