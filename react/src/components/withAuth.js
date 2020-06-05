import React, { Component } from 'react';
import AuthService from './AuthService';
export default function withAuth(AuthComponent){
    const Auth=new AuthService('http://localhost:8000');//initiate authservice
    return class AuthWrapped extends Component{
        constructor() {
            super();
            this.state = {
                user: null,
                user_id : null,
                email:null,
                username : null,
                token : null
            }
            }
            componentWillMount() {
                if (!Auth.loggedIn()) {
                    console.log("you are not logged in ")
                    alert("please login first")
                    this.props.history.replace('/login')
                    
                }
                else {
                    try {
                        const profile =  JSON.parse(Auth.getUserprofile())
                        const token = Auth.getToken().toString()
                     //   console.log("PROFILEEEEEEEEEEEE HEWEWEWEWEWE")
                    //    console.log(profile)
                   //     console.log(token)
                        this.setState({
                            user: profile.name,
                            user_id:profile.id,
                            email:profile.email,
                            username:profile.username,
                            token : token
                        })
                    }
                    catch(err){
                        Auth.logout()
                    //    console.log(err)
                        alert("Please Enter you crendentials again")
                        this.props.history.replace('/login')
                    }
                }
            }
            render() {
              //  console.log("USERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
              //  console.log(this.state)
                if (this.state.user) {
                    
                    return (
                        <AuthComponent history={this.props.history} profile={this.state} />
                    //<AuthComponent {...this.props}{...this.state}/>
                        )
                }
                else {
                    return null
                }
            }
    }
    
    
}