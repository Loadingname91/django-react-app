


import "../../assets/css/bootstrap.min.css";
import "../../assets/scss/paper-kit.scss";
import "../../assets/demo/demo.css";
import React , {Component} from "react";
import { Link } from 'react-router-dom';
// reactstrap components
import {
  Button,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import IndexNavbar from "../Navbars/IndexNavbar.js";
import ProfilePageHeader from "../../components/Headers/ProfilePageHeader.js";
import DemoFooter from "../../components/Footers/DemoFooter.js";

import AuthService from '../../components/AuthService.js';
import withAuth from '../../components/withAuth.js'
const auth = new AuthService()

class QuizInfo extends Component {
 
    constructor(props){
        super(props)
        this.state ={
            isLoading : true,
            success: false,
            registered : false,
            check : false,
            quizdata : null,
            finish : false
        }    

    }


 

  async  componentDidMount() {

   //   console.log(this.props)
      console.log("MOUNTEDDDDDDDDDDDDDDDDDDdd")
        const token = sessionStorage.getItem("token")
     //   console.log("TOKENEEEEEEEEEEE")
     //   console.log(token)
        const val  = window.location.pathname
        let url =  val.substr(val.lastIndexOf('/')+1)

       // console.log(url)

        if(!this.state.check){

          fetch("http://127.0.0.1:8000/views/info_quiz/"+url,{
            method:'GET',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization':'Token ' + token,
            }})
        .then(response => response.json())
        .then(result => {
            //console.log(result.quiz)
            console.log("MOUNTED RESPOSNE ")
         //   console.log(result)
            if(result.detail){
            //  console.log("here")
              auth.logout()
              this.props.history.push("/login")
            }
         //   console.log("REGISTEDDDDDDDD nOOOOOOOOOOOO")
          //  console.log(result[0].quiz_taken)
            
         

            if(result[0].quiz_registered === "No" )
              this.setState({quizdata : result,check : true , registered :false , isLoading : false})
            
              if(result[0].quiz_registered=== "Yes" ) {
                
                if(result[0].quiz_taken === "No")
                  this.setState({quizdata:result ,check:true,registered:true ,  isLoading : false , finish : false})
                
                else
                  this.setState({quizdata:result ,check:true,registered:true ,  isLoading : false , finish :true})

            }
            else 
              this.setState({isLoading:false,check:true})
        })
        .catch( e=>{console.log("Server error " +String(e))
                    auth.logout()
                   console.log("come back later server error")
                    this.props.history.push('/login')})

        }
        
  
   
      
       
  
  }


  register = (e) => {
    console.log("registred called")
    //  console.log("mounted")
    const token = sessionStorage.getItem("token")
    //console.log("TOKENEEEEEEEEEEE")
    //console.log(token)
  
    const val  = window.location.pathname
    let url =  val.substr(val.lastIndexOf('/')+1)
      fetch("http://127.0.0.1:8000/views/register_quizzes/"+url,{
          method:'GET',
          headers:{
              'Accept':'application/json',
              'Content-Type':'application/json',
              'Authorization':'Token ' + token,
          }})
      .then(response => response.json())
      .then(result => {
          //console.log(result.quiz)
          if(result.detail === "You have Already Registered")
             window.alert("You have already registered")
          else 
             this.setState({success:true , registered :true})
      })
      .catch( e=>{console.log("Server error " +String(e))})
  
   
      
       
  }



  





render(){
  
  //console.log("DATA ISSSSSSSSSSSSSSSSSSSSSSSSS HERER")
  //console.log(this.props.location)

  if (this.state.isLoading){

    return (
      <div className="section profile-content">
    <IndexNavbar />
    <ProfilePageHeader />
    <h2>Loading</h2>
    <DemoFooter />
    </div>
    )
  }
  
  
  
  
  //console.log("quiz info is ")
  //console.log(this.state.quizdata)
  const quiz_data = this.state.quizdata[0]

  //console.log("REGISTEREDDDDDDDDDDD VALUE")
  //console.log(this.state.registered)
  const reg_check = this.state.registered
  const play_check = this.state.finish
  //console.log('register chck')
 // console.log(reg_check)

 // console.log('play check')
  //console.log(this.state.finish)
    return (
        <>
          <IndexNavbar />
          <ProfilePageHeader />
          <div className="section profile-content">
            <Container>
              <div className="owner">
                <div className="avatar">
                  <img
                    alt="..."
                    className="img-circle img-no-padding img-responsive"
                    src={require("../../components/Cads/bg2.jpg")}
                  />
                </div>
                <div className="name">
                  <h4 className="title">
                    {quiz_data.name}<br />
                  </h4>
                    <h6 className="description">Description</h6>
                </div>
              </div>
              <Row>
                <Col className="ml-auto mr-auto text-center" md="6">
                  <p>
                      <br></br>
                      {quiz_data.description}
                      <br></br><br></br>
                      negative marking :{quiz_data.negative_marking ?  
                                            <span style = {{fontWeight : "bold",color :"green"}}> Yes</span> :
                                            <span style = {{fontWeight : "bold",color :"Red"}}> No</span> }
                  </p>
                  <br />  
                  {reg_check ? 
                      <div>
                      <p>You have registered .</p>
                      <br></br>
                      <Button  color="Primary" > Registered</Button>
                      &nbsp;
                      {play_check ? 
                        <div>
                          <br></br>
                          <p>You have already participated , check your score on the users profile page</p>   
                          <br></br>  
                        </div>    
                        :   
                         <Link to={{pathname:"/home/"+quiz_data.slug }}  >
                         <Button type="button">
                             Play Quiz
                         </Button>
                       </Link> 
                             
                      }
                      
                      </div> : 
                      <Button  color="Danger" onClick = {this.register}> Register</Button> 
                  }

                  
                </Col>
              </Row>
              <br />
            
             
            </Container>
          </div>
          <DemoFooter />
                      </>
        );






}
  
}

export default withAuth(QuizInfo);
