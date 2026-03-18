const API_URL = "http://localhost:3000";

window.onload = () => {
    fetchTasks();
    loadSpecialData('note', 'notesArea');
    loadSpecialData('focus', 'focus-input');
};

// --- FETCH AND DISPLAY TASKS ---
async function fetchTasks() {
    const taskList = document.getElementById("taskList");
    try {
        const res = await fetch(`${API_URL}/items/task`);
        const data = await res.json();
        
        taskList.innerHTML = data.map(task => {
            let dateLabel = "";
            if (task.dueDate) {
                const today = new Date();
                const due = new Date(task.dueDate);
                today.setHours(0,0,0,0);
                due.setHours(0,0,0,0);

                const isOverdue = due < today && !task.completed;
                const color = isOverdue ? "#ff4d4d" : "rgba(0,0,0,0.5)";

                dateLabel = `<span style="display:block; font-size:0.8rem; margin-top:5px; color:${color}; font-weight:${isOverdue ? '600' : '400'};">
                                ${isOverdue ? '⚠️ Overdue: ' : '📅 Due: '} ${due.toLocaleDateString()}
                             </span>`;
            }

            return `
                <li>
                    <div style="flex: 1;">
                        <span class="${task.completed ? 'completed' : ''}">${escapeHTML(task.content)}</span>
                        ${dateLabel}
                    </div>
                    <div class="task-actions">
                        <button onclick="completeTask('${task._id}')">✔</button>
                        <button onclick="deleteTask('${task._id}')">❌</button>
                    </div>
                </li>
            `;
        }).join('');
    } catch (err) { console.error("Fetch Error:", err); }
}

// --- ADD NEW TASK ---
async function addTask() {
    const input = document.getElementById("taskInput");
    const dateInput = document.getElementById("dateInput");
    
    if (!input.value.trim()) return;

    try {
        await fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                task: input.value.trim(),
                dueDate: dateInput.value || null 
            })
        });
        
        input.value = "";
        dateInput.value = ""; 
        fetchTasks();
    } catch (err) { console.error("Add Error:", err); }
}

// --- SYNC NOTES & FOCUS (DEBOUNCED) ---
let syncTimeout;
function syncSpecialData(type, content) {
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(async () => {
        try {
            await fetch(`${API_URL}/special/update`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, content })
            });
            console.log(`${type} synced!`);
        } catch (err) { console.error("Sync Error:", err); }
    }, 800); 
}

// --- LOAD SPECIAL DATA ---
async function loadSpecialData(type, elementClass) {
    try {
        const res = await fetch(`${API_URL}/items/${type}`);
        const data = await res.json();
        if (data.length > 0) {
            if (type === 'note') {
                document.getElementById('notesArea').value = data[0].content;
            } else {
                const inputs = document.querySelectorAll('.focus-input');
                const values = JSON.parse(data[0].content);
                inputs.forEach((input, i) => {
                    input.value = values[i] || "";
                });
            }
        }
    } catch (err) { console.error("Load Error:", err); }
}

// --- EVENT LISTENERS ---
document.addEventListener('input', (e) => {
    if (e.target.id === 'notesArea') {
        syncSpecialData('note', e.target.value);
    }
    if (e.target.classList.contains('focus-input')) {
        const allFocus = Array.from(document.querySelectorAll('.focus-input')).map(i => i.value);
        syncSpecialData('focus', JSON.stringify(allFocus));
    }
});

async function deleteTask(id) {
    await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
}

async function completeTask(id) {
    await fetch(`${API_URL}/tasks/${id}`, { method: "PUT" });
    fetchTasks();
}

function escapeHTML(str) {
    if (!str || typeof str !== 'string') return ""; 
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
} 