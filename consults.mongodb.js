/* global use, db */

use('ecoRide');

// CONSULTAS

// Consulta os 3 primeiros usuários
db.users.find().limit(3).pretty();

db.users.findOne({ "origin.address": "Av. Paulista, 1000 - São Paulo" }).pretty();

// média de estrelas dos motoristas
db.users.aggregate([
  {
    $match: {
      vehicle: { $exists: true }
    }
  },
  {
    $group: {
      _id: null,
      avg_driver_star_rating: { $avg: "$avg_star_rating" }
    }
  }
]).pretty();


// Consulta todos os motoristas com média de avaliação maior que 4.4
db.users.aggregate([
  {
    $match: {
      vehicle: { $exists: true },
      avg_star_rating: { $gte: 4.4 }
    }
  },
  {
    $sort: { avg_star_rating: -1 }
  }
]).pretty();

// cosulta quantos caronas foram completadas
db.scheduledRides.aggregate([
  {
    $match: {
      status: "completed"
    }
  },
  {
    $count: "total_completed_rides"
  }
]).pretty();

// Motorista com maior preço de corrida
db.routes.aggregate([
  {
    $group: {
      _id: null,
      max_price: { $max: "$price" }
    }
  }
]).pretty();

db.routes.aggregate([
  {
    $group: {
      _id: "$driver_id",
      max_price: { $max: "$price" }
    }
  },
  {
    $sort: { max_price: -1 }
  },
  {
    $limit: 1
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "driver"
    }
  },
  {
    $unwind: "$driver"
  },
  {
    $project: {
      driver_name: "$driver.name",
      max_price: 1
    }
  }
]).pretty();

