import React from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { View, StyleSheet, Text, Button, TextInput, TouchableOpacity, ScrollView, Image, Alert, Picker, TouchableWithoutFeedback, Keyboard } from 'react-native';
import {auth, db, storage} from '../constants/FConfig';

import {connect} from 'react-redux';
import {ChangeTab, ChangePage} from '../redux/Actions';

import RNFetchBlob from 'rn-fetch-blob';
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const DismissKeyboard = ({ children })=>(
  <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

class CreatePost extends React.Component {
  
  blob=null;

  state={
    title: "",
    content: "",
    tags: "",
    img: {},
    imgURL: "",
    filename: "",
    postid: "",
    category:''
  }

  handleGallery=()=>{
    Alert.alert(
      'Add a Image',
      'Where do you want to get the picture?',
      [
        {text: 'Camera', onPress: () => this.addImgFromCamera()},
        {text: 'Gallery', onPress: () => this.addImgFromGallery()},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ],
      { cancelable: true }
    )
//    console.log(this.state.category)
  }

  //user image picker and set image as state
  addImgFromGallery = async () => {
    var image = await ImagePicker.openPicker({
      width: 30,
      height: 30,
      compressImageQuality: 0.3,
      cropping: true
    })
    var imgF = await RNFetchBlob.fs.readFile(image.path, "base64");
    var blob = await Blob.build(imgF, {type: 'image/jpg;BASE64'});
    
    this.blob = blob;
    
    this.setState({
      img: image,
      filename:image.filename
    });
  }
  
   addImgFromCamera = async () => {
    var image = await ImagePicker.openCamera({
      width: 30,
      height: 30,
      compressImageQuality: 0.3,
      cropping: true
    })
    var photo = await RNFetchBlob.fs.readFile(image.path, "base64");
    var blob = await Blob.build(photo, {type:'image/jpg;BASE64'});
     
    this.blob = blob;
    
    this.setState({
      img: image,
      filename:image.filename
    });
  }
       
  createNewPost =()=>{

   if(this.state.title != "" && this.state.content != "" && this.state.category !=""){
    var newPostKey = db.ref().child('posts').push().key;
    var current = auth.currentUser.uid;
    var date = new Date().toUTCString();
    var timestamp = new Date().getTime();
    var imgURL = "";

      if(Object.keys(this.state.img).length != 0) {
        
        var imgRef = storage.ref().child('postImages/'+newPostKey+"/"+this.state.filename);

        imgRef.put(this.blob, {contentType:'image/jpg'}).then((snapshot)=>{
          storage.ref().child(snapshot.metadata.fullPath).getDownloadURL().then((url)=>{
            imgURL = url;  
            this.writeNewPost(current, newPostKey, date, this.state.title, this.state.content, timestamp, this.props.name, imgURL,this.state.category);
          })
        });

      } else {
        this.writeNewPost(current, newPostKey, date, this.state.title, this.state.content, timestamp, this.props.name, imgURL, this.state.category);
      }


      Alert.alert("you posting has been saved!");
      setTimeout(()=>{
        this.navigatePage();
      },2000)
    }

    else if(this.state.title == ""){
      Alert.alert("Please enter a title.");
    }else if(this.state.content == ""){
      Alert.alert("Please enter a description.");
    }else if(this.state.category == ""){
      Alert.alert("Please pick a category.");

    }
  }
  
  writeNewPost=(uid, postid, date, title, content, timestamp, name, imgURL,category)=>{
    db.ref('posts/' + postid).set({
        userID: uid,
        postID: postid,
        date: date,
        title: title,
        content: content,
        timestamp: timestamp,
        username: name,
        img: imgURL,
        category:category,
        progress: ""
    });
  }
  
  navigatePage=()=>{
      this.props.dispatch(ChangeTab(1));
  }; 
  
  render() {
    
    return (
      <DismissKeyboard>
        <View style={styles.container}>
          <View style={styles.pageTitle}>
              <Text style={[styles.titleFont, styles.font]}>Create an Idea</Text>
          </View>
          <View style={styles.boxes}>          
                <TouchableOpacity onPress={this.handleGallery}>
                  <Image 
                    source={(this.state.img.path) ? {uri: this.state.img.path} : require('../assets/images/addImg.png')}
                    style={styles.imgIcon}
                    />
                </TouchableOpacity>

          </View>
          <View style={styles.items}>
            <TextInput
                style={[styles.title]}
                placeholder='Title'
                maxLength={80}
                keyboardType='default'
                onChangeText={(text)=> this.setState({title: text})}
            />
          </View>
          <View style={styles.hairline} />
          <View style={[styles.items, styles.content]}>
             <TextInput
                style={{fontSize:16, flex: 1}}
                maxLength={500}
                placeholder='Description'
                multiline={true}
                keyboardType='default'
                onChangeText={(text)=> this.setState({content: text})}
              />  
          </View> 
          <View style={styles.hairline} />

          <View style={styles.category}>
            <Text style={{padding:13, fontSize:16}}>Category</Text>
            <Picker
              selectedValue={this.state.category}
              iosHeader="Select one"
              mode='dropdown'
              style={{height: 60, width: 150}}
              itemStyle={{fontSize:16, height:60}}
              onValueChange={(itemValue, itemIndex) => this.setState({category: itemValue})}>
              <Picker.Item label='Application' value='Application' />
              <Picker.Item label='Graphic Design' value='Graphic Design' />
              <Picker.Item label='Product' value='Product'/>
              <Picker.Item label='Video' value='Video' />
              <Picker.Item label='Marketing' value='Marketing' />

            </Picker>
          </View>
          <View style={styles.butBox}> 
            <TouchableOpacity onPress={this.createNewPost}> 
              <View style={[styles.signBut]}>
                  <Text style={[styles.buttonText,styles.font]}>POST</Text>
              </View>
            </TouchableOpacity>

         </View>
        </View>
      </DismissKeyboard>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width:'100%',
    height:'100%',   
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  hairline: {
    backgroundColor: '#A2A2A2',
    height: 0.6,
    width: '100%'
  },
  verticalHairline:{
    backgroundColor: '#A2A2A2',
    height: 150,
    width: 0.5
  },
  pageTitle: {
    paddingTop:35,
    paddingBottom:15,
    width:'100%',
    backgroundColor:'#e6e6e6',
    alignItems:'center',   
  },
  titleFont:{
    fontSize:25,
    fontWeight: 'bold',
    color:'#138172'
  },
  boxes: {
    alignItems:'center',
    width:'100%',
    margin:10,
  },
  box: {
    width:'50%',
    paddingLeft:'15%',
    paddingRight:'15%',
    height:150,
    backgroundColor:"#F2F2F2",
    alignContent:'center',
    justifyContent:'center'
  },
  items: {
    width:'100%',
    padding:10,
  },
  title: {
    fontSize:18, 
    fontWeight:'500',
    width:'100%'
  },
  content: {
    height:'30%' 
  },
  category:{
    width:'95%', 
    flexDirection:'row'
  },
  buttonText:{
    fontSize:17,
    color:"#fff",
    fontWeight:"300",
  },
  signBut:{
    alignItems:'center',
    margin:5,
    padding:15,
    borderRadius:10,
    backgroundColor:"#138172",
    shadowOffset:{  width: 0,  height: 5,  },
    shadowRadius: 5,
    shadowColor: "#ccc",
    shadowOpacity: 1,
  },
  butBox: {
    width:"80%"  
  },
  imgIcon:{
    width:120,
    height:120,    
  }
});

function mapStateToProps(state){
  return {
    page:state.Page.page,
    tab:state.Page.tab,
    name:state.Profile.name
  }
}

export default connect (mapStateToProps)(CreatePost);

