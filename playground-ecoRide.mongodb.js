/* global use, db */
// MongoDB Playground

// Esse script cria um banco de dados para um aplicativo de carona chamado "ecoRide".
// Ele contém três coleções: "users", "routes" e "rides".

use('ecoRide');

db.users.drop();
db.routes.drop();
db.rides.drop();

// Insere dados dos usuários -> motoristas e passageiros
db.users.insertMany([
  {
    _id: ObjectId('U001'),
    name: 'Cleber Mendonça',
    veihcle: {
      model: 'Toyota Corolla',
      year: 2015,
      color: 'black',
      plate: 'ABC-1234',
    },
    avg_star_rating: 4.5,
    total_rides_given: 100,
    total_rides_taken: 50,
    date_registered: ISODate('2023-01-01T10:00:00Z'),
  },
  {
    _id: ObjectId('U002'),
    name: 'Bárbara Omena',
    veihcle: {
      model: 'Honda Civic',
      year: 2018,
      color: 'white',
      plate: 'XYZ-5678',
    },
    avg_star_rating: 4.7,
    total_rides_given: 200,
    total_rides_taken: 150,
    date_registered: ISODate('2023-02-15T12:00:00Z'),
  },
  {
    _id: ObjectId('U003'),
    name: 'Joana Montes',
    avg_star_rating: 4.9,
    total_rides_given: 0,
    total_rides_taken: 60,
    date_registered: ISODate('2023-03-20T14:00:00Z'),
  },
  {
    _id: ObjectId('U004'),
    name: 'Lucas Silva',
    veihcle: {
      model: 'Ford Fiesta',
      year: 2016,
      color: 'blue',
      plate: 'LMN-9101',
    },
    avg_star_rating: 4.2,
    total_rides_given: 80,
    total_rides_taken: 30,
    date_registered: ISODate('2023-04-25T16:00:00Z'),
  },
  {
    _id: ObjectId('U005'),
    name: 'Marcos Oliveira',
    avg_star_rating: 4.6,
    total_rides_given: 0,
    total_rides_taken: 90,
    date_registered: ISODate('2023-05-30T18:00:00Z'),
  },
]);

// Insere dados das rotas
db.routes.insertMany([
  {
    _id: ObjectId('RT001'),
    origin: {
      address: "Av. Paulista, 1000 - São Paulo",
      coordenates: { lat: -23.5631, lng: -46.6544 },
    },
    destination: {
      address: "R. da Consolação, 500 - São Paulo",
      coordenates: { lat: -23.5515, lng: -46.6492 },
    },
    distance: 10,
    price: 20,
    driver_id: ObjectId('U002'),
    date_time: ISODate('2023-10-01T09:00:00Z'),
    date_created: ISODate('2023-09-30T08:00:00Z'),
    status: 'scheduled',
  },
  {
    _id: ObjectId('RT002'),
    origin: {
      address: "Av. Brigadeiro Faria Lima, 2000 - São Paulo",
      coordenates: { lat: -23.5869, lng: -46.6759 },
    },
    destination: {
      address: "R. dos Três Irmãos, 300 - São Paulo",
      coordenates: { lat: -23.5631, lng: -46.6544 },
    },
    distance: 15,
    price: 30,
    driver_id: ObjectId('U001'),
    date_time: ISODate('2023-10-02T10:00:00Z'),
    date_created: ISODate('2023-10-01T09:00:00Z'),
    status: 'completed',
  },
  {
    _id: ObjectId('RT003'),
    origin: {
      address: "Av. Ipiranga, 500 - São Paulo",
      coordenates: { lat: -23.5505, lng: -46.6333 },
    },
    destination: {
      address: "R. Augusta, 1000 - São Paulo",
      coordenates: { lat: -23.5542, lng: -46.6584 },
    },
    distance: 8,
    price: 15,
    driver_id: ObjectId('U004'),
    date_time: ISODate('2023-10-03T08:00:00Z'),
    date_created: ISODate('2023-10-02T07:00:00Z'),
    status: 'completed',
  },
]);

// Insere dados das caronas agendadas
db.scheduledRides.insertMany([
  {
    _id: ObjectId('SR001'),
    user_id: ObjectId('U003'),
    route_id: ObjectId('RT001'),
    date_created: ISODate('2023-10-01T08:00:00Z'),
    status: 'scheduled',
  },
  {
    _id: ObjectId('SR002'),
    user_id: ObjectId('U005'),
    route_id: ObjectId('RT002'),
    status: 'completed',
  },
  {
    _id: ObjectId('SR003'),
    user_id: ObjectId('U001'),
    route_id: ObjectId('RT003'),
    status: 'completed',
    star_rating: 4.5,
    feedback: 'Boa viagem, mas o motorista poderia ser mais gentil.',
  },
  {
    _id: ObjectId('SR004'),
    user_id: ObjectId('U002'),
    route_id: ObjectId('RT003'),
    status: 'canceled',
  },
  {
    _id: ObjectId('SR005'),
    user_id: ObjectId('U004'),
    route_id: ObjectId('RT002'),
    start_time: ISODate('2023-10-02T12:00:00Z'),
    end_time: ISODate('2023-10-02T12:45:00Z'),
    status: 'completed',
    avg_star_rating: 4.8,
    feedback: 'Viagem excelente, motorista muito educado.',
  },
  {
    _id: ObjectId('SR006'),
    user_id: ObjectId('U005'),
    route_id: ObjectId('RT001'),
    start_time: ISODate('2023-10-01T11:00:00Z'),
    end_time: ISODate('2023-10-01T11:45:00Z'),
    status: 'scheduled',
  },
]);
