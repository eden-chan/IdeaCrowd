import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({component: Component, authenticated, ...rest}) => {
    return (

        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={props => (
            authenticated === true ?
                <Component {...props} />
            : <Redirect to='/signin' />
        )} />
    );
};

export default PrivateRoute;