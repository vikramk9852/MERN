import React from 'react';
// import { withRouter } from 'react-router';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import HomePage from '../containers/HomePage';
import Admin from '../containers/Admin';
import Editor from '../components/Editor';
import Story from '../components/Story';
import Header from '../components/Header';
import NoAccess from '../components/NoAccess';
import Stories from '../containers/Stories';
import Profile from '../containers/Profile';
import SignIn from '../containers/Signup';
import Login from '../containers/Login';
import axios from 'axios';
import './index.scss';
import Loader from '../components/Loader';
const adminPath = ['/profile', '/editor', '/stories'];

const { Content, Footer, Sider } = Layout;

class Router extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false,
			noAccess: false,
			showLoader: true
		}
	}

	componentWillMount() {
		this.setState({ showLoader: true }, () => {
			this.isLoggedIn();
		})
	}

	componentWillReceiveProps() {
		this.isLoggedIn();
	}

	restrictAccess = () => {
		let url = this.props.location.pathname;
		if (adminPath.includes(url)) {
			this.setState({ noAccess: true, showLoader: false });
		}
	}

	isLoggedIn = () => {
		let userId = localStorage.getItem("userId");
		axios.get(`/api/users/${userId}`).then(user => {
			debugger;
			user = user.data;
			if (!user.logged_in) {
				this.restrictAccess();
			}
			this.setState({ loggedIn: user.logged_in, showLoader: false });
		}).catch(err => {
			this.setState({ loggedIn: false, showLoader: false });
		})
	}

	render() {

		return (
			<Layout className="layout">
				<Layout>
					{this.state.showLoader ?
						<Loader />
						:
						<Content className="ui-container">
							<div style={{marginBottom: "9rem"}}>{this.state.loggedIn && <Header handleClick={this.handleClick} />}</div>

							{this.state.noAccess &&
								<NoAccess />}
							<Switch>
								<Route exact path='/' component={HomePage} />
								<Route path='/editor' component={Editor} />
								<Route path='/admin' component={Admin} />
								<Route path='/story' component={Story} />
								<Route path='/stories' component={Stories} />
								<Route path='/profile' component={Profile} />
								<Route path='/signin' component={SignIn} />
								<Route path='/login' component={Login} />
							</Switch >
						</Content>
					}
				</Layout>
			</Layout>
		);
	}

}

export default withRouter(Router);

