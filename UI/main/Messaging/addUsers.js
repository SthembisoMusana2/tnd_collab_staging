const resultsContainer = document.getElementsByClassName('search-results')[0];
const overlay = document.getElementsByClassName('add-user-overlay')[0];
const closeOverlay = document.getElementById('close-overlay-t');
const addUserButton = document.getElementById('add-user');
const searchField = document.getElementById('search-string');
const searchButton = document.getElementById('search-button');

function resultTemplate(user={username:'', email:'', id:0, avatar:''}){
    return(
        ` <div class="friend-object">
        <img src=${user.avatar} alt="user-avatar" class="responsive-img circle result-avatar"/>
        <div class="user-information">
            <span class="result-username">${user.username}</span>
            <span class="result-email">${user.email} </span>
        </div> 
        
        <input type="button" value="Add" class="browser-default search-button add-friend-button" />
    </div>`
    );
}

let serveUrl = 'https://tnd-messaging.herokuapp.com/'

async function searchFriend(friend = {name:''}){
    return fetch(serveUrl+'search', {
        method:'POST',
        body:JSON.stringify(friend)
    });
}

window.addEventListener('load', function(e){
   
    
    addUserButton.addEventListener('click', function(e){
        overlay.style.display = 'block'; 
    });
    closeOverlay.addEventListener('click', function(e){
        resultsContainer.innerHTML = ''
        overlay.style.display = 'none';
    });

    let result;
    searchField.addEventListener('keydown', (e)=>{
        if(e.key == 'Enter'){
            let searchString = searchField.value;
            if(searchString.length > 0){
                if(user.username != searchString){
                    resultsContainer.innerHTML = `<div class="spinner center"></div><br/>`;
                    const spinner = document.getElementsByClassName('spinner')[0];
                    spinner.style.visibility = 'visible';
                    searchFriend({name:searchString})
                    .then(res=>{
                        res.text()
                        .then(data=>{
                            result = JSON.parse(data);
                            resultsContainer.innerHTML = '';
                            if(result.length > 0){
                                for(let i=0; i<result.length;  i++){
                                    let friend  = result['user'+i];
                                    resultsContainer.innerHTML += resultTemplate(friend);
                                    const addFriendButtons = document.getElementsByClassName('add-friend-button');
                                    for(let i=0; i<addFriendButtons.length; i++){
                                        addFriendButtons[i].addEventListener('click', function(e){
                                            let usersList = document.getElementsByClassName('friend-object');
                                            let thisUser = usersList[i];
                                            let userInfo = thisUser.innerText.split('\n');
                                            let userName = userInfo[0];
                                            let email = userInfo[1];
                                            
                                            let test2 = searchArray2(user.friendList, email, 'useremail');
                                            if(test2 == null){
                                                fetch(serverUrl+'addFriend', {
                                                    method:'POST',
                                                    body:JSON.stringify({
                                                    email:email,
                                                    owner:user.useremail
                                                    })
                                                })
                                                .then((res)=>{
                                                    user.appendFriend(new User(userName.trim(), email, email, friend.avatar, []));
                                                    contactList.innerHTML = user.refreshFriendList();
                                                    overlay.style.display = 'none';
                                                    resultsContainer.innerHTML = '';
                                                    updateUserClick();
                                                })           
                                            }
                                            else{
                                                alert('User already exist.');
                                            }                 
                                        });
                                    }
                                }
                            }
                            else{
                                resultsContainer.innerHTML = `<div class=""><p style="text-align:center;color:grey">No user found with that username,<br /> 
                                                                please check the name and try again</p></div>`;
                            }
                            spinner.style.visibility = 'hidden';
                        });
                    });
                }
                else{
                    alert("You can't search yourself.");
                }
                
            }
            searchField.value = '';
        }
    });

    searchButton.addEventListener('click', function(e){
        let searchString = searchField.value;
        if(searchString.length > 0){
            if(user.username != searchString){
                resultsContainer.innerHTML = `<div class="spinner center"></div><br/>`;
                const spinner = document.getElementsByClassName('spinner')[0];
                spinner.style.visibility = 'visible';
                searchFriend({name:searchString})
                .then(res=>{
                    res.text()
                    .then(data=>{
                        result = JSON.parse(data);
                        resultsContainer.innerHTML = '';
                        if(result.length > 0){
                            for(let i=0; i<result.length;  i++){
                                let friend  = result['user'+i];
                                resultsContainer.innerHTML += resultTemplate(friend);
                                const addFriendButtons = document.getElementsByClassName('add-friend-button');
                                for(let i=0; i<addFriendButtons.length; i++){
                                    addFriendButtons[i].addEventListener('click', function(e){
                                        let usersList = document.getElementsByClassName('friend-object');
                                        let thisUser = usersList[i];
                                        let userInfo = thisUser.innerText.split('\n');
                                        let userName = userInfo[0];
                                        let email = userInfo[1];
                                        
                                        let test2 = searchArray2(user.friendList, email, 'useremail');
                                        if(test2 == null){
                                            fetch(serveUrl+'addFriend', {
                                                method:'POST',
                                                body:JSON.stringify({
                                                email:email,
                                                owner:user.useremail
                                                })
                                            })
                                            .then((res)=>{
                                                user.appendFriend(new User(userName.trim(), email, email, friend.avatar, []));
                                                contactList.innerHTML = user.refreshFriendList();
                                                overlay.style.display = 'none';
                                                resultsContainer.innerHTML = '';
                                                updateUserClick();
                                            })           
                                        }
                                        else{
                                            alert('User already exist.');
                                        }                 
                                    });
                                }
                            }
                        }
                        else{
                            resultsContainer.innerHTML = `<div class=""><p style="text-align:center;color:grey">No user found with that username,<br /> 
                                                            please check the name and try again</p></div>`;
                        }
                        spinner.style.visibility = 'hidden';
                    });
                });
            }
            else{
                alert("You can't search yourself.");
            }
            
        }
        searchField.value = '';
    });

});