
class Message{
    constructor(sender,recipientType, recipient, message, timestamp, sent=0, group={name:'', flag:false}, image = null){
        this.messagebody = message;
        this.timestamp = timestamp;
        this.messageImage = image;
        this.messageSender = sender;
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
            recipientType:this.recipientType,
            recipient:this.recipient,
            messageBody:this.messagebody,
            messageTime:this.timestamp,
            group:this.group
        });
    }

    toHtml(){
        this.messageImage ="../messaging-icon.png";
        
        return this.sent === 0?(
            `<div class = "message-object-sent" style="margin-right:1%;" >
            <div class ="message-profile-image circle">
                <img src=${this.messageImage} class="responsive-img circle profile-picture" alt="Profile">
            </div>
            <div class="message-bubble" style="background-color: rgb(220, 226, 224);">
                <p class="message-sender">${this.messageSender}</p>
                <p class="message-body">${this.messagebody}
                    <br /><span class="message-time">${this.timestamp.split(' ')[4]}</span>
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
                    <br /><span class="message-time">${this.timestamp.split(' ')[4]}</span>
                </p>  
            </div>
        </div>`
        );
    }
}

class User{
    constructor(username, email, id, messageList=[]){
        this.username= username;
        this.useremail = email;
        this.id = id;
        this.messageList = [];
        this.friendList = [];
        this.profileImage = '';
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
        })
    }

    toJSON(){
        return({
            username:this.username,
            email:this.useremail,
            id:this.id
        });
    }

    toHtml(){
        this.profileImage = `../TND-Logo_-Unpacked-Parts.png`;
        return(
            `<div class="user">
                    <div class ="profile-image circle">
                        <img src=${this.profileImage} class="responsive-img circle profile-picture" alt="Profile">
                    </div>
    
                    <div class="user-name">
                        <h5 class="user-name-text no-padding">${this.username}</h4>
                        <span class="lmessage">${this.latestMessage != null?this.latestMessage.getMessagebody():'hello friend..'}</span>
                    </div>
                    <h6 class="timestamp">00:00</h6>
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
    return fetch('http://127.0.0.1:8090/signin', {
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

function updateUserClick(){
    let usersHtml = document.getElementsByClassName('user');
    for(let i=0; i<usersHtml.length; i++){
    usersHtml[i].addEventListener('click', function(e){
            let userName  = usersHtml[i].innerText.split('\n')[0];
            console.log(userName);
            currentFriend = searchArray(user.friendList, userName);
            if(currentFriend != null){
                displayMessage.style.display = 'block';
                profileTitle.innerText = currentFriend.username;
                messageDisplayWind.innerHTML = '';
                messageDisplayWind.innerHTML = currentFriend.messageListToHtml();
            }
        });
    }
}

function signIn(){
    let username;
    let email = 'sthembisomusana2@gmail.com';
    let id = '12413581283912';
    // username = prompt('Enter Name:');
    // grab the user input from the screen and send it to firebase...
    // get the user name and email from firebase and initialise user.
    return new User(username, email, id, {});
}

function createMessageObject(message={sender:'', recipientType:this.recipientType,
recipient:'',
messageBody:'',
messageTime:'',
sent:0,
group:''}){

    return new Message(message.sender, message.recipientType,message.recipient, message.messageBody, message.messageTime, 1, {});

}

let Users = [];
const contactList = document.getElementById('contact-list');
const profileTitle = document.getElementById('profile-title');
const messageDisplayWind = document.getElementById("message-display");
const messageField = document.getElementById('message-field');
const displayMessage = document.getElementsByClassName('display-content')[0];

const user = signIn();

let currentFriend = null;


let screenYOffset = 1;
let groupMembersList = document.getElementById('group-members');

window.addEventListener('load', function(e){

    let userDetails = { 
        username:localStorage.getItem('username'), 
        email:localStorage.getItem('email'), 
        id:localStorage.getItem('id')
    };

    if(userDetails.username == null){
        // Not signed in...
        let path = window.location.pathname.split('/');
        path.pop();
        path.push('signup.html');
        path = path.join('/');
        window.location.pathname = path;
    }

    let colHeight = document.getElementsByClassName('body');
    let screenWindow = document.getElementsByTagName('body');
    let sendButton = document.getElementById('send');
    
    
    let groupMembers = document.getElementById('group-members');
    
   
    messageDisplayWind.style.height = this.innerHeight-this.innerHeight*0.2 + 'px';
    screenWindow[0].style.maxHeight = this.window.innerHeight+'px';
    screenWindow[0].style.overflowY = 'hidden';
    colHeight[0].style.height = (window.innerHeight-screenYOffset)+"px";

    signin(user.toJSON()).then(function(res){
        res.text()
        .then(data=>{
            console.log(data);
        });
    });

    start(user.toJSON()) // signing in to the message server
    .then(res=>{
        res.text().then(data=>{
            let dataJson = JSON.parse(data);

            if(dataJson.length > 0){
                for(let j=0; j<dataJson.friends.length; j++){
                    let tempUsers = dataJson.friends['friend '+j];
                    user.appendFriend(new User(tempUsers.username,tempUsers.email, tempUsers.id, tempUsers.messages));
                 }
                 user.friendList.sort((user1, user2)=>{
                     if(user1.username>user2.username)return 1;
                     else if(user1.username<user2.username)return -1;
                     return 0
                 });
     
                 for(let i =0; i<user.friendList.length; i++) {
                     contactList.innerHTML += user.friendList[i].toHtml();
                 } 
                updateUserClick();
            }
            
        });

    });

    if(currentFriend == null){
        displayMessage.style.display = 'none';
    }

    sendButton.addEventListener('click', function(e){
        let messageBody = messageField.value;
        if(messageBody.length > 0){
            let messageObject  = new Message(user.username, 'single', currentFriend.username, messageBody, Date(Date.now()));
            messageDisplayWind.innerHTML += messageObject.toHtml();
            messageField.value = '';
            currentFriend.messageList.push(messageObject);
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
                let messageObject  = new Message(user.username, 'single', currentFriend.username, messageBody, Date(Date.now()));
                messageDisplayWind.innerHTML += messageObject.toHtml();
                messageField.value = '';
                currentFriend.messageList.push(messageObject);
                sendMessage(messageObject.toJSON())
                .then(res=>{
                    res.text()
                    .then(data=>{
                        // let message = createMessageObject(JSON.parse(data));
                        // currentFriend.messageList.push(message);
                        // messageDisplayWind.innerHTML += message.toHtml();
                    });
                });
            }
        }
    });

    // setInterval(function(){ // poll for new messages
    //     poll(user.toJSON())
    //     .then(function(res){
    //         res.text()
    //         .then(data=>{
    //             let resJSON = JSON.parse(data);
    //             let friend
    //             if(resJSON.length > 0)
    //             for(let i = 0; i<resJSON.length; i++){
    //                 console.log(resJSON['message'+i].sender)
    //                 friend = searchArray(user.friendList, resJSON['message'+i].sender);
       
    //                 if(friend == null && resJSON.length > 0){
    //                     //add friend in the server...
    //                     let tempFriend = new User(resJSON['message'+i].sender, 'default', 'defualt', [createMessageObject(resJSON['message'+i])]);
    //                     contactList.innerHTML += tempFriend.toHtml();
    //                     user.appendFriend(tempFriend);
    //                     updateUserClick();
    //                     console.log(friend)
    //                 }
    //                 else if(friend != null && resJSON.length > 0){
    //                     friend.messageList.push(createMessageObject(resJSON['message'+i])); // add message to history
    //                     if(friend === currentFriend){
    //                         // update the screen..
    //                         messageDisplayWind.innerHTML = currentFriend.messageListToHtml();
    //                         // scroll down;
    //                     }
    //                 }
    //             }
                
    //         });
    //     });
    // }, 500);
});

window.addEventListener('resize', function(){
    let colHeight = document.getElementsByClassName('body');
    let messageDisplayWind = document.getElementById("message-display");
    colHeight[0].style.height = (window.innerHeight-screenYOffset)+"px";
    messageDisplayWind.style.height = this.innerHeight-this.innerHeight*0.25 + 'px';
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
