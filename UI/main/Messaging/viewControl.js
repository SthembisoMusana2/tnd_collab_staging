let currentTab;

window.addEventListener('load', (e)=>{
    const chatTab = document.getElementById('chats-tab');
    const profileTab = document.getElementById('profile-tab');
    const contactList = document.getElementById('contact-list');
    const profileInfo = document.getElementById('chat-info');
    const viewPage = document.getElementById('view-page');
    const backToListB = document.getElementById('back');
    const chatsWindow = document.getElementById('chats');
    const navWindow = document.getElementById('navigation');

    currentTab = chatTab;

    chatTab.addEventListener('click', (e)=>{
        currentTab.style.borderBottom = 'none';
        currentTab = chatTab;
        chatTab.style.borderBottom = "2px solid blue";
        contactList.style.display = 'block';
        profileInfo.style.display = 'none';
    });

    profileTab.addEventListener('click', (e)=>{
        currentTab.style.borderBottom = 'none';
        currentTab = profileTab;
        profileTab.style.borderBottom = "2px solid blue";
        contactList.style.display = 'none';
        profileInfo.style.display = 'block';  
    });

    backToListB.addEventListener('click', (e)=>{
        chatsWindow.style.display = 'none';
        navWindow.style.display = 'block';
    })


})