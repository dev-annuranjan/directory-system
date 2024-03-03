const state = {
    folder: {
        app: {},
        app2: {
            file1: 'txt',
            file2: '',
            file3: 'js',
            level1: {
                level2: {
                    level3: {
                        file4: 'txt'
                    }
                }
            }
        },
        file3: "txt",
        file4: ".js"
    },
    entityType: {
        folder: 1,
        file: 2
    },
    eventType: {
        keypress: 1,
        focusOut: 2
    }
}
renderPage();

function renderPage() {
    const {folder} = state;

    const addFolderEl = document.getElementById("add-folder");
    addFolderEl.setAttribute('data-name', 'folder');
    const addFileEl = document.getElementById("add-file");
    addFileEl.setAttribute('data-name', 'folder');

    addFolderEl.addEventListener('click', addEntityProxy(state.entityType.folder));
    addFileEl.addEventListener('click', addEntityProxy(state.entityType.file));

    const folderDisplayEl = document.getElementById('folder-display');
    folderDisplayEl.setAttribute('data-name', 'folder');

    folderDisplayEl.append(createFolderStructure(folder, "folder"));
}

function addEntityProxy(type) {
    return function (event) {
        const inputTargetParent = event.target.id ?
            document.getElementById('folder-display') :
            event.target.parentElement.parentElement.parentElement.parentElement;
        addEntity(inputTargetParent, type);
    }
}

function addEntity(inputTargetParentEl, type) {
    const folderStringPath = inputTargetParentEl.getAttribute('data-name').split("-");

    let targetFolder = state.folder;
    for (let i = 1; i < folderStringPath.length; i++) {
        const path = folderStringPath[i];
        targetFolder = targetFolder[path];
    }

    const targetEl = inputTargetParentEl.lastElementChild;
    if (targetEl.lastElementChild?.tagName === "INPUT") return;
    const inputEl = document.createElement('input');

    inputEl.addEventListener("keyup", (event) => addEntityHandler(event, inputEl, targetEl, targetFolder, state.eventType.keypress, type));
    inputEl.addEventListener('focusout', (event) => addEntityHandler(event, inputEl, targetEl, targetFolder, state.eventType.focusOut, type));

    targetEl.append(inputEl);
    inputEl.focus();
}

function addEntityHandler(event, inputEl, inputParentEl, targetFolder, eventType, type) {
    // debugger;
    if (eventType === state.eventType.keypress && event.key !== "Enter") return;
    const entityName = inputEl.value;
    inputEl.remove();
    if (entityName) {
        if (targetFolder[entityName]) return;
        let newElement;
        if (type === state.entityType.file) {
            targetFolder[entityName] = entityName;
            newElement = createFileNodeEl(entityName);
        } else {
            const path = inputParentEl.parentElement.getAttribute("data-name")
            targetFolder[entityName] = {};
            newElement = createFolderNodeEl(entityName, targetFolder[entityName], path);
        }
        inputParentEl.appendChild(newElement)
    }
}

function createFolderStructure(folder, parentName) {
    const folderStructureEl = document.createElement('div');

    for (const entity in folder) {
        if (typeof folder[entity] === "object") {
            const folderNodeEl = createFolderNodeEl(entity, folder[entity], parentName);
            folderStructureEl.append(folderNodeEl);
        } else {
            folderStructureEl.appendChild(createFileNodeEl(entity));
        }
    }

    return folderStructureEl;
}

function createFolderNodeEl(folderName, folder, parentName) {
    const folderNodeEl = document.createElement('div');
    folderNodeEl.className = "folder-node";
    parentName = `${parentName}-${folderName}`;
    folderNodeEl.setAttribute('data-name', parentName);

    const folderTitleEl = document.createElement('div');
    folderTitleEl.className = "folder-node-title";

    const folderHeaderEl = document.createElement('span');
    const iconContainerEl = createIconContainerEl("fa-folder");
    const nameEl = document.createElement('span');
    nameEl.innerText = folderName;

    const folderNodeAddFolderIconEl = createIconContainerEl('fa-folder-plus', 'click', addEntityProxy(state.entityType.folder));
    folderNodeAddFolderIconEl.className = 'folder-node-add-folder';
    const folderNodeAddFileIconEl = createIconContainerEl('fa-file-circle-plus', 'click', addEntityProxy(state.entityType.file));
    folderNodeAddFileIconEl.className = 'folder-node-add-file';

    folderHeaderEl.append(iconContainerEl, nameEl, folderNodeAddFolderIconEl, folderNodeAddFileIconEl);
    folderTitleEl.append(folderHeaderEl, createIconContainerEl("fa-trash"));

    const folderBodyEl = createFolderStructure(folder, parentName);
    folderBodyEl.className = "folder-node-body";
    folderNodeEl.append(folderTitleEl, folderBodyEl);
    return folderNodeEl;
}

function createFileNodeEl(fileName) {
    const fileEl = document.createElement('div');
    fileEl.className = "file-node";
    const fileIconAndNameContainerEl = document.createElement('span');

    const fileIconEl = createIconContainerEl("fa-file");
    const fileNameContainerEl = document.createElement('span');
    fileNameContainerEl.innerText = fileName;
    fileIconAndNameContainerEl.append(fileIconEl, fileNameContainerEl);
    fileEl.append(fileIconAndNameContainerEl,
        createIconContainerEl("fa-trash", "click", deleteHandlerCallback));
    return fileEl;
}

function createIconContainerEl(iconName, eventListenerType = null, eventListener = null) {
    const iconContainerEl = document.createElement('span');
    const iconEl = document.createElement('i');
    iconEl.classList.add("fa-solid", iconName);
    if (eventListenerType) iconEl.addEventListener(eventListenerType, eventListener);
    iconContainerEl.appendChild(iconEl);
    return iconContainerEl;
}

function deleteHandlerCallback() {
    console.log("deleted");
}

