import React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';

import thunkMiddleware from 'redux-thunk';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from "redux";
import combine from './redux/Combine';
import Navigator from './navigation/Navigator';



const store = createStore (
  combine, 
  applyMiddleware(
    thunkMiddleware
  )
)

export default class App extends React.Component {
  

  render() {
    return (
      <Provider store={store}>
        <Navigator />
      </Provider>
    );
  }
}

