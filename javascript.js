// Sample data
const rooms = [
    { id: 1, name: "Sala 1 - Executiva", capacity: 10, equipment: "Projetor, Wi-Fi, Quadro Branco", available: true },
    { id: 2, name: "Sala 2 - Reunião", capacity: 6, equipment: "TV, Wi-Fi", available: true },
    { id: 3, name: "Sala 3 - Conferência", capacity: 20, equipment: "Projetor, Sistema de Som, Wi-Fi", available: false },
    { id: 4, name: "Sala 4 - Pequenos Grupos", capacity: 4, equipment: "Quadro Branco", available: true },
    { id: 5, name: "Sala 5 - Treinamento", capacity: 15, equipment: "Projetor, Wi-Fi, Quadro Branco", available: true }
];

// Reservations data
let reservations = [
    { 
        id: "RES-001", 
        roomId: 1, 
        roomName: "Sala 1 - Executiva", 
        date: "2025-11-15", 
        startTime: "14:00", 
        endTime: "15:00", 
        purpose: "Reunião de equipe", 
        participants: 8, 
        status: "active",
        userId: "user1"
    },
    { 
        id: "RES-002", 
        roomId: 2, 
        roomName: "Sala 2 - Reunião", 
        date: "2025-11-14", 
        startTime: "10:00", 
        endTime: "11:30", 
        purpose: "Apresentação para cliente", 
        participants: 5, 
        status: "completed",
        userId: "user1"
    },
    { 
        id: "RES-003", 
        roomId: 3, 
        roomName: "Sala 3 - Conferência", 
        date: "2025-11-16", 
        startTime: "09:00", 
        endTime: "12:00", 
        purpose: "Workshop de treinamento", 
        participants: 18, 
        status: "cancelled",
        userId: "user1"
    }
];

// Current user
let currentUser = null;

// DOM elements
const loginPage = document.getElementById('loginPage');
const appContainer = document.getElementById('appContainer');
const userInfo = document.getElementById('userInfo');
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('loginForm');
const roomsGrid = document.getElementById('roomsGrid');
const roomSelect = document.getElementById('roomSelect');
const reservationForm = document.getElementById('reservationForm');
const newReservationBtn = document.getElementById('newReservationBtn');
const backToDashboardBtn = document.getElementById('backToDashboardBtn');
const navTabs = document.querySelectorAll('.nav-tab');
const pages = document.querySelectorAll('.page');
const reservationsTableBody = document.getElementById('reservationsTableBody');
const filterStatus = document.getElementById('filterStatus');
const filterRoom = document.getElementById('filterRoom');
const filterDate = document.getElementById('filterDate');
const applyFiltersBtn = document.getElementById('applyFiltersBtn');

// Login functionality
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation (in a real app, this would be done on the server)
    if (email === 'admin@email.com' && password === 'senha123') {
        currentUser = {
            id: 'user1',
            name: 'Administrador',
            email: email
        };
        
        // Show app and hide login
        loginPage.classList.remove('active');
        appContainer.style.display = 'block';
        userInfo.style.display = 'flex';
        userName.textContent = currentUser.name;
        
        // Initialize app data
        initializeApp();
    } else {
        alert('Credenciais inválidas. Use: admin@email.com / senha123');
    }
});

// Logout functionality
logoutBtn.addEventListener('click', function() {
    currentUser = null;
    appContainer.style.display = 'none';
    userInfo.style.display = 'none';
    loginPage.classList.add('active');
    loginForm.reset();
});

// Navigation functionality
navTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        const targetPage = this.getAttribute('data-page');
        
        // Update active tab
        navTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Show target page
        pages.forEach(page => {
            if (page.id === targetPage) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });
    });
});

// New reservation button
newReservationBtn.addEventListener('click', function() {
    // Update active tab
    navTabs.forEach(t => t.classList.remove('active'));
    document.querySelector('.nav-tab[data-page="reservationPage"]').classList.add('active');
    
    // Show reservation page
    pages.forEach(page => {
        if (page.id === 'reservationPage') {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
});

// Back to dashboard from confirmation
backToDashboardBtn.addEventListener('click', function() {
    // Update active tab
    navTabs.forEach(t => t.classList.remove('active'));
    document.querySelector('.nav-tab[data-page="dashboardPage"]').classList.add('active');
    
    // Show dashboard page
    pages.forEach(page => {
        if (page.id === 'dashboardPage') {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
});

// Initialize app data
function initializeApp() {
    // Populate rooms grid
    renderRooms();
    
    // Populate room select
    populateRoomSelect();
    
    // Populate reservations history
    renderReservations();
    
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('reservationDate').min = today;
    document.getElementById('filterDate').value = today;
}

// Render rooms on dashboard
function renderRooms() {
    roomsGrid.innerHTML = '';
    
    rooms.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';
        
        roomCard.innerHTML = `
            <div class="room-header">
                <div class="room-name">${room.name}</div>
                <div class="room-capacity">${room.capacity} pessoas</div>
            </div>
            <div class="room-equipment">
                <strong>Equipamentos:</strong> ${room.equipment}
            </div>
            <div class="room-status ${room.available ? 'status-available' : 'status-reserved'}">
                ${room.available ? 'Disponível' : 'Reservada'}
            </div>
        `;
        
        roomsGrid.appendChild(roomCard);
    });
}

// Populate room select in reservation form
function populateRoomSelect() {
    roomSelect.innerHTML = '<option value="">Selecione uma sala</option>';
    filterRoom.innerHTML = '<option value="">Todas as salas</option>';
    
    rooms.forEach(room => {
        if (room.available) {
            const option = document.createElement('option');
            option.value = room.id;
            option.textContent = room.name;
            roomSelect.appendChild(option);
            
            // Also add to filter
            const filterOption = document.createElement('option');
            filterOption.value = room.id;
            filterOption.textContent = room.name;
            filterRoom.appendChild(filterOption);
        }
    });
}

// Handle reservation form submission
reservationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const roomId = parseInt(roomSelect.value);
    const date = document.getElementById('reservationDate').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const purpose = document.getElementById('purpose').value;
    const participants = parseInt(document.getElementById('participants').value);
    
    // Check for time conflicts
    const conflict = checkTimeConflict(roomId, date, startTime, endTime);
    
    if (conflict) {
        alert('Conflito de horário! Esta sala já está reservada para o horário selecionado.');
        return;
    }
    
    // Create new reservation
    const newReservation = {
        id: generateReservationId(),
        roomId: roomId,
        roomName: rooms.find(r => r.id === roomId).name,
        date: date,
        startTime: startTime,
        endTime: endTime,
        purpose: purpose,
        participants: participants,
        status: 'active',
        userId: currentUser.id
    };
    
    reservations.push(newReservation);
    
    // Update room availability if needed
    const room = rooms.find(r => r.id === roomId);
    if (room) {
        // In a real app, we would check if there are any available slots
        // For simplicity, we'll just mark as reserved if this is the first reservation
        room.available = false;
    }
    
    // Show confirmation page
    showConfirmation(newReservation);
    
    // Reset form
    reservationForm.reset();
    
    // Update UI
    renderRooms();
    populateRoomSelect();
});

// Check for time conflicts
function checkTimeConflict(roomId, date, startTime, endTime) {
    return reservations.some(reservation => 
        reservation.roomId === roomId && 
        reservation.date === date && 
        reservation.status === 'active' &&
        ((startTime >= reservation.startTime && startTime < reservation.endTime) ||
         (endTime > reservation.startTime && endTime <= reservation.endTime) ||
         (startTime <= reservation.startTime && endTime >= reservation.endTime))
    );
}

// Generate unique reservation ID
function generateReservationId() {
    const count = reservations.filter(r => r.id.startsWith('RES-')).length + 1;
    return `RES-${count.toString().padStart(3, '0')}`;
}

// Show confirmation page
function showConfirmation(reservation) {
    document.getElementById('confirmationId').textContent = `ID: ${reservation.id}`;
    document.getElementById('confRoomName').textContent = reservation.roomName;
    document.getElementById('confDate').textContent = formatDate(reservation.date);
    document.getElementById('confTime').textContent = `${reservation.startTime} - ${reservation.endTime}`;
    document.getElementById('confPurpose').textContent = reservation.purpose;
    
    // Update active tab
    navTabs.forEach(t => t.classList.remove('active'));
    
    // Show confirmation page
    pages.forEach(page => {
        if (page.id === 'confirmationPage') {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
}

// Render reservations in history
function renderReservations() {
    reservationsTableBody.innerHTML = '';
    
    // Apply filters
    let filteredReservations = [...reservations];
    
    if (filterStatus.value) {
        filteredReservations = filteredReservations.filter(r => r.status === filterStatus.value);
    }
    
    if (filterRoom.value) {
        filteredReservations = filteredReservations.filter(r => r.roomId === parseInt(filterRoom.value));
    }
    
    if (filterDate.value) {
        filteredReservations = filteredReservations.filter(r => r.date === filterDate.value);
    }
    
    // Show only current user's reservations
    filteredReservations = filteredReservations.filter(r => r.userId === currentUser.id);
    
    // Render table rows
    filteredReservations.forEach(reservation => {
        const row = document.createElement('tr');
        
        let statusClass = '';
        let statusText = '';
        
        switch(reservation.status) {
            case 'active':
                statusClass = 'status-active';
                statusText = 'Ativa';
                break;
            case 'completed':
                statusClass = 'status-completed';
                statusText = 'Concluída';
                break;
            case 'cancelled':
                statusClass = 'status-cancelled';
                statusText = 'Cancelada';
                break;
        }
        
        row.innerHTML = `
            <td>${reservation.id}</td>
            <td>${reservation.roomName}</td>
            <td>${formatDate(reservation.date)}</td>
            <td>${reservation.startTime} - ${reservation.endTime}</td>
            <td>${reservation.purpose}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td class="action-buttons">
                ${reservation.status === 'active' ? 
                  `<button class="btn btn-danger btn-sm cancel-btn" data-id="${reservation.id}">Cancelar</button>` : 
                  ''}
            </td>
        `;
        
        reservationsTableBody.appendChild(row);
    });
    
    // Add event listeners to cancel buttons
    document.querySelectorAll('.cancel-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const reservationId = this.getAttribute('data-id');
            cancelReservation(reservationId);
        });
    });
}

// Cancel reservation
function cancelReservation(reservationId) {
    if (confirm('Tem certeza que deseja cancelar esta reserva?')) {
        const reservation = reservations.find(r => r.id === reservationId);
        if (reservation) {
            reservation.status = 'cancelled';
            
            // Update room availability
            const room = rooms.find(r => r.id === reservation.roomId);
            if (room) {
                // Check if there are any other active reservations for this room
                const hasOtherReservations = reservations.some(r => 
                    r.roomId === reservation.roomId && 
                    r.status === 'active' && 
                    r.id !== reservationId
                );
                
                room.available = !hasOtherReservations;
            }
            
            // Re-render reservations and rooms
            renderReservations();
            renderRooms();
            populateRoomSelect();
            
            alert('Reserva cancelada com sucesso!');
        }
    }
}

// Apply filters to reservations
applyFiltersBtn.addEventListener('click', function() {
    renderReservations();
});

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Initialize date inputs with today's date
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('reservationDate').value = today;
    document.getElementById('filterDate').value = today;
});
