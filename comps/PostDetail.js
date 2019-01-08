import React from 'react';

import { View, 
        StyleSheet, 
        Text, 
        TextInput,
        Button, 
        Image, 
        ImageBackground, 
        ScrollView,
        TouchableOpacity, 
        KeyboardAvoidingView, 
        Modal,
        Alert,
        TouchableWithoutFeedback, 
        Keyboard,
        Slider
       } from 'react-native';

import {connect} from 'react-redux';
import {ChangeTab, UpdateProgress, EditPost} from '../redux/Actions';

import {auth, db, storage} from '../constants/FConfig';
import CreateComment from './CreateComment';
import CommentList from './CommentList';
import PickedCommentList from './PickedCommentList';

const DismissKeyboard = ({ children })=>(
  <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

class PostDetail extends React.Component {
  
  state={
    title:this.props.title,
    content: this.props.content,
    button: "progress",
    modal: false,
    modal2:false,
    editModal: false,
    progress: this.props.progress,
    changedProgressBar:0,
    progressBar:0
  }
  componentWillMount=()=>{
    this.setState({
      progressBar:parseInt(this.props.progressBar)
    })
  }
  
  navigateToHome=()=>{
    this.props.dispatch(ChangeTab(1));
  }
  
  addProgress=()=>{
    this.setState({modal: true})
  }
  
  viewProgress=()=>{
    this.setState({
      modal2:true,
    })
  }
  
  closeProgress=()=>{
    this.setState({modal2:false})
  }
  
  closeAddProgress=()=>{
    this.setState({modal:false})
  }
  
  closeEdit=()=>{
    this.setState({editModal:false})
  }
  
  
  saveProgress=async ()=>{
    console.log(this.state.progressBar)
    
    if(this.state.changedProgressBar != 0){
      await db.ref('posts/' + this.props.postid).update({
      progress: this.state.progress,
      progressBar: this.state.changedProgressBar
    });
    this.props.dispatch(UpdateProgress(this.state.progress, this.state.changedProgressBar));
    } else {
      await db.ref('posts/' + this.props.postid).update({
      progress: this.state.progress,
    });
    this.props.dispatch(UpdateProgress(this.state.progress, this.props.progressBar));
    }
    
    
    Alert.alert(
      "Saved",
      'You progress has been saved',
      [
        {text: 'OK', onPress: () => {this.setState({modal: false})}},
      ])
  }
  
  
  showEdit=()=>{
    this.setState({editModal: true})
  }
  
  editPost=async ()=>{
    await db.ref('posts/' + this.props.postid).update({
      content: this.state.content,
      title:this.state.title
    });
    this.props.dispatch(EditPost(this.state.title,this.state.content));
    
    Alert.alert(
      "Saved",
      'Your changes have been saved.',
      [
        {text: 'OK', onPress: () => {this.setState({editModal: false})}},
      ])
  }
  
  alertDelete=()=>{
    Alert.alert(
      "Delete Post",
      'Are you sure you want to delete your post?',
      [
        {text: 'Yes', onPress: () => {this.deletePost()}},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed2'), style: 'cancel'}
      ])
  }
  
  deletePost=async()=>{
    await db.ref('posts/' + this.props.postid).remove();
    Alert.alert(
      "Deleted",
      'Your post has been deleted.',
      [
        {text: 'OK', onPress: () => {this.navigateToHome()}}
      ])
  }
  
  render() {
  
    var editIcon = null;
    if(auth.currentUser.uid == this.props.userid){
      editIcon=(
        <View style={{position:'absolute', right:10, top:25, flexDirection:'row'}}>
          <TouchableOpacity onPress={this.addProgress}>
            <Text style={{fontWeight:'600', opacity:0.8, paddingRight:20}}>
              Add Progress
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={this.showEdit}>
            <Text style={{fontWeight:'600', opacity:0.8, paddingRight:20}}>
              Edit
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={this.alertDelete}>
            <Text style={{fontWeight:'600', opacity:0.8, paddingRight:10}}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      ) 
    }
    
    var progressBtn = null;
    if(this.state.progress != ""){
      var btntxt = "";
      
      if(this.state.button == "progress"){
        btntxt = "VIEW PROGRESS";
      } 
      
      progressBtn = (
        <View style={{width:'100%', alignItems:'center'}}>
          <TouchableOpacity onPress={this.viewProgress}> 
              <View style={styles.signBut}>
                  <Text style={styles.buttonText}>{btntxt}</Text>
              </View>
          </TouchableOpacity>
        </View>
      )
    } else {}
    
    var progress = null; 
    if(this.state.button == "content"){
      progress = (
        <View style={{width:'85%',}}>
  
          <Text>{this.props.progress}</Text>
        </View>
      )
     
    } else {
     
    }
    
    
//    this.check();
    return (
      
      <View style={styles.container}>
        <Modal
          animationType='fade'
          visible={this.state.modal}>
          <DismissKeyboard>
          <View style={{width:'100%',flex:1, alignItems:'center'}}>
            <View style={styles.pageTitle}>
              <Text style={[styles.titleFont, styles.font]}>Add Progress</Text>
            </View>
            <TouchableOpacity
              style={{position:'absolute', top:60, right:15}}
              onPress={this.closeAddProgress}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <View style={{width:'80%', marginTop:10}}>
               <Text>Drag slider to set your progress</Text>
            </View>
            
            <View style={{width:'100%', alignItems:'center', marginTop:10}}>
             
              <Slider
                style={{width:'80%'}}
                thumbTintColor='rgb(19,129,114)'
                maximumTrackTintColor='#d3d3d3' 
                minimumTrackTintColor='rgb(19,129,114)'
                minmunValue={0}
                maximunValue={100}
                onSlidingComplete={(val) =>this.setState({changedProgressBar:val})}
                value={this.props.progressBar}
              />
            </View>
            <View style={{width:'100%',backgroundColor: '#A2A2A2',height: 0.8,opacity:0.3, marginBottom:10}} />
            <View style={{width:'100%', marginTop:10,height:300,alignItems:'center'}}>
              <TextInput
                style={{fontSize:16, width:'85%'}}
                placeholder='Add Progress'
                value={this.state.progress}
                multiline={true}
                keyboardType='default'
                onChangeText={(text)=> this.setState({progress: text})}
              />
            </View>
            <TouchableOpacity onPress={this.saveProgress} style={{width:'100%', alignItems:'center'}}> 
              <View style={styles.signBut}>
                  <Text style={styles.buttonText}>SAVE</Text>
              </View>
            </TouchableOpacity>
          </View>
          </DismissKeyboard>
        </Modal>
        
        <Modal
          animationType='fade'
          visible={this.state.editModal}>
          <DismissKeyboard>
          <View style={{width:'100%',flex:1, alignItems:'center'}}>
            <View style={styles.pageTitle}>
              <Text style={[styles.titleFont, styles.font]}>Edit Post</Text>
            </View>
            <TouchableOpacity
                style={{position:'absolute', top:60, right:15}}
                onPress={this.closeEdit}>
                <Text>Cancel</Text>
            </TouchableOpacity>
            <View style={{width:'100%', marginTop:10, flex:0.6,alignItems:'center'}}>
              <View style={{width:'90%', alignItems:'center'}}>
                <TextInput
                  style={{fontSize:18,fontWeight:'500', fontFamily:'Avenir', marginBottom:15}}
                  placeholder='Edit your post title'
                  value={this.state.title}
                  multiline={true}
                  keyboardType='default'
                  onChangeText={(text)=> this.setState({title: text})}
                />  
              </View>
              <View style={{width:'100%',backgroundColor: '#A2A2A2',height: 0.8,opacity:0.3, marginBottom:10}} />
              <TextInput
                style={{fontSize:16,width:'90%',fontFamily:'Avenir'}}
                placeholder='Edit your description'
                value={this.state.content}
                multiline={true}
                keyboardType='default'
                onChangeText={(text)=> this.setState({content: text})}
              />  
            </View>
            <TouchableOpacity onPress={this.editPost} style={{width:'100%', alignItems:'center', marginTop:40}}> 
              <View style={styles.signBut}>
                  <Text style={styles.buttonText}>SAVE</Text>
              </View>
            </TouchableOpacity>
          </View>
          </DismissKeyboard>
        </Modal>
        
        <Modal
          animationType='fade'
          visible={this.state.modal2}
          presentationStyle='overFullScreen'
          transparent={true}
          >
          
          <View 
            style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center', backgroundColor:'rgba(0,0,0,0.5)'}}>
            <View 
              style={{width:'80%', height:400, padding:15, borderRadius:10,backgroundColor:'rgba(255,255,255,1)'}}>
              <View 
                style={{width:'100%', alignItems:'center'}}>
                 <Text 
                   style={{fontSize:18, fontWeight:'700', opacity:0.7, marginBottom:5, marginTop:5}}> 
                   Progress
                </Text>
                <TouchableOpacity
                   style={{position:'absolute', top:5, right:0}}
                   onPress={this.closeProgress}>
                  <Text>Close</Text>
                </TouchableOpacity>
                
              </View>
             
              <View style={{width:'100%', marginTop:10,alignItems:'center'}}>
                <View style={{width:200,backgroundColor:'rgba(0,0,0,0.2)', height:15,borderRadius:7.5, overflow: 'hidden', marginBottom:10}}>
                  <View style={{width:200*this.props.progressBar, height:15, backgroundColor:'rgba(19,129,114,1)'}}/>  
                </View>
                <ScrollView style={{width:'100%',height:300,}}>
                  <Text>{this.props.progress}</Text>
                </ScrollView>
                  
              </View>
            </View>
            
          </View>
        </Modal>
        
        
        
     
        <View style={{ width:'100%'}}>
          <TouchableOpacity 
           onPress={this.navigateToHome}
            style={{width:40, height:30,position:'absolute',left:5,top:22,}}
           >               
            <Image 
              style={styles.backBut}
              source={require('../assets/images/backButton.png')}
            /> 
                   
          </TouchableOpacity>
           {editIcon}
        </View>
      
       <KeyboardAvoidingView style={{marginTop:53}} behavior="position" enabled>
        <ScrollView style={{margionTop:0}}>
        <View style={styles.contents}>
          <View style={styles.posting}>
            
            <View style={{width:'90%', marginTop:10, height:50, flexDirection:'row', justifyContent:'space-between'}}>
              <View style={{flexDirection:'row'}}>
                <Image 
                  style={{ width:35, height:35, marginRight:10, borderRadius:17.5}} 
                 source={(this.props.userimg) ? { uri: this.props.userimg} : require('../assets/images/profileDefault.png') }/>
                
                <Text style={{fontWeight:'bold', fontSize:18, color:'#7a7979', marginTop:7}}>{(this.props.username) ? this.props.username : "Usename"}</Text>
              </View>
            </View>
            <View style={{width:'90%', alignItems:'center'}}>
             <Text style={{fontWeight:'600', color:'#bbb', marginBottom:5, }}>Category : {this.props.category}</Text>
            </View>  
            <View style={{width:'85%', marginBottom:10}} >
              <View style={{alignItems:'center'}} refs={this.props.postid}>
                <Image 
                  style={{width:200, height:200, marginBottom:5, borderRadius:5}} 
                  source={(this.props.img) ? { uri: this.props.img} : require('../assets/images/defaultPostingImg.png') } />
                <Text style={{fontSize: 20, marginTop:15,marginBottom:15, fontWeight: 'bold',}}>
                 {this.props.title}
                </Text>
              </View>
              <Text>{this.state.content}</Text>
            </View>
            
            
            
            <View style={{width:'100%'}}>
               <PickedCommentList postAuthor={this.props.userid}/>
            </View>
            
            {progressBtn}
            {progress}


          </View>
          
          <View style={{width:'100%',alignItems:'center', paddingBottom:90, backgroundColor:'#fff'}}> 
            <View style={{width:'90%'}}>
              <Image 
              style={{width:25, height:20, resizeMode:'contain'}}
              source={require('../assets/images/comment.png')}/>
            </View>
            <CommentList postid={this.props.postid}/> 
            <View style={styles.hairline}/>
            <CreateComment postid={this.props.postid}/>
            <View style={styles.hairline}/>
          </View>
          
        </View>
      </ScrollView>
    
      
      </KeyboardAvoidingView>
         </View> 
  
    );
  }
}

function mapStateToProps(state){
  return {
    page:state.Page.page,
    tab: state.Page.tab,
    postid:state.SelectPost.postid,
    userid:state.SelectPost.userid,
    title:state.SelectPost.title,
    content:state.SelectPost.content,
    username:state.SelectPost.username,
    img:state.SelectPost.img,
    picked:state.SelectPost.picked,
    category:state.SelectPost.category,
    userimg:state.SelectPost.userimg,
    progress:state.SelectPost.progress,
    progressBar:state.SelectPost.progressBar
  }
}
export default connect (mapStateToProps)(PostDetail);


const styles = StyleSheet.create({
  container: {
    position:'absolute',
    width:'100%',
    height:'100%',
  },
  contents:{
    width:'100%',
    height:'100%', 
    backgroundColor:'#fff',  
  },
  posting:{
    width:'100%', 
    margin:0,
    alignItems:'center'
  },
  comments: {
    width: "100%",
    flex: 1
  },
  hairline: {
    backgroundColor: '#A2A2A2',
    height: 0.8,
    opacity:0.3,
    width: '90%'
  },
  list:{
    width:'95%',
    backgroundColor:'#fff',
    marginBottom:20,
    borderRadius:10,
    padding:15
  },
  backBut: {
    width:22,
    height:22,
 
    resizeMode:'contain',
    zIndex:50
  },
  signBut:{
    width:'80%',
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
  buttonText:{
    fontSize:15,
    color:'#fff',
    fontWeight:"300",
  },
  pageTitle: {
    paddingTop:55,
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
  

});