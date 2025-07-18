// src/lib/database.ts
import { Pool, PoolClient } from 'pg';

// Singleton para conexão com banco
class Database {
  private static instance: Database;
  private pool: Pool;
  private isInitialized: boolean = false;

  private constructor() {
    console.log('🔧 Inicializando conexão com banco...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL não configurada no arquivo .env.local');
    }

    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20, // Máximo de conexões
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000, // Aumentei o timeout
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    });

    // Eventos para monitoramento
    this.pool.on('connect', (client: PoolClient) => {
      console.log('✅ Nova conexão estabelecida com o banco');
      this.isInitialized = true;
    });

    this.pool.on('error', (err: Error) => {
      console.error('❌ Erro inesperado no cliente do banco:', err);
      this.isInitialized = false;
    });

    this.pool.on('acquire', () => {
      console.log('🔒 Conexão adquirida do pool');
    });

    this.pool.on('release', () => {
      console.log('🔓 Conexão liberada para o pool');
    });

    // Inicializar conexão imediatamente
    this.initializeConnection();
  }

  private async initializeConnection(): Promise<void> {
    try {
      console.log('🔄 Testando conexão inicial...');
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      console.log('✅ Conexão inicial bem-sucedida');
      client.release();
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Falha na conexão inicial:', error);
      this.isInitialized = false;
      throw error;
    }
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
    if (!this.isInitialized) {
      console.log('⚠️ Banco não inicializado, tentando reconectar...');
      await this.initializeConnection();
    }

    const client = await this.pool.connect();
    try {
      console.log(`📝 Executando query: ${text.substring(0, 50)}...`);
      const result = await client.query(text, params);
      console.log(`✅ Query executada com sucesso, ${result.rows.length} linha(s) retornada(s)`);
      return result;
    } catch (error) {
      console.error(`❌ Erro na query: ${text.substring(0, 50)}...`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async getClient(): Promise<PoolClient> {
    if (!this.isInitialized) {
      console.log('⚠️ Banco não inicializado, tentando reconectar...');
      await this.initializeConnection();
    }

    console.log('🔒 Adquirindo cliente do pool...');
    const client = await this.pool.connect();
    
    // Adicionar método de release customizado para logging
    const originalRelease = client.release.bind(client);
    client.release = (err?: Error) => {
      console.log('🔓 Liberando cliente do pool...');
      return originalRelease(err);
    };

    return client;
  }

  public async close(): Promise<void> {
    console.log('🔚 Fechando pool de conexões...');
    await this.pool.end();
    this.isInitialized = false;
  }

  // Método para testar conexão com retry
  public async testConnection(): Promise<boolean> {
    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        console.log(`🔍 Teste de conexão (tentativa ${retries + 1}/${maxRetries})...`);
        const result = await this.query('SELECT NOW() as current_time, version() as db_version');
        console.log('✅ Conexão testada com sucesso:');
        console.log(`   ⏰ Hora do banco: ${result.rows[0].current_time}`);
        console.log(`   📋 Versão: ${result.rows[0].db_version.substring(0, 50)}...`);
        return true;
      } catch (error) {
        retries++;
        console.error(`❌ Teste de conexão falhou (tentativa ${retries}):`, error instanceof Error ? error.message : error);
        
        if (retries < maxRetries) {
          console.log(`⏳ Aguardando 2 segundos antes da próxima tentativa...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    console.error(`💥 Falha após ${maxRetries} tentativas`);
    return false;
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