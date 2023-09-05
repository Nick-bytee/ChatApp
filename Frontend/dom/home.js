//Scrollbar
$(document).ready(function () {
    const container = document.querySelector('.card-body');
    const ps = new PerfectScrollbar(container);
});

const backendAPI = "http://localhost:3000"


window.addEventListener('DOMContentLoaded', getData)
async function getData(){
    try{
        const data = await axios.get(`${backendAPI}/chat/home`)
    }catch(err){
        console.log(err)
    }
}

const sendButton = document.getElementById('send')
sendButton.addEventListener('click', sendMessage)

async function sendMessage(e){
    const token = localStorage.getItem('token')
    e.preventDefault()
    if(token){
    const message = document.getElementById('message').value

    try{
        const response = await axios.post(`${backendAPI}/chat/sendChat`, {message},
            {headers : {'Authenticate' : token}}
        )
        console.log(response)
    }catch(err){
        console.log(err)
    }
    }else{
        window.alert('Unauthorised')
    }
    
}