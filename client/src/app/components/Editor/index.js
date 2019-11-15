import React, { Component } from 'react';
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import './index.scss';
import { Input, Button, Select, Icon, Tooltip, Row, Col, message } from 'antd';
import ReactHtmlParser from 'react-html-parser';
import Loader from '../Loader';
import axios from 'axios';
import Utils from '../../utils/utils';
const { Option } = Select;
const initialString = "<p><br></p>";

function imageHandler(image, callback) {
    var range = Editor.quillRef.getEditor().getSelection();
    var value = prompt('What is the image URL');
    if (value) {
        Editor.quillRef.getEditor().insertEmbed(range.index, 'image', value, "user");
    }
}

class Editor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editorHtml: initialString,
            theme: 'snow',
            selectedTag: 'lifestyle',
            showLoader: true,
            title: "",
            draftText: "Draft",
            submitText: "Submit"
        }
    }

    componentDidMount() {
        let url = this.props.location.search;
        let info = url.split('?');
        this.storyId = info[2];
        if (info[1] === "update") {
            axios.get(`/api/${info[2]}`).then(res => {
                let story = res.data;
                this.setState({
                    editorHtml: story.blog_data,
                    selectedTag: story.blog_category,
                    title: story.blog_title,
                    publishDate: story.blog_publish_date,
                    showLoader: false,
                    draftText: "Archive",
                    submitText: "Update"
                });
            }).catch(err => {
                console.log(err);
                this.setState({ showLoader: false });
            })
        }
        else {
            this.setState({ showLoader: false });
        }
    }

    handleEditorTextChange = (html) => {
        console.log(Editor.quillRef)
        this.setState({ editorHtml: html });
    }

    handleTagChange = (value) => {
        this.setState({ selectedTag: value });
    }

    handleSubmit = (action) => {
        this.setState({ showLoader: true }, () => {
            let publishDate = this.state.publishDate;
            let url = `api/updateBlog/${this.storyId}`;
            let errorMessage = "Error in updating Story";
            let successMessage = "Successfully updated the Story";

            if (this.state.submitText === "Submit") {
                publishDate = new Date();
                publishDate = publishDate.toDateString();
                url = "/api/createBlog";
                errorMessage = "Error in Publishing Story";
                successMessage = "Succesfully published the Story"
            }

            let postData = {
                blog_title: this.state.title,
                blog_category: this.state.selectedTag,
                blog_data: this.state.editorHtml,
                blog_publish_date: publishDate,
                blog_state: action
            }

            if (this.state.submitText === "Submit") {
                postData.blog_writer = Utils.getFromLocalStorage('userId');
            }

            axios.post(url, postData).then(res => {
                message.success(successMessage);
                this.props.history.goBack();
            }).catch(err => {
                message.error(errorMessage)
                this.setState({ showLoader: false });
            })
        })

    }

    render() {
        return (
            <div>
                {this.state.showLoader ? <Loader /> :
                    <div className="editor">
                        <div align="center">
                            <Tooltip title="cancel">
                                <Icon onClick={() => { this.props.history.goBack() }} className="editor__close__icon" type="close-circle" theme="filled" />
                            </Tooltip>
                        </div>
                        <div className="editor__title">
                            <Input value={this.state.title} placeholder="Title of story" onChange={(e) => { this.setState({ title: e.target.value }) }} />
                        </div>
                        <ReactQuill
                            theme={this.state.theme}
                            onChange={this.handleEditorTextChange}
                            modules={Editor.modules}
                            formats={Editor.formats}
                            bounds={'.editor'}
                            placeholder="Start writing something"
                            defaultValue={this.state.editorHtml}
                            ref={(el) => Editor.quillRef = el} />
                        <div className="editor__select__tag">
                            <Select defaultValue={this.state.selectedTag} placeholder="Select Tag for this story" style={{ width: 200 }} onChange={this.handleTagChange}>
                                <Option value="lifestyle">LifeStyle</Option>
                                <Option value="beauty">Beauty</Option>
                                <Option value="travel">Travel</Option>
                            </Select>
                        </div>
                        <Button
                            className="editor__button"
                            style={{ marginRight: "20px" }}
                            onClick={() => { this.handleSubmit("draft") }}
                        >
                            {this.state.draftText}
                        </Button>

                        <Button
                            className="editor__button"
                            onClick={() => { this.handleSubmit("publish") }}
                        >
                            {this.state.submitText}
                        </Button>
                        {this.state.editorHtml != initialString &&
                            <Row>
                                <Col>
                                    <p className="ql-size-large">Preview:</p>
                                    <span className="ql-size-title">{this.state.title}</span>
                                    <div className="editor__preview">{ReactHtmlParser(this.state.editorHtml)}
                                    </div>
                                </Col>
                            </Row>
                        }
                    </div>
                }
            </div>
        )
    }
}

Editor.modules = {
    // formula: true,
    toolbar: {
        container: [
            [{ 'font': [] }, { size: ['huge', 'large', 'small'] }],
            ['bold', 'italic', 'underline', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' },
            { 'indent': '-1' }, { 'indent': '+1' }, {'align': []}],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image'],
            ['clean']],
        handlers: {
            'image': imageHandler
        }
    }
    // toolbar: [
    //     [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    //     [{ size: ['large', 'huge', 'small', 'normal'] }],
    //     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    //     [{ 'list': 'ordered' }, { 'list': 'bullet' },
    //     { 'indent': '-1' }, { 'indent': '+1' }],
    //     ['link', 'image', 'video'],
    //     [{ 'color': [] }, { 'background': [] }],
    //     [{ 'align': [] }],
    //     ['clean']
    // ],
    // clipboard: {
    //     // toggle to add extra line breaks when pasting HTML:
    //     matchVisual: false,
    // },
    // handlers: {
    //     'image': imageHandler
    // }
}

Editor.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'color', 'background', 'align',
    'link', 'image', 'video'
]

// Editor.imageHandler = imageHandler;
export default Editor;