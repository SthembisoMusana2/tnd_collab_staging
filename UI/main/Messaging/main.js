
class Message{
    constructor(sender,sEmail, recipientType, recipient, message, timestamp, imgR, sent=0, group={name:'', flag:false}){
        this.messagebody = message;
        this.timestamp = timestamp;
        this.messageImage = imgR;
        this.messageSender = sender;
        this.senderEmail = sEmail;
        this.sent = sent;
        this.recipientType = recipientType;
        this.recipient = recipient;
        this.group = group;
    }

    getTimstamp(){
        return this.timestamp;
    }
    getMessagebody(){
        return this.messagebody;
    }

    toJSON(){
        return({
            sender:this.messageSender,
            sEmail:this.senderEmail,
            recipientType:this.recipientType,
            recipient:this.recipient,
            messageBody:this.messagebody,
            messageTime:this.timestamp,
            group:this.group
        });
    }

    toHtml(){
        let timeVar = this.timestamp.split(' ')[4].split(':');
        timeVar.pop()
        timeVar[0] += ':'
        let time = timeVar[0]+''+timeVar[1];

        return this.sent === 0?(
            `<div class = "message-object-sent" style="margin-right:1%;" >
            <div class ="message-profile-image circle">
                <img src=${this.messageImage} class="responsive-img circle profile-picture" alt="Profile">
            </div>
            <div class="message-bubble" style="background-color: rgb(220, 226, 224);">
                <p class="message-sender">${this.messageSender}</p>
                <p class="message-body">${this.messagebody}
                    <br /><span class="message-time">${time}</span>
                </p>  
            </div>
        </div>`
        ): (
            `<div class = "message-object">
            <div class ="message-profile-image circle">
                <img src=${this.messageImage} class="responsive-img circle profile-picture" alt="Profile">
            </div>
            <div class="message-bubble">
                <p class="message-sender">${this.messageSender}</p>
                <p class="message-body">${this.messagebody}
                    <br /><span class="message-time">${time}</span>
                </p>  
            </div>
        </div>`
        );
    }
}

class User{
    constructor(username, email, id, imgR="../TND-Logo_-Unpacked-Parts.png", messageList=[]){
        this.username= username;
        this.useremail = email;
        this.id = id;
        this.messageList = [];
        this.friendList = [];
        this.profileImage = imgR;
        this.latestMessage = messageList!==null?messageList[messageList.length-1]:null;
    }

    setLatestMessage(message){
        this.latestMessage = message;
    }

    appendFriend(friend){
        this.friendList.push(friend);

        this.friendList.sort((user1, user2)=>{
            if(user1.username > user2.username)return -1;
            else if(user1.username < user2.username) return 1;
            return 0;
        });
    }

    toJSON(){
        return({
            username:this.username,
            email:this.useremail,
            id:this.id,
            avatar:this.profileImage
        });
    }

    toHtml(){
        // this.latestMessage != null?this.latestMessage.getMessagebody():'hello friend..';
        return(
            `<div class="user" id=${this.useremail}>
                    <div class ="profile-image circle">
                        <img src=${this.profileImage} class="responsive-img circle profile-picture" alt="Profile">
                    </div>
                    <div class="user-name">
                        <h5 class="user-name-text no-padding">${this.username}</h4>
                        <span class="lmessage">${this.useremail}</span>
                    </div>
                    <!-- <h6 class="timestamp">00:00</h6> -->
                </div>`
        );
    }

    refreshFriendList(){
        let friendListHtml = '';

        for(let i=0; i<this.friendList.length; i++){
            friendListHtml += this.friendList[i].toHtml();
        }
        return(friendListHtml);
    }

    getGroupMemberHtml(){
        this.profileImage =`../TND-Logo_-Unpacked-Parts.png`;
        return (
            `<div class="group-member-object">
            <div class="group-member-img-obj">
                <img src=${this.profileImage} class="responsive-img circle group-member-img" alt="member-profile">
            </div>
            <div class="member-name">
                <span class="member-name-text">${this.username}</span>
            </div>
        </div>`
        )
    }

    messageListToHtml(){
        let messObj = '';
        for(let i=0; i<this.messageList.length; i++){
            messObj +=this.messageList[i].toHtml();
        }
        return(messObj);
    }
}

function updateGroupMembers(UsersList){
    for(let i = 0; i<UsersList.length; i++){
        groupMembersList.innerHTML += UsersList[i].getGroupMemberHtml();
    }
}

async function sendMessage(message){
    return fetch('http://127.0.0.1:8090/send', {
        method:'POST',
        body:JSON.stringify(message)
    });
}

async function signin(user={username:String, email:String, id:id}){
    return fetch('http://127.0.0.1:8090/login', {
        method:'POST',
        body:JSON.stringify(user)
    });
}

async function poll(user={username:null, email:null, id:id}){
    return fetch('http://127.0.0.1:8090/poll', {
        method:'POST',
        body:JSON.stringify(user)
    });
}

async function start(user={username:null, email:null, id:id}){
    return fetch('http://127.0.0.1:8090/users', {
        method:'POST',
        body:JSON.stringify(user)
    });
}

const userNameInfo = document.getElementsByClassName('group-name')[0];
const userEmailInfo = document.getElementsByClassName('group-description')[0];
const friendProfilePhoto = document.getElementById('friend-profile');

function updateUserClick(){
    let usersHtml = document.getElementsByClassName('user');
    let userEmail = document.getElementsByClassName('lmessage');
    for(let i=0; i<usersHtml.length; i++){
    usersHtml[i].addEventListener('click', function(e){
            let userName  = usersHtml[i].innerText.split('\n')[0];
            currentFriend = searchArray2(user.friendList, userEmail[i].innerText, 'useremail');
            if(currentFriend != null){
                displayMessage.style.display = 'block';
                profileTitle.innerText = currentFriend.username;
                friendProfilePhoto.setAttribute('src', currentFriend.profileImage);
                messageDisplayWind.innerHTML = '';
                messageDisplayWind.innerHTML = currentFriend.messageListToHtml();
                messageDisplayWind.scrollTop = messageDisplayWind.scrollHeight;
                if(window.innerWidth <= 768){
                    const chatsWindow = document.getElementById('chats');
                    const navWindow = document.getElementById('navigation');

                    navWindow.style.display = 'none';
                    chatsWindow.style.display = 'block';
                }
            }
        });
    }
}

function createMessageObject(message={sender:'', sEmail:'', recipientType:'',
    recipient:'',
    messageBody:'',
    messageTime:'',
    sent:0,
    group:''}, imgR){
    return new Message(message.sender, message.sEmail, message.recipientType,message.recipient, message.messageBody, message.messageTime, imgR, 1, {});
}

const Users = [];
const contactList = document.getElementById('contact-list');
const profileTitle = document.getElementById('profile-title');
const messageDisplayWind = document.getElementById("message-display");
const messageField = document.getElementById('message-field');
const displayMessage = document.getElementsByClassName('display-content')[0];
const groupMembersList = document.getElementById('group-members');
const profileImage = document.getElementsByClassName('profile-picture')[0];
const profileView = document.getElementById('profile-view');

let user;
let currentFriend = null;
let screenYOffset = 1;

let loginSuccess = false;

window.addEventListener('load', function(e){
    let userDetails = { 
        username:localStorage.getItem('username'), 
        email:localStorage.getItem('email'), 
        id:localStorage.getItem('id'),
        password:localStorage.getItem('password'),
        img:localStorage.getItem('avatar')
    };

    if(userDetails.username == null){
        // Not signed in...
        let path = window.location.pathname.split('/');
        path.pop();
        path.push('signup.html');
        path = path.join('/');
        window.location.pathname = path;
    }
    else{
        // user = new User(userDetails.username, userDetails.email, userDetails.id, userDetails.img, []);
        // userNameInfo.innerText =`${user.username}`;
        // userEmailInfo.innerHTML = `<p><a href='maitlto:'+${user.useremail} > ${user.useremail}</a></p>`
        // profileImage.setAttribute('src', userDetails.img);
        // profileView.setAttribute('src', userDetails.img);
    }

    signin(userDetails).then(function(res){
       sessionStorage.setItem('loginStatus', 'true');
       res.text()
       .then(data=>{
            let respData = data.split('$');
            let userData = JSON.parse(respData[1]);
            user = new User(userData.username, userData.email, userData.id, userData.avatar, []);

            userNameInfo.innerText =`${user.username}`;
            userEmailInfo.innerHTML = `<p><a href='maitlto:'+${user.useremail} > ${user.useremail}</a></p>`
            profileImage.setAttribute('src', user.profileImage);
            profileView.setAttribute('src', user.profileImage);

            let friends = userData['friends'];
            if(friends.length > 0){
               for(let i=0; i<friends.length; i++){
                    let temp = friends['friend '+i];
                    let tempUser = new User(temp.username, temp.email, temp.email, temp.avatar, []);
                    user.appendFriend(tempUser);
               }
               user.friendList.sort((user1, user2)=>{
                    if(user1.email>user2.email)return 1;
                    else if(user1.email<user2.email)return -1;
                    return 0
                });

            for(let i =0; i<user.friendList.length; i++) {
                contactList.innerHTML += user.friendList[i].toHtml();
            } 
            updateUserClick();
           }
       })
    }).catch(err=>{
        loginSuccess = false;
    });
    
    loginSuccess = sessionStorage.getItem('loginStatus');

    setTimeout(function(){
        if(loginSuccess == 'true'){
            const colHeight = document.getElementsByClassName('body');
            const screenWindow = document.getElementsByTagName('body');
            const sendButton = document.getElementById('send');
            const groupMembers = document.getElementById('group-members');

            messageDisplayWind.style.height = this.innerHeight-this.innerHeight*0.2 + 'px';
            screenWindow[0].style.maxHeight = this.window.innerHeight+'px';
            screenWindow[0].style.overflowY = 'hidden';
            colHeight[0].style.height = (window.innerHeight-screenYOffset)+"px";

            if(currentFriend == null) displayMessage.style.display = 'none';

            sendButton.addEventListener('click', function(e){
                let messageBody = messageField.value;
                if(messageBody.length > 0){
                    let messageObject  = new Message(user.username,user.useremail, 'single', currentFriend.email, messageBody, Date(Date.now()), user.profileImage);
                    messageDisplayWind.innerHTML += messageObject.toHtml();
                    messageField.value = '';
                    currentFriend.messageList.push(messageObject);
                    messageDisplayWind.scrollTop = messageDisplayWind.scrollHeight;
                    sendMessage(messageObject.toJSON())
                    .then(res=>{
                        // console.log(res);
                    });  
                }
                
            });

            messageField.addEventListener('keydown', function(e){
                if(e.key == 'Enter'){
                    let messageBody = messageField.value;
                    if(messageBody.length > 0){
                        let messageObject  = new Message(user.username,user.useremail, 'single', currentFriend.useremail, messageBody, Date(Date.now()), user.profileImage);
                        messageDisplayWind.innerHTML += messageObject.toHtml();
                        messageField.value = '';
                        currentFriend.messageList.push(messageObject);
                        messageDisplayWind.scrollTop = messageDisplayWind.scrollHeight;
                        sendMessage(messageObject.toJSON())
                        .then(res=>{
                            res.text()
                            .then(data=>{});
                        });
                    }
            }});

            setInterval(function(){ // poll for new messages
                if(user != null){
                    poll(user.toJSON())
                    .then(function(res){
                        res.text()
                        .then(data=>{
                            let resJSON = JSON.parse(data);
                            let friend
                            if(resJSON.length > 0)
                            for(let i = 0; i<resJSON.length; i++){
                                // console.log(resJSON['message'+i].sender)
                                friend = searchArray2(user.friendList, resJSON['message'+i].sEmail, 'useremail');
                                let f;
                                if(friend == null && resJSON.length > 0){
                                    //add friend in the server...
                                    let list = [];
                                    list.push(createMessageObject(resJSON['message'+i]));

                                    fetch('http://127.0.0.1:8090/addFriend', {
                                        method:'POST',
                                        body:JSON.stringify({
                                        email:resJSON['message'+i].sEmail,
                                        owner:user.useremail
                                        })
                                    })
                                    .then((res)=>{
                                        res.text()
                                        .then(data=>{
                                            f = JSON.parse(data);
                                            let tempFriend = new User(resJSON['message'+i].sender, resJSON['message'+i].sEmail,f.id, f.avatar, []);
                                            contactList.innerHTML += tempFriend.toHtml();
                                            user.appendFriend(tempFriend);
                                            updateUserClick();
                                        })
                                        .catch(err=>{
                                            console.log(err);
                                        })
                                    });
                                }
                                else if(friend != null && resJSON.length > 0){
                                    friend.messageList.push(createMessageObject(resJSON['message'+i], friend.profileImage)); // add message to history
                                    if(friend === currentFriend){
                                        // update the screen..
                                        messageDisplayWind.innerHTML = currentFriend.messageListToHtml();
                                        messageDisplayWind.scrollTop = messageDisplayWind.scrollHeight;
                                        // scroll down;
                                    }
                                }
                            }
                            
                        });
                    });
                }
                
            }, 1000);
        }
        else{
            const bodyE = document.getElementsByTagName('body')[0];
            bodyE.innerHTML = `<div class="retry container" style="width:70%; display:flex;justify-content:center;">
                            <div class="retry-container"
                            style="
                                width:fit-content;
                                padding:4%;
                                margin-top:5%;
                                display:flex;
                                flex-flow:column;
                                justify-content:center;
                                box-shadow:7px 7px 20px 4px rgb(200, 200, 200), -7px -7px 20px 4px rgb(200, 200, 200);
                                background: rgb(180, 180, 180);
                                border-radius:2vh;
                            ">
                                <p style="font-family:roboto; "> Connection Failed!!<br />Can't connect to TND. </p>
                                <div class="retry-button" style="
                                        width:fit-content;
                                        background-color:rgb(40,40,180);
                                        margin-left:auto;
                                        margin-right:auto;
                                        border-radius:0.5em;
                                        padding:5%;
                                        box-shadow:2px 2px 10px 3px #7777, -2px -2px 10px 3px #7777;
                                        ">
                                    <a href='./messaging.html' style="color:white;
                                        font-size:large;
                                        font-weight:bold;
                                        font-family:roboto;
                                        ">Retry</a>
                                </div>
                                </div></div>`
            
        }
    }, 500);
    
});

window.addEventListener('resize', function(){
    let colHeight = document.getElementsByClassName('body');
    let messageDisplayWind = document.getElementById("message-display");
    colHeight[0].style.height = (window.innerHeight-screenYOffset)+"px";
    messageDisplayWind.style.height = this.innerHeight-this.innerHeight*0.25 + 'px';
    if(this.innerWidth < 768){
        window.location.replace('messaging.html');
    }
});


function searchArray(arrayObject = [], key){
    let tempObj = arrayObject[0];
    if(arrayObject.length > 0){
        if(tempObj.username === key){
            return tempObj;
        }
        else{ // binary search algorithm
            
            if(arrayObject.length > 1){
                let middle = arrayObject[Math.floor(arrayObject.length/2)];
    
                if(middle.username === key)
                    return middle;
                else if(key > middle.username) // it means we should look from the second half
                    return searchArray(arrayObject.slice(Math.floor(arrayObject.length/2+1), 
                            arrayObject.length), key); // looking from the middle of the array
                
                else
                    // search the second half
                    return searchArray(arrayObject.slice(0, Math.floor(arrayObject.length/2)), key); 
            }else 
                return null;
        }
    }
}

function searchArray2(arrayObject = [], key, scheme='username'){
    // sort the array according to emails
    sortArrayUsers(arrayObject, scheme); // sort the array first to how you want to search it
    let tempObj = arrayObject[0];
    if(arrayObject.length > 0){
        if(tempObj[scheme] === key){
            return tempObj;
        }
        else{ // binary search algorithm
            
            if(arrayObject.length > 1){
                let middle = arrayObject[Math.floor(arrayObject.length/2)];
    
                if(middle[scheme] === key)
                    return middle;
                else if(key > middle[scheme]) // it means we should look from the second half
                    return searchArray2(arrayObject.slice(Math.floor(arrayObject.length/2+1), 
                            arrayObject.length), key, scheme); // looking from the middle of the array
                else
                    // search the second half
                    return searchArray2(arrayObject.slice(0, Math.floor(arrayObject.length/2)), key, scheme); 
            }else 
                return null;
        }
    }
    
}

function sortArrayUsers(array=[], scheme){
    array.sort((user1, user2)=>{
        if(user1[scheme]> user2[scheme])return 1;
        else if(user1[scheme] < user2[scheme])return -1;
        return 0;
    });
}