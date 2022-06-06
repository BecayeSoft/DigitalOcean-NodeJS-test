const mongoose = require('mongoose')

//Schéma de données
const thingSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    userId: { type: String, required: true },
})

//Export du schéma en tant que modèle mongoose
module.exports = mongoose.model('Thing', thingSchema)