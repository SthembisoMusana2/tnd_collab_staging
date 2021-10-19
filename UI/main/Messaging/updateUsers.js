
class Message{
    constructor(sender,recipientType, recipient, message, timestamp, image = null, sent=0){
        this.messagebody = message;
        this.timestamp = timestamp;
        this.messageImage = image;
        this.messageSender = sender;
        this.sent = sent;
        this.recipientType = recipientType;
        this.recipient = recipient;
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
            messageTime:this.timestamp
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
    constructor(username, messageList=[], profileImage){
        this.username= username;
        this.messageList = messageList;
        this.profileImage = profileImage;
        this.latestMessage = messageList!==null?messageList[messageList.length-1]:null;
    }

    setLatestMessage(message){
        this.latestMessage = message;
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
}

let Users = [];

for(let i=0; i<10; i++){
    let tempUser = new User('Sthembiso '+i);
    Users.push(tempUser);
}

let screenYOffset = 1;
let groupMembersList = document.getElementById('group-members');


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

console.log(Date(Date.now()).split(' '))

window.addEventListener('load', function(e){
    let contactList = document.getElementById('contact-list');
    let colHeight = document.getElementsByClassName('body');
    let screenWindow = document.getElementsByTagName('body');
    let messageDisplayWind = document.getElementById("message-display");
    let sendButton = document.getElementById('send');
    let messageField = document.getElementById('message-field');
    let groupMembers = document.getElementById('group-members');
   
    messageDisplayWind.style.height = this.innerHeight-this.innerHeight*0.2 + 'px';
    screenWindow[0].style.maxHeight = this.window.innerHeight+'px';
    screenWindow[0].style.overflowY = 'hidden';

    colHeight[0].style.height = (window.innerHeight-screenYOffset)+"px";

    for(let i =0; i<Users.length; i++){
        contactList.innerHTML += Users[i].toHtml()
    }

    sendButton.addEventListener('click', function(e){
        let messageBody = messageField.value;
        if(messageBody.length > 0){
            let messageObject  = new Message('Sthembiso', 'single', "Sthembiso2", messageBody, Date(Date.now()));
            messageDisplayWind.innerHTML += messageObject.toHtml();
            messageField.value = '';
        }
        
    });

    messageField.addEventListener('keydown', function(e){
        if(e.key == 'Enter'){
            let messageBody = messageField.value;
            if(messageBody.length > 0){
                let messageObject  = new Message('Sthembiso', 'single', "Sthembiso2", messageBody, Date(Date.now()));
                messageDisplayWind.innerHTML += messageObject.toHtml();
                messageField.value = '';
            }
        }
    });

    let usersHtml = this.document.getElementsByClassName('user');

    for(let i=0; i<usersHtml.length; i++){
        usersHtml[i].addEventListener('click', function(e){
            alert('Uou clicked')
        });
    }
});

window.addEventListener('resize', function(){
    let colHeight = document.getElementsByClassName('body');
    let messageDisplayWind = document.getElementById("message-display");
    colHeight[0].style.height = (window.innerHeight-screenYOffset)+"px";
    messageDisplayWind.style.height = this.innerHeight-this.innerHeight*0.25 + 'px';
});




function searchArray(arrayObject = [], key){
    let tempObj = arrayObject[0];

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
