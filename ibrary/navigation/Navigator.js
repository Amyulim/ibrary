import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper'

import Login from '../comps/Login';
import Welcome from '../comps/Welcome';
import SignUp from '../comps/SignUp';
import FirstProfile from '../comps/FirstProfile';
import ProfileSetting from '../comps/ProfileSetting';
import TabBar from './TabBar';
import PostDetail from '../comps/PostDetail';

import {connect} from 'react-redux';
import {ChangePage} from '../redux/Actions';
import GlobalFont from 'react-native-global-font';

class Main extends React.Component {
  
  handleButton=async(page)=>{
    this.props.dispatch(ChangePage(page));
  }

   
   componentDidMount() {
   let Avenir = 'Avenir'
   GlobalFont.applyGlobal(Avenir)

   }
  render() {
    var curpage = <Login/>;
    
    //we are changing state to use the global state
    switch(this.props.page){

      case 1:
        curpage = <Login />
        break;
      case 2:
        curpage = <Welcome />
        break;
      case 3:
        curpage = <SignUp />
        break;
      case 4:
        curpage = <TabBar />
        break;
      case 5:
        curpage = <PostDetail/>
        break;
      case 6:
        curpage = <FirstProfile />
        break;
      case 7:
        curpage = <ProfileSetting/>
        break;
      default:
        curpage = <Login />
        break;
    }
    
    return (
      <View style={styles.container}>
        {curpage}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily:'Avenir',
    backgroundColor: '#e6e6e6',
    alignItems: 'center',
    ...ifIphoneX({
            paddingTop: 25
        }, {
            paddingTop: 8
        })
  },
});

function mapStateToProps(state){
  return {
    page:state.Page.page
  }
}

export default connect (mapStateToProps)(Main);