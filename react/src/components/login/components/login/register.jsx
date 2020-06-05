import React from "react";
import loginImg from "../../images/welcome.svg";
import AuthService from '../../../AuthService';


export class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {"branch":"CSE","year":"1"},
      errors: {}
    }
    this.handleChange = this.handleChange.bind(this);
    this.submituserRegistrationForm = this.submituserRegistrationForm.bind(this);
    this.handleselect = this.handleselect.bind(this)
    this.handleselect2 = this.handleselect2.bind(this)
    this.Auth=new AuthService();
  
  }

  handleselect2(e) {
    // console.log("select")
    let fields = this.state.fields;
    let dataset = e.target.value;
    // console.log(dataset)
    fields["year"] = dataset;
    // console.log(dataset)
    this.setState({
      fields
    });
    // console.log(fields)
  }

  handleselect(e) {
    // console.log("select")
    let fields = this.state.fields;
    let dataset = e.target.value;
    // console.log(dataset)
    fields["branch"] = dataset;
    // console.log(dataset)
    this.setState({
      fields
    });
    // console.log(fields)
  }

  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields
    });
    // // console.log(fields)

  }

  submituserRegistrationForm(e) {
    e.preventDefault();
    if (this.validateForm()) {
      
        // // console.log(fields)
        alert("form submitted")
        this.Senddata()

    }

  }

  Senddata(){
      let fields = this.state.fields
      fetch("http://127.0.0.1:8000/site_users/register/",{
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
            name : fields.fullname,
            email : fields.email,
            username : fields.username,
            password : fields.password,
            year : fields.year,
            usn : fields.usn,
            branch : fields.branch

        })
    })
    .then(response => response.json())
    .then(result => {
      // // console.log("Seen Response")
         // // console.log("RESPONSEEEEEE")
         // console.log(result)
          if(result.detail)
            alert(result.detail)
          else{
           //   console.log(fields.username)
          //    console.log("ELSEEEEEEEEEEEEEe")
           //   console.log(this.props)
              this.Auth.login(fields.username,fields.password)
              .then(res=>{
                //  console.log('response from auth')
               //   console.log(res.sucesss)
                  if (res.sucesss){
                    console.log("SUCESSSS IN AUTHHHHHHHHHHHHHHHHHHHHHHHHHHH")
                    this.props.value.history.replace('/');
                  }
                  else {
                     // console.log(res.detail.detail)
                      alert(res.detail.detail)
                  }
              })
          }
    })
    .catch( e=>{console.log("Server error " +String(e))})
  }



  validateForm() {

    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    
    // console.log("validate form")
    // console.log(this.state.fields)
    if (!fields["username"]) {
      formIsValid = false;
      errors["username"] = "*Please enter your username.";
    }

    if (typeof fields["username"] !== "undefined") {
      if (!fields["username"].match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors["username"] = "*Please enter alphabet characters only.";
      }
    }
    if (!fields["fullname"]) {
      formIsValid = false;
      errors["fullname"] = "*Please enter your username.";
    }

    if (typeof fields["fullname"] !== "undefined") {
      if (!fields["fullname"].match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors["fullname"] = "*Please enter alphabet characters only.";
      }
    }

    if (!fields["email"]) {
      formIsValid = false;
      errors["email"] = "*Please enter your email-ID.";
    }

    if (typeof fields["email"] !== "undefined") {
      //regular expression for email validation
      var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if (!pattern.test(fields["email"])) {
        formIsValid = false;
        errors["email"] = "*Please enter valid email-ID.";
      }
    }

    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = "*Please enter your password.";
    }

    if (typeof fields["password"] !== "undefined") {
      // console.log("bool ")
      // console.log(fields["password"].length<8)
      // console.log(!fields["password"].match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/) && fields["password"].length>=8)
      if (!fields["password"].match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/) || fields["password"].length<8 ) {
          formIsValid = false;
          errors["password"] = "*Please enter a min 8 char password containing at least one  of each upper case , lower case, special and number";
      }
    }

    this.setState({
      errors: errors
    });
    return formIsValid;


  }


   
    

  render() {
    // console.log("PROPSSSSSSSSSSSSSSSSSSSSSSSSSSSS")
    // console.log(this.props)
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Register</div>
        <form onSubmit= {this.submituserRegistrationForm}>
        <div className="content">
          <div className="image">
            <img src={loginImg} />
          </div>
          
          <div className="form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" name="username" placeholder="username" value={this.state.fields.username} onChange={this.handleChange} />
              {this.state.errors.username}
            </div>
            <div className="form-group">
              <label htmlFor="fullname">Full name</label>
              <input type="text" name="fullname" placeholder="Fullname" value={this.state.fields.fullname} onChange={this.handleChange} />
              {this.state.errors.username}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="text" name="email" placeholder="email"  value={this.state.fields.email} onChange={this.handleChange} />
              {this.state.errors.email}
            </div>
            <div className="form-group">
              <label htmlFor="usn">USN</label>
              <input type="text" name="usn" placeholder=" Ex: 4PM16CS001" value={this.state.fields.usn} onChange={this.handleChange}  required />
              {this.state.errors.usn}
            </div>

            <div className="form-group">
            <label htmlFor="branch">Year</label>
            </div>
            <select className="form-group" onChange={this.handleselect2}  required>
            <option value= "1" >1st year</option>
            <option value= "2">2nd year</option>
            <option value= "3">3rd year</option>
            <option value= "4">4th year</option>
            </select>

            <div className="form-group">
            <label htmlFor="branch">Branch</label>
            </div>
            <select className="form-group" onChange={this.handleselect}  required>
            <option value="CSE">CSE</option>
            <option value="ISE">ISE</option>
            <option value="EEE">EEE</option>
            <option value="ECE">ECE</option>
            <option value="MCE">MCE</option>

            </select>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="text" name="password" placeholder="password" value={this.state.fields.password} onChange={this.handleChange}  required />
              {this.state.errors.password}
            </div>
            
          </div>
        </div>
        <div className="footer">
          <button type="submit" className="btn" value="Register">
            Register
          </button>
        </div>
        </form>
      </div>
    );
  }
}