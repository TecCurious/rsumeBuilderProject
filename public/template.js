// let preview = document.querySelector(".preview");
// let download = document.querySelector(".download");


// preview.addEventListener("click", ()=>{
//     preview.style.display = "none"; 
// })


// let input = document.querySelector("input");
// let image =  document.querySelector("img");

let image = document.querySelector(".upload-img")
let  urlsend = document.querySelector(".url");

image.addEventListener("change", ()=>{
    let url = window.URL.createObjectURL(image.files[0]);
    urlsend.value = url;
    console.log(url);
})
