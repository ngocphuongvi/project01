// let userList = [{
//     id: Date.now(),
//     email: "admin@gmail.com",
//     userName: "admin",
//     status: true,
// }]
// localStorage.setItem("userList", JSON.stringify(userList))
let userList = JSON.parse(localStorage.getItem("userList"));
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
renderHeader();

let itemsPerPage = 3;//mỗi trang hiển thị 3 item
let nowPage = 1;
let searchResults = []; //kết quả tìm kiếm được lưu vào mảng này

//sắp xếp 
function sortUsers() {
    let sortOrder = document.querySelector("#sortOrder").value;
    let userList = JSON.parse(localStorage.getItem("userList")) || [];
    let n = userList.length;

    if (sortOrder === "none") {
        userList = JSON.parse(localStorage.getItem("userList"));//không sắp xếp
    } else {
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - 1 - i; j++) {//vòng lặp j chạy từ 0 đến`n-1-i` để so sánh và hoán đổi các phần tử liên tiếp nếu cần
                if (sortOrder === "alphabetical") {//sắp xếp theo thứ tự bảng chữ cái
                    if (userList[j].userName.toLowerCase() > userList[j + 1].userName.toLowerCase()) {//nếu j đứng sau j+1 trong bảng chữ cái
                        let temp = userList[j];//hoán đổi giá trị của 2 phần tử
                        userList[j] = userList[j + 1];
                        userList[j + 1] = temp;
                    }
                } else if (sortOrder === "reverseAlphabetical") {
                    if (userList[j].userName.toLowerCase() < userList[j + 1].userName.toLowerCase()) {//nếu j đứng trước j+1 trong bảng chữ cái
                        let temp = userList[j];
                        userList[j] = userList[j + 1];
                        userList[j + 1] = temp;
                    }
                }
            }
        }
    }
    localStorage.setItem("userList", JSON.stringify(userList));//lưu lại danh sách người dùng theo thứ tự đã được sắp xếp
    loadPageData();//tải lại danh sách mỗi trang
}
document.addEventListener('DOMContentLoaded', function () {//đảm bảo mã js chỉ chạy sau khi html đã được tải và cây DOM đã sẵn sàng để thao tác
    let sortOrder = document.querySelector("#sortOrder").value;
    sortUsers(sortOrder);
});


function renderData(paginatedItems) {
    let templateStr = ``;
    for (let i = 0; i < paginatedItems.length; i++) {
        templateStr += `
        <tr>
            <th scope="row">${i + 1}</th>
            <td>${paginatedItems[i].email}</td>
            <td>${paginatedItems[i].userName}</td>
            <td>${paginatedItems[i].status ? "Normal" : "Locked"}</td>
            <td>
                <button style="margin: 3px;" class="btn btn-danger" onclick="updateStatus(${paginatedItems[i].id})">Lock/Unlock</button>
                <button style="margin: 3px;" class="btn btn-primary" onclick="edit(${paginatedItems[i].id})">Edit</button>
                <button style="margin: 3px;" class="btn btn-danger" onclick="deleteItem(${paginatedItems[i].id})">Delete</button>
                </td>
        </tr>
        `;
    }
    document.querySelector("tbody").innerHTML = templateStr;
}

function renderPagination() {
    let userList = searchResults.length > 0 || document.querySelector('input[type="text"]').value !== "" ? searchResults : JSON.parse(localStorage.getItem("userList")) || [];
    let totalPages = Math.ceil(userList.length / itemsPerPage);
    let paginationStr = ``;
    for (let i = 1; i <= totalPages; i++) {
        paginationStr += `
        <button class="btn ${i === nowPage ? `btn-primary` : `btn-secondary`}" onclick="gotoPage(${i})">${i}</button>
        `;
    }
    document.querySelector(".page_list").innerHTML = paginationStr;
}

function loadPageData() {
    let userList = searchResults.length > 0 || document.querySelector('input[type="text"]').value !== "" ? searchResults : JSON.parse(localStorage.getItem("userList")) || [];
    let start = (nowPage - 1) * itemsPerPage;
    let end = start + itemsPerPage;

    let paginatedItems = userList.slice(start, end);
    renderPagination();
    renderData(paginatedItems);
}

function gotoPage(page) {
    nowPage = page;
    loadPageData();
}

function search(event) {
    //tim bo qua dau
    let inputSearch = event.target.value.toLowerCase().normalize();
    let userList = JSON.parse(localStorage.getItem("userList")) || [];
    if (inputSearch === "") {
        searchResults = [];
    } else {
        searchResults = userList.filter(user => user.userName.toLowerCase().normalize().includes(inputSearch));
    }
    nowPage = 1;
    loadPageData();
}

function updateStatus(id) {
    let userList = JSON.parse(localStorage.getItem("userList"));
    for (let i = 0; i < userList.length; i++) {
        if (userList[i].id == id) {
            userList[i].status = !userList[i].status;
            break;
        }
    }
    localStorage.setItem("userList", JSON.stringify(userList));
    loadPageData();
}

let editId = null;

function addUser() {
    let newUser = {
        id: editId !== null ? editId : Date.now(),
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value,
        userName: document.querySelector("#name").value,
        status: true,
    };
    let userList = JSON.parse(localStorage.getItem("userList")) || [];

    let index = userList.findIndex((c) => c.id == newUser.id);
    if (index >= 0) {
        userList.splice(index, 1, newUser);
    } else {
        userList.push(newUser);
    }
    localStorage.setItem("userList", JSON.stringify(userList));
    editId = null;

    nowPage = Math.ceil(userList.length / itemsPerPage);
    gotoPage()

    loadPageData();

}

function edit(Id) {
    let userList = JSON.parse(localStorage.getItem("userList"));
    for (let i = 0; i < userList.length; i++) {
        if (userList[i].id == Id) {
            document.querySelector("#email").value = userList[i].email;
            document.querySelector("#password").value = userList[i].password;
            document.querySelector("#name").value = userList[i].userName;
            editId = Id;
            break;
        }
    }
}
function deleteItem(x) {
    for (let i = 0; i < userList.length; i++) {
        if (userList[i].id == x) {
            userList.splice(i, 1);
            localStorage.setItem("userList", JSON.stringify(userList))
            loadPageData();
        }
    }
}
loadPageData(); 
