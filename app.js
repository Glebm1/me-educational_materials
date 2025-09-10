const CLIENT_ID = "57760898537-6hie2j6c3ii0bqg7vbs1cjcmo7fd3qbu.apps.googleusercontent.com";
const API_KEY = "AIzaSyC1ZZJUPlCwuwdFCjbOV8zbXaGjEd4b6i8";
const FOLDER_ID = "1yGY867_7y-M5I5K3vUbnFXgV64quShRG";

const SCOPES = "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata.readonly";

// Загружаем клиентскую библиотеку и сразу инициализируем
gapi.load("client:auth2", () => {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
        scope: SCOPES
    }).then(() => {
        // Если пользователь не вошёл — сразу открываем окно входа
        if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
            gapi.auth2.getAuthInstance().signIn();
        }
        loadMaterials('');
    });
});

// Загрузка файла
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const file = document.getElementById("file").files[0];

    if (!file) return alert("Выберите файл!");

    const metadata = {
        name: `${title} - ${file.name}`,
        parents: [FOLDER_ID],
        description: description
    };

    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    form.append("file", file);

    const accessToken = gapi.auth.getToken().access_token;
    const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id", {
        method: "POST",
        headers: new Headers({ "Authorization": "Bearer " + accessToken }),
        body: form
    });

    if (res.ok) {
        alert("Файл успешно загружен!");
        loadMaterials('');
        e.target.reset();
    } else {
        alert("Ошибка при загрузке файла!");
    }
});

// Загрузка списка файлов
async function loadMaterials(query) {
    const response = await gapi.client.drive.files.list({
        q: `'${FOLDER_ID}' in parents and trashed=false and name contains '${query}'`,
        fields: "files(id, name, webViewLink, description)"
    });

    const list = document.getElementById("materialsList");
    list.innerHTML = "";

    response.result.files.forEach(file => {
        const li = document.createElement("li");
        li.className = "material-item";
        li.innerHTML = `
            <div class="material-info">
                <strong>${file.name}</strong><br>
                ${file.description || ""}
            </div>
            <a href="${file.webViewLink}" target="_blank" class="download-btn">Скачать</a>
        `;
        list.appendChild(li);
    });
}

// Поиск
document.getElementById("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const query = document.getElementById("searchQuery").value;
    loadMaterials(query);
});
