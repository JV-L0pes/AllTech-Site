import { Pool, PoolClient } from 'pg';

// Singleton para conexão com banco
class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20, // Máximo de conexões
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Eventos para monitoramento
    this.pool.on('connect', (client: PoolClient) => {
      console.log('Nova conexão estabelecida com o banco');
    });

    this.pool.on('error', (err: Error) => {
      console.error('Erro inesperado no cliente do banco:', err);
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }

  public async query(text: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  public async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }

  // Método para testar conexão
  public async testConnection(): Promise<boolean> {
    try {
      const result = await this.query('SELECT NOW()');
      console.log('Conexão com banco testada:', result.rows[0]);
      return true;
    } catch (error) {
      console.error('Erro ao conectar com banco:', error);
      return false;
    }
  }
}

export default Database;