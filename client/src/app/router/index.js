import React from 'react';
import { withRouter } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import HomePage from '../containers/HomePage';
import './index.scss';

const { Header, Content, Footer, Sider } = Layout;

class Router extends React.Component {

	render() {
		return (
			<Layout className="layout">
				<Layout>
					<Content className="ui-container">
                        <Switch>
                            <Route exact path='/' component={HomePage} />
                        </Switch >
					</Content>
				</Layout>
			</Layout>
		);
	}

}

export default withRouter(Router);

