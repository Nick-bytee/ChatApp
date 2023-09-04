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
        email,
        password
    }

    try{
        const response = await axios.post(`${backendAPI}/user/signIn`, myObj)
        console.log(response)
    }catch(err){
        console.log(err)
    }

}