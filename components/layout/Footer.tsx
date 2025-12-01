'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Mail, Phone, Clock, Send, Sparkles } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa6';
import { useState } from 'react';
import SaprixLogo from '@/components/ui/SaprixLogo';

export default function DixorFooter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Newsletter subscription:', email);
    setEmail('');
    setIsSubmitting(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const socialLinks = [
    {
      icon: FaFacebook,
      href: 'https://www.facebook.com/Saprixoficial',
      label: 'Facebook',
      color: 'hover:bg-[#1877F2]'
    },
    {
      icon: FaInstagram,
      href: 'https://www.instagram.com/saprixoficial',
      label: 'Instagram',
      color: 'hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737]'
    },
    {
      icon: FaTiktok,
      href: 'https://www.tiktok.com/@saprixoficial',
      label: 'TikTok',
      color: 'hover:bg-[#000000]'
    },
    {
      icon: FaWhatsapp,
      href: 'https://wa.me/573019086637',
      label: 'WhatsApp',
      color: 'hover:bg-[#25D366]'
    }
  ];

  const footerLinks = [
    {
      title: 'Compra',
      links: [
        { label: 'Nuevos Lanzamientos', href: '/nuevos' },
        { label: 'Categorías', href: '/productos' },
        { label: 'Ofertas', href: '/ofertas' },
        { label: 'Gift Cards', href: '/gift-cards' }
      ]
    },
    {
      title: 'Soporte',
      links: [
        { label: 'Preguntas Frecuentes', href: '/preguntas-frecuentes' },
        { label: 'Envíos', href: '/envios' },
        { label: 'Devoluciones', href: '/devoluciones' },
        { label: 'Contacto', href: '/contacto' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Términos y Condiciones', href: '/terminos-y-condiciones' },
        { label: 'Política de Privacidad', href: '/politica-de-privacidad' },
        { label: 'Cookies', href: '/cookies' }
      ]
    }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-300 overflow-hidden">
      {/* Efectos de fondo decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-saprix-electric-blue/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-lime-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section - Destacado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-12 border-b border-white/5"
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-saprix-electric-blue/10 to-lime-400/10 border border-saprix-electric-blue/20 mb-4">
              <Sparkles className="w-4 h-4 text-saprix-electric-blue" />
              <span className="text-sm font-medium text-white">Únete a nuestra comunidad</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
              Recibe ofertas exclusivas
            </h2>
            <p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto">
              Suscríbete y obtén un <span className="text-lime-400 font-semibold">10% de descuento</span> en tu primera compra
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-saprix-electric-blue to-lime-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
                <div className="relative flex items-center bg-gray-900 rounded-2xl border border-white/10 overflow-hidden">
                  <Mail className="w-5 h-5 text-gray-500 ml-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="flex-1 px-4 py-4 bg-transparent text-white placeholder:text-gray-500 focus:outline-none"
                    required
                    disabled={isSubmitting}
                    suppressHydrationWarning={true}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="m-1 px-6 py-3 bg-gradient-to-r from-saprix-electric-blue to-lime-400 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-saprix-electric-blue/50 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 group"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Suscribirse</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="py-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16"
          >
            {/* Left Section - Brand */}
            <motion.div variants={itemVariants} className="space-y-4">
              <Link href="/" className="inline-block group">
                <SaprixLogo bg="dark" retina width={160} height={40} />
              </Link>

              <p className="text-gray-400 max-w-sm leading-relaxed text-sm">
                Tu destino para moda urbana de calidad. Estilo, comodidad y las últimas tendencias en un solo lugar.
              </p>

              {/* Contact Info */}
              <div className="space-y-2">
                <a
                  href="mailto:info@saprix.com"
                  className="flex items-center gap-3 text-gray-300 hover:text-saprix-electric-blue transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-saprix-electric-blue/10 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-sm">info@saprix.com</span>
                </a>

                <a
                  href="tel:3023932008"
                  className="flex items-center gap-3 text-gray-300 hover:text-lime-400 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-lime-400/10 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold">302 3932008</span>
                </a>
              </div>

              {/* Social Media */}
              <div className="flex gap-3 pt-1">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-11 h-11 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-white/20 hover:scale-110 hover:-translate-y-1 ${social.color} group`}
                    aria-label={social.label}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Right Section - Links + Store Info Below */}
            <div className="space-y-6">
              {/* Links Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {footerLinks.map((section) => (
                  <motion.div key={section.title} variants={itemVariants} className="space-y-3">
                    <h3 className="text-white font-semibold text-base">{section.title}</h3>
                    <ul className="space-y-2">
                      {section.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                          >
                            <span className="w-0 h-px bg-saprix-electric-blue group-hover:w-4 transition-all duration-300" />
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              {/* Store Info - Below Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                {/* Visítanos */}
                <motion.div variants={itemVariants}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-saprix-electric-blue" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-1.5">Visítanos</h4>
                      <p className="text-xs text-gray-400 mb-2">Calle 48b # 78n - 21, Bogotá, Colombia</p>
                      <a
                        href="https://maps.app.goo.gl/katpg74CmKH7oELr7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-saprix-electric-blue hover:text-lime-400 transition-colors font-medium"
                      >
                        <span>Ver en el mapa</span>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* Horarios */}
                <motion.div variants={itemVariants}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-lime-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-2">Horario de atención</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between gap-3">
                          <span className="text-gray-400">Lun - Vie:</span>
                          <span className="text-white">9:00 AM - 5:00 PM</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-gray-400">Sábado:</span>
                          <span className="text-white">9:00 AM - 5:00 PM</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-gray-400">Domingo:</span>
                          <span className="text-red-400">Cerrado</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-500 text-center md:text-left">
              © 2025 Saprix. Todos los derechos reservados.
            </p>
            <p className="text-xs text-gray-500 text-center md:text-right">
              Diseñado y desarrollado por{' '}
              <a
                href="https://iango.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-saprix-electric-blue hover:text-lime-400 transition-colors font-medium"
              >
                iAnGo
              </a>
              {' '}- Soluciones con IA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
