document.getElementById('sync-btn').addEventListener('click', fetchDataSync);
document.getElementById('async-btn').addEventListener('click', fetchDataAsync);
document.getElementById('fetch-btn').addEventListener('click', fetchDataWithPromises);

// Utility to update the table
function updateTable(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear table
    data.forEach(item => {
        const row = document.createElement('tr');
        const firstName = document.createElement('td');
        const lastName = document.createElement('td');
        const id = document.createElement('td');
        
        const names = item.name.split(' ');
        firstName.textContent = names[0];
        lastName.textContent = names[1];
        id.textContent = item.id;

        row.appendChild(firstName);
        row.appendChild(lastName);
        row.appendChild(id);
        tableBody.appendChild(row);
    });
}

// 1. Synchronous XMLHttpRequest
function fetchDataSync() {
    try {
        const referenceData = getDataSync('data/reference.json');
        const data1 = getDataSync(`data/${referenceData.data_location}`);
        const data2 = getDataSync(`data/${data1.data_location}`);
        const data3 = getDataSync('data/data3.json');
        const allData = [...data1.data, ...data2.data, ...data3.data];
        updateTable(allData);
    } catch (error) {
        console.error('Error in Synchronous fetching:', error);
    }
}

function getDataSync(url) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, false); // synchronous
    xhr.send(null);
    if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
    } else {
        throw new Error('Failed to fetch ' + url);
    }
}

// 2. Asynchronous XMLHttpRequest with Callbacks
function fetchDataAsync() {
    getDataAsync('data/reference.json', (referenceData) => {
        getDataAsync(`data/${referenceData.data_location}`, (data1) => {
            getDataAsync(`data/${data1.data_location}`, (data2) => {
                getDataAsync('data/data3.json', (data3) => {
                    const allData = [...data1.data, ...data2.data, ...data3.data];
                    updateTable(allData);
                });
            });
        });
    });
}

function getDataAsync(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true); // asynchronous
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send();
}

// 3. Fetch with Promises
function fetchDataWithPromises() {
    fetch('data/reference.json')
        .then(response => response.json())
        .then(referenceData => fetch(`data/${referenceData.data_location}`))
        .then(response => response.json())
        .then(data1 => fetch(`data/${data1.data_location}`)
            .then(response => response.json())
            .then(data2 => fetch('data/data3.json')
                .then(response => response.json())
                .then(data3 => {
                    const allData = [...data1.data, ...data2.data, ...data3.data];
                    updateTable(allData);
                })
            )
        )
        .catch(error => console.error('Error in fetch chain:', error));
}
