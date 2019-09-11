import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Icon, Row, Col } from 'antd';
import Menu from '../Menu';
import './index.scss';
const paths = ["editor?new", "stories", "profile", "logout"];

class Header extends Component {

    handleClick=(key)=>{
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
                                iconType="pause-circle"
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