//combine all reducers
import {combineReducers} from 'redux';
import {Page, SelectPost, Profile, AllComments} from './Reducers';

const myApp = combineReducers({
  //reducers
  Page, SelectPost, Profile, AllComments
})

export default myApp;