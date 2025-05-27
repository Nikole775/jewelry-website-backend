import sql from 'mssql';

const config = {
    user: 'labo.nikole2004',
    password: 'Korral775',
    server: ' tcp://4.tcp.eu.ngrok.io',
    port: 18669,
    database: 'JewelryDB',
    options: {
        trustServerCertificate: true,
        encrypt: false
    }
};

let pool;

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => console.error('Database Connection Error:', err));

export { sql, poolPromise };
