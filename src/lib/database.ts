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

  // Método para verificar se as tabelas necessárias existem
  public async verifyTables(): Promise<boolean> {
    try {
      console.log('🔍 Verificando tabelas necessárias...');
      const requiredTables = ['sales_representatives', 'companies', 'contacts', 'leads', 'interactions'];
      const result = await this.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = ANY($1)
      `, [requiredTables]);
      const existingTables = result.rows.map((row: any) => row.table_name);
      console.log(`📋 Tabelas encontradas: ${existingTables.length}/${requiredTables.length}`);
      requiredTables.forEach(table => {
        if (existingTables.includes(table)) {
          console.log(`   ✅ ${table}`);
        } else {
          console.log(`   ❌ ${table} - FALTANDO`);
        }
      });
      if (existingTables.length !== requiredTables.length) {
        console.log('⚠️ Nem todas as tabelas necessárias foram encontradas');
        return false;
      }
      return true;
    } catch (error) {
      console.error('❌ Erro ao verificar tabelas:', error);
      return false;
    }
  }

  // Método para verificar vendedores
  public async verifySalesReps(): Promise<boolean> {
    try {
      console.log('👔 Verificando vendedores...');
      const result = await this.query('SELECT COUNT(*) as count FROM sales_representatives WHERE is_active = TRUE');
      const count = parseInt(result.rows[0].count);
      console.log(`👤 Vendedores ativos encontrados: ${count}`);
      if (count === 0) {
        console.log('⚠️ Nenhum vendedor ativo encontrado');
        return false;
      }
      return true;
    } catch (error) {
      console.error('❌ Erro ao verificar vendedores:', error);
      return false;
    }
  }

  // Método de diagnóstico completo
  public async runDiagnostic(): Promise<{
    connection: boolean;
    tables: boolean;
    salesReps: boolean;
    permissions: boolean;
  }> {
    console.log('🏥 Executando diagnóstico completo do banco...');
    
    const diagnostic = {
      connection: false,
      tables: false,
      salesReps: false,
      permissions: false
    };

    // Teste 1: Conexão
    diagnostic.connection = await this.testConnection();
    if (!diagnostic.connection) return diagnostic;

    // Teste 2: Tabelas
    diagnostic.tables = await this.verifyTables();

    // Teste 3: Vendedores
    diagnostic.salesReps = await this.verifySalesReps();

    // Teste 4: Permissões básicas
    try {
      console.log('🔐 Testando permissões...');
      await this.query('SELECT 1 FROM sales_representatives LIMIT 1');
      await this.query('SELECT 1 FROM companies LIMIT 1');
      await this.query('SELECT 1 FROM contacts LIMIT 1');
      await this.query('SELECT 1 FROM leads LIMIT 1');
      console.log('✅ Permissões básicas OK');
      diagnostic.permissions = true;
    } catch (error) {
      console.error('❌ Problemas de permissão:', error);
      diagnostic.permissions = false;
    }

    console.log('📊 Resultado do diagnóstico:');
    console.log(`   🔌 Conexão: ${diagnostic.connection ? '✅' : '❌'}`);
    console.log(`   📋 Tabelas: ${diagnostic.tables ? '✅' : '❌'}`);
    console.log(`   👔 Vendedores: ${diagnostic.salesReps ? '✅' : '❌'}`);
    console.log(`   🔐 Permissões: ${diagnostic.permissions ? '✅' : '❌'}`);

    return diagnostic;
  }
}

export default Database;