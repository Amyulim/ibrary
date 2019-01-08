import React from 'react';
import { View, StyleSheet, Text, Button, Image, ImageBackground, ScrollView,TouchableOpacity,Dimensions } from 'react-native';

import {connect} from 'react-redux';
import {ChangeTab, SelectItem} from '../redux/Actions';

class Post extends React.Component {
  
  //passed into this comp: title, content, postid, username, img, pickedComments, userimg, author
  
  handleSelected=()=>{
    //pass or save all post props
    this.props.dispatch(SelectItem(this.props.postid, this.props.author, this.props.username,this.props.userimg, this.props.title, this.props.content, this.props.img, this.props.picked, this.props.category, this.props.progress, this.props.progressBar));
    //change page
    this.props.dispatch(ChangeTab(4));
  }

  render() {
    var width = Dimensions.get('window').width;
    return (
        <View style={styles.container}>
          <TouchableOpacity style={styles.list} refs={this.props.postid} onPress={this.handleSelected}>
            <View>
              
              <View style={{flexDirection:'row'}}>
                <Image 
                  style={{ width:30, height:30, marginRight:7, borderRadius:15, opacity:0.9}} 
                  source={(this.props.userimg) ? { uri: this.props.userimg} : require('../assets/images/profileDefault.png') } />

                <Text style={{fontSize:15, color:'#7a7979', marginTop:5, fontWeight:'700'}}>
                  {(this.props.username) ? this.props.username : "Usename"}</Text>
              </View>
              
              <View style={{flexDirection:'row', marginBottom:10}}>
                <Image 
                  style={{ width:70, height:70, marginRight:7, marginTop:10, borderRadius:5}} 
                  source={(this.props.img) ? { uri: this.props.img} : require('../assets/images/defaultPostingImg.png') }/>
                
                <View style={{width:'70%'}}>
                  <Text 
                    style={{fontSize: 18, marginBottom:3, marginTop:10,marginLeft:5,fontWeight:'800' }}
                    ellipsuzeMode='tail'
                    numberOfLines={1}
                  >{this.props.title}
                  </Text>
                  
                  <Text 
                    style={{fontSize: 15, marginLeft:5}}
                    ellipsizeMode='tail'
                    numberOfLines={2}>
                    {this.props.content}
                  </Text>
                </View>
              </View>
            
            
            </View> 
            
          </TouchableOpacity>
        </View>
    );
  }
}

function mapStateToProps(state){
  return {
    page:state.Page.page,
    tab: state.Page.tab
  }
}
export default connect (mapStateToProps)(Post);

const styles = StyleSheet.create({
  container: {
    width:"100%",
    alignItems:'center',
    fontFamily:'Avenir'
  },
  list:{
    width:'95%',
    backgroundColor:'#fff',
    marginBottom:20,
    borderRadius:10,
    paddingTop:15,
    paddingBottom:15,
    paddingLeft:20,
    paddingRight:20,
  }

});