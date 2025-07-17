'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const services = [
    'Implementação de Software',
    'Treinamentos Microsoft', 
    'Cloud Service',
    'Inteligência Artificial',
    'Diagnóstico Gratuito'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simular envio do formulário
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Dados do formulário:', formData)
    alert('Formulário enviado com sucesso! Entraremos em contato em breve.')
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      service: '',
      message: ''
    })
    
    setIsSubmitting(false)
  }

  return (
    <section id="contato" className="section-padding bg-gray-100">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Informações de contato */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Vamos <span className="text-gradient">conversar</span>?
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Pronto para transformar sua empresa com tecnologia? 
              Entre em contato conosco e descubra como podemos ajudar 
              seu negócio a alcançar o próximo nível.
            </p>

            {/* Informações de contato */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-tech-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">📧</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <p className="text-gray-600">contato@alltechdigital.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-tech-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">📱</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Telefone</h4>
                  <p className="text-gray-600">(11) 9 9999-9999</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-tech-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">📍</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Localização</h4>
                  <p className="text-gray-600">São Paulo, SP - Brasil</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-tech-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">⏰</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Horário</h4>
                  <p className="text-gray-600">Segunda à Sexta: 9h às 18h</p>
                </div>
              </div>
            </div>

            {/* Benefícios */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-300">
              <h4 className="font-bold text-gray-900 mb-4">
                🎯 Por que nos escolher?
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-tech-gradient rounded-full mr-3"></span>
                  Resposta em até 24 horas
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-tech-gradient rounded-full mr-3"></span>
                  Diagnóstico gratuito sem compromisso
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-tech-gradient rounded-full mr-3"></span>
                  Parceria Microsoft Gold
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-tech-gradient rounded-full mr-3"></span>
                  +150 projetos entregues com sucesso
                </li>
              </ul>
            </div>
          </div>

          {/* Formulário */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-300 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    placeholder="Nome da sua empresa"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    placeholder="(11) 9 9999-9999"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-semibold text-gray-700 mb-2">
                  Serviço de Interesse
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">Selecione um serviço</option>
                  {services.map((service, index) => (
                    <option key={index} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mensagem *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white resize-vertical"
                  placeholder="Conte-nos sobre seu projeto ou necessidade..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full btn-primary text-lg py-4 ${
                  isSubmitting 
                    ? 'opacity-70 cursor-not-allowed' 
                    : 'animate-gradient hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </span>
                ) : (
                  'Solicitar Contato'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Ao enviar este formulário, você concorda com nossa política de privacidade. 
                Seus dados serão utilizados apenas para entrarmos em contato.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}