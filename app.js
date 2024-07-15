import express from 'express';
import session from 'express-session';

import {pool} from './config/db.js';


// simula DB
let users = [
    {
    idusuario: 1,
    email: 'mariauno@gmail.com',
    password: '1234'
    }
]

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'codo a codo',
    resave: false,
    saveUninitialized: false
}))

function verificarAutenticacion (req, res, next) {
    if (req.session.autenticado) {
        next ();
    } else {
      res.status(401).send('No estas autenticado, por favor logueate');
    
    }
}

// Define routes here
app.get('/users', async (req, res) => {
    
    try {
        const connection = await pool.getConnection();
        const sql = 'SELECT * FROM usuario'
        const [rows, fields] = await connection.query(sql);
        // console.log("FIELDS -->", fields)
        connection.release();
        res.json(rows);
    } catch (err) {
        console.error('Hubo un error al consultar la base de datos:', err);
        res.status(500).send('Hubo un error al consultar la base de datos');
    }
});


    app.get('/users/:idusuario', async (req, res) => {
        try {
            const connection = await pool.getConnection();
            const id = req.params.id
            const sql = 'SELECT * FROM usuario WHERE idusuario = ?';

            const [rows, fields] = await connection.query(sql, [id]);
            connection.release();
            if (rows.length === 0) {
                res.status(404).send('User not found');
            } else {
                res.json(rows[0]);
            }
        } catch (err) {
            console.error('Hubo un error al consultar la base de datos:', err);
            res.status(500).send('Hubo un error al consultar la base de datos');
        }
    });

/* crear un nuevo uusuario*/
app.post('/users', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const {idusuario, nombre, apellido, email, rol, password} = req.body;

        const userData = req.body; // toma la info del formulario
  
        const sql = 'INSERT INTO usuario SET ?'; // (idusuario, nombre, email, rol, password ) VALUES (?, ?, ?, ?)';
        const [rows] = await connection.query(sql, [userData]);;
        connection.release();
        res.json({mensaje: 'Usuario creado', id: rows.insertId});
       // res.redirect('/users.html' + "?mensaje=Usuario creado");
    } catch (err) {
        console.error('Hubo un error al consultar la base de datos:', err);
        res.status(500).send('Hubo un error al consultar la base de datos');
    }
    
});

app.get('/', (req, res) => {
    // Get all users
});

    app.post('/users/:idusuario', async (req, res) => {
        try {
            const connection = await pool.getConnection();
            const id = req.params.id;
            const userData = req.body; // toma la info del formulario

            const sql = 'UPDATE usuario SET ? WHERE idusuario = ?';
            const [rows] = await connection.query(sql, [userData, id]);
            connection.release();
            res.json({ mensaje: 'Usuario actualizado' });
        } catch (err) {
            console.error('Hubo un error al consultar la base de datos:', err);
            res.status(500).send('Hubo un error al consultar la base de datos');
        }
    });


app.get('/users/borrar/:idusuario', async (req, res) => {
    
        try {
            const connection = await pool.getConnection();
            const id = req.params.id;
            const sql = 'DELETE FROM usuario WHERE idusuario = ?';
            const [rows] = await connection.query(sql, [id]);
            connection.release();
            if (rows.affectedRows === 0) {
                res.status(404).send('User not found');
            } else {
                res.json({ mensaje: 'Usuario eliminado' });
            }
        } catch (err) {
            console.error('Hubo un error al consultar la base de datos:', err);
            res.status(500).send('Hubo un error al consultar la base de datos');
        }
 
});

app.get('/login', (req, res) => {
    //res.sendFile (__dirname + 'login.html') (ESTO LO USAMOS PARA IR AL ARCHIVO DE LOOGIN)
    const {email, password} = req.body;

    const usuario = users.find(user => users.email === username && users.password === password);
    // SELECT * FROM users WHERE username = 

    if (!usuario) { 
        return res.status (401).send ('USUARIO NO ENCONTRADO');
    } else {
        req.session.autenticado = true;
         res.redirect('/admin'); 
    }

});

app.get('/admin', verificarAutenticacion, (req, res) => {
    res.send('Bienvenido al panel de Administracion');
    

});


