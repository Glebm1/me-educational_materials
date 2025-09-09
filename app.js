// Хранилище файлов в памяти
let fileStore = new Map();

// Загрузка материалов при открытии страницы
document.addEventListener('DOMContentLoaded', () => loadMaterials(''));

// Обработка формы добавления
document.getElementById('uploadForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const file = document.getElementById('file').files[0];
    if (file) {
        const id = Date.now();
        fileStore.set(id, file);
        const materials = JSON.parse(localStorage.getItem('materials') || '[]');
        materials.push({ id, title, description, filename: file.name });
        localStorage.setItem('materials', JSON.stringify(materials));
        loadMaterials('');
        e.target.reset();
    }
});

// Обработка поиска
document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('searchQuery').value;
    loadMaterials(query);
});

// Функция загрузки материалов
function loadMaterials(query) {
    const materials = JSON.parse(localStorage.getItem('materials') || '[]');
    const filtered = materials.filter(m => m.title.toLowerCase().includes(query.toLowerCase()));
    const list = document.getElementById('materialsList');
    list.innerHTML = '';
    filtered.forEach(m => {
        const li = document.createElement('li');
        li.className = 'material-item';
        li.innerHTML = `
            <div class="material-info">
                <strong>${m.title}</strong>: ${m.description}
            </div>
            <button class="download-btn" onclick="downloadFile(${m.id}, '${m.filename}')">Скачать</button>
        `;
        list.appendChild(li);
    });
}

// Функция скачивания файла
function downloadFile(id, filename) {
    const file = fileStore.get(id);
    if (file) {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    } else {
        alert('Файл недоступен. Попробуйте загрузить заново.');
    }
}