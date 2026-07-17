// Vérifie que le fichier JavaScript est bien relié
console.log("Le fichier login.js est bien connecté");

// Sélectionne le formulaire de connexion
const loginForm = document.querySelector("#login-form");

// Sélectionne la zone du message d'erreur
const loginError = document.querySelector("#login-error");

// Écoute l'envoi du formulaire
loginForm.addEventListener("submit", function (event) {
	// Empêche la page de se recharger
	event.preventDefault();

	// Récupère la valeur de l'e-mail
	const email = document.querySelector("#email").value;

	// Récupère la valeur du mot de passe
	const password = document.querySelector("#password").value;

	// Envoie les identifiants à l'API
	fetch("http://localhost:5678/api/users/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			email: email,
			password: password
		})
	})
	.then(function (response) {
		// Si la réponse n'est pas correcte, on déclenche une erreur
		if (!response.ok) {
			throw new Error("Erreur dans l’identifiant ou le mot de passe");
		}

		// Sinon, on transforme la réponse en JSON
		return response.json();
	})
	.then(function (data) {
		// Stocke le token dans le navigateur
		localStorage.setItem("token", data.token);

		// Redirige vers la page d'accueil
		window.location.href = "./index.html";
	})
	.catch(function (error) {
		// Affiche un message d'erreur pour l'utilisateur
		loginError.innerText = "Erreur dans l’identifiant ou le mot de passe";

		// Affiche l'erreur dans la console pour nous aider
		console.error(error);
	});
});