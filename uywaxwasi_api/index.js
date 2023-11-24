const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

const {sequelize} = require('./connection');
const {Vaccine, User, Pet, Activity} = require('./models');

app.use(express.json());

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Endpoint users

app.post('/users', async (req, res) => {
    try {
        const userType = req.body?.type;
        const name = req.body?.name;
        const email = req.body?.email;
        const password = req.body?.password;

        if(!userType || !name || !email || !password){
            return res
                .status(400)
                .json({message: 'Datos incompletos'});
        }

        const saveUser = await User.create({
            type: userType,
            name,
            email,
            password
        });

        return res
            .status(201)
            .json({User:saveUser});
    }catch(error){
        return res
            .status(500)
            .json({message: 'Error interno de servidor'});
    }
});

app.get('/users', async (req, res) => {
    try{
        const users = await User.findAll();
        return res.json({users});
    }catch(error){
        console.log("Error", error);
        return res.status(500).json({message: 'Error interno de servidor'});
    }
});

app.get('/users/:userId', async (req, res) => {
    try{
        const userId = req.params.userId;
        const user = await User.findByPk(userId);
        if(!user){
            return res.status(404).json({message: 'Usuario no encontrado'});
        }
        return res.json({ user });
    }catch(error){
        console.log("Error", error);
        return res.status(500).json({message: 'Error interno de servidor'});
    }
});

app.post('/users/login', async (req, res) => {
 
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({message: 'Datos incompletos'});
    }
    const users = await User.findOne({
        where: {
            email,
            password
        }
    });
        
    if(users == null){}else{
        const id = users.id;
        const token = jwt.sign({id}, "arribaLosTiuan", {expiresIn: 300});
        return res.json({auth: true, token, users});
    }

});

// Endpoint vaccines

app.post('/vaccines', async (req, res) => {     
    try {
        const name = req.body?.name;
        const pet_name = req.body?.pet_name;
        const pet = req.body?.petId;
        const user = req.body?.userId;

        if(!name || ! pet_name || !pet || !user){
            return res
                .status(400)
                .json({message: 'Datos incompletos'});
        }

        const saveVaccine = await Vaccine.create({
            name, pet_name, petId: pet, userId: user
        });

        return res
            .status(201)
            .json({Vaccine:saveVaccine});

    }catch(error){
        return res
            .status(500)
            .json({message: 'Error interno de servidor'});
    }
});

app.get('/vaccines/:userId', async (req, res) => {
    try{
        const vaccines = await Vaccine.findAll({
            where: {
                userId: req.params.userId
            }
        });
        return res.json({vaccines});
    }catch(error){
        console.log("Error", error);
        return res.status(500).json({message: 'Error interno de servidor'});
    }
});

app.get('/vaccine/:vaccineId', async (req, res) => {
    try{
        const vaccineId = req.params.vaccineId;
        const vaccine = await Vaccine.findByPk(vaccineId);
        if(!vaccine){
            return res.status(404).json({message: 'Vacuna no encontrada'});
        }
        return res.json({ vaccine });
    }catch(error){
        console.log("Error", error);
        return res.status(500).json({message: 'Error interno de servidor'});
    }
});

app.delete("/vaccines/:vaccineId", async (req, res) => {
    try{
        const vaccineId = req.params.vaccineId;
        const vaccine = await Vaccine.findByPk(vaccineId);
        if(!vaccine){
            return res.status(404).json({message: 'Vacuna no encontrada'});
        }
        await vaccine.destroy();
        return res.json({ message: "Vacuna eliminada correctamente" });
    }catch(error){
        console.log("Error", error);
        return res.status(500).json({message: 'Error interno de servidor'});
    }
});

app.put("/vaccines/:vaccineId", async (req, res) => {
    try{
        const vaccineId = req.params.vaccineId;
        const { name, pet_name } = req.body;
        if(!name || !pet_name){
            return res.status(400).json({message: 'Datos incompletos'});
        }
        const vaccine = await Vaccine.findByPk(vaccineId);
        if(!vaccine){
            return res.status(404).json({message: 'Vacuna no encontrada'});
        }

        vaccine.name = name;
        vaccine.pet_name = pet_name;
        await vaccine.save();

        return res.json({ vaccine });
    }catch(error){
        console.log("Error", error);
        return res.status(500).json({message: 'Error interno de servidor'});
    }
});

// Endpoint pets

app.get("/pets/:userId", async (req, res) => {
    try{
        const user = req.params.userId;
        const pets = await Pet.findAll({
            where: {
                userId: user
            }
        });
        return res.json({pets});
    }catch(error){
        console.log("Error", error);
        return res.status(500).json({message: 'Error interno de servidor'});
    }
});

app.get("/pet/:petId", async (req, res) => {
    try{
        const id = req.params.petId;
        const pet = await Pet.findByPk(id);
        return res.json({pet});
    }catch(error){
        console.log("Error", error);
        return res.status(500).json({message: 'Error interno de servidor'});
    }
});

app.post('/pets', async (req, res) => {
    try {
        const name = req.body?.name;
        const type = req.body?.type;
        const breed = req.body?.breed;
        const age = req.body?.age;
        const user = req.body?.user;
        const url = req.body?.url;

        
        if(!name || !type || !breed || !age || !user){
            return res
                .status(400)
                .json({message: 'Datos incompletos'});
        }

        const savePet = await Pet.create({
            name, 
            type, 
            breed, 
            age,
            icon_url: url, 
            userId: user,
        });
        return res
            .status(201)
            .json({Pet:savePet});

    } catch(error){
        return res
            .status(500)
            .json({message: 'Error interno de servidor'});
    }
});

app.delete("/pets/:petId", async (req, res) => {
    try {
        const petId = req.params.petId;
        const pet = await Pet.findByPk(petId);
        if(!pet){
            return res.status(404).json({message: 'Mascota no encontrada'});
        }
        await pet.destroy();
        return res.json({ message: "Mascota eliminada correctamente" });
    } catch(error){
        return res
            .status(500)
            .json({message: 'Error interno de servidor'});
    }
});

app.put("/pets/:petId", async (req, res) => {
    try {
        const petId = req.params.petId;
        const { name, type, breed, age } = req.body;
        if(!name || !type || !breed || !age){
            return res.status(400).json({message: 'Datos incompletos'});
        }
        const pet = await Pet.findByPk(petId);
        if(!pet){
            return res.status(404).json({message: 'Mascota no encontrada'});
        }

        pet.name = name;
        pet.type = type;
        pet.breed = breed;
        pet.age = age;
        await pet.save();

        return res.json({ pet });
    } catch(error){
        return res
            .status(500)
            .json({message: 'Error interno de servidor'});
    }
});

// Endpoint activities

app.get("/activities/:userId", async (req, res) => {
    try {
        const user = req.params.userId;
        const activities = await Activity.findAll({
            where: {
                userId: user
            }
        });
        return res.json({activities});
    } catch(error){
        return res
            .status(500)
            .json({message: 'Error interno de servidor'});
    }
});

app.get("/activity/:activityId", async (req, res) => {
    try {
        const id = req.params.activityId;
        const activity = await Activity.findByPk(id);
        return res.json({activity});
    } catch(error){
        return res
            .status(500)
            .json({message: 'Error interno de servidor'});
    }
});

app.post("/activities", async (req, res) => {
    try {
        const content = req.body?.content;
        const start = req.body?.start;
        const end = req.body?.end;
        const user = req.body?.user;

        if(!content || !start || !end || !user){
            return res
                .status(400)
                .json({message: 'Datos incompletos'});
        }

        const saveActivity = await Activity.create({
            content, 
            start, 
            end,
            userId: user,
        });

        return res
            .status(201)
            .json({Activity:saveActivity});
    } catch(error){
        return res
            .status(500)
            .json({message: 'Error interno de servidor'});
    }
});

app.delete("/activities/:activityId", async (req, res) => {
    try {
        const activityId = req.params.activityId;
        const activity = await Activity.findByPk(activityId);
        if(!activity){
            return res.status(404).json({message: 'Actividad no encontrada'});
        }
        await activity.destroy();
        return res.json({ message: "Actividad eliminada correctamente" });
    } catch(error){
        return res
            .status(500)
            .json({message: 'Error interno de servidor'});
    }
});

app.put("/activities/:activityId", async (req, res) => {
    try {
        const activityId = req.params.activityId;
        const { content, start, end } = req.body;
        if(!content || !start || !end){
            return res.status(400).json({message: 'Datos incompletos'});
        }
        const activity = await Activity.findByPk(activityId);
        if(!activity){
            return res.status(404).json({message: 'Actividad no encontrada'});
        }

        activity.content = content;
        activity.start = start;
        activity.end = end;
        await activity.save();

        return res.json({ activity });
    } catch(error){
        return res
            .status(500)
            .json({message: 'Error interno de servidor'});
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Conexión establecida con la base de datos');
        return sequelize.sync();
    })
    .then(() => {
        app.listen(port, () => {  
            console.log('Servidor iniciado');
        });
    })
    .catch(err => {
        console.error('No se pudo conectar con la base de datos:', err);
    });


