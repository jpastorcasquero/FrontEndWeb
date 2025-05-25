// Exporta un objeto constante que contiene la configuración del entorno
export const environment = {
	// Indica si la aplicación está en modo de producción o no
	production: false,
	// URL de la API para los usuarios
	user: 'https://jpastorcasquero.pythonanywhere.com/users/',
	// URL de la API para las direcciones
	addresses: 'https://jpastorcasquero.pythonanywhere.com/addresses/',
	// URL de la API para los teléfonos
	phone: 'https://jpastorcasquero.pythonanywhere.com/phones',
	// URL de la API para las conexiones
	connection: 'https://jpastorcasquero.pythonanywhere.com/connections/',
	// URL de la API para obtener clasificador
	getClassifier: 'https://jpastorcasquero.pythonanywhere.com/get_classifier',
	// URL de la API para obtener clasificador
	getPrediction: 'https://jpastorcasquero.pythonanywhere.com/get_prediction'
};