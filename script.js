const usersTag = document.getElementById("user_div");
const url = "http://nodetuto.onrender.com/users";

let userList;
const getAllUsers = async () => {
  let users = null;
  const response = await fetch(url);
  users = await response.json();

  users.forEach((user) => {
    const email = user.email;
    const name = user.name;
    const password = user.password;
    const userList = `
    <div class="users">
      <ul>
        <li>${user.name}</li>
        <li>${user.email}</li>
      </ul>
      <button
        class="btn btn-danger"
        onclick="deleteUser('${email}')"
      >
        Delete
      </button>
      <button
        class="btn btn-primary"
        onclick="toUpdate('${name}', '${password}', '${email}')"
      >
        Update
      </button>
    </div>
    `;

    usersTag.innerHTML += userList;
  });
};

getAllUsers();

const register = async () => {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  if (
    name.value.length === 0 ||
    email.value.length === 0 ||
    password.value.length === 0
  ) {
    alert("Please, fill the form");
  } else {
    const newUser = {
      name: name.value,
      email: email.value,
      password: password.value,
    };
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(newUser),
    });
    const data = await response.json();
    if (data === "existed") {
      alert("this email is already used");
      return;
    }

    usersTag.innerHTML = "";
    getAllUsers();
    name.value = "";
    email.value = "";
    password.value = "";
  }
};

async function deleteUser(user) {
  let data = null;
  console.log(user);
  const response = await fetch(url, {
    method: "DELETE",
    body: user,
  });
  data = await response.json();
  console.log(data);
  if (data === "notExisted") {
    alert("the user is not exist");
    return;
  }

  usersTag.innerHTML = "";
  getAllUsers();
}

const newNameTag = document.getElementById("newName");
const newEmailTag = document.getElementById("newEmail");
const newPasswordTag = document.getElementById("newPassword");
const updateForm = document.getElementById("updateForm");
function toUpdate(name, password, email) {
  newEmailTag.value = email;
  newNameTag.value = name;
  newPasswordTag.value = password;

  updateForm.style.display = "block";
}

async function updateUser() {
  const updateUser = {
    newName: newNameTag.value,
    newEmail: newEmailTag.value,
    newPassword: newPasswordTag.value,
  };
  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(updateUser),
  });
  const data = await response.json();
  console.log(data);

  usersTag.innerHTML = "";
  getAllUsers();
  updateForm.style.display = "none";
}

const form = document.getElementById("form");
const fileInput = document.getElementById("files");

const uploadFiles = async () => {
  const formData = new FormData(form);
  const response = await fetch("http://nodetuto.onrender.com/fileUpload", {
    method: "POST",
    body: formData,
  });
  alert(await response.json());
  fileInput.value = "";
};
