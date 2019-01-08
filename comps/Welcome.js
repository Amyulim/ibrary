import React from 'react';
import { View, StyleSheet, Text, Flatlist, Button, TouchableOpacity, Image, ScrollView, Animated, Dimensions } from 'react-native';

import {connect} from 'react-redux';
import {ChangePage, SavedProfile} from '../redux/Actions';
import Swiper from 'react-native-swiper';

class Welcome extends React.Component {

  
  navigatePage=(page)=>{
    this.props.dispatch(ChangePage(page));
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity 
           style={styles.backBut}
           onPress={this.navigatePage.bind(this,1)}> 
              <Image 
                  style={styles.backBut}
                  source={require('../assets/images/backButton.png')}
              />
        </TouchableOpacity>
        <View style={styles.pageTitle}>
            <Text style={styles.titleFont}>Welcome, {this.props.name}!</Text>
        </View>
        <Text style={styles.pageDes}>Browse our features, it will help</Text>
        <View style={{height:390}}>
        <Swiper 
          showsButtons={false} 
          autoplay={false}>
          <View style={{width:'100%',height:350, alignItems:'center'}}>
            <View style={styles.box}>
              <Image 
                source={require('../assets/images/sharingIcon.png')}
                style={styles.featureImg}           
              />
              <Text style={styles.featureText}>Share your ideas 
                or 
                Ask for help</Text>
            </View>
          </View>

          <View style={{width:'100%', alignItems:'center'}}>
            <View style={styles.box}>
              <Image 
                source={require('../assets/images/swipe.gif')}
                style={styles.featureImg}           
              />
              <Text style={styles.featureText}>Select the most helpful comment</Text>
            </View>
          </View>
          <View style={{width:'100%', alignItems:'center'}}>
            <View style={styles.box}>
              <Image 
                source={require('../assets/images/progress.gif')}
                style={styles.featureImg}           
              />
              <Text style={styles.featureText}>Add your progress</Text>
            </View>
          </View>
        </Swiper>
        </View>
        
        <View style={styles.butBox}>
            <TouchableOpacity onPress={this.navigatePage.bind(this,6)}> 
                <View style={[styles.signBut] }>
                    <Text style={[styles.buttonText]}>GET STARTED </Text>
                </View>
          </TouchableOpacity>
        </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width:'100%',
    height:'100%',
//    flex:1,
    alignItems: 'center',
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
  pageTitle: {
    marginTop:65,
    marginBottom:7,
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
    marginTop:0,
    fontSize:16
  },
  box: {
    width:'65%',
    height:300,
    marginTop:'10%',
    marginBottom:10,
    paddingTop:'10%',
    paddingLeft:'5%',
    paddingRight:'5%',
    alignItems:'center',
    backgroundColor:"#FFFFFF",
    borderRadius:20,
    shadowOffset:{  width: 0,  height: 5,  },
    shadowRadius: 5,
    shadowColor: '#ccc',
    shadowOpacity: 0.5,
  },
  featureImg:{
    width:'95%',
    height:150,
    resizeMode:'contain',
    alignItems:'center',
    margin:'5%',
    marginBottom:30
  },
  featureText: {
    textAlign:'center',
  },
  butBox: {
    flexDirection:'column',
    width:'80%',
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
});
function mapStateToProps(state){
  return {
    page:state.Page.page,
    name:state.Profile.name,
  }
}

 
export default connect (mapStateToProps)(Welcome);