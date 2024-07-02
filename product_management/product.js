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

// let productList = [
//     {
//         id: 1,
//         name: "Iphone14",
//         categoryName: "Iphone",
//         price: "300",
//         quantity: "3",
//     }
// ]
// localStorage.setItem("productList", JSON.stringify(productList));
let productList = JSON.parse(localStorage.getItem("productList"));

function renderData() {
    let templateStr = ``;
    for (let i = 0; i < productList.length; i++) {
        templateStr += `
         <tr>
            <th scope="row">${i + 1}</th>
             <td>${productList[i].name}</td>
             <td>${productList[i].categoryName}</td>
             <td>${productList[i].price}</td>
            <td>${productList[i].quantity}</td>
             <td>
                <button class="btn btn-danger" style="margin: 3px; " onclick="deleteItem(${productList[i].id})">Delete</button>
                <button class="btn btn-primary" style="margin: 3px; " onclick="edit(${productList[i].id})">Edit</button>
            </td>
        </tr>
        `;
    }
    document.querySelector("tbody").innerHTML = templateStr;
}
renderData();

function getCategory() {
    let categoryList = JSON.parse(localStorage.getItem("categoryList")) || [];
    console.log("categoryList", categoryList);
    let option = ``;
    for (let i = 0; i < categoryList.length; i++) {
        option += `
        <option value="${categoryList[i].name}">${categoryList[i].name}</option>
        `
    }
    document.querySelector("#categoryName").innerHTML = option;
}
getCategory();

let editId = null;
function add() {
    let newItem = {
        id: editId !== null ? editId : Date.now(),
        name: document.querySelector("#productName").value,
        categoryName: document.querySelector("#categoryName").value,
        price: document.querySelector("#price").value,
        quantity: document.querySelector("#quantity").value,
    };

    let index = productList.findIndex((c) => c.id == newItem.id);
    if (index >= 0) {
        productList.splice(index, 1, newItem);
    } else {
        productList.push(newItem);
    }
    localStorage.setItem("productList", JSON.stringify(productList));
    renderData();
    editId = null;
}

function edit(Id) {
    for (let i = 0; i < productList.length; i++) {
        if (productList[i].id == Id) {
            document.querySelector("#productName").value = productList[i].name;
            document.querySelector("#categoryName").value = productList[i].categoryName;
            document.querySelector("#price").value = productList[i].price;
            document.querySelector("#quantity").value = productList[i].quantity;
            editId = Id;
            break;
        }
    }
}

function deleteItem(x) {
    for (let i = 0; i < productList.length; i++) {
        if (productList[i].id == x) {
            productList.splice(i, 1);
            localStorage.setItem("productList", JSON.stringify(productList))
            renderData();
            break;
        }
    }
}