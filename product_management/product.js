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
let itemsPerPage = 3;
let nowPage = 1;
let searchResults = [];

function sortProducts() {
    let sortOrder = document.querySelector("#sortOrder").value;
    let productList = JSON.parse(localStorage.getItem("productList")) || [];
    if (sortOrder === "alphabetical") {
        productList.sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            return 0;
        });
    } else if (sortOrder === "reverseAlphabetical") {
        productList.sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
            return 0;
        });
    }

    localStorage.setItem("productList", JSON.stringify(productList));
    loadPageData();
}
document.addEventListener('DOMContentLoaded', function () {
    let sortOrder = document.querySelector("#sortOrder").value;
    sortProducts(sortOrder);
});

function renderData(paginatedItems) {
    let templateStr = ``;
    for (let i = 0; i < paginatedItems.length; i++) {
        templateStr += `
        <tr>
            <th scope="row">${i + 1}</th>
            <td>${paginatedItems[i].name}</td>
            <td>${paginatedItems[i].categoryName}</td>
            <td>${paginatedItems[i].price}</td>
            <td>${paginatedItems[i].quantity}</td>
            <td>
                <button style="margin: 3px;" class="btn btn-danger" onclick="deleteItem(${paginatedItems[i].id})">Delete</button>
                <button style="margin: 3px;" class="btn btn-primary" onclick="edit(${paginatedItems[i].id})">Edit</button>
            </td>
        </tr>
        `;
    }
    document.querySelector("tbody").innerHTML = templateStr;
}
function renderPagination() {
    let productList = searchResults.length > 0 || document.querySelector('input[type="text"]').value !== "" ? searchResults : JSON.parse(localStorage.getItem("productList")) || [];
    let totalPages = Math.ceil(productList.length / itemsPerPage);
    let paginationStr = ``;
    for (let i = 1; i <= totalPages; i++) {
        paginationStr += `
        <button class="btn ${i === nowPage ? `btn-primary` : `btn-secondary`}" onclick="gotoPage(${i})">${i}</button>
        `;
    }
    document.querySelector(".page_list").innerHTML = paginationStr;
}

function loadPageData() {
    let productList = searchResults.length > 0 || document.querySelector('input[type="text"]').value !== "" ? searchResults : JSON.parse(localStorage.getItem("productList")) || [];
    let start = (nowPage - 1) * itemsPerPage;
    let end = start + itemsPerPage;

    let paginatedItems = productList.slice(start, end);
    renderPagination();
    renderData(paginatedItems);
}

function gotoPage(page) {
    nowPage = page;
    loadPageData();
}
function search(event) {
    let inputSearch = event.target.value.toLowerCase();
    let productList = JSON.parse(localStorage.getItem("productList")) || [];
    if (inputSearch === "") {
        searchResults = [];
    } else {
        searchResults = productList.filter(product => product.name.toLowerCase().includes(inputSearch));
    }
    nowPage = 1;
    loadPageData();
}

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
            loadPageData();
        }
    }
}
loadPageData(); 
