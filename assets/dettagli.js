const URL = "https://striveschool-api.herokuapp.com/api/product/";
const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTcyZWMzOWZlMDMxZTAwMTliYTE0NzQiLCJpYXQiOjE3MDIwMzAzOTQsImV4cCI6MTcwMzIzOTk5NH0.eY6q98tzGfcJtYIqh8JhzpDD2Erk_6Si0eNKZiSYGC0";
const requestOptions = {
    headers: {
        Authorization: `Bearer ${token}`,
    },
};

const params = new URLSearchParams(window.location.search);
const id = params.get("resourceId");
console.log("RESOURCE ID: ", id);

window.onload = () => {
    fetch(`${URL}${id}`, requestOptions)
        .then((resp) => {
            if (!resp.ok) {
                throw new Error(`Errore nella richiesta GET: ${resp.status} ${resp.statusText}`);
            }
            return resp.json();
        })
        .then((product) => {
            console.log("Risposta JSON dall'API:", product);

            const { name, description, price, _id, imageUrl, brand, createdAt, updatedAt } = product;

            const container = document.getElementById("dettail-container");
            container.innerHTML = `
            <div class="row d-flex justify-content-center">
                    <div class="col col-md-6">
                        <div class="card">
                            <img class="card-img-top" src="${imageUrl}">
                            <div class="card-body">
                                <h4 class="card-title ms-3">${brand}</h4>
                                <h5 class="card-title ms-3">${name}</h5>
                                <p class="card-text ms-3">${description}</p>
                                <p class="card-text prezzo ms-3">${price}$</p>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><strong>id:</strong> ${_id}</li>
                                    <li class="list-group-item"><strong>createdAt:</strong> ${new Date(
                                        createdAt
                                    ).toLocaleString("it-IT")}</li>
                                    <li class="list-group-item"><strong>updatedAt:</strong> ${new Date(
                                        updatedAt
                                    ).toLocaleString("it-IT")}</li>
                                </ul>
                                <button class="btn personalButton mt-4" onclick="handleEdit()">Modifica Prodotto</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
        })
        .catch((error) => {
            console.error("Errore durante la richiesta GET:", error);
        });
};
const handleEdit = () => {
    window.location.assign("./back-office.html?resourceId=" + id);
};
