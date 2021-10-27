
class Message{
    constructor(sender,sEmail, recipientType, recipient, message, timestamp, sent=0, group={name:'', flag:false}, image = null){
        this.messagebody = message;
        this.timestamp = timestamp;
        this.messageImage = image;
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
        this.messageImage ="../messaging-icon.png";
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
            `<div class="user" id=${this.useremail}>
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

function login(userD){
    
}

function createMessageObject(message={sender:'', sEmail:'', recipientType:'',
recipient:'',
messageBody:'',
messageTime:'',
sent:0,
group:''}){

    return new Message(message.sender, message.sEmail, message.recipientType,message.recipient, message.messageBody, message.messageTime, 1, {});

}

let Users = [];
const contactList = document.getElementById('contact-list');
const profileTitle = document.getElementById('profile-title');
const messageDisplayWind = document.getElementById("message-display");
const messageField = document.getElementById('message-field');
const displayMessage = document.getElementsByClassName('display-content')[0];

let user;

let currentFriend = null;


let screenYOffset = 1;
let groupMembersList = document.getElementById('group-members');
let loginSuccess = false;

window.addEventListener('load', function(e){

    let userDetails = { 
        username:localStorage.getItem('username'), 
        email:localStorage.getItem('email'), 
        id:localStorage.getItem('id'),
        password:localStorage.getItem('password')
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
        user = new User(userDetails.username, userDetails.email, userDetails.id, []);
    }

    signin(userDetails).then(function(res){
       sessionStorage.setItem('loginStatus', 'true');
       res.text()
       .then(data=>{
           let respData = data.split('$');
           let userData = JSON.parse(respData[1]);
           let friends = userData['friends'];
           if(friends.length > 0){
               for(let i=0; i<friends.length; i++){
                    let temp = friends['friend '+i];
                    let tempUser = new User(temp.username, temp.email, temp.email);
                    user.appendFriend(tempUser);
               }

               user.friendList.sort((user1, user2)=>{
                if(user1.username>user2.username)return 1;
                else if(user1.username<user2.username)return -1;
                return 0});

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
            
            // start(user.toJSON()) // signing in to the message server
            // .then(res=>{
            //     res.text().then(data=>{
            //         let dataJson = JSON.parse(data);

            //         if(dataJson.length > 0){
            //             for(let j=0; j<dataJson.friends.length; j++){
            //                 let tempUsers = dataJson.friends['friend '+j];
            //                 user.appendFriend(new User(tempUsers.username,tempUsers.email, tempUsers.id, tempUsers.messages));
            //             }
            //             user.friendList.sort((user1, user2)=>{
            //                 if(user1.username>user2.username)return 1;
            //                 else if(user1.username<user2.username)return -1;
            //                 return 0
            //             });
            
            //             for(let i =0; i<user.friendList.length; i++) {
            //                 contactList.innerHTML += user.friendList[i].toHtml();
            //             } 
            //             updateUserClick();
            //         }
                    
            //     })
            //     .catch(err=>console.log("There's an error: ", err));

            // });

            if(currentFriend == null) displayMessage.style.display = 'none';

            sendButton.addEventListener('click', function(e){
                let messageBody = messageField.value;
                if(messageBody.length > 0){
                    let messageObject  = new Message(user.username,user.useremail, 'single', currentFriend.email, messageBody, Date(Date.now()));
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
                        console.log(currentFriend)
                        let messageObject  = new Message(user.username,user.useremail, 'single', currentFriend.useremail, messageBody, Date(Date.now()));
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

            setInterval(function(){ // poll for new messages
                poll(user.toJSON())
                .then(function(res){
                    res.text()
                    .then(data=>{
                        let resJSON = JSON.parse(data);
                        let friend
                        if(resJSON.length > 0)
                        for(let i = 0; i<resJSON.length; i++){
                            // console.log(resJSON['message'+i].sender)
                            friend = searchArray(user.friendList, resJSON['message'+i].sender);
            
                            if(friend == null && resJSON.length > 0){
                                //add friend in the server...
                                let list = [];
                                list.push(createMessageObject(resJSON['message'+i]));
                                let tempFriend = new User(resJSON['message'+i].sender, resJSON['message'+i].sEmail, 'defualt', list);
                                contactList.innerHTML += tempFriend.toHtml();
                                user.appendFriend(tempFriend);
                                updateUserClick();
                                // console.log(friend)
                            }
                            else if(friend != null && resJSON.length > 0){
                                friend.messageList.push(createMessageObject(resJSON['message'+i])); // add message to history
                                if(friend === currentFriend){
                                    // update the screen..
                                    messageDisplayWind.innerHTML = currentFriend.messageListToHtml();
                                    // scroll down;
                                }
                            }
                        }
                        
                    });
                });
            }, 500);

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
