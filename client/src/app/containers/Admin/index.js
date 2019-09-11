import React, { Component } from 'react';
import { Button, Row, Col, Icon, PageHeader, message } from 'antd';
import Menu from '../../components/Menu';
import axios from 'axios';
import Stories from '../Stories';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import './index.scss';
import "antd/dist/antd.css";

const heading = "First Story to be Published";
const contents = "There are many va of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.";

class Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            key: "0",
            showLoader: false,
            tabContent: "",
            allStories: []
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData=()=>{
        axios.get('/api/getAllBlogs').then(res => {
            this.setState({ showLoader: false, allStories: res.data.reverse(), key: "0" });
        }).catch(err => {
            this.setState({ showLoader: false });
        })
    }

    handleMenuClick = (key) => {
        this.renderContents(key);
    }

    openStory = (id, path) => {
        console.log(id);
    }

    returnBack = (value, options) => {
        this.setState({ showLoader: true }, () => {
            switch (options) {
                case "draft":
                    break;
                case "post":
                    let postData = value;
                    let today = new Date();
                    today = today.toDateString();
                    postData.blog_publish_date = today;
                    axios.post('/api/createBlog', postData).then(res => {
                        message.success("Successfully created blog");
                        this.fetchData();
                    }).catch(err => {
                        console.log(err);
                        message.error("Error in creating blog");
                        this.setState({ showLoader: false });
                    })
                    break;
                case "cancel":
                    this.setState({ key: "0", showLoader: false });
                    break;
            }
        })
    }

    renderContents = (key) => {
        switch (key) {
            case "0":
                this.props.history.push('/stories');
                // let story = [], allStories = this.state.allStories;;
                // for (let i = 0; i < allStories.length; i++) {
                //     story.push(<Stories data={{
                //         title: allStories[i].blog_title,
                //         contents: allStories[i].blog_data,
                //         id: allStories[i]._id,
                //         tag: allStories[i].blog_category,
                //         date: allStories[i].blog_publish_date
                //     }} />)
                // }
                // return story;
            case "1":
                this.props.history.push('/editor?new')
                // return <Editor title={"Enter title"} placeholder={'Write something'} returnBack={this.returnBack} />
            case "2":
                return <p>third</p>
            case "3":
                return <p>fourth</p>
        }
    }

    render() {
        return (
            <div className="admin">
                {this.state.showLoader ? <Loader />
                    :
                    <div>
                        <Header onClick={this.handleMenuClick} />
                    </div>
                }
                {/* <div className="admin__contents">{this.renderContents()}</div> */}
            </div>
        )
    }
}

export default Admin;
