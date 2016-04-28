import React from 'react';
import ReactDOM from 'react-dom';

import {Router, Route, useRouterHistory} from 'react-router';
import {createHashHistory} from 'history';

import IndexPage from './views/index';

import './styles/base.less';

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });
let routes = (
    <Router history={appHistory}>
        <Route path="/:label" component={IndexPage}></Route>
    </Router>
);

ReactDOM.render(routes, document.getElementById('app'));
