// scripts/security-dependency-check.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const semver = require('semver');

// Lista de dependências conhecidas com vulnerabilidades
const KNOWN_VULNERABILITIES = {
  'lodash': {
    minVersion: '4.17.21',
    reason: 'Prototype pollution vulnerabilities em versões anteriores',
    severity: 'HIGH'
  },
  'axios': {
    minVersion: '1.6.0', 
    reason: 'SSRF vulnerabilities em versões anteriores',
    severity: 'HIGH'
  },
  'jsonwebtoken': {
    minVersion: '9.0.0',
    reason: 'Algorithm confusion vulnerabilities',
    severity: 'MEDIUM'
  },
  'bcrypt': {
    minVersion: '5.1.0',
    reason: 'Timing attack vulnerabilities',
    severity: 'MEDIUM'
  }
};

// Dependências que devem ser evitadas completamente
const BANNED_PACKAGES = [
  'request', // Deprecated
  'node-uuid', // Deprecated 
  'constantinople', // Security issues
  'handlebars', // XSS vulnerabilities if not updated
  'tar', // Directory traversal if old
  'fstream', // Path traversal vulnerabilities
];

// Licenças permitidas (whitelist)
const ALLOWED_LICENSES = [
  'MIT',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'ISC',
  'CC0-1.0',
  'Unlicense',
  '0BSD'
];

class SecurityDependencyChecker {
  constructor() {
    this.packageJsonPath = path.join(process.cwd(), 'package.json');
    this.packageLockPath = path.join(process.cwd(), 'package-lock.json');
    this.errors = [];
    this.warnings = [];
  }

  async runAllChecks() {
    console.log('🔒 Iniciando auditoria de segurança de dependências...\n');

    try {
      await this.checkPackageJson();
      await this.checkNodeSecurityAdvisory();
      await this.checkRetire();
      await this.checkOutdatedPackages();
      await this.checkLicenses();
      await this.generateReport();
    } catch (error) {
      console.error('❌ Erro durante auditoria:', error.message);
      process.exit(1);
    }
  }

  async checkPackageJson() {
    console.log('📋 Verificando package.json...');

    if (!fs.existsSync(this.packageJsonPath)) {
      this.errors.push('package.json não encontrado');
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
    const allDeps = {
      ...packageJson.dependencies || {},
      ...packageJson.devDependencies || {}
    };

    // Verificar dependências banidas
    for (const [pkg, version] of Object.entries(allDeps)) {
      if (BANNED_PACKAGES.includes(pkg)) {
        this.errors.push(`Dependência BANIDA detectada: ${pkg}@${version}`);
      }

      // Verificar vulnerabilidades conhecidas
      if (KNOWN_VULNERABILITIES[pkg]) {
        const vulnInfo = KNOWN_VULNERABILITIES[pkg];
        const installedVersion = version.replace(/[^0-9.]/g, ''); // Remove ^ ~ etc
        
        if (!semver.gte(installedVersion, vulnInfo.minVersion)) {
          const message = `${pkg}@${version} tem vulnerabilidade conhecida: ${vulnInfo.reason}`;
          
          if (vulnInfo.severity === 'HIGH') {
            this.errors.push(`[HIGH] ${message}`);
          } else {
            this.warnings.push(`[${vulnInfo.severity}] ${message}`);
          }
        }
      }

      // Verificar versões muito desatualizadas (mais de 2 anos)
      try {
        const pkgInfo = execSync(`npm view ${pkg} time --json`, { encoding: 'utf8' });
        const timeData = JSON.parse(pkgInfo);
        const installedVersionTime = timeData[installedVersion];
        
        if (installedVersionTime) {
          const versionDate = new Date(installedVersionTime);
          const twoYearsAgo = new Date();
          twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
          
          if (versionDate < twoYearsAgo) {
            this.warnings.push(`${pkg}@${version} é muito antiga (${versionDate.getFullYear()})`);
          }
        }
      } catch (error) {
        // Ignorar erros de lookup individual
      }
    }

    console.log('✅ Verificação do package.json concluída');
  }

  async checkNodeSecurityAdvisory() {
    console.log('🔍 Executando npm audit...');

    try {
      const auditResult = execSync('npm audit --json', { 
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      const audit = JSON.parse(auditResult);
      
      if (audit.vulnerabilities) {
        Object.entries(audit.vulnerabilities).forEach(([pkg, vuln]) => {
          const severity = vuln.severity?.toUpperCase() || 'UNKNOWN';
          const message = `${pkg}: ${vuln.title || 'Vulnerabilidade detectada'}`;
          
          if (['HIGH', 'CRITICAL'].includes(severity)) {
            this.errors.push(`[${severity}] ${message}`);
          } else {
            this.warnings.push(`[${severity}] ${message}`);
          }
        });
      }
    } catch (error) {
      // npm audit retorna exit code 1 se há vulnerabilidades
      try {
        const auditOutput = error.stdout || error.message;
        if (auditOutput.includes('vulnerabilities found')) {
          this.warnings.push('Vulnerabilidades encontradas via npm audit (verifique npm audit para detalhes)');
        }
      } catch (parseError) {
        this.warnings.push('Não foi possível executar npm audit completamente');
      }
    }

    console.log('✅ npm audit concluído');
  }

  async checkRetire() {
    console.log('🔍 Verificando dependências com retire.js...');

    try {
      const retireResult = execSync('npx retire --js --outputformat json', { 
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      const retireData = JSON.parse(retireResult);
      
      if (retireData && retireData.length > 0) {
        retireData.forEach(item => {
          if (item.results) {
            item.results.forEach(result => {
              const severity = result.severity || 'MEDIUM';
              this.warnings.push(`[RETIRE.JS] ${result.component}: ${result.summary}`);
            });
          }
        });
      }
    } catch (error) {
      // retire.js pode não estar disponível
      this.warnings.push('retire.js não disponível - considere instalar para verificações adicionais');
    }

    console.log('✅ Verificação retire.js concluída');
  }

  async checkOutdatedPackages() {
    console.log('📦 Verificando pacotes desatualizados...');

    try {
      const outdatedResult = execSync('npm outdated --json', { 
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      if (outdatedResult.trim()) {
        const outdated = JSON.parse(outdatedResult);
        
        Object.entries(outdated).forEach(([pkg, info]) => {
          const currentMajor = semver.major(info.current);
          const wantedMajor = semver.major(info.wanted);
          const latestMajor = semver.major(info.latest);
          
          if (latestMajor > currentMajor) {
            this.warnings.push(`${pkg}: versão major desatualizada (${info.current} -> ${info.latest})`);
          } else if (wantedMajor > currentMajor) {
            this.warnings.push(`${pkg}: atualização disponível (${info.current} -> ${info.wanted})`);
          }
        });
      }
    } catch (error) {
      // npm outdated retorna exit code 1 se há atualizações
      // Isso é normal, então não tratamos como erro
    }

    console.log('✅ Verificação de pacotes desatualizados concluída');
  }

  async checkLicenses() {
    console.log('📄 Verificando licenças...');

    try {
      const licenseResult = execSync('npx license-checker --json', { 
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      const licenses = JSON.parse(licenseResult);
      
      Object.entries(licenses).forEach(([pkg, info]) => {
        const license = info.licenses;
        
        if (license && !ALLOWED_LICENSES.includes(license)) {
          if (license.includes('GPL')) {
            this.errors.push(`LICENÇA RESTRITIVA: ${pkg} usa ${license} (pode afetar distribuição comercial)`);
          } else if (license === 'UNKNOWN' || license === 'UNLICENSED') {
            this.warnings.push(`Licença desconhecida: ${pkg}`);
          } else {
            this.warnings.push(`Licença não-padrão: ${pkg} usa ${license}`);
          }
        }
      });
    } catch (error) {
      this.warnings.push('Não foi possível verificar licenças - instale license-checker');
    }

    console.log('✅ Verificação de licenças concluída');
  }

  async generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🔒 RELATÓRIO DE SEGURANÇA DE DEPENDÊNCIAS');
    console.log('='.repeat(60));

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ Nenhum problema de segurança detectado!');
      console.log('\n🎉 Todas as dependências passaram na auditoria de segurança.');
      return;
    }

    if (this.errors.length > 0) {
      console.log('\n❌ PROBLEMAS CRÍTICOS:');
      console.log('-'.repeat(40));
      this.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  AVISOS:');
      console.log('-'.repeat(40));
      this.warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
    }

    // Recomendações
    console.log('\n💡 RECOMENDAÇÕES:');
    console.log('-'.repeat(40));
    
    if (this.errors.length > 0) {
      console.log('• Execute: npm audit fix --force');
      console.log('• Atualize dependências críticas manualmente');
      console.log('• Considere substituir dependências banidas');
    }
    
    if (this.warnings.length > 0) {
      console.log('• Execute: npm update para atualizações menores');
      console.log('• Revise licenças não-padrão com jurídico');
      console.log('• Monitore CVE databases para suas dependências');
    }

    console.log('• Configure automated security updates no GitHub/GitLab');
    console.log('• Execute esta auditoria regularmente (recomendado: semanalmente)');
    console.log('• Considere usar ferramentas como Snyk ou WhiteSource');

    // Gerar arquivo de relatório
    const reportPath = path.join(process.cwd(), 'security-dependency-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        errors: this.errors.length,
        warnings: this.warnings.length,
        status: this.errors.length > 0 ? 'FAILED' : 'PASSED'
      },
      errors: this.errors,
      warnings: this.warnings,
      recommendations: [
        'Execute npm audit fix regularmente',
        'Mantenha dependências atualizadas',
        'Monitore CVE databases',
        'Configure automated security scanning',
        'Revise licenças de dependências'
      ]
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Relatório detalhado salvo em: ${reportPath}`);

    // Exit code baseado em problemas críticos
    if (this.errors.length > 0) {
      console.log('\n💥 AUDITORIA FALHOU - Corrija problemas críticos antes de prosseguir');
      process.exit(1);
    } else {
      console.log('\n✅ AUDITORIA PASSOU - Apenas avisos encontrados');
      process.exit(0);
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const checker = new SecurityDependencyChecker();
  checker.runAllChecks().catch(error => {
    console.error('❌ Falha na auditoria:', error);
    process.exit(1);
  });
}

module.exports = SecurityDependencyChecker;