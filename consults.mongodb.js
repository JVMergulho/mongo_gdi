/* global use, db */

use('ecoRide');

// CONSULTAS

// Consulta os 3 primeiros usuários
db.users.find().limit(3).pretty();


// Consulta todos os motoristas com média de avaliação maior que 4.4
db.users.aggregate([
  {
    $match: {
      veihcle: { $exists: true },
      avg_star_rating: { $gte: 4.4 }
    }
  },
  {
    $sort: { avg_star_rating: -1 }
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

