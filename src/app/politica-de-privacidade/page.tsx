import React from "react";

export default function PoliticaDePrivacidade() {
  return (
    <main className="policy-container">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-tech-cyan/20 rounded-full flex items-center justify-center text-2xl">
          <span role="img" aria-label="cadeado">🔒</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-tech-deep mb-1">Política de Privacidade</h1>
          <p className="text-tech-cyan font-medium text-base">Sua privacidade é prioridade. Transparência e segurança no tratamento dos seus dados.</p>
        </div>
      </div>
      <div className="mb-8 text-gray-700 text-lg">
        Esta Política descreve como a <strong>AllTech Digital</strong> coleta, usa e protege suas informações, em conformidade com a LGPD.
      </div>
      <section className="space-y-8">
        <div className="bg-white/60 rounded-xl p-6 border border-tech-cyan/20 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><span className="text-tech-cyan">📥</span> Quais dados coletamos?</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li><strong>Dados fornecidos:</strong> Nome, e-mail, telefone e informações enviadas via formulários.</li>
            <li><strong>Dados de navegação:</strong> Cookies, IP, localização aproximada, tipo de dispositivo, páginas acessadas.</li>
          </ul>
        </div>
        <div className="bg-white/60 rounded-xl p-6 border border-tech-cyan/20 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><span className="text-tech-cyan">⚙️</span> Como utilizamos seus dados?</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Responder solicitações feitas via formulário.</li>
            <li>Enviar informações sobre nossos serviços, se solicitado.</li>
            <li>Melhorar a experiência do usuário e analisar o uso do site.</li>
            <li>Cumprir obrigações legais e regulatórias.</li>
          </ul>
        </div>
        <div className="bg-white/60 rounded-xl p-6 border border-tech-cyan/20 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><span className="text-tech-cyan">🔗</span> Compartilhamento de dados</h2>
          <p className="text-gray-700">Não compartilhamos seus dados pessoais com terceiros, exceto quando necessário para prestação dos serviços, obrigações legais ou mediante consentimento.</p>
        </div>
        <div className="bg-white/60 rounded-xl p-6 border border-tech-cyan/20 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><span className="text-tech-cyan">🍪</span> Cookies e rastreamento</h2>
          <p className="text-gray-700">Utilizamos cookies para melhorar a navegação e, futuramente, para análise (Google Analytics). Você pode gerenciar permissões no navegador.</p>
        </div>
        <div className="bg-white/60 rounded-xl p-6 border border-tech-cyan/20 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><span className="text-tech-cyan">🛡️</span> Seus direitos</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Acessar, corrigir ou atualizar seus dados pessoais.</li>
            <li>Solicitar exclusão dos dados.</li>
            <li>Revogar consentimentos a qualquer momento.</li>
            <li>Solicitar informações sobre o tratamento dos dados.</li>
          </ul>
          <p className="mt-2">Para exercer seus direitos, envie um e-mail para: <a href="mailto:ulysses.lima@alltechbr.solutions" className="text-tech-cyan underline hover:text-tech-deep font-semibold">ulysses.lima@alltechbr.solutions</a></p>
        </div>
        <div className="bg-white/60 rounded-xl p-6 border border-tech-cyan/20 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><span className="text-tech-cyan">🔒</span> Segurança</h2>
          <p className="text-gray-700">Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou divulgação indevida.</p>
        </div>
        <div className="bg-white/60 rounded-xl p-6 border border-tech-cyan/20 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><span className="text-tech-cyan">📝</span> Alterações nesta política</h2>
          <p className="text-gray-700">Esta política pode ser atualizada periodicamente. A versão mais recente estará sempre disponível nesta página.</p>
        </div>
        <div className="bg-white/60 rounded-xl p-6 border border-tech-cyan/20 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><span className="text-tech-cyan">📧</span> Contato</h2>
          <p className="text-gray-700">Dúvidas? Fale com nosso DPO: <a href="mailto:ulysses.lima@alltechbr.solutions" className="text-tech-cyan underline hover:text-tech-deep font-semibold">ulysses.lima@alltechbr.solutions</a></p>
        </div>
      </section>
      <div className="mt-10 flex items-center gap-2 text-xs text-gray-400 justify-end">
        <span className="inline-block bg-tech-cyan/10 text-tech-cyan px-2 py-1 rounded font-semibold">LGPD</span>
        <span>Última atualização: 2025</span>
      </div>
    </main>
  );
} 