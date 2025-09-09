// Загрузка материалов при открытии страницы
document.addEventListener('DOMContentLoaded', () => loadMaterials(''));

// Обработка формы добавления
document.getElementById('uploadForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const file = document.getElementById('file').files[0];
    
    if (file) {
        // Преобразуем файл в base64
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Data = e.target.result;
            const id = Date.now();
            const materials = JSON.parse(localStorage.getItem('materials') || '[]');
            materials.push({ id, title, description, filename: file.name, fileData: base64Data });
            try {
                localStorage.setItem('materials', JSON.stringify(materials));
                loadMaterials('');
                e.target.reset();
            } catch (error) {
                alert('Ошибка: слишком большой файл или недостаточно места в localStorage. Попробуйте файл меньшего размера.');
            }
        };
        reader.readAsDataURL(file);
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
            <button class="download-btn" onclick="downloadFile(${m.id}, '${m.filename}', '${m.fileData}')">Скачать</button>
        `;
        list.appendChild(li);
    });
}

// Функция скачивания файла
function downloadFile(id, filename, base64Data) {
    try {
        const linkSource = base64Data;
        const a = document.createElement('a');
        a.href = linkSource;
        a.download = filename;
        a.click();
    } catch (error) {
        alert('Ошибка при скачивании файла. Попробуйте загрузить заново.');
    }
}
