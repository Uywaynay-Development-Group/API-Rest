const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

const {sequelize} = require('./connection');
const {Vaccine, User} = require('./models');

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
        return res.json({users});
    }

});

// Endpoint vaccines

app.post('/vaccines', async (req, res) => {     
    try {
        const name = req.body?.name;
        const pet_name = req.body?.pet_name;

        if(!name || ! pet_name){
            return res
                .status(400)
                .json({message: 'Datos incompletos'});
        }

        const saveVaccine = await Vaccine.create({
            name, pet_name
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

app.get('/vaccines', async (req, res) => {
    try{
        const vaccines = await Vaccine.findAll();
        return res.json({vaccines});
    }catch(error){
        console.log("Error", error);
        return res.status(500).json({message: 'Error interno de servidor'});
    }
});

app.get('/vaccines/:vaccineId', async (req, res) => {
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


