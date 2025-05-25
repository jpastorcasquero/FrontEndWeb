// Definición de la interfaz InfoConnections para representar la información de una conexión
export interface InfoConnections {
   id: number; // Identificador de la conexión
   user: number; // Identificador del usuario asociado a la conexión
   connectionDate: Date; // Fecha y hora de la conexión
   disconnectionDate: Date; // Fecha y hora de la desconexión
}
