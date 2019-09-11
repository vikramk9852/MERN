import React, { Component } from 'react';
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import './index.scss';
import { Input, Button, Select, Icon, Tooltip, Row, Col } from 'antd';
import ReactHtmlParser from 'react-html-parser';
import Loader from '../Loader';
import axios from 'axios';
const { Option } = Select;
const initialString = "<p><br></p>";

class Editor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editorHtml: initialString,
            theme: 'snow',
            selectedTag: 'lifestyle',
            showLoader: true,
            title: ""
        }
    }

    componentDidMount() {
        let url = this.props.location.search;
        let info = url.split('?');
        if (info[1] === "update") {
            axios.get(`/api/${info[2]}`).then(res => {
                let story = res.data;
                this.setState({
                    editorHtml: story.blog_data,
                    selectedTag: story.blog_category,
                    title: story.blog_title,
                    showLoader: false
                });
            }).catch(err => {
                console.log(err);
                this.setState({ showLoader: false });
            })
        }
        else{
            this.setState({showLoader: false});
        }
    }

    handleEditorTextChange = (html) => {
        this.setState({ editorHtml: html });
    }

    handleTagChange = (value) => {
        this.setState({ selectedTag: value });
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
                        />
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
                            onClick={() => {
                                this.props.returnBack(
                                    {
                                        blog_title: this.state.title,
                                        blog_data: this.state.editorHtml,
                                        blog_category: this.state.selectedTag,
                                    }, "draft")
                            }}
                        >
                            Draft
                </Button>

                        <Button
                            className="editor__button"
                            onClick={() => {
                                this.props.returnBack(
                                    {
                                        blog_title: this.state.title,
                                        blog_data: this.state.editorHtml,
                                        blog_category: this.state.selectedTag
                                    }, "post")
                            }}
                        >
                            Submit
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
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean'],
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    }
}

Editor.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
]

export default Editor;