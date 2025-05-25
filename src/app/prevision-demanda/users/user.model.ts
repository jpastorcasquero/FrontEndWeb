// Interfaz para representar la validación de igualdad de contraseñas
export interface IValidEqualPassword {
	validEqualPassword: boolean; // Indica si las contraseñas son iguales
}

// Interfaz para representar la validación de correo electrónico de usuario
export interface IValidUserMail {
	validUserMail: boolean; // Indica si el correo electrónico del usuario es válido
}

// Interfaz para representar la validación de la fuerza de la contraseña
export interface IValidPasswordStrength {
	validPasswordStrength?: boolean; // Indica si la contraseña cumple con los requisitos de fuerza
	noUpperCase?: boolean; // Indica si la contraseña no contiene letras mayúsculas
	noLowerCase?: boolean; // Indica si la contraseña no contiene letras minúsculas
	noNumeric?: boolean; // Indica si la contraseña no contiene caracteres numéricos
	notSymbols?: boolean; // Indica si la contraseña no contiene símbolos
}

// Interfaz para representar un usuario
interface User {
	id: number; // Identificador del usuario
	name: string; // Nombre del usuario
	email: string; // Correo electrónico del usuario
	nickName: string; // Apodo del usuario
	role: string; // Rol del usuario
}

// Exportar la interfaz User como predeterminada
export default User;
