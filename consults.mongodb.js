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


// confirmar se a junção encontrou exatamente o número esperado de documentos associados.
db.scheduledRides.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "userDocs"
      }
    },
    {
      $project: {
        route_id: 1,
        user_id: 1,
        // 'userDocs' vira um array; vamos mostrar o tamanho dele
        userDocsCount: { $size: "$userDocs" }
      }
    }
  ]);


  // Somar as distâncias totais das rotas

db.routes.aggregate([
{
    $group: {
    _id: null,
    totalDistance: { $sum: "$distance" }
    }
}
]);
  

// Usuários com avg rating maior que 4.5 
db.users.find({
  $where: function() {
    return this.avg_star_rating > 4.5;
  }
});



// text

db.users.updateOne(
    { name: "Joana Montes" },
    { $set: { roles: ["driver", "passenger"] } }
  );

  db.users.find({
    roles: { $all: ["driver", "passenger"] }
  });
  


// filter

db.users.aggregate([
{
    $lookup: {
    from: "scheduledRides",
    localField: "_id",
    foreignField: "user_id",
    as: "userRides"
    }
},
{
    $project: {
    name: 1,
    userRides: {
        $filter: {
        input: "$userRides",
        as: "ride",
        cond: { $eq: ["$$ride.status", "completed"] }
        }
    }
    }
}
]);

// UpdateOne : aumentar em 10 a nota de um usuário

db.users.updateOne(
    { name: "Lucas Silva" },
    { $set: { avg_star_rating: 4.9 } }
  );

//insertone : aumentar em 10 todas as rotas com distance < 10
db.routes.updateMany(
    { distance: { $lt: 10 } },
    { $inc: { distance: 10 } }
  );

// addtoSet adicionar role driver para Joana Montes sem duplicar
db.users.updateOne(
    { name: "Joana Montes" },
    { $addToSet: { roles: "driver" } }
  );
  

// $match, $lookup, $unwind, $addFields, $group, $project, $cond (condicional) e $sort

db.scheduledRides.aggregate([
    // 1. Seleciona apenas as corridas com status "completed"
    { $match: { status: "completed" } },
    
    // 2. Junta os detalhes da rota (a partir da coleção "routes") com base no campo "route_id"
    { $lookup: {
        from: "routes",
        localField: "route_id",
        foreignField: "_id",
        as: "routeDetails"
    }},
    { $unwind: "$routeDetails" },
    
    // 3. Junta os dados do motorista (a partir da coleção "users") usando o campo "driver_id" da rota
    { $lookup: {
        from: "users",
        localField: "routeDetails.driver_id",
        foreignField: "_id",
        as: "driverDetails"
    }},
    { $unwind: "$driverDetails" },
    
    // 4. Cria um novo campo "positiveFeedback" que vale 1 se a avaliação for >= 4.5 e 0 caso contrário
    { $addFields: {
        positiveFeedback: { $cond: [ { $gte: ["$star_rating", 4.5] }, 1, 0 ] }
    }},
    
    // 5. Agrupa os documentos por motorista, somando total de corridas, feedbacks positivos,
    //    calculando a média dos preços e somando as distâncias das rotas
    { $group: {
        _id: "$driverDetails._id",
        driverName: { $first: "$driverDetails.name" },
        totalRides: { $sum: 1 },
        totalPositiveFeedbacks: { $sum: "$positiveFeedback" },
        avgPrice: { $avg: "$routeDetails.price" },
        totalDistance: { $sum: "$routeDetails.distance" }
    }},
    
    // 6. Projeta os resultados, formatando alguns campos e removendo o _id original
    { $project: {
        _id: 0,
        driverId: "$_id",
        driverName: 1,
        totalRides: 1,
        totalPositiveFeedbacks: 1,
        avgPrice: { $round: [ "$avgPrice", 2 ] },
        totalDistance: 1
    }},
    
    // 7. Ordena os resultados pelo total de corridas, de forma decrescente
    { $sort: { totalRides: -1 } }
  ]);



// Agrupar corridas por data e status
//$project (com $dateToString), $group, $sum, $sort.
db.scheduledRides.aggregate([
    // Converte a data de criação para um formato "YYYY-MM-DD"
    { $project: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$date_created" } },
        status: 1
    }},
    // Agrupa por data e status, somando as ocorrências
    { $group: {
        _id: { date: "$date", status: "$status" },
        count: { $sum: 1 }
    }},
    // Ordena pela data (ascendente)
    { $sort: { "_id.date": 1 } }
  ]);
  

// Busca Textual de Feedback
//$text com $search.
// Criação do índice (execute apenas uma vez)
db.scheduledRides.createIndex({ feedback: "text" });

// Consulta para buscar feedbacks contendo a palavra "gentil"
db.scheduledRides.find({
  $text: { $search: "gentil" }
});


// Corridas completadas por usuário
// $lookup, $project, $filter, $eq.
db.users.aggregate([
    // Junta os agendamentos da carona referentes a cada usuário
    { $lookup: {
        from: "scheduledRides",
        localField: "_id",
        foreignField: "user_id",
        as: "userRides"
    }},
    // Projeta os campos do usuário e filtra os rides completados usando $filter
    { $project: {
        name: 1,
        userRides: {
          $filter: {
            input: "$userRides",
            as: "ride",
            cond: { $eq: [ "$$ride.status", "completed" ] }
          }
        }
    }}
  ]);


// ranking de motoristas baseado em corridas

db.scheduledRides.aggregate([
// (Removido o $match para incluir todas as corridas)

// Junta detalhes da rota
{ $lookup: {
    from: "routes",
    localField: "route_id",
    foreignField: "_id",
    as: "routeDetails"
}},
{ $unwind: "$routeDetails" },

// Junta os dados do motorista
{ $lookup: {
    from: "users",
    localField: "routeDetails.driver_id",
    foreignField: "_id",
    as: "driverDetails"
}},
{ $unwind: "$driverDetails" },

// Cria campo para feedback positivo
{ $addFields: {
    positiveFeedback: { $cond: [ { $gte: ["$star_rating", 4.5] }, 1, 0 ] }
}},

// Agrupa por motorista
{ $group: {
    _id: "$driverDetails._id",
    driverName: { $first: "$driverDetails.name" },
    totalRides: { $sum: 1 },
    totalPositiveFeedbacks: { $sum: "$positiveFeedback" },
    avgPrice: { $avg: "$routeDetails.price" },
    totalDistance: { $sum: "$routeDetails.distance" }
}},

{ $project: {
    _id: 0,
    driverId: "$_id",
    driverName: 1,
    totalRides: 1,
    totalPositiveFeedbacks: 1,
    avgPrice: { $round: [ "$avgPrice", 2 ] },
    totalDistance: 1
}},

// Apenas ordena sem limitar
{ $sort: { totalRides: -1 } }
]).pretty();



// Agrupa as rotas por Mes/Ano
// $project, $group, $sum, $avg, $round e $sort.

db.routes.aggregate([
{
    $project: {
    monthYear: { $dateToString: { format: "%Y-%m", date: "$date_created" } },
    distance: 1,
    price: 1,
    status: 1
    }
},
{
    $group: {
    _id: "$monthYear",
    totalDistance: { $sum: "$distance" },
    totalRevenue: { $sum: "$price" },
    avgPrice: { $avg: "$price" },
    count: { $sum: 1 }
    }
},
{
    $project: {
    monthYear: "$_id",
    totalDistance: 1,
    totalRevenue: 1,
    avgPrice: { $round: [ "$avgPrice", 2 ] },
    count: 1,
    _id: 0
    }
},
{ $sort: { monthYear: 1 } }
]).pretty();
