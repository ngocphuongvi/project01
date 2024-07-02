const container = document.getElementsByClassName(`sign-in-container`);

localStorage.setItem("userList", JSON.stringify(userList));
function signIn(event) {
    event.preventDefault();
    let userInfor = {
        userName: event.target.userName.value,
        password: event.target.password.value,
    }
    let userList = JSON.parse(localStorage.getItem(`userList`));
    let userResult = null;
    for (let i = 0; i < userList.length; i++) {
        if (userList[i].userName == userInfor.userName) {
            userResult = userList[i];
            break;
        }
    }

    if (!userResult) {
        alert("User does not exist.")
        return;
    }

    if (userResult.password != userInfor.password) {
        alert("Incorrect password!")
        return;
    }

    if (!userResult.status) {
        alert("The account has been locked. Please contact the administrator.")
        return;
    }
    localStorage.setItem("userLogin", JSON.stringify(userResult));
    window.location.href = "/";
};