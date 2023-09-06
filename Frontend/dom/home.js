//Scrollbar
$(document).ready(function () {
    const container = document.querySelector('.card-body');
    const ps = new PerfectScrollbar(container);
});

const backendAPI = "http://localhost:3000"


window.addEventListener('DOMContentLoaded', getData)

async function getData() {
    const chat = JSON.parse(localStorage.getItem('chats'))
    if(!chat || chat.length === 0){
        getAllChats()
    }else{
        createChats(chat)
        getNewChats(chat[chat.length-1])
    }
    
    
}

async function getAllChats() {
    const token = localStorage.getItem('token')
    try {
        const result = await axios.get(`${backendAPI}/chat/home`, {
            headers: {
                'Authenticate': token,
            }
        })
        storeChats(result.data.chats)
        
        // createChats(result.data.chats)
    } catch (err) {
        console.log(err)
    }
}

async function getNewChats(latestChat){
    id = latestChat.id
    const token = localStorage.getItem('token')
    try {
        const result = await axios.get(`${backendAPI}/chat/home`, {
            headers: {
                'Authenticate': token,
                'id' : id
            }
        })
        if(result.data.chats.length > 0){
            updateChats(result.data.chats)
        }
    } catch (err) {
        console.log(err)
    }
}

function storeChats(chats){
    length = chats.length
    let recentChats = chats.splice()
    if(length >= 10){
        recentChats = chats.splice(length-10,length)
    }else{
        recentChats = [...chats]
    }
    
    if(chats.length > 10){
        chats.pop()
    }
    localStorage.setItem('chats', JSON.stringify(recentChats))
}

function updateChats(chats){
    const oldChats = JSON.parse(localStorage.getItem('chats'))
    chats.forEach(chat => {
        if(oldChats.length > 10){
            oldChats.pop()
        }
        oldChats.push(chat)
    })
    localStorage.setItem('chats', JSON.stringify(oldChats))
    createChats(oldChats)
}

function createChats(chats) {
    const chatBox = document.getElementById('chatBox')
    chatBox.innerHTML = ""
    chats.forEach(data => {

        if (!data.isCurrentUser) {
            otherUser = document.createElement('div')
            otherUser.className = "d-flex flex-row justify-content-start"
            const userImage = document.createElement('img')
            userImage.src = "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
            userImage.style.backgroundColor = "#f5f6f7"
            userImage.style.width = "45px"
            userImage.style.height = "100%"
            otherUser.appendChild(userImage)
            const otherUserChild = document.createElement('div')
            const name = document.createElement('span')
            name.style.fontWeight = 'bold'
            name.innerHTML = data.username
            const message = document.createElement('p')
            message.className = "small p-2 me-3 rounded-3"
            message.style.backgroundColor = "#f5f6f7"
            message.innerHTML = data.message
            message.appendChild(name)
            const time = document.createElement('p')
            time.className = 'small ms-3 mb-3 rounded-3 text-muted'
            time.innerHTML = data.time
            otherUserChild.appendChild(name)
            otherUserChild.appendChild(message)
            otherUserChild.appendChild(time)
            otherUser.appendChild(otherUserChild)
            chatBox.appendChild(otherUser)

        } else
         {
            ownMessages = document.createElement('div')
            ownMessages.className = "d-flex flex-row justify-content-end"
            const image = document.createElement('img')
            image.src = "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
            image.style.backgroundColor = "#f5f6f7"
            image.style.width = "45px"
            image.style.height = "100%"
            const ownMessagesChild = document.createElement('div')
            const name = document.createElement('span')
            name.style.fontWeight = 'bold'
            name.innerHTML = data.username
            const message = document.createElement('p')
            message.className = "small p-2 me-3 mb-1 text-white rounded-3 bg-primary"
            message.style.backgroundColor = "#f5f6f7"
            message.innerHTML = data.message
            message.appendChild(name)
            const time = document.createElement('p')
            time.className = 'small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end'
            time.innerHTML = data.time
            ownMessagesChild.appendChild(name)
            ownMessagesChild.appendChild(message)
            ownMessagesChild.appendChild(time)
            ownMessages.appendChild(ownMessagesChild)
            ownMessages.appendChild(image)
            chatBox.appendChild(ownMessages)
        }
    });


}

const sendButton = document.getElementById('send')
sendButton.addEventListener('click', sendMessage)

async function sendMessage(e) {
    const token = localStorage.getItem('token')
    e.preventDefault()
    if (token) {
        const message = document.getElementById('message').value
        document.getElementById('message').value = ''

        try {
            const response = await axios.post(`${backendAPI}/chat/sendChat`, {
                message
            }, {
                headers: {
                    'Authenticate': token
                }
            })
            getData()
        } catch (err) {
            console.log(err)
        }
    } else {
        window.alert('Unauthorised')
    }

}

// const interval = setInterval(getData, 500)