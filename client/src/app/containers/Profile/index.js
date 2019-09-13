import React, { Component } from 'react';
import { Input, Icon, Row, Col, Button } from 'antd';
import axios from 'axios';
import Loader from '../../components/Loader';
import './index.scss';
import "antd/dist/antd.css";
const { TextArea } = Input;

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            mouseEnter: false
        }
    }

    render() {
        return (
            <div className="profile">
                {this.state.showLoader ? <Loader />
                    :
                    <div>
                        <div className="profile__profile_photo">
                            {this.state.mouseEnter && <Icon className="profile__profile_photo__upload__icon" type="upload"/>}
                            <img onMouseEnter={() => { this.setState({ mouseEnter: true }) }} onMouseLeave={() => { this.setState({ mouseEnter: false }) }} className="profile__profile_photo__image" align="center" height="200px" width="200px" src="http://www.cndajin.com/data/wls/193/17688428.jpg" />
                        </div>
                        <p className="ql-size-large">Profile Details</p>
                        <div className="profile__input">
                            <p className="profile__input__tag">Publishing name</p>
                            <Input style={{ height: "50px" }} onChange={(e) => { this.setState({ profileName: e.target.value }) }} />
                            <div style={{ margin: "20px 0" }}>
                                <p className="profile__input__tag">Tell something about yourself</p>
                                <TextArea
                                    onChange={(e) => { this.setState({ description: e.target.value }) }}
                                    autosize={{ minRows: 3, maxRows: 5 }}
                                />
                            </div>
                            <p className="profile__input__tag">Your Email</p>
                            <Input style={{ height: "50px" }} onChange={(e) => { this.setState({ email: e.target.value }) }} />
                            <Button className="profile__update_button">Update</Button>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default Profile;
