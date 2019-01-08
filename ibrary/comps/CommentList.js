import React from 'react';
import {Image, 
        StyleSheet, 
        Text, 
        TouchableOpacity, 
        View, 
        FlatList} from 'react-native';
import {db} from '../constants/FConfig';

import Comment from './Comment';
import {connect} from 'react-redux';
import {GetAllComments} from '../redux/Actions';

class CommentList extends React.Component {
  
  state={
    error:"",
    arrData: [],
    loading: false,
  }
  
  componentWillMount=()=>{
    this.readComments();
  }
  
  readComments=()=>{
    db.ref('comments/')
      .orderByChild('postID')
      .equalTo(this.props.postid)
      .on('value', this.createCommentList);
  }
  
  createCommentList=(snapshot)=>{
      var items = [];
      
      snapshot.forEach(child =>{
        items.unshift({
          key: child.val().commentID,
          postid: child.val().postID,
          comment: child.val().comment,
          username: child.val().username,
          userid: child.val().userID,
          picked: child.val().picked
        })
      });
      this.setState({arrData: items});
      this.props.dispatch(GetAllComments(items));
  }

  renderList=({item}) =>  {
    return(
      <Comment
       commentid={item.key}
       postid={item.postid}
       comment={item.comment}
       username={item.username}
       author={item.userid}
       refresh={this.readComments}
       />
    )
  }
    
  render() {
    
    return (

      <View style={styles.container}>
        <Text style={{height:8}}>{this.state.error}</Text>
        <View style={{width:'100%'}}>
            <FlatList
              extraData={this.state.arrData}
              data={this.state.arrData}
              keyExtractor={item => item.key}
              renderItem={this.renderList}
              refresh={this.readComments}
            />
        </View>
      </View>
    
    );
  }
}
function mapStateToProps(state){
  return {
    comments:state.AllComments.comments
  }
}
export default connect (mapStateToProps)(CommentList);

const styles = StyleSheet.create({
  container: {
    width:"100%", 
  }
});
