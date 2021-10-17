
class Message{
    constructor(message, timestamp){
        this.messagebody = message;
        this.timestamp = timestamp;
    }

    getTimstamp(){
        return this.timestamp;
    }
    getMessagebody(){
        return this.messagebody;
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
}

let messageTest = []

for(let i=0; i<10;i++){
    let tempMess = new Message("Hello friend, how are you? "+i, "00:10");
    messageTest.push(tempMess);
}

let Users = [];

for(let i=0; i<9;i++){
    let tempUser = new User("Sthembiso "+i, messageTest, null);
    Users.push(tempUser);
}

console.log(Users[0].toHtml());

let screenYOffset = 1;
window.addEventListener('load', function(e){
    let users = document.getElementsByClassName('user');
    let contactList = document.getElementById('contact-list');
    let colHeight = document.getElementsByClassName('body');
    let screenWindow = document.getElementsByTagName('body');

    
    screenWindow[0].style.maxHeight = this.window.innerHeight+'px';
    screenWindow[0].style.overflowY = 'hidden';

    colHeight[0].style.height = (window.innerHeight-screenYOffset)+"px";

    for(let i =0; i<Users.length; i++){
        contactList.innerHTML += Users[i].toHtml();
    }
    

});

window.addEventListener('resize', function(){
    let colHeight = document.getElementsByClassName('body');
    colHeight[0].style.height = (window.innerHeight-screenYOffset)+"px";
})