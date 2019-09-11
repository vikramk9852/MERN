import React, { Component } from 'react';
import { Row, Col, Icon } from 'antd';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import Loader from '../../components/Loader';
import Menu from '../../components/Menu';
import './index.scss';
import "antd/dist/antd.css";
import { Button } from 'antd/lib/radio';

class Stories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            key: "0",
            showLoader: true,
            allStories: []
        }
    }

    componentDidMount() {
        axios.get(`/api/getAllBlogs`).then(res => {
            let stories = res.data.reverse(), allStories = [];
            for (let i = 0; i < stories.length; i++) {
                allStories.push(
                    <div className="stories__contents__story">
                        <b className="stories__contents__story__pointer" onClick={() => { this.props.history.push(`/story?${stories[i]._id}`) }}><span className="ql-size-large">{stories[i].blog_title}</span></b>
                        <p className="stories__contents__story__pointer" onClick={() => { this.props.history.push(`/story?${stories[i]._id}`) }}>{ReactHtmlParser(stories[i].blog_description)}</p>
                        <p><span style={{ marginRight: "10px" }}>Published on: {stories[i].blog_publish_date}</span>
                            <span onClick={()=>{
                                this.setState({storyId: stories[i]._id})
                            }}>
                                <Menu
                                    handleClick={this.handleClick}
                                    menuItem={["Edit Story", "Delete Story"]}
                                    menuHolder="icon"
                                    iconType="down"
                                    iconSize="13px"
                                />
                            </span>
                        </p>

                    </div>
                )
            }
            this.setState({
                allStories: allStories,
                showLoader: false
            })
        }).catch(err => {
            this.setState({ showLoader: false });
            console.log(err);
        })
    }

    handleClick = (value) => {
        switch (value) {
            case "0":
                this.props.history.push(`/editor?update?${this.state.storyId}`)
            case "1":
                console.log("delete", this.state.storyId);
        }
    }

    render() {
        return (
            <div className="stories">
                {this.state.showLoader ? <Loader />
                    :
                    <div className="stories__contents">
                        <Row className="stories__heading">
                            <Col span={12}>
                                <span className="ql-size-huge">Your Stories</span>
                            </Col>
                            <Col span={12} align="right">
                                <Button onClick={this.newStory}>New Story</Button>
                            </Col>
                        </Row>
                        {this.state.allStories}
                    </div>
                }
            </div>
        )
    }
}

export default Stories;
