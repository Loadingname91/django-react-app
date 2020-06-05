import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

//{} indicate thy are named exports

//import AuthService from './components/AuthService';

import withAuth from '../../components/withAuth.js'
//const Auth = new AuthService();
//style
import '../../index.css';
import'../../styles/styles.scss';
import '../../../node_modules/@mdi/font/css/materialdesignicons.min.css';
import '../../../node_modules/materialize-css/dist/css/materialize.min.css';
import '../../../node_modules/materialize-css/dist/js/materialize.min.js';

import IndexNavbar from "../Navbars/IndexNavbar.js";




function QuizInstructions (props) {
    //console.log("INSTRUCTIONSSSSSSSSSss")
    //console.log(props)
    const val  = window.location.pathname
    let url =  val.substr(val.lastIndexOf('/')+1)
return(
        
   
    
    
    <Fragment>
        
    <div className="page-background" >
    
        <IndexNavbar/>

        <section id = "instruction" > 

            
                <h1 >How to play this quiz</h1>
               
                <img   src = {require("../../assets/img/optionhandling2.JPG")} style ={{width:"100%", paddingBottom :"14px" }} ></img>
            
                <ul>
                   
                    <li>1.Each Question is highlighted <span style = {{fontWeight:"bold" ,color : "lightgreen"}}>'green'</span> after selection.</li>
                    <li>2.Select the approppriate option .</li>
                    <li>3.IMPORTANT  <span style = {{fontWeight:"bold" , color : "orange"}}>Selecting the last option will submit the quiz automatically.</span> </li>
                    <li>4.Each of your answer will be saved after selection .</li>
                    <li>5.You can come back and resume the test even after you disconnect or close the page .</li>
                    <li>6.But the <span style = {{fontWeight:"bold" , color : "red"}}>timer</span> will  
                                <span style = {{fontWeight:"bold" , color : "red"}}> continue</span> in the website.
                    </li>
                </ul>
            
            
            
                
            <span className = "left "><Link className = "next-button" to = "/">No, take me back</Link></span>
            <span className = "right "><Link className = "next-button"  to = {"/play/quiz/" + url} >Okay, Let's begin</Link></span>
        </section>
       
    </div>
    </Fragment>
 )
}

export default withAuth(QuizInstructions);