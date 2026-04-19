/**
 * @file server.ts
 * @description Main entry point for the ReachHomes backend server.
 * This file configures an Express application, sets up a SQLite database
 * (as a fallback for the preview environment), defines REST API endpoints,
 * and integrates Vite middleware for development.
 * 
 * In a production environment, this application is designed to run within
 * a Docker container, connecting to a MySQL database and routed via Traefik.
 */

import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import Database from 'better-sqlite3';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Expert 40: Trust proxy for Cloud Run/Nginx
app.set('trust proxy', 1);

// Expert 2 & 43: Security and Compression
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development/iframe compatibility
  crossOriginEmbedderPolicy: false
}));
app.use(compression());

// Expert 42: Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 2000, // Increased limit
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again in a few minutes.'
    });
  }
});

// Database connection interface
interface DB {
  query(sql: string, params?: any[]): Promise<any>;
  execute?(sql: string, params?: any[]): Promise<any>;
  exec?(sql: string): void;
  prepare?(sql: string): any;
  end?(): Promise<void>;
  close?(): void;
}

let db: DB | null = null;
let isMySQL = false;

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    isVerified INTEGER DEFAULT 0,
    parentId VARCHAR(255)
  );

  CREATE TABLE IF NOT EXISTS properties (
    id VARCHAR(255) PRIMARY KEY,
    ownerId VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    pricePerNight DOUBLE NOT NULL,
    rating DOUBLE DEFAULT 0,
    image TEXT,
    cleaningFee DOUBLE DEFAULT 0,
    serviceFee DOUBLE DEFAULT 0,
    maxGuests INTEGER DEFAULT 1,
    bedrooms INTEGER DEFAULT 1,
    beds INTEGER DEFAULT 1,
    baths INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id VARCHAR(255) PRIMARY KEY,
    propertyId VARCHAR(255) NOT NULL,
    clientId VARCHAR(255) NOT NULL,
    startDate VARCHAR(50) NOT NULL,
    endDate VARCHAR(50) NOT NULL,
    guests INTEGER NOT NULL,
    totalPrice DOUBLE NOT NULL,
    status VARCHAR(50) DEFAULT 'CONFIRMED'
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(255) PRIMARY KEY,
    assigneeId VARCHAR(255) NOT NULL,
    propertyId VARCHAR(255) NOT NULL,
    propertyName VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    checklist TEXT -- JSON string
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    time VARCHAR(50) NOT NULL,
    read INTEGER DEFAULT 0,
    type VARCHAR(50) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS profiles (
    id VARCHAR(255) PRIMARY KEY,
    ownerId VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    image TEXT,
    targetAudience VARCHAR(255),
    priceModifier DOUBLE,
    description TEXT,
    amenities TEXT, -- JSON string
    rules TEXT, -- JSON string
    checkInTime VARCHAR(50),
    checkOutTime VARCHAR(50)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(255) PRIMARY KEY,
    propertyId VARCHAR(255) NOT NULL,
    clientName VARCHAR(255) NOT NULL,
    rating DOUBLE NOT NULL,
    comment TEXT,
    date VARCHAR(50) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS serviceRequests (
    id VARCHAR(255) PRIMARY KEY,
    propertyId VARCHAR(255) NOT NULL,
    propertyName VARCHAR(255) NOT NULL,
    partnerId VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    date VARCHAR(50) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS state (
    id INTEGER PRIMARY KEY,
    data TEXT NOT NULL
  );
`;

// Expert 52: Root Level Health Check for Cloud Run / Load Balancers
app.get('/healthz', (req, res) => {
  res.json({ 
    status: 'ok', 
    database: db ? (isMySQL ? 'mysql' : 'sqlite') : 'initializing',
    timestamp: new Date().toISOString() 
  });
});

/**
 * Initialize Database
 * Checks for MySQL environment variables to decide between MySQL and SQLite.
 * Expert 53: Enhanced Resilience with Connection Timeouts
 */
async function initDatabase(retries = 5) {
  if (process.env.DB_HOST && process.env.DB_USER) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      console.log(`[DB] Connecting to MySQL at ${process.env.DB_HOST} (Attempt ${attempt}/${retries})...`);
      try {
        const pool = mysql.createPool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          multipleStatements: true,
          connectTimeout: 30000, // 30 seconds
        });
        
        // Test the connection immediately
        await pool.query('SELECT 1');
        
        db = pool as unknown as DB;
        console.log('[DB] Connected to MySQL. Initializing schema...');
        // Convert SQLite/Generic types to MySQL specific ones where needed
        const mysqlSchema = SCHEMA
          .replace(/TEXT/g, 'LONGTEXT')
          .replace(/DOUBLE/g, 'DOUBLE PRECISION');
        await db.query(mysqlSchema);
        isMySQL = true;
        console.log('[DB] MySQL Schema initialized.');
        return; // Success, exit function
      } catch (error) {
        console.warn(`[DB] MySQL attempt ${attempt} failed:`, error instanceof Error ? error.message : error);
        
        if (attempt < retries) {
          const delay = Math.min(Math.pow(2, attempt) * 1000, 45000); // 45s max delay
        console.log(`[DB] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('[DB] All MySQL connection attempts failed. Falling back to SQLite.');
        isMySQL = false;
        setupSQLite();
      }
    }
  }
} else {
  isMySQL = false;
  setupSQLite();
}
}

function setupSQLite() {
  console.log('[DB] Initializing SQLite (reachhomes.db)...');
  const sqliteDb = new Database('reachhomes.db');
  db = sqliteDb as unknown as DB;
  isMySQL = false;
  if (db.exec) db.exec(SCHEMA);
  console.log('[DB] SQLite Initialized.');
}

/**
 * Middleware Configuration
 */
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Expert 61: API Guardian - Force JSON headers for all /api calls early
app.use('/api', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Expert 62: Apply rate limit AFTER parser but BEFORE router
app.use('/api', limiter);

// Expert 37: Simple Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Expert 16: Validation Schemas
const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  role: z.string(),
  password: z.string().min(3),
  isVerified: z.boolean().optional(),
  parentId: z.string().nullable().optional(),
});

// --- API ROUTES ---
const apiRouter = express.Router();

/**
 * @route GET /api/health
 */
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * @route GET /api/users
 */
apiRouter.get('/users', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database initializing' });
    
    if (isMySQL) {
      const [rows] = await db.query('SELECT id, name, email, role, isVerified, parentId FROM users');
      res.json(rows);
    } else {
      if (!db.prepare) throw new Error('SQLite prepare not available');
      const stmt = db.prepare('SELECT id, name, email, role, isVerified, parentId FROM users');
      const users = stmt.all();
      res.json(users);
    }
  } catch (error) {
    console.error('API Error (GET /users):', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * @route POST /api/users
 */
apiRouter.post('/users', async (req, res) => {
  try {
    const validatedData = UserSchema.parse(req.body);
    const { id, name, email, role, password, isVerified, parentId } = validatedData;
    
    if (!db) return res.status(503).json({ error: 'Database initializing' });

    if (isMySQL) {
      await db.query('INSERT INTO users (id, name, email, role, password, isVerified, parentId) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [id, name, email, role, password, isVerified ? 1 : 0, parentId || null]);
    } else {
      if (!db.prepare) throw new Error('SQLite prepare not available');
      const stmt = db.prepare('INSERT INTO users (id, name, email, role, password, isVerified, parentId) VALUES (?, ?, ?, ?, ?, ?, ?)');
      stmt.run(id, name, email, role, password, isVerified ? 1 : 0, parentId || null);
    }
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    console.error('API Error (POST /users):', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

/**
 * @route GET /api/properties
 */
apiRouter.get('/properties', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database initializing' });
    if (isMySQL) {
      const [rows] = await db.query('SELECT * FROM properties');
      res.json(rows);
    } else {
      const stmt = db.prepare('SELECT * FROM properties');
      const properties = stmt.all();
      res.json(properties);
    }
  } catch (error) {
    console.error('API Error (GET /properties):', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

/**
 * @route GET /api/reservations
 */
apiRouter.get('/reservations', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database initializing' });
    if (isMySQL) {
      const [rows] = await db.query('SELECT * FROM reservations');
      res.json(rows);
    } else {
      const stmt = db.prepare('SELECT * FROM reservations');
      const reservations = stmt.all();
      res.json(reservations);
    }
  } catch (error) {
    console.error('API Error (GET /reservations):', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

/**
 * @route GET /api/state
 */
apiRouter.get('/state', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database initializing' });
    }
    if (isMySQL) {
      const [rows] = await db.query('SELECT data FROM state WHERE id = 1');
      const row = rows[0];
      if (row) {
        try {
          res.json(JSON.parse(row.data));
        } catch (e) {
          console.error('Failed to parse state data from MySQL:', e);
          res.status(500).json({ error: 'Corrupted state data' });
        }
      } else {
        res.json(null);
      }
    } else {
      const stmt = db.prepare('SELECT data FROM state WHERE id = 1');
      const row = stmt.get() as { data: string } | undefined;
      if (row) {
        try {
          res.json(JSON.parse(row.data));
        } catch (e) {
          console.error('Failed to parse state data from SQLite:', e);
          res.status(500).json({ error: 'Corrupted state data' });
        }
      } else {
        res.json(null);
      }
    }
  } catch (error) {
    console.error('API Error (GET /state):', error);
    res.status(500).json({ error: 'Failed to fetch state' });
  }
});

/**
 * @route POST /api/state
 */
apiRouter.post('/state', async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'Invalid state data provided' });
    }

    const requiredEntities = [
      'users', 'properties', 'tasks', 'reservations', 
      'notifications', 'profiles', 'reviews', 
      'serviceRequests', 'audits', 'templates'
    ];
    const missingEntities = requiredEntities.filter(entity => !Array.isArray(data[entity]));
    
    if (missingEntities.length > 0) {
      return res.status(400).json({ 
        error: 'State data is missing required entities or they are not arrays',
        missing: missingEntities 
      });
    }

    if (!db) return res.status(503).json({ error: 'Database initializing' });

    if (isMySQL) {
      await db.query('INSERT INTO state (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)', [JSON.stringify(data)]);
    } else {
      if (!db.prepare) throw new Error('SQLite prepare not available');
      const stmt = db.prepare('INSERT OR REPLACE INTO state (id, data) VALUES (1, ?)');
      stmt.run(JSON.stringify(data));
    }
    res.json({ message: 'State updated successfully' });
  } catch (error) {
    console.error('API Error (POST /state):', error);
    res.status(500).json({ error: 'Failed to update state' });
  }
});

// Expert 44: API 404 Handler - Prevents falling through to SPA fallback for API calls
apiRouter.use((req, res) => {
  console.warn(`[API] 404 - Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'API route not found', 
    method: req.method, 
    path: req.originalUrl 
  });
});

// Mount the API Router
app.use('/api', apiRouter);

// --- ERROR HANDLING ---

/**
 * Generic Error Handler (Placeholder - moved to startServer)
 */

// --- VITE MIDDLEWARE ---

/**
 * @function startServer
 * @description Starts the Express server and configures Vite middleware for development.
 * In production, it serves the static files from the 'dist' directory.
 */
async function startServer() {
  // Expert 54: Start listening IMMEDIATELY to satisfy health checks during cold starts
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.info(`[Server] Listening on http://0.0.0.0:${PORT} (NODE_ENV: ${process.env.NODE_ENV || 'development'})`);
    
    // Initialize database asynchronously
    initDatabase().catch(err => {
      console.error('[Server] Critical database initialization failure:', err);
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log('[Server] Initializing Vite middleware for development...');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use('/api', (req, res, next) => {
      // Ensure JSON type and call next. If apiRouter didn't handle it, 
      // we'll hit the API 404 handler inside apiRouter.
      res.setHeader('Content-Type', 'application/json');
      next();
    });
    app.use(vite.middlewares);
    console.log('[Server] Vite middleware initialized.');
  } else {
    // Production mode: Serve static files built by Vite
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    
    // Expert 55: Explicitly deny access to source files in production
    app.use((req, res, next) => {
      if (req.url.endsWith('.tsx') || req.url.endsWith('.ts')) {
        return res.status(403).json({ error: 'Access to source files is forbidden' });
      }
      next();
    });

    // Expert 54: SPA fallback for production (excluding /api)
    app.get('*', (req, res, next) => {
      const isApi = req.url.startsWith('/api') || req.path.startsWith('/api');
      if (isApi) {
        console.warn(`[Server] SPA fallback intercepted API request: ${req.method} ${req.url}`);
        return res.status(404).json({ 
          error: 'API endpoint not found',
          details: 'This request reached the SPA fallback handler.'
        });
      }

      if (req.accepts('html')) {
        res.sendFile(path.join(distPath, 'index.html'));
      } else {
        next();
      }
    });
  }

  // Expert 39: Graceful Shutdown
  const shutdown = async (signal: string) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      console.log('HTTP server closed.');
      if (db) {
        if (isMySQL && db.end) {
          await db.end();
          console.log('MySQL connection pool closed.');
        } else if (!isMySQL && db.close) {
          db.close();
          console.log('SQLite database closed.');
        }
      }
      process.exit(0);
    });

    // Force close after 10s
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Expert 43: Final Error Handler (moved inside startServer to ensure it's last)
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
  });
}

// Execute the server startup function
startServer();
