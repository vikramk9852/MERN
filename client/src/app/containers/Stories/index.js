import React, { Component } from 'react';
import { Row, Col, Menu, message, Modal } from 'antd';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import Loader from '../../components/Loader';
import CustomMenu from '../../components/CustomDropDown';
import './index.scss';
import "antd/dist/antd.css";
import { Button } from 'antd/lib/radio';

class Stories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            key: "0",
            showLoader: true,
            allStories: [],
            current: "Published"
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        axios.get(`/api/getAllBlogs`).then(res => {
            let stories = res.data.reverse(), publishedStories = [], draftStories = [];
            for (let i = 0; i < stories.length; i++) {
                if (stories[i].blog_state === "draft") {
                    draftStories.push(this.createStoryComponent(stories[i]));
                }
                else {
                    publishedStories.push(this.createStoryComponent(stories[i]));
                }
            }
            this.setState({
                publishedStories: publishedStories,
                draftStories: draftStories,
                allStories: publishedStories,
                current: "Published",
                showLoader: false
            })
        }).catch(err => {
            this.setState({ showLoader: false });
            console.log(err);
        })
    }

    createStoryComponent = (story) => {
        let text = "Story", archive = "Archive";
        if (story.blog_state === "draft") {
            text = "Draft";
            archive = "Publish";
        }

        let temp = document.createElement("div");
        temp.innerHTML = story.blog_data;
        let sanitized = temp.textContent || temp.innerText;
        return (
            <div className="stories__contents__story" key={story._id}>
                <b className="stories__contents__story__pointer" onClick={() => { this.props.history.push(`/story?${story._id}`) }}><span className="ql-size-large">{story.blog_title}</span></b>
                <p className="stories__contents__story__pointer" onClick={() => { this.props.history.push(`/story?${story._id}`) }}>{ReactHtmlParser(sanitized)}</p>
                <p><span style={{ marginRight: "10px" }}>Published on: {story.blog_publish_date}</span>
                    <span onClick={() => {
                        this.setState({ blogData: story })
                    }}>
                        <CustomMenu
                            handleClick={this.handleClick}
                            menuItem={[`Edit ${text}`, `Delete ${text}`, `${archive} ${text}`]}
                            menuHolder="icon"
                            iconType="down"
                            iconSize="13px"
                        />
                    </span>
                </p>
            </div>
        )
    }

    updateState = (postData) => {

        let publishedStories = this.state.publishedStories;
        let draftStories = this.state.draftStories;
        if (postData.blog_state === "draft") {
            for (let i = 0; i < publishedStories.length; i++) {
                if (publishedStories[i].key === postData._id) {
                    draftStories.push(publishedStories[i]);
                    publishedStories.splice(i, 1);
                    break;
                }
            }
        }
        else {
            for (let i = 0; i < draftStories.length; i++) {
                if (draftStories[i].key === postData._id) {
                    publishedStories.push(draftStories[i]);
                    draftStories.splice(i, 1);
                    break;
                }
            }
        }
        this.setState({ publishedStories: publishedStories, draftStories: draftStories });
    }

    deleteBlog = () => {
        this.setState({ showLoader: true }, () => {
            let postData = this.state.blogData;
            axios.post(`/api/deleteBlog/${postData._id}`).then(res => {
                message.success("Successfully deleted the story");
                this.fetchData();
                this.setState({ showLoader: false, showDeleteDialogue: false });
            }).catch(err => {
                message.err("Error in deleting the story");
                this.setState({ showLoader: false, showDeleteDialogue: false });
            })
        })
    }

    handleClick = (value) => {
        switch (value) {
            case "0":
                this.props.history.push(`/editor?update?${this.state.blogData._id}`)
            case "1":
                this.setState({ showDeleteDialogue: true })
                break;
            case "2":
                this.setState({ showLoader: true }, () => {
                    let postData = this.state.blogData;
                    if (postData.blog_state === "draft") {
                        postData.blog_state = "published"
                    }
                    else {
                        postData.blog_state = "draft";
                    }
                    axios.post(`/api/updateBlog/${postData._id}`, postData).then(res => {
                        this.fetchData();
                        message.success("Story Archieved successfully");
                        this.setState({ showLoader: false });
                    }).catch(err => {
                        message.error("Error in archiving the story");
                        this.setState({ showLoader: false });
                    })
                })
                break;
        }
    }

    switchTab = (e) => {
        if (e.key === "Published") {
            this.setState({ allStories: this.state.publishedStories, current: e.key });
        }
        else {
            this.setState({ allStories: this.state.draftStories, current: e.key });
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
                                <Button onClick={() => { this.props.history.push('/editor?new') }}>New Story</Button>
                            </Col>
                        </Row>
                        <Menu
                            onClick={this.switchTab}
                            selectedKeys={[this.state.current]}
                            mode="horizontal"
                        >
                            <Menu.Item key="Published">
                                {this.state.publishedStories.length ? `Published ${this.state.publishedStories.length}` : "No Stories"}
                            </Menu.Item>
                            <Menu.Item key="Drafts">
                                {this.state.draftStories.length ? `Drafts ${this.state.draftStories.length}` : "No Drafts"}
                            </Menu.Item>
                        </Menu>
                        {this.state.allStories}
                    </div>
                }
                <Modal
                    visible={this.state.showDeleteDialogue}
                    footer = {false}
                    onCancel={() => { this.setState({ showDeleteDialogue: false }) }}
                >
                    <div align="center">
                        <b><p className="ql-size-huge" style={{marginBottom: "0"}}>Delete</p></b>
                        <p style={{paddingTop: "8px", paddingBottom: "24px", marginBottom: "0"}}>Deleted stories are gone forever. Are you sure?</p>
                        <Button onClick={this.deleteBlog}>Delete</Button>
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        <Button onClick={() => { this.setState({ showDeleteDialogue: false }) }}>Cancel</Button>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Stories;
