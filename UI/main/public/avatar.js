const images = [
    'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FA.png?alt=media&token=70ac8698-3bb5-40bd-bca5-bc3264f244ce',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FB.jpg?alt=media&token=08560d1f-00ff-4c91-a9c9-787e53bf0742',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FC.png?alt=media&token=a3cfaed5-5e40-40bc-a3c5-cf14cabdfc3e',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FD.jpg?alt=media&token=6eae2218-1e37-4db4-bcc5-9dab56efdef6',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FE.png?alt=media&token=1e7e5f84-32b7-4633-8f00-8b6ce320af27',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FF.png?alt=media&token=babdad4f-33da-4345-b4be-492eb2ca8132',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FG.png?alt=media&token=e17029a8-3bf9-4ce0-82f6-7f9868aa2895',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FH.png?alt=media&token=34d6edf9-042d-446e-bf41-46f458309fb6',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FI.png?alt=media&token=978e3a27-f309-4ccf-a544-e3a82db31576',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FJ.png?alt=media&token=87f70edb-5eae-465e-b9bd-065768aff6ba',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FL.png?alt=media&token=d71c1acd-2751-45b1-8e09-aaed3bd1b57d',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FM.png?alt=media&token=e887f4b1-ed49-45f8-b906-198bd9de3323',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FN.png?alt=media&token=90edd95a-f172-4f13-a7fe-c64b70f9c77a',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FO.png?alt=media&token=2e0db856-b7fa-48a6-b842-193ba10c0c4e',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FP.jpeg?alt=media&token=62e9b794-b9ea-4a6c-9c54-7fdf9b307af2',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FQ.png?alt=media&token=ec446148-f2a1-4573-a640-32b9e068a747',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FR.png?alt=media&token=94b5d16e-05cd-4910-a8a6-0abb7763a15d',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FS.png?alt=media&token=5c2cdd24-0b33-4a1d-bfb2-ee5e37ebfa6d',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FT.png?alt=media&token=a0b5f176-42cf-4c58-9c46-45f25161dda9',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FU.png?alt=media&token=38dc8f25-ec08-4a64-b624-d5ef75876782',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FV.png?alt=media&token=344e45a5-b650-42c2-bf76-0c6ef9eeda53',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FW.png?alt=media&token=cfe63e99-5cb7-445e-b60a-efe067e14b73',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FX.png?alt=media&token=7ae84327-4634-43ba-9592-6f38b7693b5a',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FY.png?alt=media&token=31d2e061-5bff-4ba6-9e96-fd711a26d52b',

'https://firebasestorage.googleapis.com/v0/b/the-nerd-department.appspot.com/o/avatar%2FZ.png?alt=media&token=032c5547-730b-4a7d-a5e4-1abeed29d6da'

]

let currentImage;
const imgContainer = document.getElementsByClassName('img-container')[0];
const overlay = document.getElementsByClassName('overlay')[0];
const nextB = document.getElementById('next-b');

window.addEventListener('load', (e)=>{
    for(let i=0; i<images.length; i++){
        imgContainer.innerHTML += `<div class="img-item">
            <img src=${images[i]} class="responsive-img avatar" alt="avatar" />
        </div>`
    }
    let imgRef = document.getElementsByClassName('img-item');
    
    for(let j = 0; j<imgRef.length; j++){
        imgRef[j].addEventListener('click', (e)=>{
            console.log(currentImage)
            if(currentImage!=null){
                currentImage.style.border = "none";
            }
            currentImage = imgRef[j];
            currentImage.style.border = "2px solid blue";

            let button;
            if(currentImage != null){
                nextB.innerHTML = `<input type="button" class="" value="Next" id="next">`;
                nextB.style.backgroundColor = "blue";

                button = document.getElementById('next');
                button.style.backgroundColor = "blue";
                button.style.outline = "none";
                button.style.border = "none";
                button.style.color = "white";
                button.ch
                button.addEventListener('click', (e)=>{
                    let imgRef = currentImage.children[0];
                    console.log(imgRef.src);
                    localStorage.setItem('avatar', imgRef.src);
                    signup.style.display = 'block';
                    overlay.style.display = "none";
                });


            }
        });
    }
});