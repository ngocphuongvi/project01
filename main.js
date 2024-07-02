// let userList = [
//     {
//         id: Date.now(),
//         email: "admin@gmail.com",
//         userName: "admin",
//         password: "12345",
//         status: true,
//     }
// ]
// localStorage.setItem("userList", JSON.stringify(userList));

let userLogin = JSON.parse(localStorage.getItem("userLogin"));

function logout() {
    localStorage.removeItem("userLogin");
    window.location.href = "/login"
}

function renderHeader() {
    document.querySelector("header").innerHTML = `
    <img src="https://rikkeisoft.com/wp-content/themes/main/assets/images/home/logo.svg" alt="rikkeisoft">
    <h3> Management Page</h3>
    <div class="user_box">
        <span>Hello, ${userLogin.userName} !</span>
        <button onclick="logout()" class="btn btn-danger">Log out</button>
    </div>
    `
}

renderHeader()