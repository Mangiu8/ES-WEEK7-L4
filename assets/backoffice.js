const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTcyZWMzOWZlMDMxZTAwMTliYTE0NzQiLCJpYXQiOjE3MDIwMzAzOTQsImV4cCI6MTcwMzIzOTk5NH0.eY6q98tzGfcJtYIqh8JhzpDD2Erk_6Si0eNKZiSYGC0";

const requestOptions = {
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
};

const resourceId = new URLSearchParams(window.location.search).get("resourceId");
const URL = resourceId
    ? `https://striveschool-api.herokuapp.com/api/product/${resourceId}`
    : "https://striveschool-api.herokuapp.com/api/product/";

const method = resourceId ? "PUT" : "POST";

window.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("changeBtn");
    const deleteBtn = document.querySelector("button[type='button'].btn-danger");
    const subtitle = document.getElementById("subtitle");
    const resetBtn = document.querySelector("button[type='button'].btn-warning");

    if (resourceId) {
        subtitle.innerText = " Modifica Prodotto";

        submitBtn.classList.remove("btn-primary");
        submitBtn.classList.add("btn-success");
        submitBtn.innerText = "Modifica prodotto";

        deleteBtn.classList.remove("d-none");
        resetBtn.classList.remove("d-none");

        isLoading(true);

        fetch(URL, requestOptions)
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error(`Errore nella richiesta GET: ${resp.status} ${resp.statusText}`);
                }
                return resp.json();
            })
            .then(({ name, description, price, imageUrl, brand }) => {
                document.getElementById("nome").value = name;
                document.getElementById("descrizione").value = description;
                document.getElementById("brand").value = brand;
                document.getElementById("foto").value = imageUrl;
                document.getElementById("prezzo").value = price;
            })
            .catch((error) => {
                console.error("Errore durante la richiesta GET:", error);
            })
            .finally(() => isLoading(false));
    } else {
        subtitle.innerText = " Aggiungi Prodotto";
    }
});

const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;

    const newProduct = {
        name: document.getElementById("nome").value,
        description: document.getElementById("descrizione").value,
        brand: document.getElementById("brand").value,
        imageUrl: document.getElementById("foto").value,
        price: Number(document.getElementById("prezzo").value),
    };

    isLoading(true);

    fetch(URL, {
        method: method,
        body: JSON.stringify(newProduct),
        headers: requestOptions.headers,
    })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error(`Errore nella richiesta ${method}: ${resp.status} ${resp.statusText}`);
            }
            return resp.json();
        })
        .then((createdProduct) => {
            if (resourceId) {
                showAlert(`Prodotto con id: ${createdProduct._id} modificato con successo!`, "success");
            } else {
                showAlert(`Prodotto con id: ${createdProduct._id} creato con successo!`, "success");
                form.reset();
            }
        })
        .catch((error) => {
            console.error(`Errore durante la richiesta ${method}: ${error.message}`);
            showAlert(`Errore durante ${method.toLowerCase()} del prodotto: ${error.message}`, "danger");
        })
        .finally(() => isLoading(false));
};

const isLoading = (boolean) => {
    const spinner = document.querySelector(".spinner-border");
    if (boolean) {
        spinner.classList.remove("d-none");
    } else {
        spinner.classList.add("d-none");
    }
};

const showAlert = (message, colorCode = "primary") => {
    const alertBox = document.getElementById("alert-box");
    alertBox.innerHTML = `<div class="alert alert-${colorCode}" role="alert">${message}</div>`;

    setTimeout(() => {
        alertBox.innerHTML = "";
    }, 4000);
};

const deleteProduct = () => {
    const hasConfirmed = confirm("Sei sicuro di voler rimuovere il prodotto?");
    if (hasConfirmed) {
        isLoading(true);
        const deleteURL = `https://striveschool-api.herokuapp.com/api/product/${resourceId}`;

        fetch(deleteURL, {
            method: "DELETE",
            headers: requestOptions.headers,
        })
            .then((resp) => {
                if (resp.ok) {
                    return resp.json();
                }
                throw new Error(`Errore nella richiesta di eliminazione: ${resp.status} ${resp.statusText}`);
            })
            .then((deletedProduct) => {
                showAlert(`Hai eliminato la risorsa ${deletedProduct.name} con id: ${deletedProduct._id}`, "danger");
                setTimeout(() => {
                    window.location.assign("./index.html");
                }, 4000);
            })
            .catch((error) => {
                console.error(error);
                showAlert(`Errore durante l'eliminazione del prodotto: ${error.message}`, "danger");
            })
            .finally(() => {
                isLoading(false);
            });
    }
};

const clearForm = () => {
    const myForm = document.getElementById("hero");
    const hasConfirmed = confirm("Sei sicuro di voler svuotare il form?");
    if (hasConfirmed) {
        myForm.reset();
    }
};
