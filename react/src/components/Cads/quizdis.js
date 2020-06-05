import React, { Component , Fragment } from 'react';
import { Link } from 'react-router-dom';

//{} indicate thy are named exports
import isEmpty from '../../utils/is-empty';


import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Grid from '@material-ui/core/Grid';


import './card-style.css'


import AuthService from '../../components/AuthService';




const auth = new  AuthService()

class QuizDisplay extends Component {

    constructor (props) {
       
       super(props);
       this.state = {
            isloading : true,
            quizdata : null,
            nodata : false

       };
       this.redirect_page = this.redirect_page.bind(this)

    }

    async componentDidMount() {
        if(isEmpty(this.state.quizdata)){
            console.log("QUIZ LIST DATA FETCHED")
            fetch("http://127.0.0.1:8000/views/all_quizzes/",{
                method:'GET',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json',
                    'Authorization':'Token ' + this.props.props.profile.token,
    
                }})
            .then(response => response.json())
            .then(result => {
             //   console.log(result)
                if (result.detail){
                    if (result.detail === "Invalid token."){
                        auth.logout()
                        this.props.props.history.push('/login')
                    }
                    else  
                        this.setState({nodata : true,isloading:false})
                }
                else 
                        this.setState({quizdata: result, isloading: false})
            })
            .catch( e=>{console.log("Server error " +String(e))})
        }     
       
    }


    redirect_page(){
         this.props.props.history.push('/info')
    }









    render(){
      //  console.log(isEmpty(this.state.quizdata))
       // console.log("PROPS DATA HEREREEEEEEEEEEEEEEE")
       // console.log(this.props)
      //  console.log("QUIZ DATAA IS HERER")
       // console.log(this.state.quizdata)
        if (this.state.isloading) {
            return (
                <Fragment>
                     
                    <h2>Loading</h2>
                </Fragment>
            )
        }
        if (this.state.nodata){
            return (
                <Fragment>
                            <center><h2>Quiz List</h2></center>
                    <center>
                    <h4>No Quizzes yet come back later :)</h4>
                    </center>

                </Fragment>
            )
        }
        else {
            const data = this.state.quizdata
                    return(
                    
                        <Fragment>
                         
                            <center><h2 style={{position:"relative",color:"white",padding:"0",backgroundImage:"linear-gradient(-20deg,black 0%,white 100%)",backgroundAttachment:"fixed",backgroundSize:"100%"}}>Quiz List</h2></center>

                            <div  className = "back">
              
                            <Grid container spacing={24} alignItems = "stretch">
                               
                                   
                                        {data.map(function(d,idx){return (
                                             <Grid item md={3} style = {{paddingLeft : '30px'}} >
                                             <Card style={{ width: '20rem',borderRadius:"8%",marginTop:"25px"}}>
                                            <Card.Img  src={require('./quiz.jpg')} style={{height:"250px",width:"300px"}} />
                                            <Card.Body style ={{   display: 'block',width: '250px', height: '400px'}}>
                                                <Card.Title>{d.name}</Card.Title>
                                                <br></br>
                                                <Card.Text style = {{height:"40%"}}>
                                              
                                                            {d.description}
                                                </Card.Text>
                                                <ListGroup  >
                                                <ListGroup.Item>No of Questions : {d.questions_count}</ListGroup.Item>
                                                <ListGroup.Item>Time Alloted : 60 mins</ListGroup.Item>
                                                </ListGroup>
                                                <center>
                                                    <br></br>
                                                    <Link to={{pathname:"/info/"+d.slug }}  >
                                                        <Button type="button">
                                                            Read More
                                                        </Button>
                                                    </Link>
                                                </center>
                                            </Card.Body>
                                            </Card>
                                            </Grid>    
                                        )})}
                                       
                                   
                               


                            
                            </Grid>
                            </div>

                        </Fragment>
                        )

            }
    }
    

    

}

export default QuizDisplay;