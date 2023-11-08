//Scrollbar
$(document).ready(function () {
  const container = document.querySelector(".card-body");
  const ps = new PerfectScrollbar(container);
});

const backendAPI = "http://localhost:3000";

var selectedGroupID;

window.addEventListener("DOMContentLoaded", getAllGroups);

async function getData() {
  const chat = JSON.parse(localStorage.getItem("chats"));
  if (!chat || chat.length === 0) {
    getAllChats();
  } else {
    createChats(chat);
    getNewChats(chat[chat.length - 1]);
  }
  getAllGroups();
}


async function getAllChats() {
  const token = localStorage.getItem("token");
  try {
    const result = await axios.get(`${backendAPI}/chat/home`, {
      headers: {
        Authenticate: token,
      },
    });
    return storeChats(result.data.chats);

    // createChats(result.data.chats)
  } catch (err) {
    console.log(err);
  }
}


async function getAllGroups() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${backendAPI}/group/getGroups`, {
      headers: {
        Authenticate: token,
      },
    });
    showGroups(response.data.groups);
  } catch (err) {
    console.log(err);
  }
}


function showGroups(data) {
  const chatList = document.getElementById("chatList");
  chatList.innerHTML = "";
  data.forEach((group) => {
    const li = document.createElement("li");
    li.className = "p-2 border-bottom";
    const a = document.createElement("a");
    a.className = "d-flex justify-content-between text-decoration-none";
    a.style.cursor = "pointer";
    const mainDiv = document.createElement("div");
    mainDiv.className = "d-flex flex-row";
    const textDiv = document.createElement("div");
    const icon = document.createElement("img");
    icon.src =
      "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp";
    icon.className = "d-flex align-self-center me-3";
    icon.width = "60";
    const span = document.createElement("span");
    span.className = "badge bg-success badge-dot";
    textDiv.appendChild(icon);
    textDiv.appendChild(span);
    const contentDiv = document.createElement("div");
    contentDiv.className = "pt-1";
    const name = document.createElement("p");
    const content = document.createElement("p");
    name.className = "fw-bold mb-0";
    name.innerHTML = group.name;
    content.className = "small text-muted";
    content.innerHTML = "Example Messages";
    contentDiv.appendChild(name);
    contentDiv.appendChild(content);
    const timeDiv = document.createElement("div");
    timeDiv.className = "pt-1";
    const time = document.createElement("p");
    time.className = "small text-muted mb-1";
    time.innerHTML = `${Math.floor(Math.random() * (60 - 1 + 1)) + 1} min ago`;
    const messageCount = document.createElement("span");
    messageCount.className = "badge bg-danger rounded-pill float-end";
    messageCount.innerHTML = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    timeDiv.appendChild(time);
    timeDiv.appendChild(messageCount);
    mainDiv.appendChild(textDiv);
    mainDiv.appendChild(contentDiv);
    a.appendChild(mainDiv);
    a.appendChild(timeDiv);
    li.appendChild(a);
    chatList.appendChild(li);
    a.addEventListener(
      "click",
      (function () {
        return function () {
          getGroupChats(group.uuid);
        };
      })(group.uuid)
    );
  });
}


const groupSelect = document.getElementById("groupSelect");
groupSelect.addEventListener("click", groupInfo);
async function groupInfo() {
  const removeUserButton = document.getElementById('removeUserButton')
  removeUserButton.innerHTML = 'Manage'
  const addUserButton = document.getElementById('addUserButton')
  addUserButton.innerHTML = 'Add Users'
  const groupInfoButton = document.getElementById("groupInfo");
  chatBox.style.display = "none";
  const messageBox = document.getElementById("messageBox");
  messageBox.style.display = "none!important";
  const groupId = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${backendAPI}/group/getInfo/${groupId}`, {
      headers: { Authenticate: token },
    });
    const length = response.data.userData.length
    if (length > 1) {
      document.getElementById('membersCount').innerHTML = length + ' Members'
    } else {
      document.getElementById('membersCount').innerHTML = length + ' Member'
    }
    const groupName = document.getElementById("groupName2");
    groupName.value = response.data.group.name;
    document.getElementById("groupDescription2").value =
      response.data.group.description;
    groupInfoButton.style.display = "block";
    createMembersList(response.data.userData)
  } catch (err) {
    console.log(err);
  }
}


function createMembersList(users) {
  const membersTable = document.getElementById('groupMembersTable')
  membersTable.innerHTML = ''
  let isCurrentUserAdmin = false
  for (let user of users) {
    if (user.isCurrentUser && user.isAdmin) {
      isCurrentUserAdmin = true
    }
    const tbody = document.createElement('tbody')
    const tr = document.createElement('tr')
    const td = document.createElement('td')
    td.className = `${user.id}*${user.isAdmin}*${user.isCurrentUser}`
    td.innerHTML = user.name;
    // td.appendChild(div)
    td.style.display = 'flex'
    td.style.justifyContent = 'space-between'
    tr.appendChild(td)
    tbody.appendChild(tr)
    membersTable.appendChild(tbody)
  }
  if (isCurrentUserAdmin) {
    const addUserButton = document.getElementById('addUserButton')
    const removeUserButton = document.getElementById('removeUserButton')
    addUserButton.style.display = 'block'
    removeUserButton.style.display = 'block'
    // addUserButton.addEventListener('click', addUsers)
    removeUserButton.addEventListener('click', manageUsers)
    addUserButton.addEventListener('click', addUsers)
  }
}


const searchButton = document.getElementById('searchButton')
searchButton.addEventListener('click', searchUsers)
async function searchUsers() {
  const searchBox = document.getElementById('searchBoxData')
  const token = localStorage.getItem('token')
  const uuid = localStorage.getItem('id')
  const myObj = {
    uuid: uuid,
    userData: searchBox.value
  }
  searchBox.value = ''
  try {
    const response = await axios.post(`${backendAPI}/group/searchUser`, myObj, {
      headers: { Authenticate: token }
    })
    console.log(response)
    showUser(response.data.data)
  } catch (err) {
    console.log(err)
  }
}


function showUser(user) {
  const chatList = document.getElementById("chatList")
  chatList.innerHTML = "";
  const li = document.createElement("li");
  li.className = "p-2 border-bottom";
  const mainDiv = document.createElement("div");
  mainDiv.className = "d-flex flex-row";
  const textDiv = document.createElement("div");
  const icon = document.createElement("img");
  const button = document.createElement('button')
  button.className = 'btn btn-primary'
  button.innerHTML = 'Add'
  icon.src =
    "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp";
  icon.className = "d-flex align-self-center me-3";
  icon.width = "60";
  const span = document.createElement("span");
  span.className = "badge bg-success badge-dot";
  textDiv.appendChild(icon);
  textDiv.appendChild(span);
  const contentDiv = document.createElement("div");
  contentDiv.className = "pt-1";
  const name = document.createElement("p");
  const content = document.createElement("p");
  name.className = "fw-bold mb-0";
  name.innerHTML = user.name;
  content.className = "small text-muted";
  content.innerHTML = user.email;
  contentDiv.appendChild(name);
  contentDiv.appendChild(content);
  mainDiv.appendChild(textDiv);
  mainDiv.appendChild(contentDiv);
  // a.appendChild(mainDiv);
  li.appendChild(mainDiv);
  li.appendChild(button)
  chatList.appendChild(li);
  button.addEventListener(
    "click",
    (function () {
      return function () {
        adddUserToGroup(user.email);
      };
    })(user.email)
  );
}

async function adddUserToGroup(email){
  const token = localStorage.getItem('token')
  const uuid = localStorage.getItem('id')
  const searchBox = document.getElementById('searchBox')
  searchBox.style.display = 'None'
  const myObj = {
    uuid : uuid,
    email : email
  }
  try{
    const response = await axios.post(`${backendAPI}/group/addUser`, myObj, {
      headers : {Authenticate : token}
    })
    window.alert('Success')
    getAllGroups()
    groupInfo()
  }catch(err){
    console.log(err)
    window.alert('Internal Server Error')
  }
}


async function addUsers() {
  const addUserButton = document.getElementById('addUserButton')
  const searchBox = document.getElementById('searchBox')
  if (addUserButton.innerHTML === 'Cancel') {
    groupInfo()
    searchBox.style.display = 'None'
  } else {
    addUserButton.innerHTML = 'Cancel'
    searchBox.style.display = 'flex'
  }
}


function manageUsers() {
  const removeUserButton = document.getElementById('removeUserButton')
  if (removeUserButton.innerHTML === 'Cancel') {
    groupInfo()
  } else {
    removeUserButton.innerHTML = 'Cancel'
  }
  const membersTable = document.getElementById('groupMembersTable')
  const rows = membersTable.getElementsByTagName('tr');
  for (let i = 0; i < rows.length; i++) {
    const td = rows[i].getElementsByTagName('td');
    for (let j = 0; j < td.length; j++) {
      const button = document.createElement('button')
      const button2 = document.createElement('button')
      button.className = 'btn btn-primary'
      button.innerHTML = 'Make Admin'
      button.style.marginRight = '5px'
      button2.className = 'btn btn-danger'
      button2.innerHTML = 'Remove'
      button.addEventListener('click', function () {
        createAdmin(td[j].className.split('*')[0])
      })
      button2.addEventListener('click', function () {
        removeUser(td[j].className.split('*')[0])
      })
      const normalDiv = document.createElement('div')
      normalDiv.appendChild(button)
      const adminDiv = document.createElement('div')
      adminDiv.appendChild(button2)
      // console.log(td[j].className.split('*')[1] === '1')
      if (td[j].className.split('*')[2] === 'true') {
        const h5 = document.createElement('h5')
        h5.innerHTML = 'You'
        td[j].appendChild(h5)
        continue
      } else if (td[j].className.split('*')[1] === '1') {
        td[j].appendChild(adminDiv)
      } else {
        td[j].appendChild(normalDiv)
        normalDiv.appendChild(button2)
        console.log(normalDiv)
      }
    }
  }
}


async function createAdmin(id) {
  const uuid = localStorage.getItem('id')
  const token = localStorage.getItem('token')
  const myObj = {
    userId: id,
    uuid: uuid
  }
  try {
    const response = await axios.put(`${backendAPI}/group/updateGroupAdmin`, myObj, { headers: { Authenticate: token } })
    window.alert('Success')
    manageUsers()
  } catch (err) {
    console.log(err)
  }
}


async function removeUser(id) {
  const uuid = localStorage.getItem('id')
  const token = localStorage.getItem('token')
  try {
    const response = await axios.delete(`${backendAPI}/group/removeUser`, {
      params: {
        uuid: uuid,
        id: id
      }, headers: { Authenticate: token }
    })
    window.alert('Success')
    manageUsers()
  } catch (err) {
    console.log(err)
  }
}


const closeButton = document.getElementById("close");
closeButton.addEventListener("click", () => {
  const groupInfoButton = document.getElementById("groupInfo");
  groupInfoButton.style.display = "none";
  chatBox.style.display = "block";
});


const inviteButton = document.getElementById("invite");
inviteButton.addEventListener("click", (e) => {
  e.preventDefault();
  const id = localStorage.getItem("id");
  const groupID = document.getElementById("groupID");
  groupID.value = id;
  groupID.style.display = "block";
  const heading2 = document.getElementById("heading2");
  heading2.style.display = "block";
});


const editButton = document.getElementById("edit");
editButton.addEventListener("click", async (e) => {
  e.preventDefault()
  const groupName = document.getElementById("groupName2");
  const groupDescription = document.getElementById("groupDescription2");
  const uuid = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  if (editButton.innerHTML === "Save") {
    const myObj = {
      name: groupName.value,
      description: groupDescription.value,
      uuid: uuid,
    };
    try {
      const response = await axios.post(
        `${backendAPI}/group/updateGroupInfo`,
        myObj,
        {
          headers: {
            Authenticate: token,
          },
        }
      );
      const msg = document.getElementById("errMessage");
      msg.innerHTML = response.data.message;
      msg.style.color = "green";
      getAllGroups();
      document.getElementById('groupHeading').innerHTML = myObj.name
    } catch (err) {
      console.log(err);
      const msg = document.getElementById("errMessage");
      msg.innerHTML = response.data.message;
      msg.style.color = "red";
    }
  } else if ((editButton.innerHTML = "Edit")) {
    groupName.removeAttribute("disabled");
    groupDescription.removeAttribute("disabled");
    editButton.innerHTML = "Save";
  }
});


async function getGroupChats(id) {
  selectedGroupID = id;
  localStorage.setItem("id", selectedGroupID);
  const token = localStorage.getItem("token");
  const defaultchatbox = document.getElementById("defaultImage");
  const chatbox = document.getElementById("groupbox");
  try {
    const response = await axios.get(
      `${backendAPI}/group/getChat/${selectedGroupID}`,
      { headers: { Authenticate: token } }
    );
    createGroupInfo(response.data.group);
    createChats(response.data.chats);
    defaultchatbox.style.display = "none";
    chatbox.style.display = "block";
  } catch (err) {
    console.log(err);
  }
}


async function getNewChats(latestChat) {
  id = latestChat.id;
  const token = localStorage.getItem("token");
  try {
    const result = await axios.get(`${backendAPI}/chat/home`, {
      headers: {
        Authenticate: token,
        id: id,
      },
    });
    if (result.data.chats.length > 0) {
      updateChats(result.data.chats);
    }
  } catch (err) {
    console.log(err);
  }
}


function storeChats(chats) {
  length = chats.length;
  let recentChats = chats.splice();
  if (length >= 10) {
    recentChats = chats.splice(length - 10, length);
  } else {
    recentChats = [...chats];
  }
  if (chats.length > 10) {
    chats.pop();
  }
  localStorage.setItem("chats", JSON.stringify(recentChats));
}


function updateChats(chats) {
  const oldChats = JSON.parse(localStorage.getItem("chats"));
  chats.forEach((chat) => {
    if (oldChats.length > 10) {
      oldChats.pop();
    }
    oldChats.push(chat);
  });
  localStorage.setItem("chats", JSON.stringify(oldChats));
  createChats(oldChats);
}


function createGroupInfo(groupData) {
  const groupHeading = document.getElementById("groupHeading");
  const usersInfo = document.getElementById("usersInfo");
  groupHeading.innerHTML = groupData.name;
}


function createChats(chats) {
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML = "";
  chats.forEach((data) => {
    if (!data.isCurrentUser) {
      otherUser = document.createElement("div");
      otherUser.className = "d-flex flex-row justify-content-start";
      const userImage = document.createElement("img");
      userImage.src =
        "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp";
      userImage.style.backgroundColor = "#f5f6f7";
      userImage.style.width = "45px";
      userImage.style.height = "100%";
      otherUser.appendChild(userImage);
      const otherUserChild = document.createElement("div");
      const name = document.createElement("span");
      name.style.fontWeight = "bold";
      name.innerHTML = data.username;
      const message = document.createElement("p");
      message.className = "small p-2 me-3 rounded-3";
      message.style.backgroundColor = "#f5f6f7";
      message.innerHTML = data.message;
      message.appendChild(name);
      const time = document.createElement("p");
      time.className = "small ms-3 mb-3 rounded-3 text-muted";
      time.innerHTML = data.time;
      otherUserChild.appendChild(name);
      otherUserChild.appendChild(message);
      otherUserChild.appendChild(time);
      otherUser.appendChild(otherUserChild);
      chatBox.appendChild(otherUser);
    } else {
      ownMessages = document.createElement("div");
      ownMessages.className = "d-flex flex-row justify-content-end";
      const image = document.createElement("img");
      image.src =
        "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp";
      image.style.backgroundColor = "#f5f6f7";
      image.style.width = "45px";
      image.style.height = "100%";
      const ownMessagesChild = document.createElement("div");
      const name = document.createElement("span");
      name.style.fontWeight = "bold";
      name.innerHTML = data.username;
      const message = document.createElement("p");
      message.className = "small p-2 me-3 mb-1 text-white rounded-3 bg-primary";
      message.style.backgroundColor = "#f5f6f7";
      message.innerHTML = data.message;
      message.appendChild(name);
      const time = document.createElement("p");
      time.className =
        "small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end";
      time.innerHTML = data.time;
      ownMessagesChild.appendChild(name);
      ownMessagesChild.appendChild(message);
      ownMessagesChild.appendChild(time);
      ownMessages.appendChild(ownMessagesChild);
      ownMessages.appendChild(image);
      chatBox.appendChild(ownMessages);
    }
  });
}


const sendButton = document.getElementById("send");
sendButton.addEventListener("click", sendMessage);
async function sendMessage(e) {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (selectedGroupID) {
    if (token) {
      const message = document.getElementById("message").value;
      document.getElementById("message").value = "";
      const obj = {
        message: message,
        id: selectedGroupID,
      };
      try {
        const response = await axios.post(`${backendAPI}/chat/sendChat`, obj, {
          headers: {
            Authenticate: token,
          },
        });
        getAllGroups();
      } catch (err) {
        console.log(err);
      }
    } else {
      window.alert("Unauthorised");
    }
  }
}

// const interval = setInterval(getData, 500)

const showGroupButton = document.getElementById("createGroupButton");
showGroupButton.addEventListener("click", showForm);
function showForm() {
  const chats = document.getElementById("chats");
  chats.style.display = "None";
  const joinGroupForm = document.getElementById("joinGroupForm");
  joinGroupForm.style.display = "none";
  const groupForm = document.getElementById("createGroup");
  groupForm.style.display = "block";
}


const cutButton = document.getElementById("cut");
cutButton.addEventListener("click", () => {
  const chats = document.getElementById("chats");
  chats.style.display = "block";
  const groupForm = document.getElementById("createGroup");
  groupForm.style.display = "none";
  getData();
});


const createGroupButton = document.getElementById("create");
createGroupButton.addEventListener("click", createGroup);
async function createGroup(e) {
  e.preventDefault();
  const groupName = document.getElementById("groupName");
  const groupDescription = document.getElementById("groupDescription");
  const token = localStorage.getItem("token");
  const obj = {
    groupName: groupName.value,
    groupDescription: groupDescription.value,
  };
  groupName.value = "";
  groupDescription.value = "";
  try {
    const response = await axios.post(`${backendAPI}/group/createGroup`, obj, {
      headers: {
        Authenticate: token,
      },
    });
    console.log(response)
  } catch (Err) {
    console.log(Err);
  }
}


const joinGroupButton = document.getElementById('joinGroupButton')
joinGroupButton.addEventListener('click', () => {
  const chats = document.getElementById("chats");
  chats.style.display = "None";
  const groupForm = document.getElementById("createGroup");
  groupForm.style.display = "none";
  const joinGroupForm = document.getElementById("joinGroupForm");
  joinGroupForm.style.display = "block";
})


const joinGroupButton2 = document.getElementById('join')
joinGroupButton2.addEventListener('click', async () => {
  const uuid = document.getElementById('groupIdInput').value
  const token = localStorage.getItem('token')
  const myObj = {
    uuid: uuid
  }
  try {
    const response = await axios.post(`${backendAPI}/group/joinGroup`, myObj, {
      headers: {
        Authenticate: token
      }
    })
    console.log(response)
  } catch (err) {
    console.log(err)
  }
})


const cancelButton = document.getElementById('cancel')
cancelButton.addEventListener('click', () => {
  const chats = document.getElementById("chats");
  chats.style.display = "block";
  const joinGroupForm = document.getElementById("joinGroupForm");
  joinGroupForm.style.display = "none";
})


const joinButton = document.getElementById('join')
joinButton.addEventListener('click', async () => {
  const uuid = document.getElementById('groupIdInput').value
  const token = localStorage.getItem('token')
  const groupJoinMessage = document.getElementById('groupJoinMessage')
  const myObj = {
    uuid: uuid
  }
  try {
    const response = await axios.post(`${backendAPI}/group/joinGroup`, myObj, {
      headers: {
        Authenticate: token
      }
    })
    groupJoinMessage.innerHTML = response.data.message
    groupJoinMessage.style.color = 'green'
    console.log(response)
  } catch (err) {
    console.log(err)
    groupJoinMessage.innerHTML = err.response.data.message
    groupJoinMessage.style.color = 'red'
  }
})