const { sql, connectToDatabase } = require('./dbConnection');

async function setupDatabase() {
    try {
        await connectToDatabase();

        // Create tables with 1-to-many relationship
        await sql.query(`
            CREATE TABLE Categories (
                CategoryID INT PRIMARY KEY IDENTITY(1,1),
                Name NVARCHAR(100) NOT NULL UNIQUE
            );
            
            CREATE TABLE Products (
                ProductID INT PRIMARY KEY IDENTITY(1,1),
                Name NVARCHAR(100) NOT NULL,
                Description NVARCHAR(500),
                Style NVARCHAR(100),
                CategoryID INT NOT NULL,
                Price DECIMAL(10, 2) NOT NULL,
                UserAdded BIT DEFAULT 1,
                Video NVARCHAR(100),
                FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
            );
        `);

        console.log('Database tables created successfully');
    } catch (err) {
        console.error('Database setup error:', err);
    } finally {
        sql.close();
    }
}

setupDatabase();