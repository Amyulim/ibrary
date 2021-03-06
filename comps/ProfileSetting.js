import React from 'react';
import {Image, Button, Text, TextInput, View, StyleSheet, TouchableOpacity, ScrollView, Alert,ImageBackground, KeyboardAvoidingView} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import {auth, auth2, db, storage} from '../constants/FConfig';
import {GoogleSignin, statusCodes} from 'react-native-google-signin';

import {connect} from 'react-redux';
import {ChangePage, ChangeTab,SavedProfile} from '../redux/Actions';

import RNFetchBlob from 'rn-fetch-blob';
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const items = [
  {
    name: "Application",
    id: 'Application',
  },{
    name: "Graphics",
    id: "Graphics",
  },{
    name: "Video",
    id: "Video",
  },{
    name: "Product",
    id: "Product",
  },{
    name: "Marketing",
    id: "Marketing",
  },
  ]
class ProfileSetting extends React.Component {
  
  blob=null;
  state={
    name:this.props.name,
    bio:this.props.bio,
    img:this.props.img,
    newImg: {},
    filename: "profileImage",
    selectedItems: this.props.interest,
  }
  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems });
  }

  navigatePage=(page)=>{
    this.props.dispatch(ChangePage(page), ChangeTab(3));
  }
  
  handleGallery=()=>{
    Alert.alert(
      'Change Profile Picture',
      'Where do you want to get the picture?',
      [
        {text: 'Camera', onPress: () => this.addImgFromCamera()},
        {text: 'Gallery', onPress: () => this.addImgFromGallery()},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ],
      { cancelable: true }
    )
  }
    handleLogout=()=>{
    Alert.alert(
      'Log Out',
       'Do you want to logout?',
      [
        {text: 'Yes', onPress: () => this.logout()},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed2'), style: 'cancel'},
      ],
      { cancelable: true }
    )
      
  }
  
  addImgFromGallery = async () => {
    var image = await ImagePicker.openPicker({
      width: 30,
      height: 30,
      compressImageQuality: 0.1,
      cropping: true
    })
    var imgF = await RNFetchBlob.fs.readFile(image.path, "base64");
    var blob = await Blob.build(imgF, {type: 'image/jpg;BASE64'});
    
    this.blob = blob;
    
    this.setState({
      newImg: image,
      filename:image.filename
    });
  }
  
   addImgFromCamera = async () => {
    var image = await ImagePicker.openCamera({
      width: 30,
      height: 30,
      compressImageQuality: 0.1,
      cropping: true
    })
    var photo = await RNFetchBlob.fs.readFile(image.path, "base64");
    var blob = await Blob.build(photo, {type:'image/jpg;BASE64'});
     
    this.blob = blob;
    
    this.setState({
      newImg: image,
      filename:image.filename
    });
  }
  
  saveNewUserData=()=>{
 
    if(this.state.name != "" && this.state.bio !="" && this.state.selectedItems != ""){
      var ref = db.ref('users/' + auth.currentUser.uid);
    
    if(Object.keys(this.state.newImg).length != 0) {
      var imgRef = storage.ref().child('profileImages/'+this.props.userid);
      
      imgRef.put(this.blob, {contentType:'image/jpg'}).then((snapshot)=>{
        storage.ref().child(snapshot.metadata.fullPath).getDownloadURL().then((url)=>{
          this.props.dispatch(SavedProfile(this.props.userid, this.state.name, this.state.bio, url,this.state.selectedItems));
          
           ref.update({
              name : this.state.name,
              bio: this.state.bio,
              img: url,
              interest:this.state.selectedItems
           });
        })
      });

    } else {
      this.props.dispatch(SavedProfile(this.props.userid, this.state.name, this.state.bio, this.props.img,this.state.selectedItems));
      ref.update({
        name : this.state.name,
        bio: this.state.bio,
        img: this.props.img,
        interest:this.state.selectedItems
      });
    }
      Alert.alert('User Profile is Saved')
    console.log(this.props.img);
    console.log(this.props.interest);
   
    } else if(this.state.name == ""){
      Alert.alert("Please enter you name.");
    }else if(this.state.bio == ""){
      Alert.alert("Please enter your bio.");
    }else if(this.state.selectedItems == ""){
      Alert.alert("Please pick a category.");

    }

   
  }
    

  logout = async ()=>{
    
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    auth.signOut().then(()=> {
//      console.log('Signed Out');
      this.props.dispatch(ChangePage(1));
    }).catch(error => {
      console.log(error.message);
    });
    
  }
    
  render() {
    
    return (
   
        <ScrollView style={styles.container}>
          <View style={styles.center}>
            <TouchableOpacity 
             style={styles.backBut}
             onPress={this.navigatePage.bind(this,4)}> 
                <Image 
                  style={styles.backBut}
                  source={require('../assets/images/backButton.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.handleLogout}
              style={{position:'absolute', top:25, right:5, width:35, height:35, zIndex:60}}>
              <Image 
                 style={{width:25, height:25, resizeMode:'contain'}}
                source={require('../assets/images/logout.png')}
              />
            </TouchableOpacity>
            <View style={styles.pageTitle}>
                <Text style={styles.titleFont}>Profile Setting</Text>
                <Text  style={styles.pageDes}>Express yourself</Text>
            </View>
            

            <View style={{marginBottom:20 }}>
              <TouchableOpacity onPress={this.handleGallery}>
                 <Image
                     style={{width:100, height:100,borderRadius:50, backgroundColor:'#ccc'}}
                    source={{uri: (this.state.newImg.path) ? this.state.newImg.path : this.props.img}}
                  />
                 <Image
                   style={{width:40, height:40, position:'absolute', right:-10, bottom:0}}
                   source={require('../assets/images/add.png')}/>

                </TouchableOpacity>      
            </View>

            <View style={styles.inpBox}>
              <Text style={styles.sectionTitle}>Name</Text>
              <TextInput 
                    style={[styles.inps]}
                    value={this.state.name}
                    placeholder="name"
                    keyboardType='default'
                     
                    onChangeText={(text) => this.setState({name: text})}/>
             
              <Text style={styles.sectionTitle}>Bio</Text>     
              <TextInput 
                    style={[styles.inps]}
                    value={this.state.bio}
                    placeholder="write something about yourself"
                    keyboardType="default"
                    maxLength={255}
                    onChangeText={(text) => this.setState({bio: text})}/>
            </View>
            
            <View style={{width:'75%', marginBottom:15}}>
              <Text style={{fontSize:17,fontWeight:'600'}}>Interest</Text>
              <SectionedMultiSelect
                items={items} 
                uniqueKey='id'
                selectText='Choose Interest'
                showDropDowns={false}
                readOnlyHeadings={false}
                onSelectedItemsChange={this.onSelectedItemsChange}
                selectedItems={this.state.selectedItems}
              />
            </View>
         
            <View style={styles.butBox}> 
                <TouchableOpacity onPress={this.saveNewUserData}> 
                    <View style={[styles.signBut]}>
                        <Text style={styles.buttonText}>SAVE</Text>
                    </View>
                </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
 
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width:'100%',
    paddingBottom:150
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
  profileImg:{
    width:100, 
    height:100, 
    borderRadius:50, 
    marginBottom:20
  },
  center: {
    width:'100%',
    alignItems:'center',
    paddingBottom:50,
    marginBottom:50
  },
  pageTitle: {
    marginTop:35,
    marginBottom:10,
    width:'100%',
//    backgroundColor:'#e6e6e6',
//    alignContent:'center',
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
    fontSize:18
  },
  sectionTitle:{
    color:'#8e8f91', 
    fontWeight:'600'
  },
  inpBox: {
    width:'75%', 
    marginBottom:'10%',
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
    width:'100%',
    padding:10,
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
}
});

function mapStateToProps(state){
  return {
    page:state.Page.page,
    tab:state.Page.tab,
    name:state.Profile.name,
    bio:state.Profile.bio,
    img:state.Profile.img,
    Pimg:state.Profile.Pimg,
    userid:state.Profile.userid,
    interest:state.Profile.interest
  }
}
 
export default connect (mapStateToProps)(ProfileSetting);