import React from 'react';
import {Image, Button, Text, TextInput, View, StyleSheet, TouchableOpacity, ActivityIndicator, AsyncStorage} from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import {db, auth, auth2} from '../constants/FConfig';

import {connect} from 'react-redux';
import {ChangePage, SavedProfile, ChangeTab} from '../redux/Actions';

import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin';
import GConfig from '../constants/GConfig';

class Login extends React.Component {

  state={
    email: '',
    password: '',
    error: '',
    name:'',
    bio:'',
    img:'',
    uid:'',
    loading: false,
    isSigninInProgress: false,
    value: ""
  }
  
//  componentWillMount=async ()=>{
//
//    this.setState({loading: true})
//
//    
//    try {
//      const value = await AsyncStorage.getItem('firsttime');
//      if (value == "NO") {
//        auth.onAuthStateChanged(user=>{
//          if (user){
//            this.handleUserInfo(user);
//          } 
//        })
//
//      } else {
//
//        await AsyncStorage.setItem('firsttime', "YES");
//      }
//      this.setState({value: value})
//      
//     } catch (error) {
//
//       this.setState({error: error.message, loading: false})
//
//     }
//    
//     this.setState({loading: false})
//  }
  
  handleLogin=()=>{
    this.setState({loading: true, isSigninInProgress: true});
    auth.setPersistence(auth2.Auth.Persistence.LOCAL).then(a => {
      
      return auth.signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        this.handleUserInfo(auth.currentUser);
      }).catch(error => {
        this.setState({loading: false, isSigninInProgress: false})      
        
        console.log("ERROR CODE: ", error.code)
        if(error.code == "auth/user-not-found"){
          this.setState({error: "User does not exist. Please try again."})      
        } else if(error.code == "auth/wrong-password"){
          this.setState({error: "Wrong password."})
        } else {
          this.setState({error: error.message})      
        }
      })
    })
  }
  
  signIn = async () => {
    this.setState({loading: true, isSigninInProgress: true});
    try{
      const user = await GoogleSignin.signIn()
      const credential = auth2.GoogleAuthProvider.credential(user.idToken, user.accessToken);

      await auth.signInAndRetrieveDataWithCredential(credential);
      
      this.handleUserInfo(auth.currentUser);
      
    } catch (error) {
      this.setState({loading: false, isSigninInProgress: false})
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        this.setState({error: "Sign in was cancelled."})
        
      } else if (error.code === statusCodes.IN_PROGRESS) {
        this.setState({error: "Sign in is already in progress."})
        
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        this.setState({error: "Play services is not available."})
        
      } else {
        console.log(error.code, error.message)
        this.setState({error: "User is not signed in, please try again."})
      }
    }
  }
  

  handleUserInfo=(user)=>{
    this.setState({loading: true});

    db.ref('users/'+ user.uid)
      .once('value')
      .then(snapshot => {
        if(snapshot.val() == null) {
          db.ref('users/' + user.uid).set({
          userID: user.uid,
          email: user.email,
          name: user.displayName,
          img: ""
          }).then(() => {
            this.props.dispatch(SavedProfile(
              user.uid,
              user.displayName,
              "",
              "",
              ""
            ))
            this.navigateToPage(2);
          });

        } else {
          db.ref('users/'+ user.uid)
          .once('value')
          .then(snapshot => {
            var thisuser = snapshot.val();
            var pimg = "";

            if(thisuser.img == "" || thisuser.img == null) {
              pimg = ''

            } else {
              pimg = thisuser.img
            }

            this.props.dispatch(SavedProfile(
              thisuser.userID,
              thisuser.name,
              thisuser.bio,
              pimg,
              thisuser.interest
            ))
          }).then(()=>{
            this.props.dispatch(ChangeTab(1))
            this.navigateToPage(4);
          });
        }
      });
  }
  
  navigateToPage=(page)=>{
    this.props.dispatch(ChangePage(page));
  }

  render() {
    
    GoogleSignin.configure(GConfig);
    
    var indicator = null;
    
    if(this.state.loading == true) {
      indicator = 
        <View style={styles.inpBox}>
          <ActivityIndicator size="large" color="#138172" />
        </View>
    } else {
      indicator = 
        <View style={styles.inpBox}>
          <View style={{flexDirection:'row', flexWrap:'wrap'}}>
            <Image 
              source={require('../assets/images/userID.png')}
              style={{width:20,height:20, marginTop:10,opacity:0.6}}            
            /> 
            <TextInput 
                style={[styles.inps]}
                placeholder='E-mail'
                keyboardType='email-address'
                onChangeText={(text) => this.setState({email: text})}/>
          </View>
          <View style={{flexDirection:'row', flexWrap:'wrap'}}>
            <Image source={require('../assets/images/password.png')}
              style={{width:20,height:25, marginTop:10,resizeMode:'contain',opacity:0.6}}            
            /> 
            <TextInput 
                style={[styles.inps]}
                placeholder="Password"
                keyboardType="default"
                secureTextEntry={true}
                onChangeText={(text) => this.setState({password: text})}/>
          </View>
        </View>
    }
    
    return (
      <View style={styles.container}>
        <Image 
            source={require('../assets/images/logo.png')}
            style={styles.logoImg}            
        /> 
        
        <View>
          <Text>{this.state.error}</Text>
        </View>
        
        {indicator}
        
        <View style={styles.butBox}> 
          
          <TouchableOpacity onPress={this.handleLogin} disabled={this.state.isSigninInProgress}> 
              <View style={[styles.signBut]}>
                  <Text style={[styles.buttonText,styles.font]}>SIGN IN</Text>
              </View>
          </TouchableOpacity>
          
          <GoogleSigninButton
              style={{ width: '100%', height: 50, borderRadius:10}}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              onPress={this.signIn}
              disabled={this.state.isSigninInProgress} />
          
          <TouchableOpacity style={{alignItems:'center'}} onPress={this.navigateToPage.bind(this, 3)}>
            <Text style={[styles.creactAccount]}>
              Create Account
            </Text>
          </TouchableOpacity>
        
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width:'100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#e6e6e6',
    ...ifIphoneX({
            paddingTop:'40%',
        }, {
            paddingTop:'20%',
        })
  },
  logoImg: {   
      marginBottom:'5%',
      width:130, 
      height:150, 
      resizeMode:'contain',
      ...ifIphoneX({
              marginTop:'15%',
          }, {
              marginTop:'5%',
          })
  },
  inpBox: {
    flexDirection:'column',
    width:'77%',
    margin:20,
    padding:15,
    paddingLeft:25,
    backgroundColor:'#FFF',
    borderRadius:10,
    shadowOffset:{  width: 0,  height: 5,  },
    shadowRadius: 5,
    shadowColor: '#ccc',
    shadowOpacity: 0.5,
  },
  inps:{
    width:'70%',
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
    width:'80%'  
  },
  red: {
    backgroundColor:'#d34836'
  },
  creactAccount:{
    marginTop:10, 
    fontSize:15, 
    fontWeight:'600', 
    color:'#676767'
  }
});

function mapStateToProps(state){
  return {
    page:state.Page.page,
    name:state.Profile.name,
    bio:state.Profile.bio,
    img:state.Profile.img,
    interest:state.Profile.interest,
  }
}
export default connect (mapStateToProps)(Login);

