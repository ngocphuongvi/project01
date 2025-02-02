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
let itemsPerPage = 3;
let nowPage = 1;
let searchResults = [];

function sortCategorys() {
    let sortOrder = document.querySelector("#sortOrder").value;
    let categoryList = JSON.parse(localStorage.getItem("categoryList")) || [];
    if (sortOrder === "alphabetical") {
        categoryList.sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            return 0;
        });
    } else if (sortOrder === "reverseAlphabetical") {
        categoryList.sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
            return 0;
        });
    }

    localStorage.setItem("categoryList", JSON.stringify(categoryList));
    loadPageData();
}
document.addEventListener('DOMContentLoaded', function () {
    let sortOrder = document.querySelector("#sortOrder").value;
    sortCategorys(sortOrder);
});

function renderData(paginatedItems) {//hàm tải dữ liệu cho từng trang nhỏ
    let templateStr = ``;
    for (let i = 0; i < paginatedItems.length; i++) {
        templateStr += `
        <tr>
            <th scope="row">${i + 1}</th>
            <td>${paginatedItems[i].name}</td>
            <td>${paginatedItems[i].quantity}</td>
            <td>${paginatedItems[i].value}</td>
            <td>
                <button style="margin: 3px;" class="btn btn-danger" onclick="updateStatus(${paginatedItems[i].id})">Delete</button>
                <button style="margin: 3px;" class="btn btn-primary" onclick="edit(${paginatedItems[i].id})">Edit</button>
            </td>
        </tr>
        `;
    }
    document.querySelector("tbody").innerHTML = templateStr;
}

function renderPagination() {//hàm tải danh sách số trang và phân biệt trang hiện tại với các trang khác
    let categoryList = searchResults.length > 0 || document.querySelector('input[type="text"]').value !== "" ? searchResults : JSON.parse(localStorage.getItem("categoryList")) || [];
    let totalPages = Math.ceil(categoryList.length / itemsPerPage);
    let paginationStr = ``;
    for (let i = 1; i <= totalPages; i++) {
        paginationStr += `
        <button class="btn ${i === nowPage ? `btn-primary` : `btn-secondary`}" onclick="gotoPage(${i})">${i}</button>
        `;
    }
    document.querySelector(".page_list").innerHTML = paginationStr;
}

function loadPageData() {//hàm tải dữ liệu trang
    let categoryList = searchResults.length > 0 || document.querySelector('input[type="text"]').value !== "" ? searchResults : JSON.parse(localStorage.getItem("categoryList")) || [];
    let start = (nowPage - 1) * itemsPerPage;
    let end = start + itemsPerPage;

    let paginatedItems = categoryList.slice(start, end);
    renderPagination();
    renderData(paginatedItems);
}

function gotoPage(page) {
    nowPage = page;
    loadPageData();
}
function search(event) {
    let inputSearch = event.target.value.toLowerCase().normalize(`NFD`).replace(/[\u0300-\u036f]/g, '').replace(/(\s+)/g, '');
    let categoryList = JSON.parse(localStorage.getItem("categoryList")) || [];
    if (inputSearch === "") {
        searchResults = [];
    } else {
        searchResults = categoryList.filter(category => category.name.toLowerCase().normalize(`NFD`).replace(/[\u0300-\u036f]/g, '').replace(/(\s+)/g, '').includes(inputSearch));
    }
    nowPage = 1;
    loadPageData();
}


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
    editId = null;
    gotoPage(Math.ceil(categoryList.length / itemsPerPage))
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
            alert("Are you sure you want to delete this category?")
            categoryList.splice(i, 1)
            localStorage.setItem("categoryList", JSON.stringify(categoryList));
            renderData();
            break;
        }
    }
}
loadPageData(); 