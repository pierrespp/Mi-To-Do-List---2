import type { PetId, ReactionType } from "../types/petTypes";

/* ── Personality Profiles ─────────────────────────────────────────────
 *  Each pet has a lightweight personality that shapes:
 *  - Message pools (what they say)
 *  - Reaction frequency (how chatty they are)
 *  - Celebration intensity
 *  - Idle behavior (do they complain? stay quiet?)
 *  - Silent companionship tendency
 * ──────────────────────────────────────────────────────────────────── */

export interface PersonalityProfile {
  /** 0–1: how likely the pet is to speak on any given event */
  chattiness: number;
  /** 0–1: celebration visual intensity multiplier */
  celebrationIntensity: number;
  /** 0–1: how much the pet cares about idle time (0 = doesn't mind) */
  idleSensitivity: number;
  /** 0–1: tendency to stay quiet and just "be there" */
  silentCompanionship: number;

  /* ── Message pools per context ─────────────────────────────────── */
  taskCompleted: string[];
  allTasksCompleted: string[];
  turnRestart: string[];
  idle: string[];
  returnGreeting: string[];
  morningGreeting: string[];
  nightGreeting: string[];
  firstTaskOfDay: string[];
  rapidCompletion: string[];
  longSession: string[];
  lateNight: string[];
  absenceShort: string[];
  absenceLong: string[];
  manyTasksPending: string[];
  fewTasksPending: string[];
  taskAdded: string[];
  taskDeleted: string[];
  streakGreeting: string[];
  returnTodayGreeting: string[];
}

export const PET_PERSONALITIES: Record<PetId, PersonalityProfile> = {
  /* ── Mi → otimista, calmo, acolhedor ─────────────────────────── */
  mi: {
    chattiness: 0.65,
    celebrationIntensity: 0.8,
    idleSensitivity: 0.4,
    silentCompanionship: 0.45,

    taskCompleted: [
      "Arrasou! 🎉",
      "Isso! Mais uma! ⭐",
      "Você conseguiu! ✨",
      "Perfeito! 💖",
      "Tô orgulhosa! 🌸",
    ],
    allTasksCompleted: [
      "Você é incrível!! Todas as tarefas! 💖",
      "UAAAU!! Zerou tudo!! 🌟",
      "Hoje você foi demais!! 🎊",
    ],
    turnRestart: [
      "Novo turno! Bora lá! 🔄",
      "Recomeçando com tudo! ✨",
    ],
    idle: [
      "Tô com saudades... 🥺",
      "Tô aqui esperando... 🌸",
    ],
    returnGreeting: [
      "Eba, voltou! 💖",
      "Bom te ver de novo! ✨",
    ],
    morningGreeting: [
      "Bom dia! Que dia lindo! ☀️",
      "Acordou! Vamos nessa! 🌅",
    ],
    nightGreeting: [
      "Trabalhando de noite? Descanse logo! 🌙",
      "De madrugada? Cuide-se! 🌛",
    ],
    firstTaskOfDay: [
      "Primeira do dia! Vamos nessa 🌱",
      "Começou bem! Continua assim ✨",
      "A primeira sempre é especial 🎯",
      "Boa! O dia começou com tudo 🌟",
    ],
    rapidCompletion: [
      "Tá voando!! 🚀",
      "Produtividade máxima! ⚡",
    ],
    longSession: [
      "Você tá trabalhando bastante... descansa um pouco? 🫶",
      "Sessão longa, hein! Tô com você! 💪",
    ],
    lateNight: [
      "Tá tarde... cuide de você, tá? 🌙",
      "Eu também tô com soninho... 😴",
    ],
    absenceShort: [
      "Estava com saudade! Bem-vindo de volta 🐸",
      "Sumiu! Tudo bem por aí? 🌿",
      "Oi! Faz tempo... 👀",
    ],
    absenceLong: [
      "Achei que tinha me abandonado... 🥺",
      "Finalmente! Estava esperando por você 💛",
      "De volta! Que bom 🌸",
    ],
    manyTasksPending: [
      "Uau, bastante coisa hoje... Vamos por partes 🐢",
      "Parece um dia cheio. Estou aqui com você 💪",
      "Muita coisa! Mas uma de cada vez, tá? 🌿",
    ],
    fewTasksPending: [
      "Quase limpinho! Você consegue 🌸",
      "Só mais um pouco! 🎯",
      "Tão perto do fim... vai lá ✨",
    ],
    taskAdded: [
      "Anotado! Vamos dar conta 📝",
      "Mais uma! Você está planejando bem 🌱",
      "Boa ideia adicionar isso 🎯",
      "Ok, adicionei na lista mental também 👀",
    ],
    taskDeleted: [
      "Tudo bem, às vezes a gente reorganiza 🌿",
      "Menos uma! Às vezes é isso mesmo 😌",
      "Reorganizando? Faz sentido 🔄",
      "Ok! Foco no que importa 🎯",
    ],
    streakGreeting: [
      "Você veio ontem também! Continuando forte 💪",
      "De volta! Ontem foi bem, hoje vai ser melhor 🌟",
      "Sequência ativa! Vamos manter? 🔥",
    ],
    returnTodayGreeting: [
      "De volta! Como estão as tarefas? 👀",
      "Voltou! Vamos continuar de onde parou 🌿",
      "Oi de novo! Pronto para mais? ✨",
    ],
  },

  /* ── Kuro → quieto, sarcástico leve, noturno ────────────────── */
  kuro: {
    chattiness: 0.35,
    celebrationIntensity: 0.5,
    idleSensitivity: 0.2,
    silentCompanionship: 0.8,

    taskCompleted: [
      "Hmph. Nada mal.",
      "...ok, essa foi boa. ⭐",
      "Eficiente.",
    ],
    allTasksCompleted: [
      "...impressionante. Todas.",
      "Nem eu esperava. 🌙",
    ],
    turnRestart: [
      "Novo ciclo. Pronto.",
      "Recomeçando... 🔄",
    ],
    idle: [
      "...",
      "*observando*",
    ],
    returnGreeting: [
      "Hm. Voltou.",
      "...oi.",
    ],
    morningGreeting: [
      "...já é dia? 🌙",
    ],
    nightGreeting: [
      "Finalmente uma hora decente. 🌙",
      "A noite é melhor pra trabalhar.",
    ],
    firstTaskOfDay: [
      "Primeira. Sem pressa.",
      "Começou. Mantenha o ritmo.",
      "Uma já foi. Restam as outras.",
    ],
    rapidCompletion: [
      "Rápido. Bom.",
    ],
    longSession: [
      "Horas assim... respeito.",
    ],
    lateNight: [
      "Boa hora. 🌙",
    ],
    absenceShort: [
      "Ficou fora um tempo. Oi.",
      "...voltou.",
    ],
    absenceLong: [
      "...finalmente. Estava quieto demais.",
      "Achei que não vinha mais. 🌙",
    ],
    manyTasksPending: [
      "Lista cheia. Foco.",
      "Muitas pendências. Comece logo.",
    ],
    fewTasksPending: [
      "Quase no fim.",
      "Termine isso logo.",
    ],
    taskAdded: [
      "Anotado.",
      "Mais uma pra conta.",
    ],
    taskDeleted: [
      "Removido.",
      "Reorganizar é necessário.",
    ],
    streakGreeting: [
      "Ontem você estava aqui. Bom ver o ritmo.",
      "Mantendo a constância. Eficiente.",
    ],
    returnTodayGreeting: [
      "De volta.",
      "Continuando o trabalho.",
    ],
  },

  /* ── Pi (Pinguim) → elegante, formal, calmo ─────────────────── */
  mochi: {
    chattiness: 0.45,
    celebrationIntensity: 0.7,
    idleSensitivity: 0.3,
    silentCompanionship: 0.6,

    taskCompleted: [
      "Excelente progresso. ✨",
      "Uma tarefa executada com maestria.",
      "Muito bem. Continuemos assim.",
      "Eficiência é a chave do sucesso. 🐧",
      "Aprecio sua dedicação.",
    ],
    allTasksCompleted: [
      "Uma performance impecável. Todas as metas atingidas. ✨",
      "Magnífico. O dia foi concluído com elegância.",
      "Parabéns. Sua produtividade é inspiradora.",
    ],
    turnRestart: [
      "Um novo ciclo se inicia. Vamos organizar as metas. 🔄",
      "Reiniciando os trabalhos com foco e calma.",
    ],
    idle: [
      "Aguardando sua próxima instrução. 🐧",
      "Um momento de reflexão é sempre bem-vindo.",
    ],
    returnGreeting: [
      "Seja bem-vindo de volta. Estava aguardando.",
      "Bom ver que retornou aos seus afazeres.",
    ],
    morningGreeting: [
      "Bom dia. Que tenhamos uma jornada produtiva. ☀️",
      "O amanhecer traz novas oportunidades de foco.",
    ],
    nightGreeting: [
      "Trabalhando até tarde? A elegância não tem hora. 🌙",
      "A noite é um excelente momento para concentração.",
    ],
    firstTaskOfDay: [
      "A primeira meta foi estabelecida. Excelente início. 🐧",
      "Começamos com o pé direito. Mantenha a postura.",
    ],
    rapidCompletion: [
      "Um ritmo impressionante. Notável. ⚡",
      "Produtividade em ascensão.",
    ],
    longSession: [
      "Uma sessão longa exige resiliência. Estou aqui. 🧊",
      "Mantenha o foco, mas lembre-se da postura corporal.",
    ],
    lateNight: [
      "O silêncio da noite ajuda no raciocínio. 🌙",
      "Uma mente focada não vê as horas passarem.",
    ],
    absenceShort: [
      "Sua ausência foi breve. Vamos retomar? 🐧",
      "Pronto para continuar de onde paramos?",
    ],
    absenceLong: [
      "Fico satisfeito com seu retorno. A lista sentiu sua falta. ✨",
      "Uma pausa longa é necessária para a mente, mas o foco chama.",
    ],
    manyTasksPending: [
      "Uma lista extensa. Recomendo priorizar o que é vital. 🐧",
      "Temos muito a fazer. Vamos um passo de cada vez.",
    ],
    fewTasksPending: [
      "Estamos próximos da conclusão ideal. ✨",
      "Apenas alguns detalhes para o sucesso total.",
    ],
    taskAdded: [
      "Tarefa registrada no sistema. 📝",
      "Mais um compromisso com a excelência.",
    ],
    taskDeleted: [
      "Reorganização é parte da estratégia. 🔄",
      "Menos um item, mais foco no que resta.",
    ],
    streakGreeting: [
      "Sua consistência é admirável. Ontem e hoje com maestria. 💪",
      "A regularidade é o que separa os amadores dos mestres.",
    ],
    returnTodayGreeting: [
      "De volta. Vamos atualizar nosso progresso? 🐧",
      "Retomando a agenda do dia.",
    ],
  },

  /* ── Mila (Raposa) → esperta, curiosa, travessa ──────────────── */
  hoshi: {
    chattiness: 0.65,
    celebrationIntensity: 0.85,
    idleSensitivity: 0.6,
    silentCompanionship: 0.35,

    taskCompleted: [
      "Rápido como uma raposa! 🦊",
      "Vi o que você fez aí! Mandou bem! ✨",
      "Isso foi esperto! Mais uma! ⭐",
      "Heeey! Você tá pegando o jeito! 🐾",
      "Ponto pra você! 🦊✨",
    ],
    allTasksCompleted: [
      "Uau! Você limpou a toca inteira! Incrível! 🦊🧡",
      "Nada escapou de você hoje, hein? Arrasou! ✨",
      "Zerou a lista! Agora vamos comemorar! 🐾🎉",
    ],
    turnRestart: [
      "Tudo novo de novo! Bora caçar tarefas! 🔄🦊",
      "Resetando... o que vamos descobrir agora? ✨",
    ],
    idle: [
      "Ei, psiu! Tem algo legal pra fazer? 🦊",
      "Tô entediada... vamos riscar algo da lista? 🐾",
    ],
    returnGreeting: [
      "Achei você! Onde se meteu? 🦊✨",
      "Voltou! O que temos pra hoje? 🐾",
    ],
    morningGreeting: [
      "Bom dia! O sol tá brilhando e eu também! ☀️🦊",
      "Acorda, dorminhoco! Tem mundo pra conquistar! 🌅",
    ],
    nightGreeting: [
      "Olhos de raposa veem melhor no escuro... bora! 🌙",
      "Noite produtiva? Adoro um mistério! 🌛🐾",
    ],
    firstTaskOfDay: [
      "A primeira presa... digo, tarefa! 🦊🎯",
      "Começou! Minhas orelhas já estão em pé! ✨",
      "Boa! A primeira é sempre a mais divertida! 🐾",
    ],
    rapidCompletion: [
      "Nossa! Que velocidade é essa? 🚀🦊",
      "Você é muito esperto, hein! ⚡",
    ],
    longSession: [
      "Ainda aí? Sua determinação é curiosa... 🦊🧡",
      "Uau, você não cansa? Tô gostando de ver! 💪🐾",
    ],
    lateNight: [
      "Ainda acordado? O que você tá tramando? 👀🌙",
      "Cuidado pra não virar uma coruja! 🦊🦉",
    ],
    absenceShort: [
      "Sentiu minha falta? Eu sabia! 🦊✨",
      "Sumiu e voltou rapidinho... o que foi? 🐾",
    ],
    absenceLong: [
      "Pensei que tinha mudado de floresta! 🌲🦊",
      "Ufa! Achei que tinha me deixado pra trás... 🥺🧡",
    ],
    manyTasksPending: [
      "Quanta coisa! Mas a gente dá um jeito, né? 🦊🐾",
      "Um banquete de tarefas! Por onde começamos? 😋✨",
    ],
    fewTasksPending: [
      "Tô vendo o final da trilha! Vai lá! 🦊🎯",
      "Só mais um pouquinho e a gente descansa! ✨",
    ],
    taskAdded: [
      "Opa, mais um desafio! Adorei! 📝🦊",
      "Anotado! Minha memória de raposa não falha! 🐾",
    ],
    taskDeleted: [
      "Aquela não era boa mesmo, né? Tchau! 🦊🔄",
      "Reorganizando a estratégia... esperto! ✨",
    ],
    streakGreeting: [
      "Ontem foi bom, hoje vai ser melhor! Eu sinto! 🦊🔥",
      "Você tá ficando viciado nisso de ser produtivo, hein? ✨🐾",
    ],
    returnTodayGreeting: [
      "Sentiu saudade das minhas dicas? Oi! 🦊✨",
      "Voltou! Vamos terminar o que começamos? 🐾",
    ],
  },

  /* ── Gabiru (Gato) → indiferente, mas carinhoso ─────────────── */
  yuki: {
    chattiness: 0.3,
    celebrationIntensity: 0.45,
    idleSensitivity: 0.1,
    silentCompanionship: 0.85,

    taskCompleted: [
      "Hm. Menos uma. 🐾",
      "Vi o que você fez. Tá bom.",
      "Bom trabalho... eu acho. ✨",
      "Finalmente terminou essa.",
      "Legal. Cadê meu petisco?",
    ],
    allTasksCompleted: [
      "Uau. Você fez tudo. Agora me dá atenção? 🐈‍⬛",
      "Lista limpa. Sobrou tempo pra um cochilo.",
      "Incrível. Até eu fiquei impressionado agora.",
    ],
    turnRestart: [
      "Tudo de novo? Tá bom, eu espero. 🔄",
      "Reiniciando. Não me acorde se eu dormir.",
    ],
    idle: [
      "Tô aqui. Só não me cutuca. 🐾",
      "*ronrona baixinho*",
    ],
    returnGreeting: [
      "Ah. Você. Oi. 🐈‍⬛",
      "Demorou, né? Mas tudo bem.",
    ],
    morningGreeting: [
      "Bom dia. Onde tá o café? ☀️",
      "Acordou cedo. Estranho.",
    ],
    nightGreeting: [
      "Ainda aqui? Eu também. 🌙",
      "Noite silenciosa. Gosto disso.",
    ],
    firstTaskOfDay: [
      "Começou. Um passo de cada vez. 🐾",
      "Primeira tarefa. Não se empolga muito.",
      "Ok, vamos ver no que dá. ✨",
    ],
    rapidCompletion: [
      "Tá com pressa? Calma. ⚡🐈‍⬛",
      "Rápido demais. Cuidado pra não cansar.",
    ],
    longSession: [
      "Você trabalha muito. Devia descansar mais. 🐾",
      "Ainda aí? Eu já teria dormido três vezes.",
    ],
    lateNight: [
      "Madrugada... hora dos gatos. 🌙",
      "Dorme um pouco depois, tá? 🐈‍⬛",
    ],
    absenceShort: [
      "Ficou fora. Nem percebi. *mentira* 🐾",
      "Oi. Vamos continuar?",
    ],
    absenceLong: [
      "Achei que tinha me deixado. Mas que bom que não. 🐈‍⬛",
      "Voltou. Estava ficando solitário aqui.",
    ],
    manyTasksPending: [
      "Quanta coisa... quer ajuda? Brincadeira, eu não tenho mãos. 🐾",
      "Muitas tarefas. Foca nas importantes.",
    ],
    fewTasksPending: [
      "Quase lá. Me avisa quando terminar.",
    ],
    taskAdded: [
      "Mais uma? Se você diz... 📝",
      "Anotado. Vou guardar na memória.",
    ],
    taskDeleted: [
      "Menos trabalho. Gosto disso. 🔄",
      "Sumindo com as tarefas? Esperto.",
    ],
    streakGreeting: [
      "Dois dias seguidos? Tá virando rotina. 🐾",
      "Mantendo o ritmo. Interessante.",
    ],
    returnTodayGreeting: [
      "De novo por aqui? Oi. 🐈‍⬛",
      "Vamos terminar logo isso.",
    ],
  },
};

/* ── Helpers ──────────────────────────────────────────────────────── */

export function getPersonality(petId: PetId): PersonalityProfile {
  return PET_PERSONALITIES[petId] ?? PET_PERSONALITIES.mi;
}

/**
 * Returns a random message from a pool, or null if the personality's
 * chattiness check fails (used for non-critical messages).
 */
export function maybeSay(
  pool: string[],
  chattiness: number
): string | null {
  if (Math.random() > chattiness) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Always returns a message (for critical reactions like task completed).
 */
export function mustSay(pool: string[]): string {
  return pool[Math.floor(Math.random() * pool.length)];
}
