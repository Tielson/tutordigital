"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useAuth } from "@clerk/nextjs"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Globe,
  GraduationCap,
  Headphones,
  Languages,
  Smartphone,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

// Nome da aplicação: TutorDigital
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
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <GraduationCap className="h-8 w-8 text-sky-600 dark:text-sky-400" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-sky-700 dark:text-sky-400"
            >
              TutorDigital
            </motion.h1>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2"
          >
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
          </motion.div>
        </div>
      </header>

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
          Aprenda <span className="text-sky-600 dark:text-sky-400">inglês</span> com um professor virtual
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300 sm:text-xl"
        >
          Um assistente de IA especializado em ensino de inglês via WhatsApp para alunos do ensino fundamental ao médio,
          disponível 24/7 para prática de conversação, vocabulário e gramática.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Link href="/sign-in">
            <Button size="lg" className="gap-2 bg-sky-600 hover:bg-sky-700 dark:bg-sky-700 dark:hover:bg-sky-600">
              Gerenciar Alunos
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
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

      {/* Benefícios para a Escola */}
      <section className="relative z-10 bg-white/90 py-16 backdrop-blur-sm dark:bg-gray-900/90">
        <div className="container mx-auto px-4">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white"
          >
            Benefícios para o Aprendizado de Inglês
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mb-12 max-w-2xl text-center text-gray-600 dark:text-gray-300"
          >
            Nossa solução traz diversos benefícios para o ensino de inglês, melhorando a experiência educacional e
            acelerando o aprendizado dos alunos.
          </motion.p>

          <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="flex items-start gap-3 rounded-lg border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="rounded-full bg-sky-100 p-2 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                  {benefit.icon}
                </div>
                <p className="text-gray-700 dark:text-gray-200">{benefit.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="relative z-10 bg-gradient-to-br from-sky-50 to-indigo-50 py-16 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white"
          >
            Como Funciona o Professor Virtual
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mb-12 max-w-2xl text-center text-gray-600 dark:text-gray-300"
          >
            O assistente de IA conversa com os alunos pelo WhatsApp, ajudando no aprendizado de inglês. Ele entende
            texto e áudio, adapta a linguagem conforme o nível do aluno, e oferece exercícios personalizados.
          </motion.p>

          <div className="mx-auto flex max-w-4xl flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative mb-8 h-[6px] w-full max-w-2xl rounded-full bg-gray-200 dark:bg-gray-700"
            >
              <div className="absolute left-0 top-0 h-full w-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 dark:from-sky-600 dark:to-indigo-700"></div>

              <div className="absolute -top-[14px] left-[0%] flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-sky-400 text-xs font-bold text-white dark:border-gray-800 dark:bg-sky-600">
                1
              </div>
              <div className="absolute -top-[14px] left-[33%] flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-sky-500 text-xs font-bold text-white dark:border-gray-800 dark:bg-sky-700">
                2
              </div>
              <div className="absolute -top-[14px] left-[66%] flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-indigo-400 text-xs font-bold text-white dark:border-gray-800 dark:bg-indigo-600">
                3
              </div>
              <div className="absolute -top-[14px] left-[100%] flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-indigo-500 text-xs font-bold text-white dark:border-gray-800 dark:bg-indigo-700">
                4
              </div>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-lg bg-white p-4 text-center shadow-sm dark:bg-gray-800"
              >
                <h4 className="mb-2 font-semibold dark:text-white">Cadastro</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  O professor cadastra os alunos na plataforma TutorDigital
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-lg bg-white p-4 text-center shadow-sm dark:bg-gray-800"
              >
                <h4 className="mb-2 font-semibold dark:text-white">Acesso</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Alunos recebem acesso ao professor virtual via WhatsApp
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="rounded-lg bg-white p-4 text-center shadow-sm dark:bg-gray-800"
              >
                <h4 className="mb-2 font-semibold dark:text-white">Prática</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Alunos praticam inglês por texto ou áudio a qualquer momento
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="rounded-lg bg-white p-4 text-center shadow-sm dark:bg-gray-800"
              >
                <h4 className="mb-2 font-semibold dark:text-white">Evolução</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  IA fornece feedback e acompanha o progresso do aluno
                </p>
              </motion.div>
            </div>
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

      {/* Toggle para alternar entre mensal e anual */}
      <div className="flex justify-center my-4">
        <button
          onClick={togglePlan}
          className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
        >
          {isAnnual ? "Exibir Planos Mensais" : "Exibir Planos Anuais"}
        </button>
      </div>

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
            Planos e Valores
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mb-12 max-w-2xl text-center text-gray-600 dark:text-gray-300"
          >
            Escolha o plano ideal para sua escola ou curso de inglês e comece a oferecer suporte inteligente aos seus
            alunos.
          </motion.p>

          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan, i) => (
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
                  onClick={() => window.location.href = 'https://wa.me/557531997183'}
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
            Todos os planos incluem atendimento via WhatsApp, suporte, atualizações e regras de segurança.
          </motion.p>
        </div>
      </section>

      {/* CTA - TutorDigital */}
      <section className="relative z-10 bg-white/90 py-16 backdrop-blur-sm dark:bg-gray-900/90">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 p-8 text-center text-white shadow-lg dark:from-sky-800 dark:to-indigo-900 md:p-12">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4 text-3xl font-bold"
            >
              Gerencie seus alunos com o TutorDigital
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8 text-lg text-white/90"
            >
              Nossa plataforma permite cadastrar, ativar e gerenciar todos os alunos que terão acesso ao Professor
              Virtual de Inglês via WhatsApp.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/sign-in">
                <Button size="lg" className="bg-white text-sky-700 hover:bg-white/90 dark:text-sky-800">
                  Acessar Plataforma
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t bg-white/80 py-6 text-center backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
        <div className="container mx-auto px-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} TutorDigital - Sistema de Gestão para Professor Virtual de Inglês
          </p>
        </div>
      </footer>
    </div>
  )
}
