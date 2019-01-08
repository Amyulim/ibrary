//build functions to change global state

export function ChangePage(page) {
  return {
    type:"CHANGE_PAGE",
    curpage:page
  }
}

export function ChangeTab(tab) {
  return {
    type:"CHANGE_TAB",
    curtab:tab
  }
}

export function SelectItem(postid, userid, username, userimg,title, content, img, picked, category, progress,progressBar) {
  return {
    type:"SELECTED_ITEM",
    postid: postid,
    userid: userid,
    username: username,
    userimg:userimg,
    title: title,
    content: content,
    img:img,
    picked:picked,
    category:category,
    progress:progress,
    progressBar:progressBar,
    
  }
}

export function UpdateProgress(progress,progressBar){
  return{
    type:"UPDATE_PROGRESS",
    progress:progress,
    progressBar:progressBar,
    
  }
}

export function EditPost(title,content){
  return{
    type:"EDIT_POST",
    title:title,
    content:content,
  
  }
}

export function SavedProfile( userid, name, bio, img, interest) {
  return {
    type:"SAVED_PROFILE",
    userid: userid,
    name: name,
    bio: bio,
    img:img,
    interest:interest
  }
}

export function UpdatePicked( picked) {
  return {
    type:"UPDATE_PICKED",
    picked: picked
  }
}

export function DeletePicked() {
  return {
    type:"DELETE_PICKED"
  }
}

export function SelectProfileImg(Pimg) {
  return {
    type:"SELECTED_PROFILEIMG",
    Pimg:Pimg
  }
}

export function SelectPostImg(postimg) {
  return {
    type:"SELECT_POSTIMG",
    postImg:postImg
  }
}

export function GetAllComments(comments) {
  return {
    type:"GET_ALLCOMMENTS",
    comments: comments
  }
}