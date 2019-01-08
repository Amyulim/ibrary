//update state variables
const pageDefault ={
  page:1,
  tab: 1,
};

export function Page(state= pageDefault, action) {
  let obj = Object.assign({}, state);
  
  switch(action.type) {
    case "CHANGE_PAGE":
      obj.page = action.curpage;
      return obj;
      
    case "CHANGE_TAB":
      obj.tab = action.curtab;
      return obj;
      
    default:
      return state;
  }
}

const selectedPost ={
  postid: "",
  userid: "",
  title: "",
  content: "",
  username: "",
  userimg:'',
  img:"",
  category:"",
  progress: "",
  progressBar: ""
};

export function SelectPost(state= selectedPost, action) {
  let obj = Object.assign({}, state);
  
  switch(action.type) {
    case "SELECTED_ITEM":
      obj.postid = action.postid;
      obj.userid = action.userid;
      obj.title = action.title;
      obj.content = action.content;
      obj.username = action.username;
      obj.userimg = action.userimg;
      obj.img = action.img;
      obj.category = action.category;
      obj.progress = action.progress;
      obj.progressBar = action.progressBar;
      return obj;
      
    case "UPDATE_PROGRESS":
      obj.progress = action.progress;
      obj.progressBar = action.progressBar;
      return obj;
      
    case "EDIT_POST":
      obj.title = action.title;
      obj.content = action.content;
      return obj;
      
    default:
      return state;
  }
}

const savedProfile ={
  userid: "",
  name: "",
  bio: "",
  img: "",
  interest:""
};

export function Profile(state= savedProfile, action) {
  let obj = Object.assign({}, state);
  
  switch(action.type) {
    case "SAVED_PROFILE":
      obj.userid = action.userid;
      obj.name = action.name;
      obj.bio = action.bio;
      obj.img = action.img;
      obj.interest = action.interest;
      return obj;
      
    default:
      return state;
  }
}

const selectedPostImg ={
  postImg: "",
};

export function PostImg(state= selectedPostImg, action) {
  let obj = Object.assign({}, state);
  
  switch(action.type) {
    case "SELECT_POSTIMG":
      obj.postImg = action.postImg;
      return obj;
      
    default:
      return state;
  }
}

const allComments ={
  comments: [],
};

export function AllComments(state= allComments, action) {
  let obj = Object.assign({}, state);
  
  switch(action.type) {
    case "GET_ALLCOMMENTS":
      obj.comments = action.comments;
//      console.log("object", obj)
      return obj;
      
    default:
      return state;
  }
}




//for storing global background color state variable
//const bgDefault = {
//  bgcolor: "#FFFFFF"
//}
//export function Background(state= bgDefault, action) {
//  let obj = Object.assign({}, state);
//  
//  switch(action.type) {
//    case "CHANGE_BG":
//      //same as setState
//      obj.bgcolor = action.bgcolor;
//      return obj;
//    default:
//      return state;
//  }
//}