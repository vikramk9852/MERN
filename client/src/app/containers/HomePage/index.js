import React, { Component } from 'react';
import { Button, Row, Col, Icon } from 'antd';
import CreateAccount from '../../../app/components/CreateAccount'
import AddData from '../../../app/components/AddData'
import RetrieveData from '../../../app/components/RetrieveData'
import axios from 'axios';
import './index.scss';
import "antd/dist/antd.css";

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            initial: true,
            createAccount: false,
            addData: false,
            retrieveData: false,
            headerText: "Welcome to Blockchain"
        }
        this.initialState = this.state;
    }

    handleCreateAccount = () => {
        this.setState({ initial: false, createAccount: true, headerText: "Create account on Blockchain" });

        const newTodo = {
            todo_description: "this.state.todo_description",
            todo_responsible: "this.state.todo_responsible",
            todo_priority: "this.state.todo_priority",
            todo_completed: true
        };

        axios.post('/api/add', newTodo).then(res => console.log(res.data)).catch(console.log)

    }

    handleAddData = () => {
        this.setState({ initial: false, addData: true, headerText: "Add data to Blockchain" });
        axios.get('/api/getTodo').then(res => console.log(res.data)).catch(console.log)

    }

    handleRetrieveData = () => {
        this.setState({ initial: false, retrieveData: true, headerText: "Retreive data from Blockchain" });
    }

    handleCancelButton = () => {
        this.setState(this.initialState);
    }

    render() {
        return (
            <div className="buttons" align="center">
                <p className="headerText">{this.state.headerText}</p>
                {
                    this.state.initial &&
                    <Row gutter={24}>
                        <Col xs={24} sm={24} lg={8} xl={8} md={8} style={{ padding: "1rem" }} align="center">
                            <Button block="true" onClick={() => this.handleCreateAccount()} icon="user-add">Create Account</Button>
                        </Col>
                        <Col xs={24} sm={24} lg={8} xl={8} md={8} style={{ padding: "1rem" }} align="center" >
                            <Button block="true" onClick={this.handleAddData} icon="upload">Add Data</Button>
                        </Col>
                        <Col xs={24} sm={24} lg={8} xl={8} md={8} style={{ padding: "1rem" }} align="center" >
                            <Button block="true" onClick={this.handleRetrieveData} icon="download">Retrieve Data</Button>
                        </Col>
                    </Row>
                }
                {
                    this.state.createAccount &&
                    <Row>
                        <CreateAccount initialState={this.handleCancelButton} />
                    </Row>
                }
                {
                    this.state.addData &&
                    <Row>
                        <AddData initialState={this.handleCancelButton} />
                    </Row>
                }
                {
                    this.state.retrieveData &&
                    <Row>
                        <RetrieveData initialState={this.handleCancelButton} />
                    </Row>
                }
            </div>
        )
    }
}

export default HomePage;
