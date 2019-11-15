import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Icon, Row, Col } from 'antd';
import Menu from '../CustomDropDown';
import './index.scss';
import axios from 'axios';
const paths = ["editor?new", "stories", "profile", "login"];

class Header extends Component {

    handleClick = (key) => {
        console.log(key)
        debugger;
        if (Number(key) === 3) {
            let userId = localStorage.getItem('userId');
            let url = `api/updateUser/${userId}`;
            let postData = {
                logged_in: false
            }
            axios.post(url, postData).then(res => {
                console.log("logged out", res);
            }).catch(err => {
                console.log("error in logging out", err);
            })
        }
        this.props.history.push(`/${paths[key]}`);
    }

    render() {
        return (
            <div className="header">
                <Row className="header__content">
                    <Col span={12}>
                        <div className=""><Icon type="user" /></div>
                    </Col>
                    <Col span={12} align="right">
                        <div className="header__profileIcon">
                            <Menu
                                handleClick={this.handleClick}
                                menuItem={["New Story", "Stories", "Profile", "Logout"]}
                                menuHolder="icon"
                                iconType="setting"
                                iconSize="20px"
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default withRouter(Header);