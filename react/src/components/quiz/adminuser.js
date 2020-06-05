


import "../../assets/css/bootstrap.min.css";
import "../../assets/scss/paper-kit.scss";
import "../../assets/demo/demo.css";
import React , {Component} from "react";

// reactstrap components
import {
  Button,
  Container,

} from "reactstrap";

// core components
import IndexNavbar from "../Navbars/IndexNavbar.js";
import CustomPageHeader from "../../components/Headers/custompageheader.js";
import DemoFooter from "../../components/Footers/DemoFooter.js";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import AuthService from '../../components/AuthService';
import withAuth from '../../components/withAuth.js'
  
const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);


  
  

  const auth = new  AuthService()


class AdminInfo extends Component {
 
    constructor(props){
        super(props)
        this.state ={
            isLoading : true,
            quizlist : null
        }
        
      this.downloadStats = this.downloadStats.bind(this)
     
    } 


 

  async  componentDidMount() {

        const token = sessionStorage.getItem("token")
        fetch("http://127.0.0.1:8000/views/results_quiz/",{
            method:'GET',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization':'Token ' + token,

            }})
        .then(response => response.json())
        .then(result => {
         
            if (result.detail === "Invalid token."){
                    auth.logout()
                    this.props.history.push('/login')
                }           
            else 
               this.setState({quizdata: result, isLoading: false})
        })
        .catch( e=>{console.log("Server error " +String(e))
                    auth.logout()
                    alert("come back later server error")
                    this.props.history.push('/login')})
      
       
  
  }

  
 
  
 
  
   useStyles = makeStyles({
    table: {
      minWidth: 700,
    },
  });









  downloadStats = (e) => {
    var saveAs = require('file-saver');
   
    //  console.log("mounted")
    const token = sessionStorage.getItem("token")
   
      fetch("http://127.0.0.1:8000/views/download_quiz/"+e,{
        method:'GET',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization':'Token ' + token,

        }})
        .then(response => response.blob())
        .then(blob => saveAs(blob, e+'.csv'))
        .catch( e=>{console.log("Server error " +String(e))
        auth.logout()
        alert("come back later server error")
        this.props.history.push('/login')})
   
      
       
  }



  





render(){
  
 
  const classes = this.useStyles;
  if (this.state.isLoading){

    return (
      <div className="section profile-content">
    <IndexNavbar />
    <CustomPageHeader />
    <h2>Loading</h2>    <DemoFooter />
    </div>
    )
  }

  else {    

    const quizdata  = this.state.quizdata
   
    const fill_quiz = quizdata.data.map(event => event)
    const count =  fill_quiz.map(item => item.length)
  
    
    return (
        
      <>
        
        <IndexNavbar />
        <CustomPageHeader/>
        <div className="section profile-content">
          <Container>
            <div className="owner">
             
              <div className="name">
                <h4 className="title">
                 Events List<br />
                </h4>
              </div>
            </div>
           
            <br />
            
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="customized table">
                  <TableHead>
                  <TableRow>
                      <StyledTableCell>Event</StyledTableCell>
                      <StyledTableCell align="right">Participants completed</StyledTableCell>
                      <StyledTableCell align="right">Donwload Stats</StyledTableCell>
                      
                  </TableRow>
                  </TableHead>
                  <TableBody>
                  {fill_quiz.map(function(d,idx) { return(
                      <>
                        <StyledTableRow key={d[0].slug}> 
                         
                            <StyledTableCell component="th" scope="row">
                            {d[0].quiz_name}  
                            </StyledTableCell>
                            <StyledTableCell align="right">{count[idx]-1}</StyledTableCell>
                            <StyledTableCell align="right"><Button onClick = {() => this.downloadStats(d[0].slug)}>Download</Button></StyledTableCell>
                         
                        </StyledTableRow>
                        </>
                  )},this)}
                  </TableBody>
              </Table>
              </TableContainer>
          
           
          </Container>
        </div>
        <DemoFooter />
                    </>
      );
    

  }





  }
  
}

export default withAuth(AdminInfo);
