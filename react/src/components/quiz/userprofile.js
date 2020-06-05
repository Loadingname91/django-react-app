

import "../../assets/css/bootstrap.min.css";
import "../../assets/scss/paper-kit.scss";
import "../../assets/demo/demo.css";
import React , {Component} from "react";
import { Link } from 'react-router-dom';
import withAuth from '../../components/withAuth.js'
// reactstrap components
import {
  Button,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import IndexNavbar from "../Navbars/IndexNavbar.js";
import ProfilePageHeader from "../../components/Headers/ProfilePageHeader.js";
import DemoFooter from "../../components/Footers/DemoFooter.js";
import AuthService from "../../components/AuthService.js"

const auth = new AuthService()

class UserInfo extends Component {
 
    constructor(props){
        super(props)
        this.state ={
            isLoading : true,
            finish : false,
            activeTab : "1",
            loggedIn : true,
            userInfo : null,
            tokenInfo : null,
            userquiz : null
        }    

    this.toggle = this.toggle.bind(this)    

    }

    toggle = (tab) => {

       if(this.state.activeTab!==tab)
          this.setState({activeTab:tab}) 

    }


    componentDidMount(){

        if(!this.state.tokenInfo){
         //   console.log("HEREEEEEEEEEEEEE MOUNTEDDDDDDDDDDDDDDDDDDDDDDDDdd")
            const token = sessionStorage.getItem("token")
            const userprofile = sessionStorage.getItem("userprofile")
      //      console.log("TOKENEEEEEEEEEEE")
       //     console.log(token)
        //    console.log("User profilee")
        //    console.log(userprofile)

            if(token && userprofile){

                fetch("http://127.0.0.1:8000/views/my_quizzes/",{
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
                  //  console.log(result)
                    if(result.detail){
                      auth.logout()
                      this.props.history.push("/login")
                    }
                       
                    else 
                        this.setState({userInfo : JSON.parse(userprofile) , tokenInfo : token , userquiz : result , isLoading : false  , loggedIn :true})

                })
                .catch( e=>{console.log("Server error " +String(e))
                            auth.logout()
                            alert("come back later server error")
                            this.props.history.push('/login')})

            }

            else {
                this.setState({loggedIn:false })
            }



        }
        


    }
 


  





render(){
  
 // console.log("DATA ISSSSSSSSSSSSSSSSSSSSSSSSS HERER")
 // console.log(this.props.location)
 // console.log("LOGEED IN STATUS")
 // console.log(this.state.loggedIn)
  
  if (!this.state.loggedIn){
    this.props.history.push("/login")
  }


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

  //console.log("QUIZ DATA")
 // console.log(this.state.userquiz)
 // console.log("user profile")
 // console.log(this.state.userInfo)
  const user = this.state.userInfo
  const quiz = this.state.userquiz
  const quizcompleted = quiz.filter(item=> item.score != null)
  const quiznotcompleted = quiz.filter(item => item.score === null)
//  console.log("quiz list")
 // console.log(quizcompleted)
 // console.log(quiznotcompleted)
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
                    src={require("../../components/Cads/strom tropper.jpg")}
                  />
                </div>
                <div className="name">
                  <h4 className="title">
                    Username : {user.username}<br />
                  </h4>
                    <h6 className="description">User Details</h6>
                    <br></br>
                </div>
              </div>
              <Row>
                <Col className="ml-auto mr-auto " md="6">
                  
                  <p>
                      Name :   <span className ="right">{user.name} </span>    
                      <br></br><br></br>
                      Email :    <span className ="right"> {user.email} </span>     
                      <br></br><br></br>
                      Full name :    <span className ="right"> {user.name} </span>  
                      <br></br><br></br>
                      Usn :        <span className ="right"> {user.usn} </span>   
                      <br></br><br></br>
                      Exit Year :     <span className ="right">{user.year} </span>  
                      <br></br><br></br>
                      Branch :     <span className ="right">{user.branch} </span>     
                  </p>         
                  
                </Col>

              </Row>
             
              <br />


              <div className="nav-tabs-navigation">
            <div className="nav-tabs-wrapper">
              <Nav role="tablist" tabs>
                <NavItem>
                  <NavLink
                    className={this.state.activeTab === "1" ? "active" : ""}
                    onClick={() => {
                      this.toggle("1");
                    }}
                  >
                    Events completed
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={this.state.activeTab === "2" ? "active" : ""}
                    onClick={() => {
                      this.toggle("2");
                    }}
                  >
                    Events not completed
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
          </div>

             {/* Tab panes */}
          <TabContent className="following" activeTab={this.state.activeTab}>
            <TabPane tabId="1" id="follows">
              <Row>
                <Col className="ml-auto mr-auto" md="6">
                  <ul className="list-unstyled follows">
                  {quizcompleted.length ===0 ? <h3 className="text-muted">No quiz completed yet :(</h3> 
                    :
                    quizcompleted.map(function(d,idx){return (  
                        <div>
                        <li>
                        <Row>
                            <Col className="ml-auto mr-auto" lg="2" md="4" xs="4">
                            
                            </Col>
                            <Col className="ml-auto mr-auto" lg="7" md="4" xs="4">
                            <h6 style = {{color:"grey"}}>
                                {d.name}
                                <br></br>
                                <br></br>
                                <small>Score : {d.score}%</small>
                                <br></br>
                                
                            </h6>
                            </Col>
                            <Col className="ml-auto mr-auto" lg="3" md="4" >
                            <Link to={{pathname:"/info/"+d.slug }}  >
                                  <Button type="button">
                                      GOTO
                                  </Button>
                              </Link>
                            </Col>
                        </Row>
                        </li>
                        <hr />
                        </div>
                    )})
                    } 



                  }


                  </ul>
                </Col>
              </Row>
            </TabPane>
            <TabPane className="text-center" tabId="2" id="following">
            <Row>
                <Col className="ml-auto mr-auto" md="6">
                  <ul className="list-unstyled follows">
                  {quiznotcompleted.length ===0 ? <h3 className="text-muted">Done and dusted :)</h3> 
                    :
                    quiznotcompleted.map(function(d,idx){return (  
                        <div>
                        <li>
                        <Row>
                            <Col className="ml-auto mr-auto" lg="2" md="4" xs="4">
                            
                            </Col>
                            <Col className="ml-auto mr-auto" lg="7" md="4" xs="4">
                            <h6>
                                
                                <small>{d.name}</small>
                            </h6>
                            </Col>
                            <Col className="ml-auto mr-auto" lg="3" md="4" >
                              <Link to={{pathname:"/info/"+d.slug }}  >
                                  <Button type="button">
                                      GOTO
                                  </Button>
                              </Link>
                            </Col>
                        </Row>
                        </li>
                        <hr />
                        </div>
                    )})
                    } 



                  }


                  </ul>
                </Col>
              </Row>
            </TabPane>
          </TabContent>




            
             
            </Container>
          </div>
          <DemoFooter />
                      </>
        );






}
  
}

export default withAuth(UserInfo);
