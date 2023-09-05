const backendAPI = "http://localhost:3000"

const signInButton = document.getElementById('signIn')
signInButton.addEventListener('click', login)
const message = document.getElementById('errMessage')


document.getElementById('signUp').addEventListener('click', () => {
    window.location.href = "./signUp.html"
})

async function login(){
    const email = document.getElementById('email')
    const password = document.getElementById('password')
    
    const myObj = {
        email : email.value,
        password : password.value
    }

    try{
        const response = await axios.post(`${backendAPI}/user/signIn`, myObj)
        if(response.status === 200 && response.data.success){
            message.style.color = 'green'
            message.innerHTML = response.data.message
            console.log(response.data)
            localStorage.setItem('token', response.data.token)
            window.location.href = './home.html'
        }
    }catch(err){
        console.log(err)
        if(err.status === 401){
            email.style.borderColor = 'red'
            message.style.color = 'red'
            message.innerHTML = err.response.data.message
        }else{
            password.style.borderColor = "red"
            message.style.color = 'red'
            message.innerHTML = err.response.data.message
        }
    }

}