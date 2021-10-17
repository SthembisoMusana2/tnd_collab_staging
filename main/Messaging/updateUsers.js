
class Message{
    constructor(message, timestamp, image = null, sender = null, sent=0){
        this.messagebody = message;
        this.timestamp = timestamp;
        this.messageImage = image;
        this.messageSender = sender;
        this.sent = sent;
    }

    getTimstamp(){
        return this.timestamp;
    }
    getMessagebody(){
        return this.messagebody;
    }

    toHtml(){
        this.messageImage ="../messaging-icon.png";
        
        return this.sent === 0?(
            `<div class = "message-object-sent" id="message-object">
            <div class ="message-profile-image circle">
                <img src=${this.messageImage} class="responsive-img circle profile-picture" alt="Profile">
            </div>
            <div class="message-bubble" style="background-color: rgb(120, 126, 124);">
                <p class="message-sender">${this.messageSender}</p>
                <p class="message-body">${this.messagebody}
                    <br /><span class="message-time">${this.timestamp}</span>
                </p>  
            </div>
        </div>`
        ): (
            `<div class = "message-object" id="message-object">
            <div class ="message-profile-image circle">
                <img src=${this.messageImage} class="responsive-img circle profile-picture" alt="Profile">
            </div>
            <div class="message-bubble">
                <p class="message-sender">${this.messageSender}</p>
                <p class="message-body">${this.messagebody}
                    <br /><span class="message-time">${this.timestamp}</span>
                </p>  
            </div>
        </div>`
        );
    }
}

class User{
    constructor(username, messageList, profileImage){
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
                        <span class="lmessage">${this.latestMessage.getMessagebody()}</span>
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

let messageTest = []

for(let i=0; i<10;i++){
    let tempMess = new Message("Hello friend, how are you? "+i, "00:10");
    messageTest.push(tempMess);
}

let Users = [];

for(let i=0; i<10;i++){
    let tempUser = new User("Sthembiso "+i, messageTest, null);
    Users.push(tempUser);
}

console.log(Users[0].toHtml());

let screenYOffset = 1;
let groupMembersList = document.getElementById('group-members');


function updateGroupMembers(UsersList){
    for(let i = 0; i<UsersList.length; i++){
        groupMembersList.innerHTML += UsersList[i].getGroupMemberHtml();
    }
}

window.addEventListener('load', function(e){
    let contactList = document.getElementById('contact-list');
    let colHeight = document.getElementsByClassName('body');
    let screenWindow = document.getElementsByTagName('body');
    let messageDisplayWind = document.getElementById("message-display");
    let sendButton = document.getElementById('send');
    let messageField = document.getElementById('message-field');
    let groupMembers = document.getElementById('group-members');

    updateGroupMembers(Users);

    messageDisplayWind.style.height = this.innerHeight-this.innerHeight*0.2 + 'px';
    screenWindow[0].style.maxHeight = this.window.innerHeight+'px';
    screenWindow[0].style.overflowY = 'hidden';

    colHeight[0].style.height = (window.innerHeight-screenYOffset)+"px";

    for(let i =0; i<Users.length; i++){
        contactList.innerHTML += Users[i].toHtml();
    }

    sendButton.addEventListener('click', function(e){
        let messageBody = messageField.value;
        if(messageBody.length > 0){
            let messageObject  = new Message(messageBody, "01:00", null, "Me");
            messageDisplayWind.innerHTML += messageObject.toHtml();
            messageField.value = '';
        }
        
    });

    messageField.addEventListener('keydown', function(e){
        if(e.key == 'Enter'){
            let messageBody = messageField.value;
            if(messageBody.length > 0){
                let messageObject  = new Message(messageBody, "01:00", null, "Me");
                messageDisplayWind.innerHTML += messageObject.toHtml();
                messageField.value = '';
            }
        }
    });
});

window.addEventListener('resize', function(){
    let colHeight = document.getElementsByClassName('body');
    let messageDisplayWind = document.getElementById("message-display");
    colHeight[0].style.height = (window.innerHeight-screenYOffset)+"px";
    messageDisplayWind.style.height = this.innerHeight-this.innerHeight*0.25 + 'px';
});