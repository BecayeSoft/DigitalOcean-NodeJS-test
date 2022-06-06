const express = require('express')

const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const  Thing = require('./models/Thing')

const app = express()

//Connexion à la base de données
//'mongodb+srv://user:Mongodb2001@mycluster.dntqr.mongodb.net/MongoDB?retryWrites=true&w=majority'
mongoose.connect('mongodb+srv://'
    + process.env.db_username 
    + process.env.db_password 
    + '@mycluster.dntqr.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
		useUnifiedTopology: true
    })
	.then(() => console.log('Connexion à MongoDB réussie !'))
	.catch((err) => console.error('Connexion à MongoDB échouée\n', err))

//Autorisation des CORS (Cross Origin Ressource Sharing)
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
	next()
})

app.use(bodyParser.json())

//Création d'un Thing
app.post('/api/stuff', (req, res, next) => {
	//Suppression de l'id puisqu'il est généré automatiquement dans la base de données
	delete req.body._id
	const  thing = new Thing({
		//Copie les champs du corps de la requête
		...req.body
	})
	thing.save()
		.then(() => res.status(201).json({ message: 'Objet enregistré !' }))

})

//Récupération d'un seul Thing
app.get('/api/stuff/:id', (req, res, next) =>{
	Thing.findOne({ _id: req.params.id })
		.then(thing => res.status(200).json(thing))
		.catch(error => res.status(404).json({ error }))
})

//Modification d'un Thing
app.put('/api/stuff/:id', (req, res, next) => {
	Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
		.then(() => res.status(200).json({ message: 'Objet modifié !' }))
		.catch((error) => res.status(400).json({ error }))
})

//Suppression d'un Thing
app.delete('/api/stuff/:id', (req, res, next) => {
	Thing.deleteOne({_id: req.params.id} )
		.then(thing => res.status(200).json({ message: 'Objet supprimé !' }))
		.catch(error => res.status(404).json({ error }))
})

//Récupération des Things dans la base de données
app.get('/api/stuff', (req, res, next) => {
	Thing.find()
		.then(things => res.status(200).json(things))
		.catch(error => res.status(400).json( {error} ))
})

module.exports = app