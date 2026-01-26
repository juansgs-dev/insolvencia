"use client";

import { motion } from "framer-motion";
import {
  FaFileContract,
  FaBalanceScale,
  FaHome,
  FaHandshake,
  FaShieldAlt,
  FaPiggyBank,
  FaUsers,
  FaHeart,
  FaChild,
  FaDollarSign,
  FaFileSignature,
  FaMapMarkerAlt,
  FaFileAlt,
  FaCalendarAlt,
  FaEnvelope,
  FaUser,
  FaPhoneAlt,
  FaPaperPlane
} from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import Image from 'next/image';
import { useAuth } from "@/lib/context/AuthContext"
import UserDropdown from "@/components/UserDropdown";
import UserDropdownMobile from "@/components/UserDropdownMobile";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter()

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, loading, isAuthenticated, logout } = useAuth();

  const isAdmin = user?.role === "admin"

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const floatingAnimation = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const handleAdvisoryClick = () => {
    if (!isAuthenticated) {
      router.push("/login")
    } else {
      router.push("/request-advisory")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 font-poppins">

      <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        `}</style>

      <nav className="fixed w-full bg-white/95 backdrop-blur-md z-50 shadow-sm font-poppins">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-[#1e3a8a]"
            >
              J.A. Servicios Jurídicos
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              {["Inicio", "Quiénes Somos", "Servicios", "Contacto"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '')}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, color: "#1e3a8a" }}
                  className="text-gray-700 hover:text-[#1e3a8a] font-medium transition-colors"
                >
                  {item}
                </motion.a>
              ))}

              {!loading && isAuthenticated && isAdmin && (
                <Link href="/admin/documents">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-xl border border-[#1e3a8a] text-[#1e3a8a] font-semibold hover:bg-blue-50 transition-all"
                  >
                    Administrador
                  </motion.button>
                </Link>
              )}

              {!loading && !isAuthenticated && (
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1e3a8a] text-white font-semibold shadow-md hover:bg-[#1e40af] transition-all"
                  >
                    <FaUser className="text-sm" />
                    Iniciar sesión
                  </motion.button>
                </Link>
              )}

              {!loading && isAuthenticated && user && (
                <UserDropdown
                  fullName={user.fullName}
                  role={user.role}
                  onLogout={logout}
                />
              )}

            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-0.5 bg-gray-700 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-gray-700 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-gray-700"></div>
            </motion.button>
          </div>

          <motion.div
            initial={false}
            animate={isMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="py-6 space-y-4">
              {["Inicio", "Quiénes Somos", "Servicios", "Contacto"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '')}`}
                  className="block text-gray-700 hover:text-[#1e3a8a] font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}

              {!loading && isAuthenticated && isAdmin && (
                <Link
                  href="/admin/documents"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center py-3 rounded-xl border border-[#1e3a8a] text-[#1e3a8a] font-semibold"
                >
                  Administrador
                </Link>
              )}

              <div className="pt-4 border-t border-gray-200">
                {!loading && !isAuthenticated && (
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1e3a8a] text-white font-semibold shadow-md hover:bg-[#1e40af] transition-all"
                    >
                      <FaUser className="text-sm" />
                      Iniciar sesión
                    </motion.button>
                  </Link>
                )}

                {!loading && isAuthenticated && user && (
                  <UserDropdownMobile
                    fullName={user.fullName}
                    role={user.role}
                    onLogout={logout}
                    onClose={() => setIsMenuOpen(false)}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </nav>

      <section id="inicio" className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-gray-900 font-poppins"
            >
              Soluciones reales para situaciones{" "}
              <motion.span
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"],
                  backgroundSize: ["200%", "200%", "200%"]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity
                }}
                className="bg-gradient-to-r from-[#1e3a8a] to-[#3730a3] bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(90deg, #1e3a8a, #3730a3, #1e3a8a)",
                  backgroundSize: "200% auto"
                }}
              >
                difíciles
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 mb-8 leading-relaxed font-light"
            >
              Acompañamos personas y pequeños comercios en procesos de insolvencia,
              brindando claridad, estrategia y apoyo jurídico profesional.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 30px -10px rgba(30, 58, 138, 0.5)"
                }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-[#1e3a8a] text-white rounded-xl font-semibold shadow-lg hover:bg-[#1e40af] transition-all"
                onClick={handleAdvisoryClick}
              >
                Solicitar asesoría
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <div className="relative">
              <motion.div
                animate={floatingAnimation}
                className="w-80 h-80 rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100"
              >
                <Image
                  src="/logo_icono.png"
                  alt="JIA Servicios Jurídicos e Inmobiliarios"
                  width={320}
                  height={320}
                  className="w-full h-full object-contain p-6"
                />
              </motion.div>
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity
                }}
                className="absolute inset-0 border-2 border-blue-200 rounded-3xl"
              />
              <motion.div
                animate={{
                  rotate: [0, -3, 3, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: 1
                }}
                className="absolute -inset-4 border border-blue-100 rounded-3xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section id="quiénessomos" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-poppins"
            >
              Quiénes Somos
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="w-24 h-1 bg-[#1e3a8a] mx-auto rounded-full"
            />
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-900 leading-relaxed mb-8 text-center font-light"
            >
              En <span className="font-semibold text-[#1e3a8a]">"J.A. Servicios Jurídicos"</span> somos un equipo de abogados con amplia experiencia en litigio, asesoría y representación legal en las principales ramas del Derecho.
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-900 leading-relaxed mb-8 text-center font-light"
            >
              Nuestra misión es ofrecer soluciones jurídicas efectivas, confiables y personalizadas, acompañando a nuestros clientes en cada etapa de su proceso, con ética, compromiso y resultados reales.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="bg-blue-50 rounded-2xl p-8 border-l-4 border-[#1e3a8a]"
            >
              <p className="text-lg text-gray-700 font-medium">
                Nos destacamos por nuestra atención humana, nuestro conocimiento actualizado de la ley y nuestra capacidad para enfrentar con éxito procesos complejos, especialmente en materia de insolvencia para persona natural no comerciante.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="servicios" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-poppins"
            >
              Nuestros Servicios Jurídicos
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="w-24 h-1 bg-[#1e3a8a] mx-auto rounded-full"
            />
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8"
          >

            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <FaFileContract className="text-2xl text-[#1e3a8a]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-poppins">Proceso de Insolvencia</h3>
              </div>
              <p className="text-gray-600 mb-4 font-light">Ley 2445 del 2025 - Persona natural y/o pequeño comerciante</p>
              <ul className="space-y-3">
                {[
                  { text: "Negociación de deudas con entidades financieras y particulares", icon: FaHandshake },
                  { text: "Levantamiento de embargos y desbloqueo de cuentas", icon: FaShieldAlt },
                  { text: "Protección del salario, patrimonio y vivienda", icon: FaHome },
                  { text: "Suspensión de descuentos de libranzas en nómina", icon: FaPiggyBank },
                  { text: "Representación ante centros de conciliación y juzgados civiles", icon: FaUsers },
                  { text: "Fase de liquidación patrimonial - descargue de las deudas", icon: FaDollarSign }
                ].map((service, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center text-gray-700 font-light"
                  >
                    <service.icon className="w-4 h-4 text-[#1e3a8a] mr-3 flex-shrink-0" />
                    {service.text}
                  </motion.li>
                ))}
              </ul>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
              >
                <p className="text-sm text-blue-800 font-medium flex items-center">
                  <FaFileContract className="mr-2" />
                  Tenemos beneficios especiales para docentes, activos y pensionados de la Fuerza Pública.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <FaBalanceScale className="text-2xl text-[#1e3a8a]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-poppins">Derecho Civil y de Familia</h3>
              </div>
              <ul className="space-y-3">
                {[
                  { text: "Sucesiones y partición de herencias", icon: FaUsers },
                  { text: "Divorcios y liquidación de sociedad conyugal", icon: FaHeart },
                  { text: "Cuotas alimentarias, custodia y visitas", icon: FaChild },
                  { text: "Ejecutivos por alimentos a menores", icon: FaChild },
                  { text: "Filiaciones", icon: FaUsers },
                  { text: "Procesos de pertenencia y divisorio de bienes", icon: FaHome },
                  { text: "Deslinde, servidumbres y conflictos de propiedad", icon: FaMapMarkerAlt }
                ].map((service, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center text-gray-700 font-light"
                  >
                    <service.icon className="w-4 h-4 text-[#1e3a8a] mr-3 flex-shrink-0" />
                    {service.text}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all md:col-span-2"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                  <FaHome className="text-2xl text-[#1e3a8a]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-poppins">Derecho Inmobiliario</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 font-poppins flex items-center">
                    <FaFileSignature className="mr-2 text-[#1e3a8a]" />
                    Asesoría Integral
                  </h4>
                  <ul className="space-y-2">
                    {[
                      { text: "Compra, venta y arrendamiento de bienes raíces", icon: FaHandshake },
                      { text: "Elaboración y revisión de contratos inmobiliarios", icon: FaFileAlt },
                      { text: "Subdivisión, desenglobe y saneamiento", icon: FaMapMarkerAlt },
                      { text: "Representación ante notarías y registros", icon: FaMapMarkerAlt }
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center text-gray-600 font-light"
                      >
                        <item.icon className="w-3 h-3 text-[#1e3a8a] mr-3 flex-shrink-0" />
                        {item.text}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 font-poppins flex items-center">
                    <FaFileAlt className="mr-2 text-[#1e3a8a]" />
                    Documentos Especializados
                  </h4>
                  <ul className="space-y-2">
                    {[
                      { text: "Contratos de compraventa", icon: FaFileSignature },
                      { text: "Otros sí y anexos", icon: FaMapMarkerAlt },
                      { text: "Hipotecas y garantías", icon: FaDollarSign },
                      { text: "Documentos de propiedad", icon: FaFileAlt }
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center text-gray-600 font-light"
                      >
                        <item.icon className="w-3 h-3 text-[#1e3a8a] mr-3 flex-shrink-0" />
                        {item.text}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-poppins"
            >
              Por Qué Elegirnos
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="w-24 h-1 bg-[#1e3a8a] mx-auto rounded-full"
            />
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                title: "Atención Directa",
                description: "Por abogados expertos en cada área del derecho"
              },
              {
                title: "Soluciones Reales",
                description: "Estrategias jurídicas efectivas, no promesas vacías"
              },
              {
                title: "Experiencia Comprobada",
                description: "En procesos judiciales y extrajudiciales complejos"
              },
              {
                title: "Acompañamiento",
                description: "Comunicación constante y servicio personalizado"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{
                  scale: 1.05,
                  y: -5
                }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:shadow-lg transition-all"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                  className="w-16 h-16 bg-[#1e3a8a] rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <span className="text-2xl text-white">✓</span>
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-poppins">{item.title}</h3>
                <p className="text-gray-600 font-light">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="contacto" className="py-20 bg-gradient-to-br from-[#1e3a8a] to-[#3730a3]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-white mb-6 font-poppins"
            >
              Contáctanos
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="w-24 h-1 bg-white mx-auto rounded-full"
            />
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-12"
          >

            <motion.div
              variants={fadeInUp}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 font-poppins flex items-center">
                  <FaMapMarkerAlt className="mr-3 text-blue-200" />
                  Dónde Estamos
                </h3>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <p className="text-white text-lg leading-relaxed font-light">
                    Centro Profesional El Crucero, a la altura de La Aguacatala, Medellín.<br />
                    Cra 48 #12 Sur 70 oficina 212 de la T 1. El Poblado
                  </p>
                  <p className="text-white/80 mt-4 font-light flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-blue-200 text-sm" />
                    Atendemos de forma presencial y virtual a nivel nacional
                  </p>
                </motion.div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-6 font-poppins flex items-center">
                  <FaPhoneAlt className="mr-3 text-blue-200" />
                  Medios de Contacto
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: FaPhoneAlt,
                      label: "WhatsApp / Teléfono",
                      value: "3243736171"
                    },
                    {
                      icon: FaEnvelope,
                      label: "Correo electrónico",
                      value: "serviciosjuridicosjaa@gmail.com"
                    }
                  ].map((contact, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                    >
                      <div className="flex items-center">
                        <contact.icon className="text-2xl mr-4 text-blue-200" />
                        <div>
                          <p className="text-white font-semibold">{contact.label}</p>
                          <p className="text-white/90 font-light">{contact.value}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/30"
              >
                <h4 className="text-xl font-bold text-white mb-3 font-poppins flex items-center">
                  <FaCalendarAlt className="mr-3 text-blue-200" />
                  Agenda tu cita
                </h4>
                <p className="text-white/90 mb-4 font-light">
                  Consulta virtual disponible para todo Colombia
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white text-[#1e3a8a] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center"
                >
                  <FaCalendarAlt className="mr-2" />
                  Solicitar cita virtual
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <h3 className="text-2xl font-bold text-white mb-6 font-poppins flex items-center">
                <FaEnvelope className="mr-3 text-blue-200" />
                Envíanos un mensaje
              </h3>
              <form className="space-y-4">
                {[
                  { name: "Nombre", icon: FaUser },
                  { name: "Email", icon: FaEnvelope },
                  { name: "Teléfono", icon: FaPhoneAlt },
                  { name: "Mensaje", icon: FaPaperPlane }
                ].map((field, index) => (
                  <motion.div
                    key={field.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <label className="block text-white mb-2 font-medium flex items-center">
                      <field.icon className="mr-2 text-blue-200 text-sm" />
                      {field.name}
                    </label>
                    {field.name === "Mensaje" ? (
                      <textarea
                        className="w-full rounded-xl p-4 bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 font-light"
                        placeholder={`Escribe tu ${field.name.toLowerCase()}...`}
                      />
                    ) : (
                      <input
                        type="text"
                        className="w-full rounded-xl p-4 bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 font-light"
                        placeholder={`Ingresa tu ${field.name.toLowerCase()}...`}
                      />
                    )}
                  </motion.div>
                ))}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-4 bg-white text-[#1e3a8a] rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                >
                  <FaPaperPlane className="mr-2" />
                  Enviar Mensaje
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-gray-400 font-light"
          >
            © 2024 J.A. Servicios Jurídicos. Todos los derechos reservados.
          </motion.p>
        </div>
      </footer>
    </div>
  );
}