const registerButton = document.getElementById('register')
registerButton.addEventListener('click', addUser)

const password2 = document.getElementById('password2')
password2.addEventListener('input', checkPasswords)

document.getElementById('signIn').addEventListener('click', () => {
    window.location.href = "./signIn.html"
})


async function checkPasswords(req, res) {
    const password = document.getElementById('password')
    if (password.value !== password2.value) {
        document.getElementById('errMessage').innerHTML = "Entered passwords doesn't match"
        password.style.borderColor = "red"
        password2.style.borderColor = "red"
    } else {
        document.getElementById('errMessage').innerHTML = ""
        password.style.borderColor = "black"
        password2.style.borderColor = "black"
        registerButton.className = "btn btn-success btn-lg"
    }
}

async function addUser(e) {
    e.preventDefault()

    //getting User Data
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    const myObj = {
        name,
        email,
        password
    }

    if (password === password2.value) {
        const message = document.getElementById('errMessage')
        try {
            const response = await axios.post('http://localhost:3000/user/addUser', myObj)
            console.log(response)
            if (response.data.success) {
                message.innerHTML = response.data.message
                message.style.color = "green"
            }
        } catch (err) {
            console.log(err)
            message.style.innerHTML = 'red'
            message.innerHTML = err.response.data.message
        }
    }

}