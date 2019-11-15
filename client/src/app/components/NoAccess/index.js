import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import Loader from '../Loader';
import './index.scss';
import "antd/dist/antd.css";

class NoAccess extends Component {

    constructor(props){
        super(props);
        this.state={
            showDeleteDialogue: true
        }
    }

    render() {
        return (
            <div className="noaccess">
                <Modal
                    visible={this.state.showDeleteDialogue}
                    footer={false}
                    closable={false}
                >
                    <div align="center">
                        <b><p className="ql-size-large" style={{ marginBottom: "0" }}>You must be logged in to view this page</p></b>
                        <Button onClick={this.deleteBlog}>Delete</Button>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default NoAccess;
