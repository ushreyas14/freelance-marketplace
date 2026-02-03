const userSelect = document.getElementById('userSelect');
const loginBtn = document.getElementById('loginBtn');

let currentUser = null;
let allUsers = [];

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    setupEventListeners();
});

async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        allUsers = await response.json();
        populateUserSelect();
    } catch (error) {
        console.error('Failed to load users');
    }
}

function populateUserSelect() {
    allUsers.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = `${user.name} - $${user.balance}`;
        userSelect.appendChild(option);
    });
}

function setupEventListeners() {
    userSelect.addEventListener('change', () => {
        loginBtn.disabled = !userSelect.value;
    });

    loginBtn.addEventListener('click', () => {
        const userId = parseInt(userSelect.value);
        currentUser = allUsers.find(u => u.id === userId);
        if (currentUser) {

            document.getElementById('loginSection').classList.add('hidden');
            document.getElementById('mainApp').classList.remove('hidden');
            console.log('Logged in as:', currentUser.name);
        }
    });
}