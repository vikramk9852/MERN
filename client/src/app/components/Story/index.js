import React, { Component } from 'react';
import { Icon } from 'antd';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import Loader from '../Loader';
import './index.scss';
import "antd/dist/antd.css";

class Story extends Component {

    constructor(props) {
        super(props);
        this.state = {
            key: "0",
            showLoader: true
        }
    }

    componentDidMount() {
        let url = this.props.location.search;
        let storyId = url.split('?')[1];
        axios.get(`/api/${storyId}`).then(res => {
            let storyData = res.data;
            this.setState({
                title: storyData.blog_title,
                content: storyData.blog_data,
                storyId: storyId,
                showLoader: false
            })
        }).catch(err => {
            console.log(err);
        })
    }

    render() {
        return (
            <div className="story">
                {this.state.showLoader ? <Loader />
                    :
                    <div>
                        <p className="ql-size-title" align="center">{this.state.title}</p>
                        <div>{ReactHtmlParser(this.state.content)}</div>
                    </div>
                }
            </div>
        )
    }
}

export default Story;
