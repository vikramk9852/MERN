import React, { Component } from 'react';
import { Row, Col } from 'antd';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import Loader from '../../components/Loader';
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
                        <b><span className="ql-size-large">{stories[i].blog_title}</span></b>
                        <p>{ReactHtmlParser(stories[i].blog_description)}</p>
                        <p></p>
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

    render() {
        console.log(this.state.allStories)
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
