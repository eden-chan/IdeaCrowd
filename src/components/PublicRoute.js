import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PublicRoute = ({component: Component, authenticated, ...rest}) => {
    return (

        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={props => (
            authenticated === false ?
                <Component {...props} />
            : <Redirect to='/' />
        )} />
    );
};

export default PublicRoute;