import React from 'react';
// import { withRouter } from 'react-router';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import HomePage from '../containers/HomePage';
import Admin from '../containers/Admin';
import Editor from '../components/Editor';
import Story from '../components/Story';
import Header from '../components/Header';
import Stories from '../containers/Stories';
import Profile from '../containers/Profile';
import './index.scss';

const { Content, Footer, Sider } = Layout;

class Router extends React.Component {

	render() {
		return (
			<Layout className="layout">
				<Layout>
					<Content className="ui-container">
						<Header handleClick={this.handleClick} />

						<Switch>
							<Route exact path='/' component={HomePage} />
							<Route path='/editor' component={Editor} />
							<Route path='/admin' component={Admin} />
							<Route path='/story' component={Story} />
							<Route path='/stories' component={Stories} />
							<Route path='/profile' component={Profile} />
						</Switch >
					</Content>
				</Layout>
			</Layout>
		);
	}

}

export default withRouter(Router);

