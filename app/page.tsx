"use client"

import { ThemeToggle } from "@/app/components/theme-toggle"
import { Button } from "@/app/components/ui/button"
import { useAuth } from "@clerk/nextjs"

import { motion } from "framer-motion"
import {
  ArrowRight,
  BookOpen,
  Brain,
  BrainCircuit,
  CheckCircle2,
  Clock,
  FrownIcon,
  Globe,
  Headphones,
  ImageIcon,
  Languages,
  MessageSquare,
  Mic,
  Smartphone,
  Sparkles,
  TrendingDown,
  Users,
  XCircle
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "../components/ui/menubar"
import logo from '../public/logo.svg'

// Nome da aplicação: Englishapp
export default function Home() {
  const { userId, isLoaded } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [isAnnual, setIsAnnual] = useState(false) // Toggle para plano anual ou mensal

  useEffect(() => {
    setMounted(true)
  }, [])

  // Se o usuário estiver logado, redirecionar para o dashboard
  if (mounted && isLoaded && userId) {
    redirect("/dashboard")
  }

  const togglePlan = () => {
    setIsAnnual(!isAnnual)
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  const benefits = [
    {
      icon: <Globe className="h-5 w-5" />,
      text: "Prática de conversação em inglês a qualquer momento",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      text: "Reforço de vocabulário e gramática personalizado",
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      text: "Aumento da confiança dos alunos para se comunicar em inglês",
    },
    {
      icon: <CheckCircle2 className="h-5 w-5" />,
      text: "Acompanhamento do progresso e áreas de melhoria",
    },
  ]

  const features = [
    {
      icon: <Clock className="h-10 w-10" />,
      title: "Disponível 24/7",
      description: "Prática de inglês a qualquer hora, todos os dias da semana.",
    },
    {
      icon: <Headphones className="h-10 w-10" />,
      title: "Áudio e Pronúncia",
      description: "Correção de pronúncia e conversação em áudio para prática oral.",
    },
    {
      icon: <Languages className="h-10 w-10" />,
      title: "Adaptação por Nível",
      description: "Conteúdo adaptado ao nível de inglês de cada aluno, do básico ao avançado.",
    },
    {
      icon: <BrainCircuit className="h-10 w-10" />,
      title: "Exercícios Personalizados",
      description: "Atividades e exercícios personalizados para reforçar o aprendizado.",
    },
  ]

  const plans = [
    {
      name: "Básico",
      price: isAnnual ? "R$2880" : "R$300",
      period: isAnnual ? "/ano (20% de desconto)" : "/mês",
      description: "Ideal para escolas pequenas",
      features: ["Até 100 alunos", "Atendimento via WhatsApp", "Suporte básico", "Atualizações incluídas"],
      highlighted: false,
    },
    {
      name: "Intermediário",
      price: isAnnual ? "R$7680" : "R$800",
      period: isAnnual ? "/ano (20% de desconto)" : "/mês",
      description: "Para escolas de médio porte",
      features: [
        "Até 500 alunos",
        "Atendimento via WhatsApp",
        "Suporte prioritário",
        "Atualizações incluídas",
        "Relatórios mensais",
      ],
      highlighted: true,
    },
    {
      name: "Avançado",
      price: "Personalizado",
      period: "",
      description: "Para escolas grandes ou redes",
      features: [
        "Alunos ilimitados",
        "Atendimento via WhatsApp",
        "Suporte VIP",
        "Atualizações prioritárias",
        "Relatórios semanais",
        "Personalização avançada",
      ],
      highlighted: false,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col relative h-full">
      {/* Gradiente animado de fundo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-indigo-50 opacity-80 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 dark:opacity-100" />
        <div className="absolute -top-[40%] -right-[60%] h-[1000px] w-[1000px] rounded-full bg-gradient-to-br from-sky-100/40 to-indigo-200/40 blur-3xl dark:from-sky-900/20 dark:to-indigo-900/20" />
        <div className="absolute -bottom-[40%] -left-[60%] h-[1000px] w-[1000px] rounded-full bg-gradient-to-br from-blue-100/40 to-purple-200/40 blur-3xl dark:from-blue-900/20 dark:to-purple-900/20" />
      </div>

      {/* Navbar */}
      <header className="relative z-10 border-b bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-sky-700 dark:text-sky-400 relative overflow-hidden"
            >
              <Image
              src={logo}
              alt="Logo Englishapp"
              width={150}
              height={50}
              className="relative rounded-full object-contain"
              />
              
            </motion.h1>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <div className="hidden md:flex">
              <ThemeToggle />
              <Link href="/blog">
                <Button variant="ghost" className="gap-2">
                  Blog
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="ghost" className="gap-2">
                  Área do Professor
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

            <div className="block md:hidden">
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>Menu</MenubarTrigger>
                  <MenubarContent>
                    <Link href="/blog" passHref legacyBehavior>
                      <MenubarItem asChild>
                        <button>Blog</button>
                      </MenubarItem>
                    </Link>
                    <Link href="/sign-in" passHref legacyBehavior>
                      <MenubarItem asChild>
                        <button className="flex items-center gap-2">
                          Área do Professor
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </MenubarItem>
                    </Link>
                    <MenubarSeparator />
                    <MenubarItem >
                      Tema
                      <MenubarShortcut><ThemeToggle /></MenubarShortcut>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
          </div>
        </div>
      </header >

      {/* Menubar para Mobile */}


      {/* Hero Section - IA Educacional */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center justify-center gap-3 rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-800 dark:bg-sky-900/30 dark:text-sky-300"
        >
          <Smartphone className="h-4 w-4" />
          Assistente de IA para Ensino de Inglês via WhatsApp
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-4 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
        >
          Um Professor de Inglês com Inteligência Artificial, disponível 24h no WhatsApp dos seus alunos.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300 sm:text-xl"
        >
          Transforme o ensino de inglês da sua escola com uma solução moderna, interativa e acessível — com correção de
          pronúncia, vocabulário em imagens e explicações gramaticais instantâneas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            className="gap-2 bg-sky-600 hover:bg-sky-700 dark:bg-sky-700 dark:hover:bg-sky-600"
            onClick={() => (window.location.href = "https://wa.me/557531997183")}
          >
            🔵 Solicitar Demonstração
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Ilustração WhatsApp */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <div className="relative h-[400px] w-full max-w-md overflow-hidden rounded-3xl border bg-white/90 shadow-lg dark:border-gray-700 dark:bg-gray-800/90">
            {/* Header do WhatsApp */}
            <div className="flex h-16 items-center gap-3 bg-green-500 px-4 text-white">
              <div className="h-10 w-10 rounded-full bg-white/20"></div>
              <div>
                <div className="font-medium">Professor de Inglês</div>
                <div className="text-xs text-white/80 text-left">Online</div>
              </div>
            </div>

            {/* Mensagens */}
            <div className="h-[calc(400px-4rem)] bg-[#e5ded8] p-4 dark:bg-gray-700">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="ml-auto mb-4 max-w-[70%] rounded-lg rounded-tr-none bg-[#dcf8c6] p-2 px-3 text-left dark:bg-green-700 dark:text-white"
              >
                <p className="text-sm">Hi! Can you help me with the present perfect tense?</p>
                <p className="text-right text-xs text-gray-500 dark:text-gray-300">14:22</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mr-auto mb-4 max-w-[70%] rounded-lg rounded-tl-none bg-white p-2 px-3 text-left dark:bg-gray-600 dark:text-white"
              >
                <p className="text-sm">
                  Hello! Of course I can help you with the present perfect tense. It's used to talk about experiences or
                  changes that have happened in the past but are connected to the present. We form it with "have/has" +
                  past participle.
                </p>
                <p className="text-right text-xs text-gray-500 dark:text-gray-300">14:23</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="ml-auto mb-4 max-w-[70%] rounded-lg rounded-tr-none bg-[#dcf8c6] p-2 px-3 text-left dark:bg-green-700 dark:text-white"
              >
                <p className="text-sm">Can you give me some examples?</p>
                <p className="text-right text-xs text-gray-500 dark:text-gray-300">14:24</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="mr-auto max-w-[70%] rounded-lg rounded-tl-none bg-white p-2 px-3 text-left dark:bg-gray-600 dark:text-white"
              >
                <p className="text-sm">
                  Here are some examples:
                  <br />- I have visited London twice.
                  <br />- She has studied English for five years.
                  <br />- They have never eaten sushi.
                  <br />- Have you ever traveled abroad?
                </p>
                <p className="text-right text-xs text-gray-500 dark:text-gray-300">14:25</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Problemas + Conexão emocional */}
      <section className="relative z-10 bg-white/90 py-16 backdrop-blur-sm dark:bg-gray-900/90">
        <div className="container mx-auto px-4">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white"
          >
            🎯 Os desafios no ensino de inglês que sua escola não precisa mais enfrentar:
          </motion.h3>

          <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-1">
            {[
              {
                icon: <Clock className="h-5 w-5" />,
                text: "⏱️ Falta de tempo dos professores para atendimento individual.",
              },
              {
                icon: <FrownIcon className="h-5 w-5" />,
                text: "😓 Alunos com dificuldade de compreensão, mas sem reforço extra.",
              },
              {
                icon: <Users className="h-5 w-5" />,
                text: "🧒 Pais preocupados com o desempenho no inglês.",
              },
              {
                icon: <TrendingDown className="h-5 w-5" />,
                text: "📉 Falta de engajamento nas aulas e baixo desempenho no ENEM.",
              },
              {
                icon: <XCircle className="h-5 w-5" />,
                text: "❌ Nenhum diferencial claro em relação à concorrência.",
              },
            ].map((problem, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="flex items-start gap-3 rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <p className="text-gray-700 dark:text-gray-200 text-lg">{problem.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* A Solução: Professor Edu */}
      <section className="relative z-10 bg-gradient-to-br from-sky-50 to-indigo-50 py-16 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white"
          >
            🚀 Apresentamos o Professor Edu – o assistente de IA que revoluciona o ensino de inglês
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mb-12 max-w-2xl text-center text-gray-600 dark:text-gray-300"
          >
            Professor Edu é um assistente de inteligência artificial que conversa, corrige e ensina em tempo real pelo
            WhatsApp. Um reforço inteligente que cabe no bolso dos seus alunos, disponível 24 horas por dia, todos os
            dias da semana.
          </motion.p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Mic className="h-10 w-10" />,
                title: "🗣️ Pronúncia com Feedback e Nota",
                description: "O aluno envia um áudio e recebe uma nota de 0 a 100, com dicas de melhora.",
              },
              {
                icon: <Brain className="h-10 w-10" />,
                title: "🧠 Gramática e Vocabulário sob Demanda",
                description: "Dúvidas resolvidas na hora, com explicações claras em linguagem acessível.",
              },
              {
                icon: <MessageSquare className="h-10 w-10" />,
                title: "💬 Conversação Simulada",
                description: "Prática de diálogos reais, com correção de erros em tempo real.",
              },
              {
                icon: <ImageIcon className="h-10 w-10" />,
                title: "📷 Reconhecimento de Imagens",
                description: "O aluno envia uma imagem e recebe o vocabulário completo em inglês e português.",
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <h4 className="mb-2 text-xl font-semibold dark:text-white">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="relative z-10 bg-white/90 py-16 backdrop-blur-sm dark:bg-gray-900/90">
        <div className="container mx-auto px-4">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white"
          >
            Diferenciais
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mb-12 max-w-2xl text-center text-gray-600 dark:text-gray-300"
          >
            Nossa solução se destaca por oferecer recursos exclusivos que potencializam o aprendizado de inglês e
            garantem resultados efetivos.
          </motion.p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-4 inline-flex rounded-full bg-sky-100 p-3 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                  {feature.icon}
                </div>
                <h4 className="mb-2 text-xl font-semibold dark:text-white">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos e Valores */}
      <section className="relative z-10 bg-gradient-to-br from-sky-50 to-indigo-50 py-16 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white"
          >
            💼 Escolha o plano ideal para sua escola
          </motion.h3>

          {/* Toggle para alternar entre mensal e anual */}
          <div className="flex justify-center my-8">
            <div className="bg-white dark:bg-gray-800 rounded-full p-1 flex items-center">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-2 rounded-full transition-all ${!isAnnual ? "bg-sky-600 text-white" : "text-gray-600 dark:text-gray-300"
                  }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-2 rounded-full transition-all ${isAnnual ? "bg-sky-600 text-white" : "text-gray-600 dark:text-gray-300"
                  }`}
              >
                Anual (20% de desconto)
              </button>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Básico",
                price: isAnnual ? "R$240" : "R$300",
                period: isAnnual ? "/ano" : "/mês",
                description: "Ideal para escolas pequenas",
                features: ["Até 100 alunos", "Suporte básico", "Atualizações incluídas"],
                highlighted: false,
              },
              {
                name: "Intermediário",
                price: isAnnual ? "R$640" : "R$800",
                period: isAnnual ? "/ano" : "/mês",
                description: "Para escolas de médio porte",
                features: ["Até 500 alunos", "Suporte prioritário", "Relatórios mensais"],
                highlighted: true,
              },
              {
                name: "Avançado",
                price: "Sob consulta",
                period: "",
                description: "Para escolas grandes ou redes",
                features: ["Alunos ilimitados", "Suporte VIP", "Relatórios semanais", "Personalização avançada"],
                highlighted: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: plan.highlighted ? 1.05 : 1,
                }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className={`relative rounded-xl border bg-white p-6 shadow-sm transition-all dark:border-gray-700 dark:bg-gray-800 ${plan.highlighted
                  ? "border-sky-200 shadow-lg ring-1 ring-sky-200 dark:border-sky-800 dark:ring-sky-800"
                  : ""
                  }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-sky-600 px-3 py-1 text-xs font-medium text-white dark:bg-sky-700">
                    Mais Popular
                  </div>
                )}

                <h4 className="mb-2 text-xl font-bold dark:text-white">{plan.name}</h4>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-3xl font-bold dark:text-white">{plan.price}</span>
                  <span className="text-gray-600 dark:text-gray-300">{plan.period}</span>
                </div>

                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm dark:text-gray-200">
                      <CheckCircle2 className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${plan.highlighted
                    ? "bg-sky-600 hover:bg-sky-700 dark:bg-sky-700 dark:hover:bg-sky-600"
                    : "bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"
                    }`}
                  onClick={() => (window.location.href = "https://wa.me/557531997183")}
                >
                  Contratar
                </Button>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400"
          >
            🔔 Planos anuais com até 20% de desconto.
          </motion.p>
        </div>
      </section>

      {/* Depoimento/Autoridade */}
      <section className="relative z-10 bg-white/90 py-16 backdrop-blur-sm dark:bg-gray-900/90">
        <div className="container mx-auto px-4">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white"
          >
            📣 O que dizem as escolas que já utilizam o Professor Edu:
          </motion.h3>

          <div className="mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800"
            >
              <div className="mb-6 flex items-center justify-center">
                <div className="text-4xl text-sky-600 dark:text-sky-400">❝</div>
              </div>
              <p className="mb-6 text-center text-lg italic text-gray-700 dark:text-gray-300">
                "Foi um divisor de águas no reforço de inglês. Os alunos se sentiram motivados a praticar em casa, e os
                pais adoraram o acompanhamento."
              </p>
              <div className="text-center">
                <p className="font-semibold dark:text-white">Coordenadora Pedagógica</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Escola Nova Geração</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA final + Urgência */}
      <section className="relative z-10 bg-white/90 py-16 backdrop-blur-sm dark:bg-gray-900/90">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl relative rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 p-8 text-center text-white shadow-lg dark:from-sky-800 dark:to-indigo-900 md:p-12">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4 text-3xl font-bold"
            >
              🔓 Sua escola pronta para o futuro do ensino de idiomas.
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8 text-lg text-white/90"
            >
              Solicite uma demonstração gratuita e veja como o Professor Edu pode transformar o aprendizado de inglês na
              sua instituição.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="opacity-100 transform-none bg-white rounded-[10px] p-[15px] flex justify-center items-center"
            >
              <Button
                size="lg"
                className="bg-white text-sky-700 text-wrap p-4 hover:bg-white/90 dark:text-sky-800 text-lg gap-2 relative"
                onClick={() => (window.location.href = "https://wa.me/557531997183")}
              >
                📲 Quero agendar uma demonstração
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t bg-white/80 py-6 text-center backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
        <div className="container mx-auto px-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Englishapp - Sistema de Gestão para Professor Virtual de Inglês
          </p>
        </div>
      </footer>
    </div >
  )
}
