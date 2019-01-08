import React from 'react';
import { View, StyleSheet, Text, Button, Image, ImageBackground, ScrollView,TouchableOpacity } from 'react-native';
import Swipeout from 'react-native-swipeout';

import {connect} from 'react-redux';
import {ChangeTab, DeletePicked} from '../redux/Actions';
import {db, auth} from '../constants/FConfig';

class PickedComment extends React.Component {
  
  deleteFromPost=()=>{
    db.ref('comments/' + this.props.commentid).update({
        picked: false
    })
    this.props.dispatch(DeletePicked());
  }

  render() {
    
    if(auth.currentUser.uid == this.props.postAuthor) {
      var swipeoutBtns = [
        {
         text:'Delete', 
         backgroundColor:'#138172', 
         onPress:this.deleteFromPost
        }
      ]
    }
    
    return (
      
        <View style={styles.container}>
        <View style={{width:'100%'}}>
          <Text style={{fontWeight:'600', color:'#000',opacity:0.7, marginBottom:5, marginLeft:'5%'}}>Picked Comment</Text>
        </View>
           
        <Swipeout 
          style={{width:'100%'}}
          left={swipeoutBtns}
          autoClose={true}
          backgroundColor="#fff"
        >
          <TouchableOpacity style={styles.list} refs={this.props.commentid}>
            <View View style={{width:'90%'}}>
             
              <View style={{flexDirection:'row',  backgroundColor:'rgba(86,173,161,0.5)', padding:10, borderRadius:5, width:'100%', flexWrap:'wrap'}}>
                <View>
                  <Text style={styles.username}>{this.props.username}</Text>
                </View> 
                <View style={{width:'75%'}}>
                  <Text>{this.props.comment}</Text>
                </View>
              </View>
               
            </View>
          </TouchableOpacity>
            </Swipeout>
        </View>
    
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width:"100%",
    alignItems:'center',
    marginBottom:15
  },
  list:{
    width:'100%',
    alignItems:'center',
  },
  hairline: {
    backgroundColor: '#A2A2A2',
    height: 0.6,
    width: '90%'
  },
  username:{
    fontWeight:'bold',
    marginRight:10,
  }

});


function mapStateToProps(state){
  return {
    page:state.Page.page,
    tab: state.Page.tab,
    picked: state.SelectPost.picked
  }
}
export default connect (mapStateToProps)(PickedComment);