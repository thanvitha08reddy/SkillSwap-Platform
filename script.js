// ADD USER
if (document.getElementById("skillForm")) {
    document.getElementById("skillForm").addEventListener("submit", function(e) {
        e.preventDefault();

        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let teach = document.getElementById("teach").value;
        let learn = document.getElementById("learn").value;

        let user = { name, email, teach, learn };

        // 🔥 SAVE TO LOCALSTORAGE
        let users = JSON.parse(localStorage.getItem("users") || "[]");
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Skill Added Successfully!");
        document.getElementById("skillForm").reset();
    });
}


// DISPLAY USERS
function displayUsers() {
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    let userList = document.getElementById("userList");
    let searchValue = document.getElementById("searchInput")?.value.toLowerCase() || "";

    if (!userList) return;

    userList.innerHTML = "";

    users.forEach((user, index) => {

        if (
            user.name.toLowerCase().includes(searchValue) ||
            user.teach.toLowerCase().includes(searchValue) ||
            user.learn.toLowerCase().includes(searchValue)
        ) {

            let match = users.find(u =>
                u.teach.toLowerCase() === user.learn.toLowerCase() &&
                u.learn.toLowerCase() === user.teach.toLowerCase()
            );

            let matchText = match
                ? `✅ Match Found!<br><small>Contact: ${match.email || "N/A"}</small>`
                : "❌ No Match";

            let card = `
                <div class="col-md-4">
                    <div class="card p-3 mb-3 text-center">
                        <h5 class="text-primary">${user.name}</h5>
                        <p><strong>Teaches:</strong> ${user.teach}</p>
                        <p><strong>Wants:</strong> ${user.learn}</p>
                        <p class="${match ? 'text-success' : 'text-danger'}">${matchText}</p>

                        ${match && match.email ? `<a href="mailto:${match.email}" class="btn btn-success mt-2">Connect</a>` : ""}

                        <button class="btn btn-danger mt-2" onclick="deleteUser(${index})">Delete</button>
                    </div>
                </div>
            `;

            userList.innerHTML += card;
        }
    });
}


// DELETE USER
function deleteUser(index) {
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    users.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(users));
    displayUsers();
}


// SEARCH
document.getElementById("searchInput")?.addEventListener("input", displayUsers);


// LOAD USERS
displayUsers();


// DARK MODE
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}