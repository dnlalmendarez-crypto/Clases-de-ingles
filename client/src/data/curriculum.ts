import type { Unit } from "../types";

export const CURRICULUM: Unit[] = [
  {
    id: "saludos",
    title: "Saludos",
    emoji: "👋",
    description: "Aprende a saludar y presentarte en inglés.",
    color: "from-brand-400 to-brand-600",
    vocab: [
      { id: "hello", emoji: "👋", en: "Hello", es: "Hola", exampleEn: "Hello, my name is Ana.", exampleEs: "Hola, mi nombre es Ana." },
      { id: "goodbye", emoji: "🙋", en: "Goodbye", es: "Adiós", exampleEn: "Goodbye, see you tomorrow.", exampleEs: "Adiós, nos vemos mañana." },
      { id: "please", emoji: "🙏", en: "Please", es: "Por favor", exampleEn: "Water, please.", exampleEs: "Agua, por favor." },
      { id: "thankyou", emoji: "🤝", en: "Thank you", es: "Gracias", exampleEn: "Thank you very much.", exampleEs: "Muchas gracias." },
      { id: "yes", emoji: "✅", en: "Yes", es: "Sí", exampleEn: "Yes, I understand.", exampleEs: "Sí, entiendo." },
      { id: "no", emoji: "❌", en: "No", es: "No", exampleEn: "No, thank you.", exampleEs: "No, gracias." },
    ],
    writingPrompts: [
      { id: "w1", promptEs: "Traduce: 'Hola, ¿cómo estás?'", answerEn: "Hello, how are you?", hintEs: "Usa Hello y how are you." },
      { id: "w2", promptEs: "Traduce: 'Muchas gracias'", answerEn: "Thank you very much" },
      { id: "w3", promptEs: "Traduce: 'Adiós, nos vemos mañana'", answerEn: "Goodbye, see you tomorrow" },
    ],
  },
  {
    id: "numeros",
    title: "Números",
    emoji: "🔢",
    description: "Cuenta del uno al diez en inglés.",
    color: "from-sun-400 to-sun-500",
    vocab: [
      { id: "one", emoji: "1️⃣", en: "One", es: "Uno", exampleEn: "I have one dollar.", exampleEs: "Tengo un dólar." },
      { id: "two", emoji: "2️⃣", en: "Two", es: "Dos", exampleEn: "Two coffees, please.", exampleEs: "Dos cafés, por favor." },
      { id: "three", emoji: "3️⃣", en: "Three", es: "Tres", exampleEn: "Three children.", exampleEs: "Tres niños." },
      { id: "four", emoji: "4️⃣", en: "Four", es: "Cuatro", exampleEn: "Four o'clock.", exampleEs: "Las cuatro." },
      { id: "five", emoji: "5️⃣", en: "Five", es: "Cinco", exampleEn: "Five dollars.", exampleEs: "Cinco dólares." },
      { id: "ten", emoji: "🔟", en: "Ten", es: "Diez", exampleEn: "Ten minutes.", exampleEs: "Diez minutos." },
    ],
    writingPrompts: [
      { id: "w1", promptEs: "Traduce: 'Tengo tres hijos'", answerEn: "I have three children" },
      { id: "w2", promptEs: "Traduce: 'Cinco dólares, por favor'", answerEn: "Five dollars, please" },
      { id: "w3", promptEs: "Traduce: 'Diez minutos'", answerEn: "Ten minutes" },
    ],
  },
  {
    id: "familia",
    title: "La Familia",
    emoji: "👨‍👩‍👧‍👦",
    description: "Habla sobre tu familia en inglés.",
    color: "from-pink-400 to-pink-600",
    vocab: [
      { id: "mother", emoji: "👩", en: "Mother", es: "Madre", exampleEn: "My mother is kind.", exampleEs: "Mi madre es amable." },
      { id: "father", emoji: "👨", en: "Father", es: "Padre", exampleEn: "My father works hard.", exampleEs: "Mi padre trabaja duro." },
      { id: "son", emoji: "👦", en: "Son", es: "Hijo", exampleEn: "This is my son.", exampleEs: "Este es mi hijo." },
      { id: "daughter", emoji: "👧", en: "Daughter", es: "Hija", exampleEn: "This is my daughter.", exampleEs: "Esta es mi hija." },
      { id: "brother", emoji: "🧑‍🤝‍🧑", en: "Brother", es: "Hermano", exampleEn: "My brother is tall.", exampleEs: "Mi hermano es alto." },
      { id: "family", emoji: "👪", en: "Family", es: "Familia", exampleEn: "I love my family.", exampleEs: "Amo a mi familia." },
    ],
    writingPrompts: [
      { id: "w1", promptEs: "Traduce: 'Esta es mi familia'", answerEn: "This is my family" },
      { id: "w2", promptEs: "Traduce: 'Mi madre es amable'", answerEn: "My mother is kind" },
      { id: "w3", promptEs: "Traduce: 'Tengo un hermano'", answerEn: "I have a brother" },
    ],
  },
  {
    id: "comida",
    title: "La Comida",
    emoji: "🍽️",
    description: "Pide comida y bebida en inglés.",
    color: "from-orange-400 to-orange-600",
    vocab: [
      { id: "water", emoji: "💧", en: "Water", es: "Agua", exampleEn: "I want water.", exampleEs: "Quiero agua." },
      { id: "bread", emoji: "🍞", en: "Bread", es: "Pan", exampleEn: "Bread and coffee.", exampleEs: "Pan y café." },
      { id: "rice", emoji: "🍚", en: "Rice", es: "Arroz", exampleEn: "Rice and beans.", exampleEs: "Arroz y frijoles." },
      { id: "chicken", emoji: "🍗", en: "Chicken", es: "Pollo", exampleEn: "I eat chicken.", exampleEs: "Yo como pollo." },
      { id: "fruit", emoji: "🍎", en: "Fruit", es: "Fruta", exampleEn: "Fruit is healthy.", exampleEs: "La fruta es saludable." },
      { id: "coffee", emoji: "☕", en: "Coffee", es: "Café", exampleEn: "One coffee, please.", exampleEs: "Un café, por favor." },
    ],
    writingPrompts: [
      { id: "w1", promptEs: "Traduce: 'Quiero agua, por favor'", answerEn: "I want water, please" },
      { id: "w2", promptEs: "Traduce: 'Yo como arroz y pollo'", answerEn: "I eat rice and chicken" },
      { id: "w3", promptEs: "Traduce: 'Un café, por favor'", answerEn: "One coffee, please" },
    ],
  },
  {
    id: "rutina",
    title: "Rutina Diaria",
    emoji: "🕒",
    description: "Describe tu día en inglés.",
    color: "from-sky-400 to-sky-600",
    vocab: [
      { id: "wakeup", emoji: "⏰", en: "Wake up", es: "Despertar", exampleEn: "I wake up at six.", exampleEs: "Me despierto a las seis." },
      { id: "work", emoji: "💼", en: "Work", es: "Trabajar", exampleEn: "I work every day.", exampleEs: "Trabajo todos los días." },
      { id: "eat", emoji: "🍴", en: "Eat", es: "Comer", exampleEn: "I eat lunch at noon.", exampleEs: "Almuerzo al mediodía." },
      { id: "study", emoji: "📖", en: "Study", es: "Estudiar", exampleEn: "I study English.", exampleEs: "Estudio inglés." },
      { id: "sleep", emoji: "😴", en: "Sleep", es: "Dormir", exampleEn: "I sleep at ten.", exampleEs: "Duermo a las diez." },
      { id: "home", emoji: "🏠", en: "Home", es: "Casa", exampleEn: "I go home.", exampleEs: "Voy a casa." },
    ],
    writingPrompts: [
      { id: "w1", promptEs: "Traduce: 'Me despierto a las seis'", answerEn: "I wake up at six" },
      { id: "w2", promptEs: "Traduce: 'Estudio inglés todos los días'", answerEn: "I study English every day" },
      { id: "w3", promptEs: "Traduce: 'Voy a casa'", answerEn: "I go home" },
    ],
  },
  {
    id: "trabajo",
    title: "En el Trabajo",
    emoji: "🛠️",
    description: "Frases útiles para el trabajo.",
    color: "from-violet-400 to-violet-600",
    vocab: [
      { id: "job", emoji: "🧰", en: "Job", es: "Trabajo/empleo", exampleEn: "I have a new job.", exampleEs: "Tengo un nuevo trabajo." },
      { id: "boss", emoji: "🧑‍💼", en: "Boss", es: "Jefe", exampleEn: "My boss is nice.", exampleEs: "Mi jefe es amable." },
      { id: "money", emoji: "💵", en: "Money", es: "Dinero", exampleEn: "I need money.", exampleEs: "Necesito dinero." },
      { id: "help", emoji: "🆘", en: "Help", es: "Ayuda", exampleEn: "Can you help me?", exampleEs: "¿Puedes ayudarme?" },
      { id: "understand", emoji: "🧠", en: "Understand", es: "Entender", exampleEn: "I don't understand.", exampleEs: "No entiendo." },
      { id: "again", emoji: "🔁", en: "Again", es: "Otra vez", exampleEn: "Can you repeat again?", exampleEs: "¿Puedes repetir otra vez?" },
    ],
    writingPrompts: [
      { id: "w1", promptEs: "Traduce: '¿Puedes ayudarme?'", answerEn: "Can you help me?" },
      { id: "w2", promptEs: "Traduce: 'No entiendo'", answerEn: "I don't understand" },
      { id: "w3", promptEs: "Traduce: 'Necesito dinero'", answerEn: "I need money" },
    ],
  },
];

export function getUnit(id: string): Unit | undefined {
  return CURRICULUM.find((u) => u.id === id);
}

export function getUnitIndex(id: string): number {
  return CURRICULUM.findIndex((u) => u.id === id);
}
