import React, { Component } from 'react';
import { Input, Button } from 'antd';
import Loader from '../../components/Loader';
import CustomInput from '../../components/CustomInput';
import firebase from '../../utils/firebase-database';
import './index.scss';
import "antd/dist/antd.css";

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            words: [],
            advanced_words: []
        }
    }

    componentDidMount() {
        const wordRef = firebase.app().database().ref('users/vikramk9852');
        wordRef.once('value').then(snapshot => {
            let data = snapshot.val();
            console.log(data);
        }).catch(err => {
            console.log(err)
        })
    }

    // logIn=()=>{
    //     let email = this.state.email;
    //     let password = this.state.password;
    // }

    // setInput=(e, purpose)=>{
    //     this.setState({[purpose]: e.target.value});
    // }

    updateData = () => {

        var postData = {
            data: "this is clipboard data of new user"
        }

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/users/newUser'] = postData;

        return firebase.app().database().ref().update(updates);

    }

    render() {
        return (
            <div className="login">
                <Button onClick={this.updateData}>Update</Button>
            </div>
        )
    }
}

export default Login;
