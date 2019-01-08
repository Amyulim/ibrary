import React from 'react';
import {Image, Button, Text, TextInput, View, StyleSheet, TouchableOpacity,KeyboardAvoidingView, AsyncStorage} from 'react-native';

import {auth, auth2, db} from '../constants/FConfig';

import {connect} from 'react-redux';
import {ChangePage, FirstTime,SavedProfile} from '../redux/Actions';

class SignUp extends React.Component {

  state={
    email: "",
    password: "",
    password2: "",
    error: "",
    name:"",
    poURl:"",
  }

  navigateToLogIn=()=>{
    this.props.dispatch(ChangePage(1));
  }

  handleSignUp=()=>{
//    this.props.dispatch(FirstTime("true"))
    //check if passwords match
    if(this.state.password === this.state.password2 && this.state.name.length != 0) {
      
      //create user
      auth.createUserWithEmailAndPassword(this.state.email, this.state.password).then(user => {
        this.saveNewUserData();
        this.props.dispatch(ChangePage(2));
        
      }).catch(error => {
        this.setState({error: error.message})
      })

    }
    else {
      this.setState({error: "your passwords don't match"})
    }
  }
  
  saveNewUserData=()=> {
    if (auth.currentUser) {
      currentUser = auth.currentUser;
      
      db.ref('users/' + currentUser.uid).set({
          userID: currentUser.uid,
          email: currentUser.email,
          name:this.state.name,
          img: ""
      }).catch(error => {
//          this.setState({error: error.message})
       
      });
      this.props.dispatch(SavedProfile(
          currentUser.uid,
          this.state.name,
          "",
          "",
          ""
        ))
    console.log("userID",currentUser.uid)
    }
  }
  
  render() {
    
    return (
      <View style={styles.container}>
        <TouchableOpacity 
           style={styles.backBut}
         onPress={this.navigateToLogIn}> 
              <Image 
                  style={styles.backBut}
                  source={require('../assets/images/backButton.png')}
                />
        </TouchableOpacity>
        <KeyboardAvoidingView behavior="position" enabled>
        <View style={styles.center}>
          <View style={styles.pageTitle}>
              <Text style={[styles.titleFont, styles.font]}>Create Account</Text>
          </View>

          <Text style={styles.pageDes}>Sign up with your email address</Text>
          <View>
            <Text>{this.state.error}</Text>
          </View>

          <View style={styles.inpBox}>
           
              <TextInput 
                  style={[styles.inps]}
                  placeholder='Email'
                  keyboardType='email-address'
                  onChangeText={(text) => this.setState({email: text})}/>
           
              <TextInput 
                  style={[styles.inps]}
                  placeholder="Password"
                  keyboardType="default"
                  secureTextEntry={true}
                  onChangeText={(text) => this.setState({password: text})}/>
           
            <TextInput 
                  style={[styles.inps]}
                  placeholder="Re-type password"
                  keyboardType="default"
                  secureTextEntry={true}
                  maxLength={30}
                  onChangeText={(text) => this.setState({password2: text})}/>
            
            <TextInput 
                  style={[styles.inps]}
                  placeholder="Name"
                  keyboardType="name-phone-pad"
                  onChangeText={(text) => this.setState({name: text})}/>
          </View>
          <View style={styles.butBox}> 
                  <TouchableOpacity onPress={this.handleSignUp}> 
                      <View style={[styles.signBut]}>
                          <Text style={[styles.buttonText,styles.font]}>SIGN UP</Text>
                      </View>
                  </TouchableOpacity>
          </View>
        </View>
          </KeyboardAvoidingView>
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    width:'100%',
  },
  backBut: {
    width:22,
    height:22,
    position:'absolute',
    left:3,
    top:13,
    resizeMode:'contain',
    zIndex:50
  },
  center: {
    alignItems:'center'
  },
  pageTitle: {
    marginTop:65,
    marginBottom:10,
    width:'100%',
    alignItems:'center',
  },
  titleFont:{
    fontSize:25,
    fontWeight: 'bold',
    color:'#138172'
  },
   pageDes:{
    marginTop:5,
    marginBottom:20,
    fontSize:16
  },
  sectionTitle:{
    color:'#8e8f91', 
    fontWeight:'600'
  },
  inpBox: {
    width:'76%',
    marginTop:'7%',
    marginBottom:30,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:20,
    paddingRight:20,
    backgroundColor:'#FFF',
    borderRadius:10,
    shadowOffset:{  width: 0,  height: 5,  },
    shadowRadius: 5,
    shadowColor: '#ccc',
    shadowOpacity: 0.5,
  },
  inps:{
    margin:15,
    borderColor:'#000000',
  },
  buttonText:{
    fontSize:17,
    color:'#fff',
    fontWeight:"300",
  },
  signBut:{
    alignItems:'center',
    margin:5,
    padding:15,
    borderRadius:10,
    backgroundColor:'#138172',
    shadowOffset:{  width: 0,  height: 5,  },
    shadowRadius: 5,
    shadowColor: '#ccc',
    shadowOpacity: 1,
  },
  butBox: {
    flexDirection:'column',
    width:'80%',
    marginTop:10
  },
  red: {
    backgroundColor:'#d34836'
}
});


function mapStateToProps(state){
  return {
    page:state.Page.page,
    firsttime:state.Page.firsttime,
    userid:state.Profile.userid,
  }
}
export default connect (mapStateToProps)(SignUp);

