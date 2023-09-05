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