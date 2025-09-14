//invocamos express
const express = require('express');
const app = express();

//2.setiamos urlencode para capturar datos del form
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//3. invoco dotenv para entorno
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });

//4. el directorio public middleware
app.use('', express.static('public'));
app.use('', express.static(__dirname + '/public'));

const multer = require('multer');
const path = require('path');

//middlewares para sessiones

function isLoggedIn(req, res, next) {
    if (req.session.loggedin) {
        next();
    } else {
        res.redirect('/login');
    }
}

function isAdmin(req, res, next) {
    if (req.session.loggedin && req.session.rol === 1) { // 1 = admin
        next();
    } else {
        res.status(403).send("Acceso denegado: solo administradores ");
    }
}

function isVendedorOrAdmin(req, res, next) {
    if (req.session.loggedin && (req.session.rol === 1 || req.session.rol === 2)) {
        next();
    } else {
        res.status(403).send("Acceso denegado: solo vendedores o admin");
    }
}

//5. establecer motor de plantilla
app.set('view engine', 'ejs');

//6.debo encriptar datos con bcryptjs
const bcryptjs = require('bcryptjs');

//7. var de sesion
const session = require('express-session');
const connection = require('./database/db.js');
const { name } = require('ejs');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//.8 llamamos al modulo de conexion
require('./database/db');

//.9 establecer las rutas

app.get('/cliente', (req, res) => {
    if (req.session.loggedin && req.session.rol === 3) {
        res.render('index_cliente', {
            login: true,
            name: req.session.name
        });
    } else {
        res.redirect('/'); // si no está logueado o no es cliente
    }
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
})

app.get('/register', (req, res) => {
    res.render('register.ejs');
})

app.get('/updateUser', (req, res) => {
    res.render('updateUser.ejs');
})

app.get('/clientes', (req, res) => {
    res.render('clientes.ejs');
})

app.get('/updateUser', (req, res) => {
    res.render('updateUser.ejs');
})

app.get('/updatePedido', (req, res) => {
    res.render('updatePedido.ejs');
})

app.get('/updateEnvio', (req, res) => {
    res.render('updateEnvio.ejs');
})


//10. registro en la bbdd mysql
app.post('/register', async (req, res) => {
    const nombres = req.body.nombres;
    const correo = req.body.correo;
    const telefono = req.body.telefono;
    const direccion = req.body.direccion;
    const contrasena = req.body.contrasena;
    let passwordHash = await bcryptjs.hash(contrasena, 8);

    connection.query(
        'INSERT INTO usuario (correo, contrasena, idRol) VALUES (?, ?, ?)',
        [correo, passwordHash, 3], // 1 = Cliente
        (error, resultsUsuario) => {
            if (error) {
                return res.render('register', {
                    alert: true,
                    alertTitle: "Registro no completado",
                    alertMessage: "El correo ya está registrado. Intenta con otro.",
                    alertIcon: "warning",
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'register'
                });
            }

            // a- Aquí está el id autogenerado
            const idUsuario = resultsUsuario.insertId;

            // b. Insertar en Cliente
            connection.query(
                'INSERT INTO Cliente (nombres, telefono, direccion, idUsuario) VALUES (?, ?, ?, ?)',
                [nombres, telefono, direccion, idUsuario],
                (error, resultsCliente) => {
                    if (error) {
                        console.log('Error insertando en Cliente:', error);
                        return res.status(500).send('Error en el registro (Correo Registrado)');
                    }

                    // c. Respuesta OK
                    res.render('register', {
                        alert: true,
                        alertTitle: "Registrado",
                        alertMessage: "Registrado Exitosamente",
                        alertIcon: "success",
                        showConfirmButton: false,
                        timer: 3000,
                        ruta: ''
                    });
                }
            );
        }
    );

})

//11.autentificacion
app.post('/auth', async (req, res) => {
    const correo = req.body.correo;
    const pass = req.body.pass;

    if (!correo || !pass) {
        return res.render('login', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "Favor ingresar correo y contraseña",
            alertIcon: "warning",
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
        });
    }

    connection.query(
        `SELECT u.idUsuario, u.correo, u.contrasena, u.idRol, c.nombres
         FROM usuario u
         LEFT JOIN cliente c ON u.idUsuario = c.idUsuario
         WHERE u.correo = ?`,
        [correo],
        async (error, results) => {
            if (error) {
                console.log("Error en la consulta:", error.sqlMessage);
                return res.status(500).send('Error en la consulta a la DB');
            }

            if (results.length === 0 || !(await bcryptjs.compare(pass, results[0].contrasena))) {
                return res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o Contraseña Incorrecta",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: 2000,
                    ruta: 'login'
                });
            }

            // Guardar datos en sesión
            req.session.loggedin = true;
            req.session.userId = results[0].idUsuario;
            req.session.name = results[0].nombres || results[0].correo;
            req.session.rol = results[0].idRol;

            // Definir ruta según el rol
            let rutaDestino = '';
            if (req.session.rol === 1) {
                rutaDestino = 'admin';
            } else if (req.session.rol === 2) {
                rutaDestino = 'vendedor';
            } else {
                rutaDestino = 'index_cliente';
            }

            return res.render('login', {
                alert: true,
                alertTitle: "Conexión Exitosa",
                alertMessage: "Ingresando...",
                alertIcon: "success",
                showConfirmButton: false,
                timer: 3000,
                ruta: rutaDestino
            });
        }
    );
});



//12. atenticación de pagina index

app.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.render('index', {
            login: true,
            name: req.session.name   // debe ser .name
        });
    } else {
        res.render('index', {
            login: false,
            name: 'Puede Iniciar Sesion'
        });
    };
});

function isCliente(req, res, next) {
    if (req.session.loggedin && req.session.rol === 3) {
        return next();
    }
    res.redirect('/login');
}

// Ruta para index_cliente
app.get('/index_cliente', isCliente, (req, res) => {
    const sql = "SELECT idProducto, nombreProducto, descripcion, precio FROM Producto ORDER BY idProducto DESC LIMIT 12";

    connection.query(sql, (err, productos) => {
        if (err) {
            console.error("Error consultando productos:", err);
            return res.status(500).send("Error en la consulta a la DB");
        }

        res.render('index_cliente', {
            login: true,
            name: req.session.name,
            productos: productos
        });

    });
});


//13. logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    });
});


//14. admin edit
app.get('/admin', isAdmin, (req, res) => {
    const sqlClientes = `
        SELECT c.idCliente, c.nombres, c.telefono, c.direccion, u.correo, u.idRol
        FROM Cliente c
        JOIN Usuario u ON c.idUsuario = u.idUsuario
        ORDER BY c.idCliente DESC
        LIMIT 10;
    `;

    const sqlProductos = `
        SELECT idProducto, nombreProducto, descripcion, precio, idCategoria
        FROM Producto
        ORDER BY idProducto DESC
        LIMIT 10;
    `;

    const sqlPedidos = `
        SELECT idPedido, idCliente, fechaPedido, total, idMetodoPago, idEnvio
        FROM Pedido
        ORDER BY idPedido DESC
        LIMIT 10;
    `;

    const sqlEnvios = `
        SELECT idEnvio, direccionEnvio, ciudad, estado, codigoPostal, fechaEnvio
        FROM Envio
        ORDER BY idEnvio DESC
        LIMIT 10;
    `;

    connection.query(sqlClientes, (errClientes, clientes) => {
        if (errClientes) return res.status(500).send("Error en clientes");

        connection.query(sqlProductos, (errProductos, productos) => {
            if (errProductos) return res.status(500).send("Error en productos");

            connection.query(sqlPedidos, (errPedidos, pedidos) => {
                if (errPedidos) return res.status(500).send("Error en pedidos");

                connection.query(sqlEnvios, (errEnvios, envios) => {
                    if (errEnvios) return res.status(500).send("Error en envíos");

                    res.render('admin', {
                        people: clientes,
                        productos: productos,
                        pedidos: pedidos,
                        envios: envios,
                        alert: req.session.alert || null,
                        alertTitle: req.session.alert ? req.session.alert.title : '',
                        alertMessage: req.session.alert ? req.session.alert.message : '',
                        alertIcon: req.session.alert ? req.session.alert.type : '',
                        showConfirmButton: false,
                        timer: 2000,
                        ruta: 'admin'
                    });
                    req.session.alert = null; // limpiar alert
                });
            });
        });
    });
});



//15. eliminacion con admin
app.get('/deleteUser/:idCliente', (req, res) => {
    const IdDelCliente = req.params.idCliente;

    const sqlDelete = `
        DELETE u, c
        FROM Usuario u
        JOIN Cliente c ON u.idUsuario = c.idUsuario
        WHERE c.idCliente = ?;
    `;

    connection.query(sqlDelete, [IdDelCliente], (error, results) => {
        if (error) {
            console.log(error);
            return res.redirect('/admin?error=1'); // se redirige con querystring
        }

        // Traer de nuevo la lista después de borrar
        connection.query(
            `SELECT c.idCliente, c.nombres, c.telefono, c.direccion, u.correo, u.idRol
             FROM Cliente c
             JOIN Usuario u ON c.idUsuario = u.idUsuario
             ORDER BY c.idCliente DESC
             LIMIT 10`,
            (err, results) => {
                if (err) {
                    console.error("Error en la base de datos:", err);
                    return res.status(500).send("Error en la base de datos");
                }

                res.render('admin', {
                    people: results,
                    alert: true,
                    alertTitle: "Eliminado",
                    alertMessage: "Cliente eliminado correctamente",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 2000,
                    ruta: 'admin'
                });
            }
        );
    });
});

// 16. actualización de user con admin
app.get('/updateUser/:idCliente', (req, res) => {
    const IdDelCliente = req.params.idCliente;

    const sqlSelect = `
        SELECT c.idCliente, c.nombres, c.telefono, c.direccion, u.correo
        FROM Cliente c
        JOIN Usuario u ON c.idUsuario = u.idUsuario
        WHERE c.idCliente = ?;
    `;

    connection.query(sqlSelect, [IdDelCliente], (error, results) => {
        if (error) {
            console.error("Error al obtener cliente:", error);
            return res.status(500).send("Error en la base de datos");
        }

        if (results.length === 0) {
            return res.status(404).send("Cliente no encontrado");
        }

        res.render('updateUser', {
            data: results[0] //pasamos solo un cliente
        });
    });
});

app.post('/update', (req, res) => {
    const { idCliente, nombres, correo, telefono, direccion } = req.body;

    // Primero buscamos el idUsuario que corresponde al cliente
    const sqlFindUser = `SELECT idUsuario FROM Cliente WHERE idCliente = ?;`;

    connection.query(sqlFindUser, [idCliente], (err, results) => {
        if (err) {
            console.error("Error buscando idUsuario:", err);
            return res.status(500).send("Error en la base de datos (buscando usuario)");
        }

        if (results.length === 0) {
            return res.status(404).send("Cliente no encontrado");
        }

        const idUsuario = results[0].idUsuario;

        // Iniciamos una transacción para que ambos updates sean consistentes
        connection.beginTransaction(err => {
            if (err) throw err;

            // Update en Cliente
            const sqlUpdateCliente = `
                UPDATE Cliente 
                SET nombres = ?, telefono = ?, direccion = ?
                WHERE idCliente = ?;
            `;
            connection.query(sqlUpdateCliente, [nombres, telefono, direccion, idCliente], (err) => {
                if (err) {
                    return connection.rollback(() => {
                        console.error("Error actualizando Cliente:", err);
                        res.status(500).send("Error actualizando Cliente");
                    });
                }

                // Update en Usuario
                const sqlUpdateUsuario = `
                    UPDATE Usuario 
                    SET correo = ?
                    WHERE idUsuario = ?;
                `;
                connection.query(sqlUpdateUsuario, [correo, idUsuario], (err) => {
                    if (err) {
                        return connection.rollback(() => {
                            console.error("Error actualizando Usuario:", err);
                            res.status(500).send("Error actualizando Usuario");
                        });
                    }

                    // Commit si ambos updates fueron exitosos
                    connection.commit(err => {
                        if (err) {
                            return connection.rollback(() => {
                                console.error("Error en commit:", err);
                                res.status(500).send("Error finalizando actualización");
                            });
                        }
                        req.session.alert = {
                            type: 'success',
                            title: 'Actualizado',
                            message: 'El registro del cliente fue actualizado correctamente'
                        };

                        // en vez de render, redirigimos al listado admin
                        if (req.session.rol === 1) {
                            res.redirect('/admin');
                        } else {
                            res.redirect('/vendedor');
                        }
                    });
                });
            });
        });
    });
});


//17 Mostrar formulario de edición
app.get('/updateProducto/:idProducto', isVendedorOrAdmin, (req, res) => {
    const { idProducto } = req.params;
    const sql = "SELECT * FROM Producto WHERE idProducto = ?";

    connection.query(sql, [idProducto], (err, results) => {
        if (err) return res.status(500).send("Error en DB");
        if (results.length === 0) return res.status(404).send("Producto no encontrado");

        res.render('updateProducto', {
            data: results[0],
            rol: req.session.rol
        });
    });
});

// Actualizar producto
app.post('/updateProducto', isVendedorOrAdmin, (req, res) => {
    const { idProducto, nombreProducto, descripcion, precio, idCategoria } = req.body;
    const sql = `
        UPDATE Producto 
        SET nombreProducto = ?, descripcion = ?, precio = ?, idCategoria = ?
        WHERE idProducto = ?
    `;
    connection.query(sql, [nombreProducto, descripcion, precio, idCategoria, idProducto], (err) => {
        if (err) return res.status(500).send("Error actualizando producto");

        req.session.alert = {
            type: 'success',
            title: 'Producto actualizado',
            message: 'El producto fue editado correctamente'
        };
        if (req.session.rol === 1) {
            res.redirect('/admin');
        } else {
            res.redirect('/vendedor');
        }
    });
});

// Eliminar producto
app.get('/deleteProducto/:idProducto', isVendedorOrAdmin, (req, res) => {
    const { idProducto } = req.params;
    const sql = "DELETE FROM Producto WHERE idProducto = ?";

    connection.query(sql, [idProducto], (err) => {
        if (err) return res.status(500).send("Error eliminando producto");

        req.session.alert = {
            type: 'success',
            title: 'Producto eliminado',
            message: 'El producto fue eliminado correctamente'
        };

        //  Redirige según el rol
        if (req.session.rol === 1) {
            res.redirect('/admin');     // admin
        } else {
            res.redirect('/vendedor');  // vendedor
        }
    });
});
// Guardar nuevo producto 

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/'); // carpeta donde guardarás las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // nombre único
    }
});

const upload = multer({ storage: storage });

app.get('/addProducto', isVendedorOrAdmin, (req, res) => {
    res.render('addProducto.ejs', { rol: req.session.rol });
});
app.post('/addProducto', isVendedorOrAdmin, upload.single('imagen'), (req, res) => {
    const { nombreProducto, descripcion, precio, idCategoria } = req.body;
    const imagen = req.file ? '/uploads/' + req.file.filename : null;

    const sql = `
        INSERT INTO Producto (nombreProducto, descripcion, precio, idCategoria, imagen)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(sql, [nombreProducto, descripcion, precio, idCategoria, imagen], (err) => {
        if (err) {
            console.error("Error agregando producto:", err);
            return res.status(500).send("Error agregando producto");
        }

        req.session.alert = {
            type: 'success',
            title: 'Producto agregado',
            message: 'El producto fue registrado correctamente'
        };

        if (req.session.rol === 1) {
            res.redirect('/admin');
        } else {
            res.redirect('/vendedor');
        }
    });
});



// Editar pedido
app.get('/updatePedido/:idPedido', isVendedorOrAdmin, (req, res) => {
    const { idPedido } = req.params;
    const sql = "SELECT * FROM Pedido WHERE idPedido = ?";

    connection.query(sql, [idPedido], (err, results) => {
        if (err) return res.status(500).send("Error en DB");
        if (results.length === 0) return res.status(404).send("Pedido no encontrado");

        res.render('updatePedido', { data: results[0] });
    });
});

app.post('/updatePedido', isVendedorOrAdmin, (req, res) => {
    let { idPedido, idCliente, fechaPedido, total, idMetodoPago, idEnvio } = req.body;

    // Si vienen vacíos, asigna null
    idMetodoPago = idMetodoPago || null;
    idEnvio = idEnvio || null;

    const sql = `
        UPDATE Pedido
        SET idCliente = ?, fechaPedido = ?, total = ?, idMetodoPago = ?, idEnvio = ?
        WHERE idPedido = ?
    `;

    connection.query(sql, [idCliente, fechaPedido, total, idMetodoPago, idEnvio, idPedido], (err) => {
        if (err) {
            console.error("Error actualizando pedido:", err);
            return res.status(500).send("Error actualizando pedido");
        }

        req.session.alert = {
            type: 'success',
            title: 'Pedido actualizado',
            message: 'El pedido fue editado correctamente'
        };

        if (req.session.rol === 1) {
            res.redirect('/admin');
        } else {
            res.redirect('/vendedor');
        }
    });
});



// Eliminar pedido
app.get('/deletePedido/:idPedido', isVendedorOrAdmin, (req, res) => {
    const { idPedido } = req.params;
    const sql = "DELETE FROM Pedido WHERE idPedido = ?";

    connection.query(sql, [idPedido], (err) => {
        if (err) return res.status(500).send("Error eliminando pedido");

        req.session.alert = {
            type: 'success',
            title: 'Pedido eliminado',
            message: 'El pedido fue eliminado correctamente'
        };
        if (req.session.rol === 1) {
            res.redirect('/admin');
        } else {
            res.redirect('/vendedor');
        }
    });
});
// Editar envío
app.get('/updateEnvio/:idEnvio', isVendedorOrAdmin, (req, res) => {
    const { idEnvio } = req.params;
    const sql = "SELECT * FROM Envio WHERE idEnvio = ?";

    connection.query(sql, [idEnvio], (err, results) => {
        if (err) return res.status(500).send("Error en DB");
        if (results.length === 0) return res.status(404).send("Envío no encontrado");

        res.render('updateEnvio', { data: results[0] });
    });
});

app.post('/updateEnvio', isVendedorOrAdmin, (req, res) => {
    const { direccionEnvio, ciudad, estado, codigoPostal, fechaEnvio, idEnvio } = req.body;
    const sql = `
        UPDATE Envio
        SET direccionEnvio = ?, ciudad = ?, estado = ?, codigoPostal = ?, fechaEnvio = ?
        WHERE idEnvio = ?
    `;
    connection.query(sql, [direccionEnvio, ciudad, estado, codigoPostal, fechaEnvio, idEnvio], (err) => {
        if (err) return res.status(500).send("Error actualizando envío");

        req.session.alert = {
            type: 'success',
            title: 'Envío actualizado',
            message: 'El envío fue editado correctamente'
        };
        res.redirect('/admin');
    });
});

// Eliminar envío
app.get('/deleteEnvio/:idEnvio', isVendedorOrAdmin, (req, res) => {
    const { idEnvio } = req.params;
    const sql = "DELETE FROM Envio WHERE idEnvio = ?";

    connection.query(sql, [idEnvio], (err) => {
        if (err) return res.status(500).send("Error eliminando envío");

        req.session.alert = {
            type: 'success',
            title: 'Envío eliminado',
            message: 'El envío fue eliminado correctamente'
        };
        if (req.session.rol === 1) {
            res.redirect('/admin');
        } else {
            res.redirect('/vendedor');
        }
    });
});


//vista y render para plantilla vendedor


app.get('/vendedor', (req, res) => {
    const sqlProductos = `
        SELECT idProducto, nombreProducto, descripcion, precio, idCategoria
        FROM Producto
        ORDER BY idProducto DESC
        LIMIT 10;
    `;

    const sqlPedidos = `
        SELECT idPedido, idCliente, fechaPedido, total, idMetodoPago, idEnvio
        FROM Pedido
        ORDER BY idPedido DESC
        LIMIT 10;
    `;

    connection.query(sqlProductos, (errProductos, productos) => {
        if (errProductos) return res.status(500).send("Error en productos");

        connection.query(sqlPedidos, (errPedidos, pedidos) => {
            if (errPedidos) return res.status(500).send("Error en pedidos");

            res.render('vendedor', {
                productos: productos,
                pedidos: pedidos,
                alert: req.session.alert || null,
                alertTitle: req.session.alert ? req.session.alert.title : '',
                alertMessage: req.session.alert ? req.session.alert.message : '',
                alertIcon: req.session.alert ? req.session.alert.type : '',
                showConfirmButton: false,
                timer: 2000,
                ruta: 'vendedor'
            });

            req.session.alert = null; // limpiar alert
        });
    });
});
//recepcion de carrito del front end

// Registrar un pedido
app.post('/api/pedido', (req, res) => {
    if (!req.session.loggedin || req.session.rol !== 3) { // 3 = cliente
        return res.status(401).json({ error: 'Debes iniciar sesión como cliente' });
    }

    const carrito = req.body.carrito;
    const idCliente = req.session.userId; // ya lo guardaste en la sesión
    let total = 0;

    carrito.forEach(item => {
        const precioNum = parseFloat(item.precio.replace(/[^0-9.-]+/g, ""));
        total += precioNum * item.cantidad;
    });

    // 1. Insertar pedido
    const sqlPedido = "INSERT INTO Pedido (idCliente, total) VALUES (?, ?)";
    connection.query(sqlPedido, [idCliente, total], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error creando pedido' });
        }

        const idPedido = result.insertId;

        // 2. Insertar detalles
        const sqlDetalle = "INSERT INTO DetallePedido (idPedido, idProducto, cantidad, precio) VALUES ?";
        const values = carrito.map(item => [
            idPedido,
            item.id, // ojo: este `id` debe coincidir con Producto.idProducto
            item.cantidad,
            parseFloat(item.precio.replace(/[^0-9.-]+/g, ""))
        ]);

        connection.query(sqlDetalle, [values], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error guardando detalles' });
            }

            res.json({ success: true, idPedido });
        });
    });
});

//modulo para dejar operativo el formulario de index con mi gmail

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // el correo
        pass: process.env.EMAIL_PASS  // la contraseña o app password
    }
});

app.post('/contactanos', (req, res) => {
    const { nombres, correo, telefono, message } = req.body;

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // lo mando a mi mail
        subject: "Nuevo mensaje de contacto",
        text: `
            Nombre: ${nombres}
            Correo: ${correo}
            Teléfono: ${telefono}
            Mensaje: ${message}
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error enviando correo:", error);
            return res.render('index', {
                login: req.session.loggedin || false,
                name: req.session.name || 'Invitado',
                alert: true,
                alertTitle: "Error",
                alertMessage: "No se pudo enviar el mensaje. Intenta más tarde.",
                alertIcon: "error",
                showConfirmButton: true,
                timer: false,
                ruta: ""
            });
        };
        res.render('index', {
            login: req.session.loggedin || false,
            name: req.session.name || 'Invitado',
            alert: true,
            alertTitle: "Enviado",
            alertMessage: "Tu mensaje fue enviado correctamente",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 2500,
            ruta: ""
        });
    });
});
app.listen(3000, (req, res) => {
    console.log('server is running in port http://localhost:3000')
});


