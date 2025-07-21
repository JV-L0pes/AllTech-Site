import React from "react";

export default function TermosDeUso() {
  return (
    <main className="terms-container">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-tech-cyan/20 rounded-full flex items-center justify-center text-2xl">
          <span role="img" aria-label="documento">📄</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-tech-deep mb-1">Termos de Uso</h1>
          <p className="text-tech-cyan font-medium text-base">Regras para uso seguro e responsável do site AllTech Digital.</p>
        </div>
      </div>
      <div className="mb-8 text-gray-700 text-lg">
        Estes Termos regulam o acesso e uso do site da <strong>AllTech Digital</strong>. Ao utilizar nosso site, você concorda com as condições abaixo.
      </div>
      <section className="space-y-8">
        <div className="bg-white/60 rounded-xl p-6 border border-tech-cyan/20 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><span className="text-tech-cyan">🌐</span> Uso do site</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Conteúdo destinado à divulgação institucional, serviços e contato comercial.</li>
            <li>Proibido uso para fins ilícitos, difamatórios ou que violem direitos de terceiros.</li>
            <li>Não é permitido tentar acessar áreas restritas, sistemas ou dados de outros usuários.</li>
          </ul>
        </div>
        <div className="bg-white/60 rounded-xl p-6 border border-tech-cyan/20 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><span className="text-tech-cyan">©️</span> Propriedade intelectual</h2>
          <p className="text-gray-700">Todo o conteúdo (textos, imagens, marcas, logotipos, layouts) é de propriedade da AllTech Digital ou de seus parceiros e protegido por direitos autorais. É proibida a reprodução sem autorização prévia.</p>
        </div>
        <div className="bg-white/60 rounded-xl p-6 border border-tech-cyan/20 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><span className="text-tech-cyan">⚠️</span> Responsabilidades</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Nos esforçamos para manter as informações atualizadas, mas não garantimos isenção de erros ou omissões.</li>
            <li>Não nos responsabilizamos por danos decorrentes do uso indevido ou indisponibilidade temporária.</li>
            <li>Links para terceiros são apenas para conveniência e não implicam endosso.</li>
          </ul>
        </div>
        <div className="bg-white/60 rounded-xl p-6 border border-tech-cyan/20 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><span className="text-tech-cyan">🔒</span> Privacidade</h2>
          <p className="text-gray-700">O uso dos dados pessoais está detalhado em nossa <a href="/politica-de-privacidade" className="text-tech-cyan underline hover:text-tech-deep font-semibold">Política de Privacidade</a>.</p>
        </div>
        <div className="bg-white/60 rounded-xl p-6 border border-tech-cyan/20 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><span className="text-tech-cyan">📝</span> Alterações nos termos</h2>
          <p className="text-gray-700">Estes termos podem ser alterados a qualquer momento, sem aviso prévio. Recomendamos consultar esta página periodicamente.</p>
        </div>
        <div className="bg-white/60 rounded-xl p-6 border border-tech-cyan/20 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><span className="text-tech-cyan">📧</span> Contato</h2>
          <p className="text-gray-700">Dúvidas? Fale com nosso time: <a href="mailto:ulysses.lima@alltechbr.solutions" className="text-tech-cyan underline hover:text-tech-deep font-semibold">ulysses.lima@alltechbr.solutions</a></p>
        </div>
      </section>
      <div className="mt-10 flex items-center gap-2 text-xs text-gray-400 justify-end">
        <span className="inline-block bg-tech-cyan/10 text-tech-cyan px-2 py-1 rounded font-semibold">Institucional</span>
        <span>Última atualização: 2025</span>
      </div>
    </main>
  );
} 