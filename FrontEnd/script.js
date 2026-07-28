// Récupère le token enregistré lors de la connexion
const token = localStorage.getItem("token");

// Sélectionne le lien login dans le menu grâce à son ID
const loginLink = document.getElementById("login-link");

// Sélectionne la galerie principale
const gallery = document.querySelector(".gallery");

// Sélectionne la zone des filtres
const filters = document.querySelector(".filters");

// Sélectionne le bandeau du mode édition
const editBanner = document.querySelector(".edit-banner");

// Sélectionne le bouton Modifier
const editButton = document.querySelector(".edit-button");

// Sélectionne la modale
const modal = document.querySelector(".modal");

// Sélectionne le bouton de fermeture de la modale
const modalClose = document.querySelector(".modal-close");

// Sélectionne la vue galerie de la modale
const modalGalleryView = document.querySelector(".modal-gallery-view");

// Sélectionne la galerie située dans la modale
const modalGallery = document.querySelector(".modal-gallery");

// Sélectionne la vue formulaire de la modale
const modalFormView = document.querySelector(".modal-form-view");

// Sélectionne le bouton Ajouter une photo
const addPhotoButton = document.querySelector(".add-photo-button");

// Sélectionne la flèche de retour de la modale
const modalBack = document.querySelector(".modal-back");

// Sélectionne le champ permettant de choisir une image grâce à son ID
const workImageInput = document.getElementById("work-image");

// Sélectionne l'image utilisée pour afficher la preview grâce à son ID
const imagePreview = document.getElementById("image-preview");

// Sélectionne la liste des catégories du formulaire grâce à son ID
const workCategorySelect = document.getElementById("work-category");

// Sélectionne le formulaire d'ajout d'un projet grâce à son ID
const addWorkForm = document.getElementById("add-work-form");

// Sélectionne le champ titre du projet grâce à son ID
const workTitleInput = document.getElementById("work-title");

// Sélectionne le bouton Valider du formulaire
const submitWorkButton = addWorkForm.querySelector('input[type="submit"]');

// Sélectionne le contenu affiché avant le choix d'une image
const uploadPlaceholder = document.querySelector(".upload-placeholder");

// Stocke tous les travaux récupérés depuis l'API
let allWorks = [];


// --------------------------------------------------
// GESTION DU FORMULAIRE D'AJOUT
// --------------------------------------------------

// Met à jour le bouton Valider selon l'état du formulaire
function updateSubmitButton() {
  const selectedFile = workImageInput.files[0];
  const title = workTitleInput.value.trim();
  const category = workCategorySelect.value;

  // Active le bouton seulement si les 3 informations sont présentes
  if (selectedFile && title && category) {
    submitWorkButton.style.backgroundColor = "#1D6154";
    submitWorkButton.disabled = false;
  } else {
    submitWorkButton.style.backgroundColor = "#A7A7A7";
    submitWorkButton.disabled = true;
  }
}


// Réinitialise complètement le formulaire d'ajout
function resetAddWorkForm() {
  // Vide tous les champs du formulaire
  addWorkForm.reset();

  // Cache la preview
  imagePreview.style.display = "none";

  // Retire l'ancienne image de la preview
  imagePreview.removeAttribute("src");

  // Réaffiche la zone permettant de choisir une image
  uploadPlaceholder.style.display = "flex";

  // Remet le bouton Valider en gris et désactivé
  updateSubmitButton();
}


// Désactive le bouton Valider au chargement de la page
updateSubmitButton();


// Affiche une preview lorsque l'utilisateur sélectionne une image
workImageInput.addEventListener("change", function () {
  // Récupère le premier fichier sélectionné
  const selectedFile = workImageInput.files[0];

  // Vérifie que l'image ne dépasse pas 4 Mo
  if (selectedFile && selectedFile.size > 4 * 1024 * 1024) {
    alert("L'image ne doit pas dépasser 4 Mo.");

    // Vide le champ image
    workImageInput.value = "";

    // Met à jour l'état du bouton Valider
    updateSubmitButton();

    return;
  }

  // Vérifie qu'un fichier a bien été sélectionné
  if (selectedFile) {
    // Crée une URL temporaire pour afficher l'image
    imagePreview.src = URL.createObjectURL(selectedFile);

    // Affiche la preview
    imagePreview.style.display = "block";

    // Cache la zone d'ajout de photo
    uploadPlaceholder.style.display = "none";
  }

  // Vérifie si le bouton Valider peut devenir actif
  updateSubmitButton();
});


// Vérifie le formulaire lorsque l'utilisateur écrit le titre
workTitleInput.addEventListener("input", updateSubmitButton);


// Vérifie le formulaire lorsque l'utilisateur choisit une catégorie
workCategorySelect.addEventListener("change", updateSubmitButton);


// --------------------------------------------------
// AJOUT D'UN NOUVEAU PROJET
// --------------------------------------------------

addWorkForm.addEventListener("submit", function (event) {
  // Empêche le rechargement automatique de la page
  event.preventDefault();

  // Récupère les valeurs du formulaire
  const selectedFile = workImageInput.files[0];
  const title = workTitleInput.value.trim();
  const category = workCategorySelect.value;

  // Sécurité supplémentaire :
  // bloque l'envoi si une information manque
  if (!selectedFile || !title || !category) {
    return;
  }

  // Crée un objet FormData pour envoyer l'image
  // et les informations du projet
  const formData = new FormData();

  // Ajoute l'image
  formData.append("image", selectedFile);

  // Ajoute le titre
  formData.append("title", title);

  // Ajoute la catégorie
  formData.append("category", category);

  // Envoie le nouveau projet à l'API
  fetch("http://localhost:5678/api/works", {
    method: "POST",

    // Envoie le token pour prouver que l'utilisateur est connecté
    headers: {
      Authorization: `Bearer ${token}`
    },

    // Envoie les données du formulaire
    body: formData
  })
    .then(function (response) {
      // Vérifie que l'ajout a bien été accepté par l'API
      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du projet");
      }

      // Transforme la réponse en données JavaScript
      return response.json();
    })
    .then(function (newWork) {
      // Convertit l'identifiant de catégorie en nombre
      // pour rester cohérent avec les catégories de l'API
      newWork.categoryId = Number(newWork.categoryId);

      // Ajoute le nouveau projet au tableau des travaux
      allWorks.push(newWork);

      // Met à jour la galerie principale
      displayWorks(allWorks);

      // Met à jour la galerie de la modale
      displayModalWorks(allWorks);

      // Réinitialise le formulaire
      resetAddWorkForm();

      // Revient sur la galerie de la modale
      modalFormView.style.display = "none";
      modalGalleryView.style.display = "block";
    })
    .catch(function (error) {
      console.error("Erreur lors de l'ajout :", error);
    });
});


// --------------------------------------------------
// MODE CONNECTÉ / DÉCONNECTÉ
// --------------------------------------------------

if (token) {
  // Remplace login par logout
  loginLink.innerText = "logout";

  // Affiche le bandeau du mode édition
  editBanner.style.display = "block";

  // Cache les filtres
  filters.style.display = "none";

  // Affiche le bouton Modifier
  editButton.style.display = "block";

  // Ouvre la modale au clic sur Modifier
  editButton.addEventListener("click", function () {
    // Affiche la vue galerie
    modalGalleryView.style.display = "block";

    // Cache la vue formulaire
    modalFormView.style.display = "none";

    // Affiche la modale
    modal.style.display = "flex";
  });

  // Déconnecte l'utilisateur au clic sur logout
  loginLink.addEventListener("click", function (event) {
    event.preventDefault();

    // Supprime le token
    localStorage.removeItem("token");

    // Retourne à la page d'accueil
    window.location.href = "./index.html";
  });
}


// --------------------------------------------------
// GESTION DE LA MODALE
// --------------------------------------------------

// Ferme la modale au clic sur la croix
modalClose.addEventListener("click", function () {
  // Réinitialise le formulaire
  resetAddWorkForm();

  // Cache la modale
  modal.style.display = "none";
});


// Ferme la modale au clic sur le fond sombre
modal.addEventListener("click", function (event) {
  // Vérifie que le clic a été fait directement sur le fond
  if (event.target === modal) {
    // Réinitialise le formulaire
    resetAddWorkForm();

    // Cache la modale
    modal.style.display = "none";
  }
});


// Affiche le formulaire au clic sur Ajouter une photo
addPhotoButton.addEventListener("click", function () {
  // Cache la galerie
  modalGalleryView.style.display = "none";

  // Affiche le formulaire
  modalFormView.style.display = "block";
});


// Revient à la galerie au clic sur la flèche
modalBack.addEventListener("click", function () {
  // Réinitialise le formulaire
  resetAddWorkForm();

  // Cache la vue formulaire
  modalFormView.style.display = "none";

  // Affiche la galerie
  modalGalleryView.style.display = "block";
});


// --------------------------------------------------
// FILTRES
// --------------------------------------------------

// Met à jour le bouton de filtre actif
function updateActiveButton(clickedButton) {
  // Sélectionne tous les boutons de filtre
  const filterButtons = document.querySelectorAll(".filter-button");

  // Retire la classe active de tous les boutons
  filterButtons.forEach(function (button) {
    button.classList.remove("active");
  });

  // Ajoute la classe active au bouton cliqué
  clickedButton.classList.add("active");
}


// Crée le bouton "Tous"
const allButton = document.createElement("button");

// Ajoute le texte du bouton
allButton.innerText = "Tous";

// Ajoute les classes CSS
allButton.classList.add("filter-button", "active");

// Ajoute le bouton dans la zone des filtres
filters.appendChild(allButton);


// Affiche tous les projets au clic sur "Tous"
allButton.addEventListener("click", function () {
  updateActiveButton(allButton);
  displayWorks(allWorks);
});


// --------------------------------------------------
// RÉCUPÉRATION DES CATÉGORIES
// --------------------------------------------------

fetch("http://localhost:5678/api/categories")
  .then(function (response) {
    // Vérifie que l'API a répondu correctement
    if (!response.ok) {
      throw new Error("Impossible de récupérer les catégories");
    }

    // Transforme la réponse en données JavaScript
    return response.json();
  })
  .then(function (categories) {
    // Parcourt toutes les catégories
    categories.forEach(function (category) {
      // Crée une option pour le formulaire d'ajout
      const option = document.createElement("option");

      // Utilise l'id comme valeur
      option.value = category.id;

      // Affiche le nom de la catégorie
      option.innerText = category.name;

      // Ajoute l'option dans le select
      workCategorySelect.appendChild(option);


      // Crée un bouton de filtre
      const categoryButton = document.createElement("button");

      // Ajoute le nom de la catégorie
      categoryButton.innerText = category.name;

      // Ajoute la classe CSS
      categoryButton.classList.add("filter-button");

      // Ajoute le bouton dans la zone des filtres
      filters.appendChild(categoryButton);


      // Filtre les projets au clic sur le bouton
      categoryButton.addEventListener("click", function () {
        // Met à jour le bouton actif
        updateActiveButton(categoryButton);

        // Garde uniquement les projets de cette catégorie
        const filteredWorks = allWorks.filter(function (work) {
          return work.categoryId === category.id;
        });

        // Affiche les projets filtrés
        displayWorks(filteredWorks);
      });
    });
  })
  .catch(function (error) {
    console.error("Erreur lors du chargement des catégories :", error);
  });


// --------------------------------------------------
// CRÉATION ET AFFICHAGE DES PROJETS
// --------------------------------------------------

// Crée un élément HTML pour afficher un projet
function createWorkElement(work) {
  // Crée une balise figure
  const figure = document.createElement("figure");

  // Crée l'image
  const image = document.createElement("img");

  // Ajoute l'URL de l'image
  image.src = work.imageUrl;

  // Ajoute le texte alternatif
  image.alt = work.title;

  // Crée la légende
  const caption = document.createElement("figcaption");

  // Ajoute le titre du projet
  caption.innerText = work.title;

  // Ajoute l'image dans la figure
  figure.appendChild(image);

  // Ajoute la légende
  figure.appendChild(caption);

  // Retourne la figure complète
  return figure;
}


// Affiche une liste de projets dans la galerie principale
function displayWorks(works) {
  // Vide la galerie
  gallery.innerHTML = "";

  // Parcourt les projets
  works.forEach(function (work) {
    // Crée l'élément HTML du projet
    const workElement = createWorkElement(work);

    // Ajoute le projet dans la galerie
    gallery.appendChild(workElement);
  });
}


// --------------------------------------------------
// GALERIE DE LA MODALE ET SUPPRESSION
// --------------------------------------------------

function displayModalWorks(works) {
  // Vide la galerie de la modale
  modalGallery.innerHTML = "";

  // Parcourt tous les projets
  works.forEach(function (work) {
    // Crée le conteneur du projet
    const workContainer = document.createElement("div");

    // Ajoute la classe CSS
    workContainer.classList.add("modal-work");

    // Crée l'image
    const image = document.createElement("img");

    // Ajoute l'URL de l'image
    image.src = work.imageUrl;

    // Ajoute le texte alternatif
    image.alt = work.title;

    // Crée le bouton de suppression
    const deleteButton = document.createElement("button");

    // Ajoute l'id du projet au bouton
    deleteButton.dataset.id = work.id;

    // Ajoute la classe CSS
    deleteButton.classList.add("delete-work");

    // Ajoute l'icône de corbeille
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';


    // Supprime le projet au clic sur la corbeille
    deleteButton.addEventListener("click", function () {
      // Récupère l'id du projet
      const workId = deleteButton.dataset.id;

      // Envoie la requête DELETE à l'API
      fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",

        // Envoie le token
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(function (response) {
          // Vérifie que la suppression a fonctionné
          if (!response.ok) {
            throw new Error("Erreur lors de la suppression du projet");
          }

          // Retire le projet du tableau
          allWorks = allWorks.filter(function (work) {
            return work.id !== Number(workId);
          });

          // Met à jour la galerie principale
          displayWorks(allWorks);

          // Met à jour la galerie de la modale
          displayModalWorks(allWorks);
        })
        .catch(function (error) {
          console.error("Erreur lors de la suppression :", error);
        });
    });


    // Ajoute l'image dans le conteneur
    workContainer.appendChild(image);

    // Ajoute la corbeille dans le conteneur
    workContainer.appendChild(deleteButton);

    // Ajoute le projet dans la galerie de la modale
    modalGallery.appendChild(workContainer);
  });
}


// --------------------------------------------------
// RÉCUPÉRATION DES TRAVAUX
// --------------------------------------------------

fetch("http://localhost:5678/api/works")
  .then(function (response) {
    // Vérifie que l'API a répondu correctement
    if (!response.ok) {
      throw new Error("Impossible de récupérer les travaux");
    }

    // Transforme la réponse en données JavaScript
    return response.json();
  })
  .then(function (works) {
    // Stocke tous les travaux
    allWorks = works;

    // Affiche les travaux dans la galerie principale
    displayWorks(allWorks);

    // Affiche les travaux dans la galerie de la modale
    displayModalWorks(allWorks);
  })
  .catch(function (error) {
    console.error("Erreur lors du chargement des travaux :", error);
  });