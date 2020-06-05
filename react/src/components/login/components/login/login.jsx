import React from "react";
import loginImg from "../../images/welcome.svg";
import AuthService from '../../../AuthService';


export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange=this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.Auth=new AuthService();
  
    
  }
  componentWillMount(){
    if(this.Auth.loggedIn())
        this.props.value.history.replace('/')
}

handleFormSubmit(e){
    e.preventDefault();
    this.Auth.login(this.state.username,this.state.password)
    .then(res=>{
        // console.log('response from auth')
        // console.log(res.sucesss)
        if (res.sucesss){
           // console.log("SUCESSSS IN AUTHHHHHHHHHHHHHHHHHHHHHHHHHHH")
           this.props.value.history.replace('/');
        }
        else {
            // console.log(res.detail.detail)
            alert(res.detail.detail)
        }
    })
 }
    handleChange(e){
        this.setState(
            {
                [e.target.name]:e.target.value
            }
        )
    }
   
  render() {
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Login</div>
        <form onSubmit = {this.handleFormSubmit}>
        <div className="content">
          <div className="image">
            <img src={loginImg} />
          </div>
        
          <div className="form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" name="username" placeholder="username" required  onChange={this.handleChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" placeholder="password" required  onChange={this.handleChange}  required/>
            </div>
          </div>
        </div>
        <div className="footer">
          <button type="submit" className="btn"  >
            Login
          </button>
        </div>
        </form>
      </div>
    );
  }
}



