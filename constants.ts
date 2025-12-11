
import { Category, WordItem } from './types';

const createItems = (list: [string, string][]): WordItem[] => {
  return list.map(([target, hint]) => ({ target, hint }));
};

export const CATEGORIES: Category[] = [
  {
    id: 'sports',
    name: 'Deportes',
    items: createItems([
      ['Fútbol', 'Hinchada'],
      ['Baloncesto', 'Altura'],
      ['Tenis', 'Wimbledon'],
      ['Natación', 'Cloro'],
      ['Boxeo', 'Round'],
      ['Ciclismo', 'Cadena'],
      ['Voleibol', 'Bloqueo'],
      ['Béisbol', 'Home'],
      ['Fórmula 1', 'Pits'],
      ['Golf', 'Handicap'],
      ['Rugby', 'Tackle'],
      ['Atletismo', 'Meta']
    ])
  },
  {
    id: 'daily_life',
    name: 'Vida Cotidiana',
    items: createItems([
      ['Cama', 'Siesta'],
      ['Ducha', 'Vapor'],
      ['Celular', 'Cobertura'],
      ['Llaves', 'Llavero'],
      ['Billetera', 'Tarjeta'],
      ['Computador', 'Mouse'],
      ['Zapatos', 'Cordones'],
      ['Reloj', 'Tic-tac'],
      ['Gafas', 'Aumento'],
      ['Silla', 'Respaldo'],
      ['Cepillo de dientes', 'Caries'],
      ['Televisor', 'Control']
    ])
  },
  {
    id: 'food',
    name: 'Comidas',
    items: createItems([
      ['Pizza', 'Pepperoni'],
      ['Hamburguesa', 'Chatarra'],
      ['Sushi', 'Palillos'],
      ['Sopa', 'Cuchara'],
      ['Helado', 'Derretido'],
      ['Ensalada', 'Dieta'],
      ['Pollo Frito', 'Alas'],
      ['Pasta', 'Harina'],
      ['Tacos', 'México'],
      ['Huevo', 'Yema'],
      ['Pan', 'Miga'],
      ['Fruta', 'Semilla']
    ])
  },
  {
    id: 'places',
    name: 'Lugares',
    items: createItems([
      ['Playa', 'Bronceador'],
      ['Montaña', 'Nieve'],
      ['Colegio', 'Recreo'],
      ['Hospital', 'Camilla'],
      ['Cine', 'Cartelera'],
      ['Discoteca', 'Dj'],
      ['Aeropuerto', 'Pasaporte'],
      ['Restaurante', 'Chef'],
      ['Gimnasio', 'Rutina'],
      ['Parque', 'Columpio'],
      ['Centro Comercial', 'Vitrina'],
      ['Estadio', 'Grada']
    ])
  },
  {
    id: 'objects',
    name: 'Objetos',
    items: createItems([
      ['Martillo', 'Clavo'],
      ['Guitarra', 'Cuerda'],
      ['Lápiz', 'Grafito'],
      ['Cuchillo', 'Filo'],
      ['Botella', 'Corcho'],
      ['Libro', 'Página'],
      ['Mesa', 'Mantel'],
      ['Cámara', 'Flash'],
      ['Maleta', 'Equipaje'],
      ['Espejo', 'Reflejo']
    ])
  },
  {
    id: 'animals',
    name: 'Animales',
    items: createItems([
      ['Perro', 'Huella'],
      ['Gato', 'Tejado'],
      ['León', 'Sabana'],
      ['Elefante', 'Marfil'],
      ['Pájaro', 'Nido'],
      ['Pez', 'Anzuelo'],
      ['Serpiente', 'Veneno'],
      ['Vaca', 'Mugido'],
      ['Caballo', 'Establo'],
      ['Mono', 'Liana']
    ])
  },
  {
    id: 'professions',
    name: 'Profesiones',
    items: createItems([
      ['Doctor', 'Bata'],
      ['Policía', 'Placa'],
      ['Profesor', 'Tiza'],
      ['Bombero', 'Sirena'],
      ['Chef', 'Gorro'],
      ['Piloto', 'Cabina'],
      ['Astronauta', 'Gravedad'],
      ['Cantante', 'Micrófono'],
      ['Pintor', 'Pincel'],
      ['Mecánico', 'Tuerca']
    ])
  }
];
