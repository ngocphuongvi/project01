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
// let categoryList = [
//     {
//         id: 1,
//         name: "Computer",
//         quantity: "3",
//         value: "100",
//     }
// ]
// localStorage.setItem("categoryList", JSON.stringify(categoryList));
let categoryList = JSON.parse(localStorage.getItem("categoryList"));
function renderData() {
    let templateStr = ``;
    for (let i = 0; i < categoryList.length; i++) {
        templateStr += `
        <tr>
            <th scope="row">${i + 1}</th>
            <td>${categoryList[i].name}</td>
            <td>${categoryList[i].quantity}</td>
            <td>${categoryList[i].value}</td>
            <td>
                <button style="margin: 3px; " onclick="deleteItem(${categoryList[i].id})">Delete</button>
                <button style="margin: 3px; " onclick="edit(${categoryList[i].id})">Edit</button>
            </td>
        </tr>
        `;
    }
    document.querySelector("tbody").innerHTML = templateStr;
}
renderData();

let editId = null;

function add() {
    let newItem = {
        id: editId !== null ? editId : Date.now(),
        name: document.querySelector("#categoryName").value,
        quantity: document.querySelector("#quantity").value,
        value: document.querySelector("#value").value,
    };

    let index = categoryList.findIndex((c) => c.id == newItem.id);
    if (index >= 0) {
        categoryList.splice(index, 1, newItem);
    } else {
        categoryList.push(newItem);
    }
    localStorage.setItem("categoryList", JSON.stringify(categoryList));
    renderData();
    editId = null;
}

function edit(Id) {
    let categoryList = JSON.parse(localStorage.getItem("categoryList"))
    for (let i = 0; i < categoryList.length; i++) {
        if (categoryList[i].id == Id) {
            document.querySelector("#categoryName").value = categoryList[i].name;
            document.querySelector("#quantity").value = categoryList[i].quantity;
            document.querySelector("#value").value = categoryList[i].value;
            editId = Id;
            break;
        }
    }
}

function deleteItem(x) {
    for (let i = 0; i < categoryList.length; i++) {
        if (categoryList[i].id == x) {
            categoryList.splice(i, 1)
            localStorage.setItem("categoryList", JSON.stringify(categoryList));
            renderData();
            break;
        }
    }
}
