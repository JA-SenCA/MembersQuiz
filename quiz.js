let correctAnswers = 0;
const totalQuestions = 144;

document.addEventListener("DOMContentLoaded", function() {
    // Add drop and dragover event handlers programmatically
    const panel1 = document.getElementById("panel1");

    panel1.addEventListener("drop", drop);
    panel1.addEventListener("dragover", allowDrop);
    fetchNamesFromCSV()
    generateQuestions(); // Assuming you have a generateQuestions() function
});


function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    if (draggedElement) {
        event.target.appendChild(draggedElement);
    }
}

function fetchNamesFromCSV() {
    fetch('names.csv')
        .then(response => response.text())
        .then(data => {
            const names = parseCSV(data);
            generateNames(names);
        })
        .catch(error => console.error('Error fetching CSV:', error));
}

function parseCSV(data) {
    const lines = data.split('\n');
    return lines.slice(1).map(line => line.trim()).filter(line => line);
}

function generateNames(names) {
    const panel1 = document.getElementById("panel1");
    names.forEach((name, index) => {
        const nameItem = document.createElement("div");
        nameItem.className = "name-item";
        nameItem.draggable = true;
        nameItem.ondragstart = drag;
        nameItem.id = "name" + (index + 1);
        nameItem.textContent = name;
        panel1.appendChild(nameItem);
    });
}

function generateQuestions() {
    const questionPanels = document.getElementById("question-panels");

    // Generate question panels with placeholders
    for (let i = 1; i <= totalQuestions; i++) {
        const picturePanel = document.createElement("div");
        picturePanel.className = "picture-panel";
        picturePanel.ondrop = dropToPlaceholder;
        picturePanel.ondragover = allowDrop;

        const picture = document.createElement("img");
        picture.src = "https://via.placeholder.com/150";
        picture.alt = "Person " + i;
        picture.className = "picture";

        const placeholder = document.createElement("div");
        placeholder.className = "name-placeholder";
        placeholder.id = "name-placeholder-" + i;
        placeholder.textContent = "Drop the correct name here";

        picturePanel.appendChild(picture);
        picturePanel.appendChild(placeholder);
        questionPanels.appendChild(picturePanel);
    }
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function dropToPlaceholder(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    var placeholderId = event.target.id;
    var placeholder = document.getElementById(placeholderId);

    if (placeholder && draggedElement) {
        // Check if the correct name is being dropped into the correct placeholder
        let correctId = placeholderId.replace("name-placeholder-", "name");
        if (data === correctId) {
            placeholder.textContent = draggedElement.textContent;
            correctAnswers++;
        } else {
            alert("Incorrect name. Try again!");
        }
    }
}
