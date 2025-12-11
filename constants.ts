import { Category } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'sports',
    name: 'Deportes',
    words: [
      'fútbol', 'baloncesto', 'tenis', 'natación', 'ciclismo', 'boxeo', 'karate', 'taekwondo',  'béisbol', 
      'voleibol', 'golf', 'atletismo', 'surf', 'esquí',  'hockey', 'rugby',  'tiro con arco', 
      'gimnasia', 'patinaje',  'esgrima', 'buceo', 'remo', 'kayak', 'paracaidismo', 
      'maratón',   'levantamiento', 'pesas',  'ajedrez', 'ping pong', 
      'bádminton', 'fútbol sala',  'motocross',  'equitación','billar', 'bolos'
    ]
  },
  {
    id: 'daily_life',
    name: 'Vida Cotidiana',
    words: [
      'computadora', 'cama', 'ducha', 'jabón', 'mercado', 'celular', 'calle', 'bus', 'taxi', 'parque', 'puerta', 
      'ventana', 'silla', 'vaso', 'plato', 'cuchara', 'cuchillo', 'tenedor', 'foco', 'cable', 'botella', 'bolso', 
      'cuaderno', 'lápiz', 'cargador', 'chancleta', 'zapato', 'camisa', 'espejo', 'llaves', 'reloj', 'televisor', 
      'cortina', 'ventilador', 'aire acondicionado', 'trapero', 'escoba', 'nevera', 'microondas', 'lava platos', 
      'champú',  'almohada',  'wifi', 'puente', 'bicicleta', 'sombrilla', 'play station', 'condón',  
    ]
  },
  {
    id: 'countries',
    name: 'Países',
    words: [
      'Colombia', 'Argentina', 'Brasil', 'Chile', 'Perú', 'Ecuador', 'México', 'Canadá', 'Estados Unidos', 'España', 
      'Francia', 'Italia', 'Alemania', 'Portugal', 'Grecia', 'Turquía', 'Japón', 'Corea', 'China', 'India', 'Rusia', 
      'Australia', 'Egipto', 'Sudáfrica', 'Marruecos', 'Nigeria', 
      'Polonia', 'Ucrania', 'Arabia Saudita', 'Israel',
       'Panamá', 'Costa Rica', 'Uruguay', 'Bolivia'
    ]
  },
  {
    id: 'food',
    name: 'Comidas',
    words: [
      'pizza', 'hamburguesa', 'pasta', 'arroz', 'sushi', 'sopa', 'carne asada', 'pollo frito', 'empanada', 'arepa', 
      'taco', 'burrito', 'hot dog', 'ensalada', 'pan', 'croissant', 'helado', 'yogur', 'avena', 'lasaña', 'brownie', 
      'galleta', 'chocolate', 'quesadilla',  'pescado frito', 'camarones', 'ceviche', 'lentejas', 'fríjoles', 
      'sancocho',  'pancakes', 'waffle', 'sandwich',  'paella', 
       'mazorca', 'pastel', 'empanada', 'nachos', 'deditos', 'salchipapa','arepa picada','chuzo pan','mazorca','perro caliente',
       'raspao','boli','fresas con crema','tres leche','flan','napoleon','panocha',
    ]
  },
  {
    id: 'places',
    name: 'Lugares',
    words: [
      'playa', 'montaña', 'bosque', 'desierto', 'río', 'lago', 'parque', 'museo', 'estadio', 'aeropuerto', 'estación', 
      'hospital', 'colegio', 'universidad', 'centro comercial', 'supermercado', 'hotel', 'restaurante', 'cine', 'teatro', 
      'iglesia', 'oficina', 'terminal', 'puerto', 'mercado', 'biblioteca', 'gimnasio', 'fábrica', 'barrio', 'pueblo', 
       'puente', 'zoológico', 'acuario', 'cascada', 'volcán', 'isla', 'cabaña', 'castillo', 'torre', 
      'granja', 'motel', 'la escollera','one shot','aitana','parque de los novios'
    ]
  },
  {
    id: 'objects',
    name: 'Objetos',
    words: [
      'celular', 'teclado', 'mouse', 'monitor', 'audífonos', 'maleta', 'billetera', 'linterna', 'tijeras', 'cinta', 
      'pegante', 'botella', 'pijama', 'maquillaje', 'brocha', 'perfume', 'cepillo', 'llave', 'candado', 'martillo', 
      'destornillador', 'tornillo', 'cable USB', 'moneda', 'billete', 'paraguas', 'velas', 'encendedor', 'fósforos', 
      'control remoto', 'parlante', 'impresora', 'calculadora', 'balón', 'palo de selfie', 'caja', 'sobre', 'disco', 
      'tabla de cortar', 'colador', 'sartén'
    ]
  },
  {
    id: 'professions',
    name: 'Profesiones',
    words: [
      'doctor', 'enfermero', 'abogado', 'profesor', 'ingeniero', 'arquitecto', 'chef', 'barbero', 'diseñador', 
      'programador', 'mecánico', 'electricista', 'plomero', 'contador', 'psicólogo', 'policía', 'bombero', 'piloto', 
      'veterinario', 'periodista', 'fotógrafo', 'camarógrafo', 'modelo', 'constructor', 'odontólogo', 'panadero', 
      'mesero', 'cajero', 'recepcionista', 'gerente', 'administrador', 'químico', 'biólogo', 'analista', 'conductor', 
      'agricultor', 'albañil', 'vigilante', 'estilista'
    ]
  },
  {
    id: 'animals',
    name: 'Animales',
    words: [
      'perro', 'gato', 'caballo', 'vaca', 'cerdo', 'gallina', 'pato', 'oveja', 'cabra', 'ratón', 'loro', 'tortuga', 
      'serpiente', 'león', 'tigre', 'jirafa', 'elefante', 'mono', 'águila', 'búho', 'tiburón', 'ballena', 'delfín', 
      'pez payaso', 'rana', 'hipopótamo', 'cebra', 'camello', 'koala', 'panda', 'oso', 'murciélago', 'pingüino', 
      'canguro', 'lobo', 'zorro', 'ardilla', 'castor', 'hámster', 'ciervo'
    ]
  }
];
