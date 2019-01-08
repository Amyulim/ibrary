import React from 'react';
import { View, StyleSheet, Text, Button, Image, ImageBackground, TouchableOpacity, FlatList, TextInput,ListItem, ScrollView } from 'react-native';
import {db, auth,auth2} from '../constants/FConfig';
import * as firebase from 'firebase';

import {connect} from 'react-redux'; 
import {ChangePage,SavedProfile} from '../redux/Actions';
import Post from './Post';



class Profile extends React.Component {
  state={
    error:"",
    arrData: [],
    userN:'',
    bio:'',
    img:'',
    interest:[],
    uid:this.props.userid

  }
  static navigationOptions = {
    title: 'Profile',
  };
  navigatePage=(page)=>{
    this.props.dispatch(ChangePage(page));
  }
  readProfile=async()=>{
    var firebase = require('firebase');
    currentUser = firebase.auth().currentUser;
      if (currentUser) {
//+currentUser.uid
        db.ref('users/'+currentUser.uid).once('value').then(snapshot =>{
//           var items = []; 
          var user = snapshot.val(); 
          this.setState({
            userN:user.name,
            bio:user.bio,
            img:user.img,
            interest:user.interest
          })

          //console.log("img",this.props.img);
        }).catch(error => {
          this.setState({error: error.message})
        });
    
      }
    
  }
  
  componentWillMount=()=>{
    this.readProfile();
    this.readPosts();
    
  }
  readPosts=()=>{
    db.ref('posts/')
      .once('value')
      .then(snapshot => {
      var items = [];
      var profileimg = "";
      
      snapshot.forEach(child =>{
        items.push({
          key: child.val().postID,
          author:child.val().userID,
          title: child.val().title,
          content: child.val().content,
          date: child.val().date,
          username: child.val().username,
          img:child.val().img,
          pickedComments:child.val().pickedComments,
          timestamp:child.val().timestamp,
          category:child.val().category,
          progress:child.val().progress,
          progressBar:child.val().progressBar
        })
      })
  
      this.setState({arrData: items})
      
//      console.log(this.state.arrData)
      //filter posting with uid
      var newResult = this.state.arrData.filter((post)=>{
      var matchThis = new RegExp(this.state.uid, 'g');
        var arr = post.author.match(matchThis);
      return arr;
      })
      this.setState({
      arrData:newResult
      })     
      console.log(this.state.arrData)
    }).then(()=>{
      var newthingy = this.state.arrData.sort((x,y)=>{
        return x.timestamp - y.timestamp;
      })
      newthingy =newthingy.reverse();
      this.setState({arrData:newthingy})
      
    }).catch(error => {
      this.setState({error: error.message})
    });
  }
  
  renderList=({item}) =>  {
    return(
      <Post 
       title={item.title} 
       content={item.content} 
       postid={item.key}
       username={this.state.userN}
       img={item.img}
       pickedComments={item.pickedComments}
       userimg = {this.state.img}
       author={item.author}
       category={item.category}
       progress={item.progress}
       progressBar={item.progressBar}
       />
    )
  }

  render() {
    
    return (
      <View style={styles.container}>
         <View style={styles.pageTitle}>
            <Text style={styles.titleFont}>Profile</Text>
        </View>
        <TouchableOpacity 
          style={{position:'absolute', top:30, right:5, width:35, height:35}}
          onPress={this.navigatePage.bind(this,7)}>
          <Image 
            source={require('../assets/images/setting.png')}
            style={{width:25, height:25}}
          />
        </TouchableOpacity>
      
        <ScrollView style={{width:'100%'}}>
        <View style={styles.section}>  
            <View style={[styles.box1, {width:'25%'}]}>
              <Image 
                source={(this.props.img == "") ? require('../assets/images/profileDefault.png'):{ uri: this.props.img}  }
                style={styles.profile}            
              /> 
            </View>
            <View style={[styles.box1, {width:'70%'}]}>
              <Text>{this.state.error}</Text>
              <Text style={{fontWeight:'bold', fontSize:22, marginBottom:5}}>{this.state.userN}</Text>
              <Text>{this.state.bio}</Text>
            </View>
        </View>
          
        <View style={styles.hairline} />
          
        <View style={styles.section2}>
          <Text style={styles.sectionTitle}>Interest</Text>
          <ScrollView 
            horizontal={true} 
            overScrollMode='auto'
            showsHorizontalScrollIndicator='false'>
            
            <View style={{flexDirection:'row', paddingLeft:10, marginBottom:6}}>
              {(this.state.interest) ? <View style={styles.interestList}><Text style={{color:'white'}}> {this.state.interest[0]} </Text></View> : null}
              
              {(this.state.interest.length > 1) ? <View style={styles.interestList}><Text style={{color:'white'}}> {this.state.interest[1]} </Text></View> : null}
              
              {(this.state.interest.length > 2) ? <View style={styles.interestList}><Text style={{color:'white'}}> {this.state.interest[2]} </Text></View> : null}
              
              {(this.state.interest.length > 3) ? <View style={styles.interestList}><Text style={{color:'white'}}> {this.state.interest[3]} </Text></View> : null}
              
              {(this.state.interest.length > 4) ? <View style={styles.interestList}><Text style={{color:'white'}}> {this.state.interest[4]} </Text></View> : null}
            </View> 
            
          </ScrollView>
        </View>
          <View>
        <View style={styles.hairline} />
          </View>

       
          
        <View style={styles.section2}>
         <Text style={styles.sectionTitle}>Posts</Text>
          <View style={{width:'95%', marginBottom:50}}>
            <FlatList
              extraData={this.state.arrData}
              data={this.state.arrData}
              keyExtractor={item => item.key}
              renderItem={this.renderList}
            />
          </View>
          
        </View>
       </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    width:'100%',
    flex: 1,
    backgroundColor: '#e6e6e6',
    flexDirection: 'column'
 
  },
  pageTitle: {
    paddingTop:35,
    paddingBottom:5,
    width:'100%',
    backgroundColor:'#e6e6e6',
//    alignContent:'center',
    alignItems:'center',
  },
  titleFont:{
    fontSize:25,
    fontWeight: 'bold',
    color:'#138172'
  },
  section: {
    flexDirection:'row',
    width:'100%',
    paddingLeft:15,
    paddingTop:5,
    paddingBottom:5,
    flexWrap:'wrap'
  },
  section2: {
    width:'100%',
    paddingLeft:15,
    paddingTop:7,
    paddingBottom:10,
  },
  sectionTitle:{
    fontSize:16,
    fontWeight:'600',
    paddingBottom:10
  },
  interestList:{
    
    backgroundColor:'#138172',
    paddingTop:5,
    paddingBottom:5,
    paddingLeft:8,
    paddingRight:8,
    borderRadius:5,
    marginRight:10,
    alignItems:'center'
  },
  box1: {
    
    marginTop:5,
    paddingBottom:15,
  },
  profile: {
    width:80,
    height:80,
    resizeMode:'cover',
    borderRadius:40,
    marginRight:20
  },
  hairline: {
    backgroundColor: '#A2A2A2',
    height: 0.8,
    opacity:0.5,
    width: '100%'
},
});
function mapStateToProps(state){
  return {
    page:state.Page.page,
    img:state.Profile.img,
    name:state.Profile.name,
    bio:state.Profile.bio,
    userid:state.Profile.userid,
    interest:state.Profile.interest,
  }
}
 
export default connect (mapStateToProps)(Profile);
