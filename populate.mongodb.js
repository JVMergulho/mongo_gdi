/* global use, db */
// MongoDB Playground

// Esse script cria um banco de dados para um aplicativo de carona chamado "ecoRide".
// Ele contém três coleções: "users", "routes" e "rides".

// O banco de dados é chamado "ecoRide"
use('ecoRide');

// Limpa as coleções existentes para evitar duplicação de dados
db.users.drop();
db.routes.drop();
db.scheduledRides.drop();

const user1Id = ObjectId();
const user2Id = ObjectId();
const user3Id = ObjectId();
const user4Id = ObjectId();
const user5Id = ObjectId();

const route1Id = ObjectId();
const route2Id = ObjectId();
const route3Id = ObjectId();

const ride1Id = ObjectId();
const ride2Id = ObjectId();
const ride3Id = ObjectId();
const ride4Id = ObjectId();
const ride5Id = ObjectId();
const ride6Id = ObjectId();

// POPULANDO BD

// Insere dados dos usuários -> motoristas e passageiros
db.users.insertMany([
  {
    _id: ObjectId(user1Id),
    name: 'Cleber Mendonça',
    vehicle: {
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
    _id: ObjectId(user2Id),
    name: 'Bárbara Omena',
    vehicle: {
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
    _id: ObjectId(user3Id),
    name: 'Joana Montes',
    avg_star_rating: 4.9,
    total_rides_given: 0,
    total_rides_taken: 60,
    date_registered: ISODate('2023-03-20T14:00:00Z'),
  },
  {
    _id: ObjectId(user4Id),
    name: 'Lucas Silva',
    vehicle: {
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
    _id: ObjectId(user5Id),
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
    _id: ObjectId(route1Id),
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
    driver_id: ObjectId(user2Id),
    date_time: ISODate('2023-10-01T09:00:00Z'),
    date_created: ISODate('2023-09-30T08:00:00Z'),
    status: 'scheduled',
  },
  {
    _id: ObjectId(route2Id),
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
    driver_id: ObjectId(user1Id),
    date_time: ISODate('2023-10-02T10:00:00Z'),
    date_created: ISODate('2023-10-01T09:00:00Z'),
    status: 'completed',
  },
  {
    _id: ObjectId(user3Id),
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
    driver_id: ObjectId(user4Id),
    date_time: ISODate('2023-10-03T08:00:00Z'),
    date_created: ISODate('2023-10-02T07:00:00Z'),
    status: 'completed',
  },
]);

// Insere dados das caronas agendadas
db.scheduledRides.insertMany([
  {
    _id: ObjectId(ride1Id),
    user_id: ObjectId(user3Id),
    route_id: ObjectId(route1Id),
    date_created: ISODate('2023-10-01T08:00:00Z'),
    status: 'scheduled',
  },
  {
    _id: ObjectId(ride2Id),
    user_id: ObjectId(user5Id),
    route_id: ObjectId(route2Id),
    status: 'completed',
  },
  {
    _id: ObjectId(ride3Id),
    user_id: ObjectId(user1Id),
    route_id: ObjectId(route3Id),
    status: 'completed',
    star_rating: 4.5,
    feedback: 'Boa viagem, mas o motorista poderia ser mais gentil.',
  },
  {
    _id: ObjectId(ride4Id),
    user_id: ObjectId(user2Id),
    route_id: ObjectId(route3Id),
    status: 'canceled',
  },
  {
    _id: ObjectId(ride5Id),
    user_id: ObjectId(user4Id),
    route_id: ObjectId(route2Id),
    status: 'completed',
    star_rating: 4.8
  },
  {
    _id: ObjectId(ride6Id),
    user_id: ObjectId(user5Id),
    route_id: ObjectId(route1Id),
    status: 'scheduled',
  },
]);

// renomeia a coleção "rides" para "scheduledRides"
db.rides.renameCollection("rides");

//atualiza a 
db.rides.updateOne(
  { _id: ObjectId(ride1Id) },
  {
    $set: {
      status: 'completed',
      star_rating: 4.1,
      feedback: 'O motorista foi gentil, mas ele corre demais!!!',
    },
  }
);