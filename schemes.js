const ecoRideUsersScheme = {
  users: {
    _id: "ObjectId", // Tipo ObjectId
    name: "string", // Nome do usuário
    vehicle: {
      model: "string", // Modelo do veículo
      year: "int", // Ano do veículo
      color: "string", // Cor do veículo
      plate: "string", // Placa do veículo
    },
    avg_star_rating: "float", // Média de estrelas
    total_rides_given: "int", // Total de caronas oferecidas
    total_rides_taken: "int", // Total de caronas pegadas
    date_registered: "ISODate", // Data de registro
  }
}

const ecoRideRoutesScheme = {
  routes: {
    _id: "ObjectId", // Tipo ObjectId
    origin: {
      address: "string", // Endereço de origem
      coordinates: { lat: "float", lng: "float" }, // Coordenadas de origem (latitude, longitude)
    },
    destination: {
      address: "string", // Endereço de destino
      coordinates: { lat: "float", lng: "float" }, // Coordenadas de destino (latitude, longitude)
    },
    distance: "float", // Distância da rota
    price: "float", // Preço da rota
    driver_id: "ObjectId", // ID do motorista (referência para `users`)
    date_time: "ISODate", // Data e hora da rota
    date_created: "ISODate", // Data de criação da rota
    status: "string", // Status da rota (scheduled, completed, canceled)
  }
}

const ecoRideRidesScheme = {
  scheduledRides: {
    _id: "ObjectId", // Tipo ObjectId
    user_id: "ObjectId", // ID do usuário (referência para `users`)
    route_id: "ObjectId", // ID da rota (referência para `routes`)
    date_created: "ISODate", // Data de criação do agendamento
    status: "string", // Status do agendamento (scheduled, completed, canceled)
    star_rating: "float", // Classificação de estrelas (opcional, se a viagem for concluída)
    feedback: "string", // Comentário do usuário sobre a viagem (opcional)
  },
};
