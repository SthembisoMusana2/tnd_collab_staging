let card1 = document.getElementById('card-1');
let card2 = document.getElementById('card-2');
let card3 = document.getElementById('card-3');

card1.addEventListener('click', function(){
    window.location.pathname = "./main/messaging.html";
});

card2.addEventListener('click', function(){
    alert('I clicked card 2');
});

card3.addEventListener('click', function(){
    alert('I clicked card 3');
});