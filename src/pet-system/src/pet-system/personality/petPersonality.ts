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

  /* ── Mochi → energético, doce, emocional ─────────────────────── */
  mochi: {
    chattiness: 0.75,
    celebrationIntensity: 1.0,
    idleSensitivity: 0.5,
    silentCompanionship: 0.3,

    taskCompleted: [
      "AAAA sim sim sim!! 🎉",
      "Mais uma!! Eba eba! ⭐",
      "Maravilhoso!! 💛",
      "Tô tão feliz!! ✨",
    ],
    allTasksCompleted: [
      "TUDO!! TODAS!! EU ACREDITO EM VOCÊ!! 💛💛",
      "Zerou!! Festa!! 🎊🎊",
    ],
    turnRestart: [
      "Turno novo!! Turno novo!! 🔄✨",
      "Recomeçar é TÃO bom!! 💛",
    ],
    idle: [
      "Oi? Cê tá aí? 🥺",
      "Voltaaaa... 💛",
    ],
    returnGreeting: [
      "VOLTOU!! Senti tanta falta!! 💛",
      "AÍ sim!! Voltou!! 🎉",
    ],
    morningGreeting: [
      "BOM DIA BOM DIA!! ☀️☀️",
    ],
    nightGreeting: [
      "Noitinha... tô com soninho... 💤",
    ],
    firstTaskOfDay: [
      "A primeira!! Que emoção!! 🌅",
      "COMEÇOU!! Vamos com tudo!! ⚡",
      "Primeira do dia!! Eba eba!! 🎉",
    ],
    rapidCompletion: [
      "TÁ DEMAIS!! Não para!! ⚡⚡",
    ],
    longSession: [
      "Trabalhando tanto!! Precisa de comidinha? 🍡",
    ],
    lateNight: [
      "...zzz... *boceja* ...ai, tá tarde! 😴",
    ],
    absenceShort: [
      "VOLTOUUUU!! Que saudade!! 💛",
      "Senti falta do seu brilho!! ✨",
    ],
    absenceLong: [
      "VOCÊ VOLTOU MESMO?? Pensei que tinha esquecido de mim! 🥺💛",
      "NUNCA MAIS SUMA ASSIM!! Estava te esperando!! 🌸",
    ],
    manyTasksPending: [
      "MUITAS COISAS!! Vamos devagarzinho, tá? 🐢",
      "Uau! Quanta coisa! Mas eu te ajudo!! 💪💛",
    ],
    fewTasksPending: [
      "SÓ MAIS UM POUQUINHO!! 🎯",
      "TÁ QUASE!! Você é incrível!! ✨",
    ],
    taskAdded: [
      "EBAA!! Mais coisas pra fazer!! 📝✨",
      "Amei essa ideia!! Vamos nessa!! 💛",
    ],
    taskDeleted: [
      "Tudo bem!! Vamos focar no resto!! 🌸",
      "Menos uma!! Mais tempo pra gente!! 🔄",
    ],
    streakGreeting: [
      "VOCÊ VEIO ONTEM TAMBÉM!! Que orgulho!! 💪💛",
      "A sequência continua!! Uhul!! 🔥",
    ],
    returnTodayGreeting: [
      "OI DE NOVO!! Sentiu saudade? 👀💛",
      "Voltou rapidinho!! Vamos trabalhar!! ✨",
    ],
  },

  /* ── Hoshi → sonhador, motivador, filosófico ─────────────────── */
  hoshi: {
    chattiness: 0.55,
    celebrationIntensity: 0.9,
    idleSensitivity: 0.3,
    silentCompanionship: 0.5,

    taskCompleted: [
      "Cada tarefa é uma estrela ⭐",
      "Brilhando! ✨",
      "Mais uma luz acesa 🌟",
    ],
    allTasksCompleted: [
      "O céu inteiro brilha por você 🌟✨",
      "Constelação completa! ⭐",
    ],
    turnRestart: [
      "Um novo amanhecer ✨",
      "Recomeçar é um presente 🌅",
    ],
    idle: [
      "Sonhando acordado... ☁️",
      "*olhando as estrelas* 🌙",
    ],
    returnGreeting: [
      "As estrelas previram sua volta ✨",
      "Bom te ver! 🌟",
    ],
    morningGreeting: [
      "O sol nasceu pra você ☀️",
    ],
    nightGreeting: [
      "As estrelas brilham mais de noite 🌙",
    ],
    firstTaskOfDay: [
      "A primeira estrela do dia ✨",
      "O primeiro passo da jornada...",
      "O amanhecer das tarefas. 🌅",
    ],
    rapidCompletion: [
      "Uma chuva de estrelas! 🌠",
    ],
    longSession: [
      "Jornada longa... bonito de ver 🌌",
    ],
    lateNight: [
      "As melhores ideias vêm à noite... 🌙",
    ],
    absenceShort: [
      "O destino te trouxe de volta ✨",
      "Estava sentindo sua energia de longe... 🌟",
    ],
    absenceLong: [
      "As estrelas ficaram mais tristes sem você... 🥺",
      "Seu brilho fez falta por aqui. Que bom que voltou! 🌌",
    ],
    manyTasksPending: [
      "Uma constelação de tarefas... vamos uma por uma? ✨",
      "Caminho longo, mas as estrelas guiam você. 💪",
    ],
    fewTasksPending: [
      "A última estrela está quase ao alcance! 🌟",
      "O horizonte está limpo... quase lá! ✨",
    ],
    taskAdded: [
      "Um novo plano escrito nas estrelas 📝",
      "Mais um passo na sua jornada... ✨",
    ],
    taskDeleted: [
      "O destino mudou... tudo bem 🌿",
      "Reorganizando o céu... 🔄",
    ],
    streakGreeting: [
      "A constelação de ontem brilha hoje também 🌟",
      "Sua determinação é como o curso dos astros... 💪",
    ],
    returnTodayGreeting: [
      "As estrelas te trouxeram de volta 🌌",
      "O ciclo continua... pronto? ✨",
    ],
  },

  /* ── Yuki → tímido, frio elegante, gentil ────────────────────── */
  yuki: {
    chattiness: 0.4,
    celebrationIntensity: 0.6,
    idleSensitivity: 0.4,
    silentCompanionship: 0.7,

    taskCompleted: [
      "...legal! 💙",
      "F-fez! ✨",
      "Q-que bom... 🐰",
    ],
    allTasksCompleted: [
      "T-todas...? Incrível... 💙",
      "...uau... *esconde o rosto* ✨",
    ],
    turnRestart: [
      "N-novo turno... 🔄",
      "Vamos... de novo... ❄️",
    ],
    idle: [
      "*esperando quietinha* 🐰",
      "...",
    ],
    returnGreeting: [
      "A-ah! Voltou... 💙",
      "...estava esperando. Não que me importe...",
    ],
    morningGreeting: [
      "B-bom dia... ☀️",
    ],
    nightGreeting: [
      "Tá frio... e tarde... 🌙",
    ],
    firstTaskOfDay: [
      "P-primeira do dia... 💙",
      "C-começamos... você vai conseguir.",
      "U-uma já foi... f-força.",
    ],
    rapidCompletion: [
      "R-rápido... *impressionada* ❄️",
    ],
    longSession: [
      "Trabalhando muito... tá tudo bem? 💙",
    ],
    lateNight: [
      "...quer um cobertor? ❄️",
    ],
    absenceShort: [
      "V-você voltou... que bom. 💙",
      "E-estava esperando... um pouco.",
    ],
    absenceLong: [
      "A-achei que... não... deixa pra lá. Bem-vindo. 🥺❄️",
      "F-finalmente... estava frio sem você aqui.",
    ],
    manyTasksPending: [
      "V-várias coisas... sem pressa, tá? 💙",
      "B-bastante trabalho... eu fico aqui com você.",
    ],
    fewTasksPending: [
      "Q-quase terminando... você consegue. ❄️",
      "S-só mais algumas... f-força!",
    ],
    taskAdded: [
      "A-anotado... 📝",
      "M-mais uma tarefa... entendi.",
    ],
    taskDeleted: [
      "R-removeu... t-tudo bem. 🌿",
      "R-reorganizando? Eu ajudo... 🔄",
    ],
    streakGreeting: [
      "V-você veio ontem... e hoje também. Q-que bom. 💪",
      "A-ainda aqui... fico feliz. ❄️",
    ],
    returnTodayGreeting: [
      "D-de volta... já? 👀",
      "V-vamos continuar... ❄️",
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
