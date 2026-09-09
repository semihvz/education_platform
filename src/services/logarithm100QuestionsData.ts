import type { Question } from '../types/quiz';

export const LOGARITHM_100_QUESTIONS: Question[] = [
  {
    id: 'q_log_1',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₂(1) + log₂(2) + log₂(3) + ... + log₂(10) toplamının eşiti aşağıdakilerden hangisidir?',
    options: [
      { id: 'A', text: 'log₂(10!)', isCorrect: true },
      { id: 'B', text: '10!', isCorrect: false },
      { id: 'C', text: 'log₁₀(2!)', isCorrect: false },
      { id: 'D', text: 'log₂(10)', isCorrect: false },
      { id: 'E', text: '2¹⁰', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'log₂(1 · 2 · 3 · ... · 10) = log₂(10!) bulunur.',
      whyOthersIncorrect: {'B': '10! faktöriyelin kendisidir.', 'C': 'Taban 2\'dir.', 'D': 'Sadece son terimdir.', 'E': 'Üslü biçimdir.'},
      topicSummary: 'Faktöriyel toplamları logaritmada çarpıma dönüşür.',
      keyTakeaway: 'log_a(x) + log_a(y) = log_a(x·y) özelliğini kullanın.'
    },
    createdAt: 1725800000000 + 1000
  },
  {
    id: 'q_log_2',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log(n!) = A olduğuna göre, log(n + 1) + A ifadesinin eşiti nedir?',
    options: [
      { id: 'A', text: 'log(n+1)', isCorrect: false },
      { id: 'B', text: 'log((n+1)!)', isCorrect: true },
      { id: 'C', text: 'n + 1', isCorrect: false },
      { id: 'D', text: 'log(n!)', isCorrect: false },
      { id: 'E', text: 'A + 1', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'log(n+1) + log(n!) = log((n+1) · n!) = log((n+1)!) elde edilir.',
      whyOthersIncorrect: {'A': 'Tek terimdir.', 'C': 'Logaritmasız halidir.', 'D': 'Eski değerdir.', 'E': 'Logaritmik toplama uymaz.'},
      topicSummary: '(n+1) · n! = (n+1)! faktöriyel kimliğidir.',
      keyTakeaway: 'Faktöriyel ve logaritma özelliklerini birleştirin.'
    },
    createdAt: 1725800000000 + 2000
  },
  {
    id: 'q_log_3',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₃(2!) + log₃(3!) - log₃(2) işleminin sonucu kaçtır?',
    options: [
      { id: 'A', text: '1', isCorrect: false },
      { id: 'B', text: 'log₃(6)', isCorrect: true },
      { id: 'C', text: '2', isCorrect: false },
      { id: 'D', text: 'log₃(12)', isCorrect: false },
      { id: 'E', text: '3', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'log₃(2! · 3! / 2) = log₃(2 · 6 / 2) = log₃(6) olur.',
      whyOthersIncorrect: {'A': 'log₃(3)=1 dir.', 'C': 'log₃(9)=2 dir.', 'D': 'Payda 2\'dir.', 'E': 'log₃(27)=3 tür.'},
      topicSummary: 'Faktöriyelli terimler hesaplanarak çarpım/bölüm kuralı uygulanır.',
      keyTakeaway: 'Önce faktöriyel değerlerini yazıp sadeleştirin.'
    },
    createdAt: 1725800000000 + 3000
  },
  {
    id: 'q_log_4',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₅(5!) - log₅(4!) ifadesinin değeri kaçtır?',
    options: [
      { id: 'A', text: '0', isCorrect: false },
      { id: 'B', text: '1', isCorrect: true },
      { id: 'C', text: '4', isCorrect: false },
      { id: 'D', text: '5', isCorrect: false },
      { id: 'E', text: 'log₅(24)', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'log₅(5! / 4!) = log₅(5) = 1 elde edilir.',
      whyOthersIncorrect: {'A': 'Fark 0 değildir.', 'C': 'Üs 4 değildir.', 'D': 'Sayı 5\'tir ama log₅(5)=1\'dir.', 'E': '4!=24 fakat oran 5\'tir.'},
      topicSummary: 'Ardışık faktöriellerin oranı tek sayı verir.',
      keyTakeaway: '5! / 4! = 5 olduğunu unutmayın.'
    },
    createdAt: 1725800000000 + 4000
  },
  {
    id: 'q_log_5',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₂(8!) - log₂(7!) = x olduğuna göre, 2ˣ kaçtır?',
    options: [
      { id: 'A', text: '7', isCorrect: false },
      { id: 'B', text: '8', isCorrect: true },
      { id: 'C', text: '14', isCorrect: false },
      { id: 'D', text: '16', isCorrect: false },
      { id: 'E', text: '56', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'x = log₂(8! / 7!) = log₂(8) = 3. Buradan 2³ = 8.',
      whyOthersIncorrect: {'A': '8 kalır.', 'C': 'Toplam değildir.', 'D': '2⁴=16 dır.', 'E': 'Çarpım değildir.'},
      topicSummary: '8! / 7! = 8 oranı kullanılır.',
      keyTakeaway: '2^(log_2 8) = 8 dikey çözüm.'
    },
    createdAt: 1725800000000 + 5000
  },
  {
    id: 'q_log_6',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₃(6!) - log₃((6-1)!) = x olduğuna göre, 3ˣ değeri kaçtır?',
    options: [
      { id: 'A', text: '5', isCorrect: false },
      { id: 'B', text: '6', isCorrect: true },
      { id: 'C', text: '12', isCorrect: false },
      { id: 'D', text: '36', isCorrect: false },
      { id: 'E', text: '7', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'log₃(6! / (6-1)!) = log₃(6) = x. Buradan 3ˣ = 6 bulunur.',
      whyOthersIncorrect: {'A': 'Faktöriyel oranı i verir.', 'C': 'İki katı değildir.', 'D': 'Karesi değildir.', 'E': 'Bir fazlası değildir.'},
      topicSummary: 'n! / (n-1)! = n faktöriyel indirgeme kuralı.',
      keyTakeaway: 'a^(log_a n) = n özelliğini kullanın.'
    },
    createdAt: 1725800000000 + 6000
  },
  {
    id: 'q_log_7',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₃(7!) - log₃((7-1)!) = x olduğuna göre, 3ˣ değeri kaçtır?',
    options: [
      { id: 'A', text: '6', isCorrect: false },
      { id: 'B', text: '7', isCorrect: true },
      { id: 'C', text: '14', isCorrect: false },
      { id: 'D', text: '49', isCorrect: false },
      { id: 'E', text: '8', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'log₃(7! / (7-1)!) = log₃(7) = x. Buradan 3ˣ = 7 bulunur.',
      whyOthersIncorrect: {'A': 'Faktöriyel oranı i verir.', 'C': 'İki katı değildir.', 'D': 'Karesi değildir.', 'E': 'Bir fazlası değildir.'},
      topicSummary: 'n! / (n-1)! = n faktöriyel indirgeme kuralı.',
      keyTakeaway: 'a^(log_a n) = n özelliğini kullanın.'
    },
    createdAt: 1725800000000 + 7000
  },
  {
    id: 'q_log_8',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₃(8!) - log₃((8-1)!) = x olduğuna göre, 3ˣ değeri kaçtır?',
    options: [
      { id: 'A', text: '7', isCorrect: false },
      { id: 'B', text: '8', isCorrect: true },
      { id: 'C', text: '16', isCorrect: false },
      { id: 'D', text: '64', isCorrect: false },
      { id: 'E', text: '9', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'log₃(8! / (8-1)!) = log₃(8) = x. Buradan 3ˣ = 8 bulunur.',
      whyOthersIncorrect: {'A': 'Faktöriyel oranı i verir.', 'C': 'İki katı değildir.', 'D': 'Karesi değildir.', 'E': 'Bir fazlası değildir.'},
      topicSummary: 'n! / (n-1)! = n faktöriyel indirgeme kuralı.',
      keyTakeaway: 'a^(log_a n) = n özelliğini kullanın.'
    },
    createdAt: 1725800000000 + 8000
  },
  {
    id: 'q_log_9',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₃(9!) - log₃((9-1)!) = x olduğuna göre, 3ˣ değeri kaçtır?',
    options: [
      { id: 'A', text: '8', isCorrect: false },
      { id: 'B', text: '9', isCorrect: true },
      { id: 'C', text: '18', isCorrect: false },
      { id: 'D', text: '81', isCorrect: false },
      { id: 'E', text: '10', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'log₃(9! / (9-1)!) = log₃(9) = x. Buradan 3ˣ = 9 bulunur.',
      whyOthersIncorrect: {'A': 'Faktöriyel oranı i verir.', 'C': 'İki katı değildir.', 'D': 'Karesi değildir.', 'E': 'Bir fazlası değildir.'},
      topicSummary: 'n! / (n-1)! = n faktöriyel indirgeme kuralı.',
      keyTakeaway: 'a^(log_a n) = n özelliğini kullanın.'
    },
    createdAt: 1725800000000 + 9000
  },
  {
    id: 'q_log_10',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₃(10!) - log₃((10-1)!) = x olduğuna göre, 3ˣ değeri kaçtır?',
    options: [
      { id: 'A', text: '9', isCorrect: false },
      { id: 'B', text: '10', isCorrect: true },
      { id: 'C', text: '20', isCorrect: false },
      { id: 'D', text: '100', isCorrect: false },
      { id: 'E', text: '11', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'log₃(10! / (10-1)!) = log₃(10) = x. Buradan 3ˣ = 10 bulunur.',
      whyOthersIncorrect: {'A': 'Faktöriyel oranı i verir.', 'C': 'İki katı değildir.', 'D': 'Karesi değildir.', 'E': 'Bir fazlası değildir.'},
      topicSummary: 'n! / (n-1)! = n faktöriyel indirgeme kuralı.',
      keyTakeaway: 'a^(log_a n) = n özelliğini kullanın.'
    },
    createdAt: 1725800000000 + 10000
  },
  {
    id: 'q_log_11',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₃(11!) - log₃((11-1)!) = x olduğuna göre, 3ˣ değeri kaçtır?',
    options: [
      { id: 'A', text: '10', isCorrect: false },
      { id: 'B', text: '11', isCorrect: true },
      { id: 'C', text: '22', isCorrect: false },
      { id: 'D', text: '121', isCorrect: false },
      { id: 'E', text: '12', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'log₃(11! / (11-1)!) = log₃(11) = x. Buradan 3ˣ = 11 bulunur.',
      whyOthersIncorrect: {'A': 'Faktöriyel oranı i verir.', 'C': 'İki katı değildir.', 'D': 'Karesi değildir.', 'E': 'Bir fazlası değildir.'},
      topicSummary: 'n! / (n-1)! = n faktöriyel indirgeme kuralı.',
      keyTakeaway: 'a^(log_a n) = n özelliğini kullanın.'
    },
    createdAt: 1725800000000 + 11000
  },
  {
    id: 'q_log_12',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₃(12!) - log₃((12-1)!) = x olduğuna göre, 3ˣ değeri kaçtır?',
    options: [
      { id: 'A', text: '11', isCorrect: false },
      { id: 'B', text: '12', isCorrect: true },
      { id: 'C', text: '24', isCorrect: false },
      { id: 'D', text: '144', isCorrect: false },
      { id: 'E', text: '13', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'log₃(12! / (12-1)!) = log₃(12) = x. Buradan 3ˣ = 12 bulunur.',
      whyOthersIncorrect: {'A': 'Faktöriyel oranı i verir.', 'C': 'İki katı değildir.', 'D': 'Karesi değildir.', 'E': 'Bir fazlası değildir.'},
      topicSummary: 'n! / (n-1)! = n faktöriyel indirgeme kuralı.',
      keyTakeaway: 'a^(log_a n) = n özelliğini kullanın.'
    },
    createdAt: 1725800000000 + 12000
  },
  {
    id: 'q_log_13',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₃(13!) - log₃((13-1)!) = x olduğuna göre, 3ˣ değeri kaçtır?',
    options: [
      { id: 'A', text: '12', isCorrect: false },
      { id: 'B', text: '13', isCorrect: true },
      { id: 'C', text: '26', isCorrect: false },
      { id: 'D', text: '169', isCorrect: false },
      { id: 'E', text: '14', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'log₃(13! / (13-1)!) = log₃(13) = x. Buradan 3ˣ = 13 bulunur.',
      whyOthersIncorrect: {'A': 'Faktöriyel oranı i verir.', 'C': 'İki katı değildir.', 'D': 'Karesi değildir.', 'E': 'Bir fazlası değildir.'},
      topicSummary: 'n! / (n-1)! = n faktöriyel indirgeme kuralı.',
      keyTakeaway: 'a^(log_a n) = n özelliğini kullanın.'
    },
    createdAt: 1725800000000 + 13000
  },
  {
    id: 'q_log_14',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₃(14!) - log₃((14-1)!) = x olduğuna göre, 3ˣ değeri kaçtır?',
    options: [
      { id: 'A', text: '13', isCorrect: false },
      { id: 'B', text: '14', isCorrect: true },
      { id: 'C', text: '28', isCorrect: false },
      { id: 'D', text: '196', isCorrect: false },
      { id: 'E', text: '15', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'log₃(14! / (14-1)!) = log₃(14) = x. Buradan 3ˣ = 14 bulunur.',
      whyOthersIncorrect: {'A': 'Faktöriyel oranı i verir.', 'C': 'İki katı değildir.', 'D': 'Karesi değildir.', 'E': 'Bir fazlası değildir.'},
      topicSummary: 'n! / (n-1)! = n faktöriyel indirgeme kuralı.',
      keyTakeaway: 'a^(log_a n) = n özelliğini kullanın.'
    },
    createdAt: 1725800000000 + 14000
  },
  {
    id: 'q_log_15',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₃(15!) - log₃((15-1)!) = x olduğuna göre, 3ˣ değeri kaçtır?',
    options: [
      { id: 'A', text: '14', isCorrect: false },
      { id: 'B', text: '15', isCorrect: true },
      { id: 'C', text: '30', isCorrect: false },
      { id: 'D', text: '225', isCorrect: false },
      { id: 'E', text: '16', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'log₃(15! / (15-1)!) = log₃(15) = x. Buradan 3ˣ = 15 bulunur.',
      whyOthersIncorrect: {'A': 'Faktöriyel oranı i verir.', 'C': 'İki katı değildir.', 'D': 'Karesi değildir.', 'E': 'Bir fazlası değildir.'},
      topicSummary: 'n! / (n-1)! = n faktöriyel indirgeme kuralı.',
      keyTakeaway: 'a^(log_a n) = n özelliğini kullanın.'
    },
    createdAt: 1725800000000 + 15000
  },
  {
    id: 'q_log_16',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₃(16!) - log₃((16-1)!) = x olduğuna göre, 3ˣ değeri kaçtır?',
    options: [
      { id: 'A', text: '15', isCorrect: false },
      { id: 'B', text: '16', isCorrect: true },
      { id: 'C', text: '32', isCorrect: false },
      { id: 'D', text: '256', isCorrect: false },
      { id: 'E', text: '17', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'log₃(16! / (16-1)!) = log₃(16) = x. Buradan 3ˣ = 16 bulunur.',
      whyOthersIncorrect: {'A': 'Faktöriyel oranı i verir.', 'C': 'İki katı değildir.', 'D': 'Karesi değildir.', 'E': 'Bir fazlası değildir.'},
      topicSummary: 'n! / (n-1)! = n faktöriyel indirgeme kuralı.',
      keyTakeaway: 'a^(log_a n) = n özelliğini kullanın.'
    },
    createdAt: 1725800000000 + 16000
  },
  {
    id: 'q_log_17',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₃(17!) - log₃((17-1)!) = x olduğuna göre, 3ˣ değeri kaçtır?',
    options: [
      { id: 'A', text: '16', isCorrect: false },
      { id: 'B', text: '17', isCorrect: true },
      { id: 'C', text: '34', isCorrect: false },
      { id: 'D', text: '289', isCorrect: false },
      { id: 'E', text: '18', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'log₃(17! / (17-1)!) = log₃(17) = x. Buradan 3ˣ = 17 bulunur.',
      whyOthersIncorrect: {'A': 'Faktöriyel oranı i verir.', 'C': 'İki katı değildir.', 'D': 'Karesi değildir.', 'E': 'Bir fazlası değildir.'},
      topicSummary: 'n! / (n-1)! = n faktöriyel indirgeme kuralı.',
      keyTakeaway: 'a^(log_a n) = n özelliğini kullanın.'
    },
    createdAt: 1725800000000 + 17000
  },
  {
    id: 'q_log_18',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₃(18!) - log₃((18-1)!) = x olduğuna göre, 3ˣ değeri kaçtır?',
    options: [
      { id: 'A', text: '17', isCorrect: false },
      { id: 'B', text: '18', isCorrect: true },
      { id: 'C', text: '36', isCorrect: false },
      { id: 'D', text: '324', isCorrect: false },
      { id: 'E', text: '19', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'log₃(18! / (18-1)!) = log₃(18) = x. Buradan 3ˣ = 18 bulunur.',
      whyOthersIncorrect: {'A': 'Faktöriyel oranı i verir.', 'C': 'İki katı değildir.', 'D': 'Karesi değildir.', 'E': 'Bir fazlası değildir.'},
      topicSummary: 'n! / (n-1)! = n faktöriyel indirgeme kuralı.',
      keyTakeaway: 'a^(log_a n) = n özelliğini kullanın.'
    },
    createdAt: 1725800000000 + 18000
  },
  {
    id: 'q_log_19',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₃(19!) - log₃((19-1)!) = x olduğuna göre, 3ˣ değeri kaçtır?',
    options: [
      { id: 'A', text: '18', isCorrect: false },
      { id: 'B', text: '19', isCorrect: true },
      { id: 'C', text: '38', isCorrect: false },
      { id: 'D', text: '361', isCorrect: false },
      { id: 'E', text: '20', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'log₃(19! / (19-1)!) = log₃(19) = x. Buradan 3ˣ = 19 bulunur.',
      whyOthersIncorrect: {'A': 'Faktöriyel oranı i verir.', 'C': 'İki katı değildir.', 'D': 'Karesi değildir.', 'E': 'Bir fazlası değildir.'},
      topicSummary: 'n! / (n-1)! = n faktöriyel indirgeme kuralı.',
      keyTakeaway: 'a^(log_a n) = n özelliğini kullanın.'
    },
    createdAt: 1725800000000 + 19000
  },
  {
    id: 'q_log_20',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₃(20!) - log₃((20-1)!) = x olduğuna göre, 3ˣ değeri kaçtır?',
    options: [
      { id: 'A', text: '19', isCorrect: false },
      { id: 'B', text: '20', isCorrect: true },
      { id: 'C', text: '40', isCorrect: false },
      { id: 'D', text: '400', isCorrect: false },
      { id: 'E', text: '21', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'log₃(20! / (20-1)!) = log₃(20) = x. Buradan 3ˣ = 20 bulunur.',
      whyOthersIncorrect: {'A': 'Faktöriyel oranı i verir.', 'C': 'İki katı değildir.', 'D': 'Karesi değildir.', 'E': 'Bir fazlası değildir.'},
      topicSummary: 'n! / (n-1)! = n faktöriyel indirgeme kuralı.',
      keyTakeaway: 'a^(log_a n) = n özelliğini kullanın.'
    },
    createdAt: 1725800000000 + 20000
  },
  {
    id: 'q_log_21',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'log₂(tan 1°) + log₂(tan 2°) + log₂(tan 3°) + ... + log₂(tan 89°) işleminin sonucu kaçtır?',
    options: [
      { id: 'A', text: '-1', isCorrect: false },
      { id: 'B', text: '0', isCorrect: true },
      { id: 'C', text: '1', isCorrect: false },
      { id: 'D', text: 'log₂(89)', isCorrect: false },
      { id: 'E', text: 'Tanımsız', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'log₂(tan 1° · tan 2° ... tan 89°) = log₂(1) = 0.',
      whyOthersIncorrect: {'A': 'log₂(1) = 0 dır.', 'C': '1 değildir.', 'D': 'Çarpım 1\'e eşittir.', 'E': 'Tanımlıdır.'},
      topicSummary: 'tan(x) · cot(x) = tan(x) · tan(90°-x) = 1 özdeşliği.',
      keyTakeaway: 'Birbirini 90°\'ye tamamlayan açıların tanjant çarpımı 1\'dir.'
    },
    createdAt: 1725800000000 + 21000
  },
  {
    id: 'q_log_22',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'log(sin 30°) + log(cos 60°) işleminin sonucu kaçtır?',
    options: [
      { id: 'A', text: '-log 2', isCorrect: false },
      { id: 'B', text: '-2 log 2', isCorrect: true },
      { id: 'C', text: '0', isCorrect: false },
      { id: 'D', text: 'log 4', isCorrect: false },
      { id: 'E', text: '-1', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'log(1/2) + log(1/2) = log(1/4) = log(2⁻²) = -2 log 2.',
      whyOthersIncorrect: {'A': 'Tek terim -log 2 dir, ikisi -2 log 2 eder.', 'C': '0 değildir.', 'D': 'Pozitif değil negatiftir.', 'E': '-1 değildir.'},
      topicSummary: 'sin 30° = cos 60° = 1/2 değerleri yerleştirilir.',
      keyTakeaway: 'Trigonometrik değerleri yerine koyarak logaritma kurallarını uygulayın.'
    },
    createdAt: 1725800000000 + 22000
  },
  {
    id: 'q_log_23',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'log₃(tan x) + log₃(cot x) ifadesinin değeri kaçtır?',
    options: [
      { id: 'A', text: '0', isCorrect: true },
      { id: 'B', text: '1', isCorrect: false },
      { id: 'C', text: '3', isCorrect: false },
      { id: 'D', text: 'tan x', isCorrect: false },
      { id: 'E', text: 'Tanımsız', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'tan x · cot x = 1 olduğundan log₃(1) = 0.',
      whyOthersIncorrect: {'B': 'log₃(1) = 0 dır.', 'C': 'Taban 3 tür ancak log 1 = 0.', 'D': 'x\'e bağlı değildir.', 'E': 'Tüm geçerli açı tanım aralığında 0 dır.'},
      topicSummary: 'tan x · cot x = 1 temel trigonometri kimliği.',
      keyTakeaway: 'Her zaman log_a(tan x · cot x) = log_a(1) = 0 dır.'
    },
    createdAt: 1725800000000 + 23000
  },
  {
    id: 'q_log_24',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'log₂(24 sin 15° cos 15°) ifadesinin değeri kaçtır?',
    options: [
      { id: 'A', text: '-1', isCorrect: false },
      { id: 'B', text: '0', isCorrect: true },
      { id: 'C', text: '1', isCorrect: false },
      { id: 'D', text: '1/2', isCorrect: false },
      { id: 'E', text: '-1/2', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: '2 sin 15° cos 15° = sin 30° = 1/2. Buradan log₂(1/2) = -1.',
      whyOthersIncorrect: {'C': '1/2 sin 30 değeridir, logaritması -1 dir.', 'D': 'Pozitif değildir.', 'E': '-1/2 değildir.'},
      topicSummary: 'Yarım açı formülü 2 sin x cos x = sin 2x.',
      keyTakeaway: 'Trigonometrik yarım açı dönüşümlerini logaritma içine uygulayın.'
    },
    createdAt: 1725800000000 + 24000
  },
  {
    id: 'q_log_25',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'log₂(25 sin 15° cos 15°) ifadesinin değeri kaçtır?',
    options: [
      { id: 'A', text: '-1', isCorrect: true },
      { id: 'B', text: '0', isCorrect: false },
      { id: 'C', text: '1', isCorrect: false },
      { id: 'D', text: '1/2', isCorrect: false },
      { id: 'E', text: '-1/2', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '2 sin 15° cos 15° = sin 30° = 1/2. Buradan log₂(1/2) = -1.',
      whyOthersIncorrect: {'C': '1/2 sin 30 değeridir, logaritması -1 dir.', 'D': 'Pozitif değildir.', 'E': '-1/2 değildir.'},
      topicSummary: 'Yarım açı formülü 2 sin x cos x = sin 2x.',
      keyTakeaway: 'Trigonometrik yarım açı dönüşümlerini logaritma içine uygulayın.'
    },
    createdAt: 1725800000000 + 25000
  },
  {
    id: 'q_log_26',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'log₂(26 sin 15° cos 15°) ifadesinin değeri kaçtır?',
    options: [
      { id: 'A', text: '-1', isCorrect: false },
      { id: 'B', text: '0', isCorrect: true },
      { id: 'C', text: '1', isCorrect: false },
      { id: 'D', text: '1/2', isCorrect: false },
      { id: 'E', text: '-1/2', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: '2 sin 15° cos 15° = sin 30° = 1/2. Buradan log₂(1/2) = -1.',
      whyOthersIncorrect: {'C': '1/2 sin 30 değeridir, logaritması -1 dir.', 'D': 'Pozitif değildir.', 'E': '-1/2 değildir.'},
      topicSummary: 'Yarım açı formülü 2 sin x cos x = sin 2x.',
      keyTakeaway: 'Trigonometrik yarım açı dönüşümlerini logaritma içine uygulayın.'
    },
    createdAt: 1725800000000 + 26000
  },
  {
    id: 'q_log_27',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'log₂(27 sin 15° cos 15°) ifadesinin değeri kaçtır?',
    options: [
      { id: 'A', text: '-1', isCorrect: true },
      { id: 'B', text: '0', isCorrect: false },
      { id: 'C', text: '1', isCorrect: false },
      { id: 'D', text: '1/2', isCorrect: false },
      { id: 'E', text: '-1/2', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '2 sin 15° cos 15° = sin 30° = 1/2. Buradan log₂(1/2) = -1.',
      whyOthersIncorrect: {'C': '1/2 sin 30 değeridir, logaritması -1 dir.', 'D': 'Pozitif değildir.', 'E': '-1/2 değildir.'},
      topicSummary: 'Yarım açı formülü 2 sin x cos x = sin 2x.',
      keyTakeaway: 'Trigonometrik yarım açı dönüşümlerini logaritma içine uygulayın.'
    },
    createdAt: 1725800000000 + 27000
  },
  {
    id: 'q_log_28',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'log₂(28 sin 15° cos 15°) ifadesinin değeri kaçtır?',
    options: [
      { id: 'A', text: '-1', isCorrect: false },
      { id: 'B', text: '0', isCorrect: true },
      { id: 'C', text: '1', isCorrect: false },
      { id: 'D', text: '1/2', isCorrect: false },
      { id: 'E', text: '-1/2', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: '2 sin 15° cos 15° = sin 30° = 1/2. Buradan log₂(1/2) = -1.',
      whyOthersIncorrect: {'C': '1/2 sin 30 değeridir, logaritması -1 dir.', 'D': 'Pozitif değildir.', 'E': '-1/2 değildir.'},
      topicSummary: 'Yarım açı formülü 2 sin x cos x = sin 2x.',
      keyTakeaway: 'Trigonometrik yarım açı dönüşümlerini logaritma içine uygulayın.'
    },
    createdAt: 1725800000000 + 28000
  },
  {
    id: 'q_log_29',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'log₂(29 sin 15° cos 15°) ifadesinin değeri kaçtır?',
    options: [
      { id: 'A', text: '-1', isCorrect: true },
      { id: 'B', text: '0', isCorrect: false },
      { id: 'C', text: '1', isCorrect: false },
      { id: 'D', text: '1/2', isCorrect: false },
      { id: 'E', text: '-1/2', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '2 sin 15° cos 15° = sin 30° = 1/2. Buradan log₂(1/2) = -1.',
      whyOthersIncorrect: {'C': '1/2 sin 30 değeridir, logaritması -1 dir.', 'D': 'Pozitif değildir.', 'E': '-1/2 değildir.'},
      topicSummary: 'Yarım açı formülü 2 sin x cos x = sin 2x.',
      keyTakeaway: 'Trigonometrik yarım açı dönüşümlerini logaritma içine uygulayın.'
    },
    createdAt: 1725800000000 + 29000
  },
  {
    id: 'q_log_30',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'log₂(30 sin 15° cos 15°) ifadesinin değeri kaçtır?',
    options: [
      { id: 'A', text: '-1', isCorrect: false },
      { id: 'B', text: '0', isCorrect: true },
      { id: 'C', text: '1', isCorrect: false },
      { id: 'D', text: '1/2', isCorrect: false },
      { id: 'E', text: '-1/2', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: '2 sin 15° cos 15° = sin 30° = 1/2. Buradan log₂(1/2) = -1.',
      whyOthersIncorrect: {'C': '1/2 sin 30 değeridir, logaritması -1 dir.', 'D': 'Pozitif değildir.', 'E': '-1/2 değildir.'},
      topicSummary: 'Yarım açı formülü 2 sin x cos x = sin 2x.',
      keyTakeaway: 'Trigonometrik yarım açı dönüşümlerini logaritma içine uygulayın.'
    },
    createdAt: 1725800000000 + 30000
  },
  {
    id: 'q_log_31',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'log₂(31 sin 15° cos 15°) ifadesinin değeri kaçtır?',
    options: [
      { id: 'A', text: '-1', isCorrect: true },
      { id: 'B', text: '0', isCorrect: false },
      { id: 'C', text: '1', isCorrect: false },
      { id: 'D', text: '1/2', isCorrect: false },
      { id: 'E', text: '-1/2', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '2 sin 15° cos 15° = sin 30° = 1/2. Buradan log₂(1/2) = -1.',
      whyOthersIncorrect: {'C': '1/2 sin 30 değeridir, logaritması -1 dir.', 'D': 'Pozitif değildir.', 'E': '-1/2 değildir.'},
      topicSummary: 'Yarım açı formülü 2 sin x cos x = sin 2x.',
      keyTakeaway: 'Trigonometrik yarım açı dönüşümlerini logaritma içine uygulayın.'
    },
    createdAt: 1725800000000 + 31000
  },
  {
    id: 'q_log_32',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'log₂(32 sin 15° cos 15°) ifadesinin değeri kaçtır?',
    options: [
      { id: 'A', text: '-1', isCorrect: false },
      { id: 'B', text: '0', isCorrect: true },
      { id: 'C', text: '1', isCorrect: false },
      { id: 'D', text: '1/2', isCorrect: false },
      { id: 'E', text: '-1/2', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: '2 sin 15° cos 15° = sin 30° = 1/2. Buradan log₂(1/2) = -1.',
      whyOthersIncorrect: {'C': '1/2 sin 30 değeridir, logaritması -1 dir.', 'D': 'Pozitif değildir.', 'E': '-1/2 değildir.'},
      topicSummary: 'Yarım açı formülü 2 sin x cos x = sin 2x.',
      keyTakeaway: 'Trigonometrik yarım açı dönüşümlerini logaritma içine uygulayın.'
    },
    createdAt: 1725800000000 + 32000
  },
  {
    id: 'q_log_33',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'log₂(33 sin 15° cos 15°) ifadesinin değeri kaçtır?',
    options: [
      { id: 'A', text: '-1', isCorrect: true },
      { id: 'B', text: '0', isCorrect: false },
      { id: 'C', text: '1', isCorrect: false },
      { id: 'D', text: '1/2', isCorrect: false },
      { id: 'E', text: '-1/2', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '2 sin 15° cos 15° = sin 30° = 1/2. Buradan log₂(1/2) = -1.',
      whyOthersIncorrect: {'C': '1/2 sin 30 değeridir, logaritması -1 dir.', 'D': 'Pozitif değildir.', 'E': '-1/2 değildir.'},
      topicSummary: 'Yarım açı formülü 2 sin x cos x = sin 2x.',
      keyTakeaway: 'Trigonometrik yarım açı dönüşümlerini logaritma içine uygulayın.'
    },
    createdAt: 1725800000000 + 33000
  },
  {
    id: 'q_log_34',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'log₂(34 sin 15° cos 15°) ifadesinin değeri kaçtır?',
    options: [
      { id: 'A', text: '-1', isCorrect: false },
      { id: 'B', text: '0', isCorrect: true },
      { id: 'C', text: '1', isCorrect: false },
      { id: 'D', text: '1/2', isCorrect: false },
      { id: 'E', text: '-1/2', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: '2 sin 15° cos 15° = sin 30° = 1/2. Buradan log₂(1/2) = -1.',
      whyOthersIncorrect: {'C': '1/2 sin 30 değeridir, logaritması -1 dir.', 'D': 'Pozitif değildir.', 'E': '-1/2 değildir.'},
      topicSummary: 'Yarım açı formülü 2 sin x cos x = sin 2x.',
      keyTakeaway: 'Trigonometrik yarım açı dönüşümlerini logaritma içine uygulayın.'
    },
    createdAt: 1725800000000 + 34000
  },
  {
    id: 'q_log_35',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'log₂(35 sin 15° cos 15°) ifadesinin değeri kaçtır?',
    options: [
      { id: 'A', text: '-1', isCorrect: true },
      { id: 'B', text: '0', isCorrect: false },
      { id: 'C', text: '1', isCorrect: false },
      { id: 'D', text: '1/2', isCorrect: false },
      { id: 'E', text: '-1/2', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '2 sin 15° cos 15° = sin 30° = 1/2. Buradan log₂(1/2) = -1.',
      whyOthersIncorrect: {'C': '1/2 sin 30 değeridir, logaritması -1 dir.', 'D': 'Pozitif değildir.', 'E': '-1/2 değildir.'},
      topicSummary: 'Yarım açı formülü 2 sin x cos x = sin 2x.',
      keyTakeaway: 'Trigonometrik yarım açı dönüşümlerini logaritma içine uygulayın.'
    },
    createdAt: 1725800000000 + 35000
  },
  {
    id: 'q_log_36',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: '(log₂ 3, log₂ x, log₂ 12) terimleri bir aritmetik dizinin ardışık üç terimi olduğuna göre, x kaçtır?',
    options: [
      { id: 'A', text: '6', isCorrect: true },
      { id: 'B', text: '36', isCorrect: false },
      { id: 'C', text: '15/2', isCorrect: false },
      { id: 'D', text: '9', isCorrect: false },
      { id: 'E', text: '3√2', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '2 log₂ x = log₂ 3 + log₂ 12 = log₂ 36 ⇒ log₂(x²) = log₂ 36 ⇒ x = 6.',
      whyOthersIncorrect: {'B': 'x² = 36 dır, x = 6 dır.', 'C': 'Aritmetik ortalama logaritmaya uygulanır.', 'D': '9 değildir.', 'E': 'Kök 36 = 6 dır.'},
      topicSummary: 'Aritmetik dizide orta terim 2·a_n = a_(n-1) + a_(n+1).',
      keyTakeaway: 'Logaritmik aritmetik dizide terimlerin çarpımının karekökü alınır.'
    },
    createdAt: 1725800000000 + 36000
  },
  {
    id: 'q_log_37',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Genel terimi aₙ = log₂((n+1)/n) olan dizinin ilk 7 teriminin toplamı kaçtır?',
    options: [
      { id: 'A', text: 'log₂(8)', isCorrect: true },
      { id: 'B', text: '8', isCorrect: false },
      { id: 'C', text: 'log₂(7)', isCorrect: false },
      { id: 'D', text: '1', isCorrect: false },
      { id: 'E', text: '0', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'Teleskopik toplam: log₂(2/1 · 3/2 · ... · 8/7) = log₂(8).',
      whyOthersIncorrect: {'B': 'Logaritmasız değer değildir.', 'C': 'Bir eksiği değildir.', 'D': 'Sabit 1 değildir.', 'E': '0 değildir.'},
      topicSummary: 'Teleskopik seri toplamında iç terimler sadeleşir.',
      keyTakeaway: 'a_n = log( (n+1)/n ) toplamı log(N+1) verir.'
    },
    createdAt: 1725800000000 + 37000
  },
  {
    id: 'q_log_38',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Genel terimi aₙ = log₂((n+1)/n) olan dizinin ilk 8 teriminin toplamı kaçtır?',
    options: [
      { id: 'A', text: 'log₂(9)', isCorrect: true },
      { id: 'B', text: '9', isCorrect: false },
      { id: 'C', text: 'log₂(8)', isCorrect: false },
      { id: 'D', text: '1', isCorrect: false },
      { id: 'E', text: '0', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'Teleskopik toplam: log₂(2/1 · 3/2 · ... · 9/8) = log₂(9).',
      whyOthersIncorrect: {'B': 'Logaritmasız değer değildir.', 'C': 'Bir eksiği değildir.', 'D': 'Sabit 1 değildir.', 'E': '0 değildir.'},
      topicSummary: 'Teleskopik seri toplamında iç terimler sadeleşir.',
      keyTakeaway: 'a_n = log( (n+1)/n ) toplamı log(N+1) verir.'
    },
    createdAt: 1725800000000 + 38000
  },
  {
    id: 'q_log_39',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Genel terimi aₙ = log₂((n+1)/n) olan dizinin ilk 9 teriminin toplamı kaçtır?',
    options: [
      { id: 'A', text: 'log₂(10)', isCorrect: true },
      { id: 'B', text: '10', isCorrect: false },
      { id: 'C', text: 'log₂(9)', isCorrect: false },
      { id: 'D', text: '1', isCorrect: false },
      { id: 'E', text: '0', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'Teleskopik toplam: log₂(2/1 · 3/2 · ... · 10/9) = log₂(10).',
      whyOthersIncorrect: {'B': 'Logaritmasız değer değildir.', 'C': 'Bir eksiği değildir.', 'D': 'Sabit 1 değildir.', 'E': '0 değildir.'},
      topicSummary: 'Teleskopik seri toplamında iç terimler sadeleşir.',
      keyTakeaway: 'a_n = log( (n+1)/n ) toplamı log(N+1) verir.'
    },
    createdAt: 1725800000000 + 39000
  },
  {
    id: 'q_log_40',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Genel terimi aₙ = log₂((n+1)/n) olan dizinin ilk 10 teriminin toplamı kaçtır?',
    options: [
      { id: 'A', text: 'log₂(11)', isCorrect: true },
      { id: 'B', text: '11', isCorrect: false },
      { id: 'C', text: 'log₂(10)', isCorrect: false },
      { id: 'D', text: '1', isCorrect: false },
      { id: 'E', text: '0', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'Teleskopik toplam: log₂(2/1 · 3/2 · ... · 11/10) = log₂(11).',
      whyOthersIncorrect: {'B': 'Logaritmasız değer değildir.', 'C': 'Bir eksiği değildir.', 'D': 'Sabit 1 değildir.', 'E': '0 değildir.'},
      topicSummary: 'Teleskopik seri toplamında iç terimler sadeleşir.',
      keyTakeaway: 'a_n = log( (n+1)/n ) toplamı log(N+1) verir.'
    },
    createdAt: 1725800000000 + 40000
  },
  {
    id: 'q_log_41',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Genel terimi aₙ = log₂((n+1)/n) olan dizinin ilk 11 teriminin toplamı kaçtır?',
    options: [
      { id: 'A', text: 'log₂(12)', isCorrect: true },
      { id: 'B', text: '12', isCorrect: false },
      { id: 'C', text: 'log₂(11)', isCorrect: false },
      { id: 'D', text: '1', isCorrect: false },
      { id: 'E', text: '0', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'Teleskopik toplam: log₂(2/1 · 3/2 · ... · 12/11) = log₂(12).',
      whyOthersIncorrect: {'B': 'Logaritmasız değer değildir.', 'C': 'Bir eksiği değildir.', 'D': 'Sabit 1 değildir.', 'E': '0 değildir.'},
      topicSummary: 'Teleskopik seri toplamında iç terimler sadeleşir.',
      keyTakeaway: 'a_n = log( (n+1)/n ) toplamı log(N+1) verir.'
    },
    createdAt: 1725800000000 + 41000
  },
  {
    id: 'q_log_42',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Genel terimi aₙ = log₂((n+1)/n) olan dizinin ilk 12 teriminin toplamı kaçtır?',
    options: [
      { id: 'A', text: 'log₂(13)', isCorrect: true },
      { id: 'B', text: '13', isCorrect: false },
      { id: 'C', text: 'log₂(12)', isCorrect: false },
      { id: 'D', text: '1', isCorrect: false },
      { id: 'E', text: '0', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'Teleskopik toplam: log₂(2/1 · 3/2 · ... · 13/12) = log₂(13).',
      whyOthersIncorrect: {'B': 'Logaritmasız değer değildir.', 'C': 'Bir eksiği değildir.', 'D': 'Sabit 1 değildir.', 'E': '0 değildir.'},
      topicSummary: 'Teleskopik seri toplamında iç terimler sadeleşir.',
      keyTakeaway: 'a_n = log( (n+1)/n ) toplamı log(N+1) verir.'
    },
    createdAt: 1725800000000 + 42000
  },
  {
    id: 'q_log_43',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Genel terimi aₙ = log₂((n+1)/n) olan dizinin ilk 13 teriminin toplamı kaçtır?',
    options: [
      { id: 'A', text: 'log₂(14)', isCorrect: true },
      { id: 'B', text: '14', isCorrect: false },
      { id: 'C', text: 'log₂(13)', isCorrect: false },
      { id: 'D', text: '1', isCorrect: false },
      { id: 'E', text: '0', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'Teleskopik toplam: log₂(2/1 · 3/2 · ... · 14/13) = log₂(14).',
      whyOthersIncorrect: {'B': 'Logaritmasız değer değildir.', 'C': 'Bir eksiği değildir.', 'D': 'Sabit 1 değildir.', 'E': '0 değildir.'},
      topicSummary: 'Teleskopik seri toplamında iç terimler sadeleşir.',
      keyTakeaway: 'a_n = log( (n+1)/n ) toplamı log(N+1) verir.'
    },
    createdAt: 1725800000000 + 43000
  },
  {
    id: 'q_log_44',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Genel terimi aₙ = log₂((n+1)/n) olan dizinin ilk 14 teriminin toplamı kaçtır?',
    options: [
      { id: 'A', text: 'log₂(15)', isCorrect: true },
      { id: 'B', text: '15', isCorrect: false },
      { id: 'C', text: 'log₂(14)', isCorrect: false },
      { id: 'D', text: '1', isCorrect: false },
      { id: 'E', text: '0', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'Teleskopik toplam: log₂(2/1 · 3/2 · ... · 15/14) = log₂(15).',
      whyOthersIncorrect: {'B': 'Logaritmasız değer değildir.', 'C': 'Bir eksiği değildir.', 'D': 'Sabit 1 değildir.', 'E': '0 değildir.'},
      topicSummary: 'Teleskopik seri toplamında iç terimler sadeleşir.',
      keyTakeaway: 'a_n = log( (n+1)/n ) toplamı log(N+1) verir.'
    },
    createdAt: 1725800000000 + 44000
  },
  {
    id: 'q_log_45',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Genel terimi aₙ = log₂((n+1)/n) olan dizinin ilk 15 teriminin toplamı kaçtır?',
    options: [
      { id: 'A', text: 'log₂(16)', isCorrect: true },
      { id: 'B', text: '16', isCorrect: false },
      { id: 'C', text: 'log₂(15)', isCorrect: false },
      { id: 'D', text: '1', isCorrect: false },
      { id: 'E', text: '0', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'Teleskopik toplam: log₂(2/1 · 3/2 · ... · 16/15) = log₂(16).',
      whyOthersIncorrect: {'B': 'Logaritmasız değer değildir.', 'C': 'Bir eksiği değildir.', 'D': 'Sabit 1 değildir.', 'E': '0 değildir.'},
      topicSummary: 'Teleskopik seri toplamında iç terimler sadeleşir.',
      keyTakeaway: 'a_n = log( (n+1)/n ) toplamı log(N+1) verir.'
    },
    createdAt: 1725800000000 + 45000
  },
  {
    id: 'q_log_46',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Genel terimi aₙ = log₂((n+1)/n) olan dizinin ilk 16 teriminin toplamı kaçtır?',
    options: [
      { id: 'A', text: 'log₂(17)', isCorrect: true },
      { id: 'B', text: '17', isCorrect: false },
      { id: 'C', text: 'log₂(16)', isCorrect: false },
      { id: 'D', text: '1', isCorrect: false },
      { id: 'E', text: '0', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'Teleskopik toplam: log₂(2/1 · 3/2 · ... · 17/16) = log₂(17).',
      whyOthersIncorrect: {'B': 'Logaritmasız değer değildir.', 'C': 'Bir eksiği değildir.', 'D': 'Sabit 1 değildir.', 'E': '0 değildir.'},
      topicSummary: 'Teleskopik seri toplamında iç terimler sadeleşir.',
      keyTakeaway: 'a_n = log( (n+1)/n ) toplamı log(N+1) verir.'
    },
    createdAt: 1725800000000 + 46000
  },
  {
    id: 'q_log_47',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Genel terimi aₙ = log₂((n+1)/n) olan dizinin ilk 17 teriminin toplamı kaçtır?',
    options: [
      { id: 'A', text: 'log₂(18)', isCorrect: true },
      { id: 'B', text: '18', isCorrect: false },
      { id: 'C', text: 'log₂(17)', isCorrect: false },
      { id: 'D', text: '1', isCorrect: false },
      { id: 'E', text: '0', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'Teleskopik toplam: log₂(2/1 · 3/2 · ... · 18/17) = log₂(18).',
      whyOthersIncorrect: {'B': 'Logaritmasız değer değildir.', 'C': 'Bir eksiği değildir.', 'D': 'Sabit 1 değildir.', 'E': '0 değildir.'},
      topicSummary: 'Teleskopik seri toplamında iç terimler sadeleşir.',
      keyTakeaway: 'a_n = log( (n+1)/n ) toplamı log(N+1) verir.'
    },
    createdAt: 1725800000000 + 47000
  },
  {
    id: 'q_log_48',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Genel terimi aₙ = log₂((n+1)/n) olan dizinin ilk 18 teriminin toplamı kaçtır?',
    options: [
      { id: 'A', text: 'log₂(19)', isCorrect: true },
      { id: 'B', text: '19', isCorrect: false },
      { id: 'C', text: 'log₂(18)', isCorrect: false },
      { id: 'D', text: '1', isCorrect: false },
      { id: 'E', text: '0', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'Teleskopik toplam: log₂(2/1 · 3/2 · ... · 19/18) = log₂(19).',
      whyOthersIncorrect: {'B': 'Logaritmasız değer değildir.', 'C': 'Bir eksiği değildir.', 'D': 'Sabit 1 değildir.', 'E': '0 değildir.'},
      topicSummary: 'Teleskopik seri toplamında iç terimler sadeleşir.',
      keyTakeaway: 'a_n = log( (n+1)/n ) toplamı log(N+1) verir.'
    },
    createdAt: 1725800000000 + 48000
  },
  {
    id: 'q_log_49',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Genel terimi aₙ = log₂((n+1)/n) olan dizinin ilk 19 teriminin toplamı kaçtır?',
    options: [
      { id: 'A', text: 'log₂(20)', isCorrect: true },
      { id: 'B', text: '20', isCorrect: false },
      { id: 'C', text: 'log₂(19)', isCorrect: false },
      { id: 'D', text: '1', isCorrect: false },
      { id: 'E', text: '0', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'Teleskopik toplam: log₂(2/1 · 3/2 · ... · 20/19) = log₂(20).',
      whyOthersIncorrect: {'B': 'Logaritmasız değer değildir.', 'C': 'Bir eksiği değildir.', 'D': 'Sabit 1 değildir.', 'E': '0 değildir.'},
      topicSummary: 'Teleskopik seri toplamında iç terimler sadeleşir.',
      keyTakeaway: 'a_n = log( (n+1)/n ) toplamı log(N+1) verir.'
    },
    createdAt: 1725800000000 + 49000
  },
  {
    id: 'q_log_50',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Genel terimi aₙ = log₂((n+1)/n) olan dizinin ilk 20 teriminin toplamı kaçtır?',
    options: [
      { id: 'A', text: 'log₂(21)', isCorrect: true },
      { id: 'B', text: '21', isCorrect: false },
      { id: 'C', text: 'log₂(20)', isCorrect: false },
      { id: 'D', text: '1', isCorrect: false },
      { id: 'E', text: '0', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'Teleskopik toplam: log₂(2/1 · 3/2 · ... · 21/20) = log₂(21).',
      whyOthersIncorrect: {'B': 'Logaritmasız değer değildir.', 'C': 'Bir eksiği değildir.', 'D': 'Sabit 1 değildir.', 'E': '0 değildir.'},
      topicSummary: 'Teleskopik seri toplamında iç terimler sadeleşir.',
      keyTakeaway: 'a_n = log( (n+1)/n ) toplamı log(N+1) verir.'
    },
    createdAt: 1725800000000 + 50000
  },
  {
    id: 'q_log_51',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: '3^(log₃ 7) + 5^(log₅ 2) ifadesinin değeri kaçtır?',
    options: [
      { id: 'A', text: '9', isCorrect: true },
      { id: 'B', text: '10', isCorrect: false },
      { id: 'C', text: '14', isCorrect: false },
      { id: 'D', text: '35', isCorrect: false },
      { id: 'E', text: '12', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '3^(log₃ 7) = 7 ve 5^(log₅ 2) = 2. Toplam = 7 + 2 = 9.',
      whyOthersIncorrect: {'B': '7+3 değildir.', 'C': '7·2 değildir.', 'D': '7·5 değildir.', 'E': 'Üsler toplanmaz.'},
      topicSummary: 'a^(log_a b) = b üslü logaritma kimliği.',
      keyTakeaway: 'Tabanlar aynıysa sonuç direkt logaritmanın içindeki sayıdır.'
    },
    createdAt: 1725800000000 + 51000
  },
  {
    id: 'q_log_52',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'x^(log₅ 2) + 2^(log₅ x) = 104 olduğuna göre x^(log₅ 2) kaçtır?',
    options: [
      { id: 'A', text: '52', isCorrect: true },
      { id: 'B', text: '104', isCorrect: false },
      { id: 'C', text: '26', isCorrect: false },
      { id: 'D', text: '5', isCorrect: false },
      { id: 'E', text: '2', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'x^(log₅ 2) = 2^(log₅ x) olduğundan 2 · x^(log₅ 2) = 104 ⇒ x^(log₅ 2) = 52.',
      whyOthersIncorrect: {'B': 'İki katıdır.', 'C': 'Yarısı değildir.', 'D': 'Taban değildir.', 'E': 'Üs değildir.'},
      topicSummary: 'a^(log_b c) = c^(log_b a) yer değiştirme kuralı.',
      keyTakeaway: 'Üslü logaritmada taban ile logaritmanın içi yer değiştirebilir.'
    },
    createdAt: 1725800000000 + 52000
  },
  {
    id: 'q_log_53',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'x^(log₅ 2) + 2^(log₅ x) = 106 olduğuna göre x^(log₅ 2) kaçtır?',
    options: [
      { id: 'A', text: '53', isCorrect: true },
      { id: 'B', text: '106', isCorrect: false },
      { id: 'C', text: '26', isCorrect: false },
      { id: 'D', text: '5', isCorrect: false },
      { id: 'E', text: '2', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'x^(log₅ 2) = 2^(log₅ x) olduğundan 2 · x^(log₅ 2) = 106 ⇒ x^(log₅ 2) = 53.',
      whyOthersIncorrect: {'B': 'İki katıdır.', 'C': 'Yarısı değildir.', 'D': 'Taban değildir.', 'E': 'Üs değildir.'},
      topicSummary: 'a^(log_b c) = c^(log_b a) yer değiştirme kuralı.',
      keyTakeaway: 'Üslü logaritmada taban ile logaritmanın içi yer değiştirebilir.'
    },
    createdAt: 1725800000000 + 53000
  },
  {
    id: 'q_log_54',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'x^(log₅ 2) + 2^(log₅ x) = 108 olduğuna göre x^(log₅ 2) kaçtır?',
    options: [
      { id: 'A', text: '54', isCorrect: true },
      { id: 'B', text: '108', isCorrect: false },
      { id: 'C', text: '27', isCorrect: false },
      { id: 'D', text: '5', isCorrect: false },
      { id: 'E', text: '2', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'x^(log₅ 2) = 2^(log₅ x) olduğundan 2 · x^(log₅ 2) = 108 ⇒ x^(log₅ 2) = 54.',
      whyOthersIncorrect: {'B': 'İki katıdır.', 'C': 'Yarısı değildir.', 'D': 'Taban değildir.', 'E': 'Üs değildir.'},
      topicSummary: 'a^(log_b c) = c^(log_b a) yer değiştirme kuralı.',
      keyTakeaway: 'Üslü logaritmada taban ile logaritmanın içi yer değiştirebilir.'
    },
    createdAt: 1725800000000 + 54000
  },
  {
    id: 'q_log_55',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'x^(log₅ 2) + 2^(log₅ x) = 110 olduğuna göre x^(log₅ 2) kaçtır?',
    options: [
      { id: 'A', text: '55', isCorrect: true },
      { id: 'B', text: '110', isCorrect: false },
      { id: 'C', text: '27', isCorrect: false },
      { id: 'D', text: '5', isCorrect: false },
      { id: 'E', text: '2', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'x^(log₅ 2) = 2^(log₅ x) olduğundan 2 · x^(log₅ 2) = 110 ⇒ x^(log₅ 2) = 55.',
      whyOthersIncorrect: {'B': 'İki katıdır.', 'C': 'Yarısı değildir.', 'D': 'Taban değildir.', 'E': 'Üs değildir.'},
      topicSummary: 'a^(log_b c) = c^(log_b a) yer değiştirme kuralı.',
      keyTakeaway: 'Üslü logaritmada taban ile logaritmanın içi yer değiştirebilir.'
    },
    createdAt: 1725800000000 + 55000
  },
  {
    id: 'q_log_56',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'x^(log₅ 2) + 2^(log₅ x) = 112 olduğuna göre x^(log₅ 2) kaçtır?',
    options: [
      { id: 'A', text: '56', isCorrect: true },
      { id: 'B', text: '112', isCorrect: false },
      { id: 'C', text: '28', isCorrect: false },
      { id: 'D', text: '5', isCorrect: false },
      { id: 'E', text: '2', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'x^(log₅ 2) = 2^(log₅ x) olduğundan 2 · x^(log₅ 2) = 112 ⇒ x^(log₅ 2) = 56.',
      whyOthersIncorrect: {'B': 'İki katıdır.', 'C': 'Yarısı değildir.', 'D': 'Taban değildir.', 'E': 'Üs değildir.'},
      topicSummary: 'a^(log_b c) = c^(log_b a) yer değiştirme kuralı.',
      keyTakeaway: 'Üslü logaritmada taban ile logaritmanın içi yer değiştirebilir.'
    },
    createdAt: 1725800000000 + 56000
  },
  {
    id: 'q_log_57',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'x^(log₅ 2) + 2^(log₅ x) = 114 olduğuna göre x^(log₅ 2) kaçtır?',
    options: [
      { id: 'A', text: '57', isCorrect: true },
      { id: 'B', text: '114', isCorrect: false },
      { id: 'C', text: '28', isCorrect: false },
      { id: 'D', text: '5', isCorrect: false },
      { id: 'E', text: '2', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'x^(log₅ 2) = 2^(log₅ x) olduğundan 2 · x^(log₅ 2) = 114 ⇒ x^(log₅ 2) = 57.',
      whyOthersIncorrect: {'B': 'İki katıdır.', 'C': 'Yarısı değildir.', 'D': 'Taban değildir.', 'E': 'Üs değildir.'},
      topicSummary: 'a^(log_b c) = c^(log_b a) yer değiştirme kuralı.',
      keyTakeaway: 'Üslü logaritmada taban ile logaritmanın içi yer değiştirebilir.'
    },
    createdAt: 1725800000000 + 57000
  },
  {
    id: 'q_log_58',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'x^(log₅ 2) + 2^(log₅ x) = 116 olduğuna göre x^(log₅ 2) kaçtır?',
    options: [
      { id: 'A', text: '58', isCorrect: true },
      { id: 'B', text: '116', isCorrect: false },
      { id: 'C', text: '29', isCorrect: false },
      { id: 'D', text: '5', isCorrect: false },
      { id: 'E', text: '2', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'x^(log₅ 2) = 2^(log₅ x) olduğundan 2 · x^(log₅ 2) = 116 ⇒ x^(log₅ 2) = 58.',
      whyOthersIncorrect: {'B': 'İki katıdır.', 'C': 'Yarısı değildir.', 'D': 'Taban değildir.', 'E': 'Üs değildir.'},
      topicSummary: 'a^(log_b c) = c^(log_b a) yer değiştirme kuralı.',
      keyTakeaway: 'Üslü logaritmada taban ile logaritmanın içi yer değiştirebilir.'
    },
    createdAt: 1725800000000 + 58000
  },
  {
    id: 'q_log_59',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'x^(log₅ 2) + 2^(log₅ x) = 118 olduğuna göre x^(log₅ 2) kaçtır?',
    options: [
      { id: 'A', text: '59', isCorrect: true },
      { id: 'B', text: '118', isCorrect: false },
      { id: 'C', text: '29', isCorrect: false },
      { id: 'D', text: '5', isCorrect: false },
      { id: 'E', text: '2', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'x^(log₅ 2) = 2^(log₅ x) olduğundan 2 · x^(log₅ 2) = 118 ⇒ x^(log₅ 2) = 59.',
      whyOthersIncorrect: {'B': 'İki katıdır.', 'C': 'Yarısı değildir.', 'D': 'Taban değildir.', 'E': 'Üs değildir.'},
      topicSummary: 'a^(log_b c) = c^(log_b a) yer değiştirme kuralı.',
      keyTakeaway: 'Üslü logaritmada taban ile logaritmanın içi yer değiştirebilir.'
    },
    createdAt: 1725800000000 + 59000
  },
  {
    id: 'q_log_60',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'x^(log₅ 2) + 2^(log₅ x) = 120 olduğuna göre x^(log₅ 2) kaçtır?',
    options: [
      { id: 'A', text: '60', isCorrect: true },
      { id: 'B', text: '120', isCorrect: false },
      { id: 'C', text: '30', isCorrect: false },
      { id: 'D', text: '5', isCorrect: false },
      { id: 'E', text: '2', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'x^(log₅ 2) = 2^(log₅ x) olduğundan 2 · x^(log₅ 2) = 120 ⇒ x^(log₅ 2) = 60.',
      whyOthersIncorrect: {'B': 'İki katıdır.', 'C': 'Yarısı değildir.', 'D': 'Taban değildir.', 'E': 'Üs değildir.'},
      topicSummary: 'a^(log_b c) = c^(log_b a) yer değiştirme kuralı.',
      keyTakeaway: 'Üslü logaritmada taban ile logaritmanın içi yer değiştirebilir.'
    },
    createdAt: 1725800000000 + 60000
  },
  {
    id: 'q_log_61',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'x^(log₅ 2) + 2^(log₅ x) = 122 olduğuna göre x^(log₅ 2) kaçtır?',
    options: [
      { id: 'A', text: '61', isCorrect: true },
      { id: 'B', text: '122', isCorrect: false },
      { id: 'C', text: '30', isCorrect: false },
      { id: 'D', text: '5', isCorrect: false },
      { id: 'E', text: '2', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'x^(log₅ 2) = 2^(log₅ x) olduğundan 2 · x^(log₅ 2) = 122 ⇒ x^(log₅ 2) = 61.',
      whyOthersIncorrect: {'B': 'İki katıdır.', 'C': 'Yarısı değildir.', 'D': 'Taban değildir.', 'E': 'Üs değildir.'},
      topicSummary: 'a^(log_b c) = c^(log_b a) yer değiştirme kuralı.',
      keyTakeaway: 'Üslü logaritmada taban ile logaritmanın içi yer değiştirebilir.'
    },
    createdAt: 1725800000000 + 61000
  },
  {
    id: 'q_log_62',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'x^(log₅ 2) + 2^(log₅ x) = 124 olduğuna göre x^(log₅ 2) kaçtır?',
    options: [
      { id: 'A', text: '62', isCorrect: true },
      { id: 'B', text: '124', isCorrect: false },
      { id: 'C', text: '31', isCorrect: false },
      { id: 'D', text: '5', isCorrect: false },
      { id: 'E', text: '2', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'x^(log₅ 2) = 2^(log₅ x) olduğundan 2 · x^(log₅ 2) = 124 ⇒ x^(log₅ 2) = 62.',
      whyOthersIncorrect: {'B': 'İki katıdır.', 'C': 'Yarısı değildir.', 'D': 'Taban değildir.', 'E': 'Üs değildir.'},
      topicSummary: 'a^(log_b c) = c^(log_b a) yer değiştirme kuralı.',
      keyTakeaway: 'Üslü logaritmada taban ile logaritmanın içi yer değiştirebilir.'
    },
    createdAt: 1725800000000 + 62000
  },
  {
    id: 'q_log_63',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'x^(log₅ 2) + 2^(log₅ x) = 126 olduğuna göre x^(log₅ 2) kaçtır?',
    options: [
      { id: 'A', text: '63', isCorrect: true },
      { id: 'B', text: '126', isCorrect: false },
      { id: 'C', text: '31', isCorrect: false },
      { id: 'D', text: '5', isCorrect: false },
      { id: 'E', text: '2', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'x^(log₅ 2) = 2^(log₅ x) olduğundan 2 · x^(log₅ 2) = 126 ⇒ x^(log₅ 2) = 63.',
      whyOthersIncorrect: {'B': 'İki katıdır.', 'C': 'Yarısı değildir.', 'D': 'Taban değildir.', 'E': 'Üs değildir.'},
      topicSummary: 'a^(log_b c) = c^(log_b a) yer değiştirme kuralı.',
      keyTakeaway: 'Üslü logaritmada taban ile logaritmanın içi yer değiştirebilir.'
    },
    createdAt: 1725800000000 + 63000
  },
  {
    id: 'q_log_64',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'x^(log₅ 2) + 2^(log₅ x) = 128 olduğuna göre x^(log₅ 2) kaçtır?',
    options: [
      { id: 'A', text: '64', isCorrect: true },
      { id: 'B', text: '128', isCorrect: false },
      { id: 'C', text: '32', isCorrect: false },
      { id: 'D', text: '5', isCorrect: false },
      { id: 'E', text: '2', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'x^(log₅ 2) = 2^(log₅ x) olduğundan 2 · x^(log₅ 2) = 128 ⇒ x^(log₅ 2) = 64.',
      whyOthersIncorrect: {'B': 'İki katıdır.', 'C': 'Yarısı değildir.', 'D': 'Taban değildir.', 'E': 'Üs değildir.'},
      topicSummary: 'a^(log_b c) = c^(log_b a) yer değiştirme kuralı.',
      keyTakeaway: 'Üslü logaritmada taban ile logaritmanın içi yer değiştirebilir.'
    },
    createdAt: 1725800000000 + 64000
  },
  {
    id: 'q_log_65',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'x^(log₅ 2) + 2^(log₅ x) = 130 olduğuna göre x^(log₅ 2) kaçtır?',
    options: [
      { id: 'A', text: '65', isCorrect: true },
      { id: 'B', text: '130', isCorrect: false },
      { id: 'C', text: '32', isCorrect: false },
      { id: 'D', text: '5', isCorrect: false },
      { id: 'E', text: '2', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'x^(log₅ 2) = 2^(log₅ x) olduğundan 2 · x^(log₅ 2) = 130 ⇒ x^(log₅ 2) = 65.',
      whyOthersIncorrect: {'B': 'İki katıdır.', 'C': 'Yarısı değildir.', 'D': 'Taban değildir.', 'E': 'Üs değildir.'},
      topicSummary: 'a^(log_b c) = c^(log_b a) yer değiştirme kuralı.',
      keyTakeaway: 'Üslü logaritmada taban ile logaritmanın içi yer değiştirebilir.'
    },
    createdAt: 1725800000000 + 65000
  },
  {
    id: 'q_log_66',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: '1 / log₂ 36 + 1 / log₃ 36 + 1 / log₆ 36 ifadesinin değeri kaçtır?',
    options: [
      { id: 'A', text: '1/2', isCorrect: false },
      { id: 'B', text: '1', isCorrect: true },
      { id: 'C', text: '2', isCorrect: false },
      { id: 'D', text: '6', isCorrect: false },
      { id: 'E', text: '36', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'log₃₆ 2 + log₃₆ 3 + log₃₆ 6 = log₃₆(2 · 3 · 6) = log₃₆(36) = 1.',
      whyOthersIncorrect: {'A': '1/2 değildir.', 'C': '2 değildir.', 'D': '6 değildir.', 'E': '36 değildir.'},
      topicSummary: '1 / log_a b = log_b a taban değiştirme kuralı.',
      keyTakeaway: 'Kesirli logaritmaları ters çevirerek ortak tabanda toplayın.'
    },
    createdAt: 1725800000000 + 66000
  },
  {
    id: 'q_log_67',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₂ 7 = a ve log₃ 7 = b olduğuna göre log₆ 7 nin a ve b türünden eşiti nedir?',
    options: [
      { id: 'A', text: '(a·b)/(a+b)', isCorrect: true },
      { id: 'B', text: '(a+b)/(a·b)', isCorrect: false },
      { id: 'C', text: 'a+b', isCorrect: false },
      { id: 'D', text: 'a·b', isCorrect: false },
      { id: 'E', text: 'a-b', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '1/log₆ N = 1/log₂ N + 1/log₃ N = 1/a + 1/b = (a+b)/(ab). Buradan log₆ N = (ab)/(a+b).',
      whyOthersIncorrect: {'B': 'Tersidir.', 'C': 'Toplamı değildir.', 'D': 'Çarpımı değildir.', 'E': 'Farkı değildir.'},
      topicSummary: 'Harmonik taban değiştirme kuralı.',
      keyTakeaway: '1/log_ab N = 1/log_a N + 1/log_b N özdeşliğini kullanın.'
    },
    createdAt: 1725800000000 + 67000
  },
  {
    id: 'q_log_68',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₂ 8 = a ve log₃ 8 = b olduğuna göre log₆ 8 nin a ve b türünden eşiti nedir?',
    options: [
      { id: 'A', text: '(a·b)/(a+b)', isCorrect: true },
      { id: 'B', text: '(a+b)/(a·b)', isCorrect: false },
      { id: 'C', text: 'a+b', isCorrect: false },
      { id: 'D', text: 'a·b', isCorrect: false },
      { id: 'E', text: 'a-b', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '1/log₆ N = 1/log₂ N + 1/log₃ N = 1/a + 1/b = (a+b)/(ab). Buradan log₆ N = (ab)/(a+b).',
      whyOthersIncorrect: {'B': 'Tersidir.', 'C': 'Toplamı değildir.', 'D': 'Çarpımı değildir.', 'E': 'Farkı değildir.'},
      topicSummary: 'Harmonik taban değiştirme kuralı.',
      keyTakeaway: '1/log_ab N = 1/log_a N + 1/log_b N özdeşliğini kullanın.'
    },
    createdAt: 1725800000000 + 68000
  },
  {
    id: 'q_log_69',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₂ 9 = a ve log₃ 9 = b olduğuna göre log₆ 9 nin a ve b türünden eşiti nedir?',
    options: [
      { id: 'A', text: '(a·b)/(a+b)', isCorrect: true },
      { id: 'B', text: '(a+b)/(a·b)', isCorrect: false },
      { id: 'C', text: 'a+b', isCorrect: false },
      { id: 'D', text: 'a·b', isCorrect: false },
      { id: 'E', text: 'a-b', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '1/log₆ N = 1/log₂ N + 1/log₃ N = 1/a + 1/b = (a+b)/(ab). Buradan log₆ N = (ab)/(a+b).',
      whyOthersIncorrect: {'B': 'Tersidir.', 'C': 'Toplamı değildir.', 'D': 'Çarpımı değildir.', 'E': 'Farkı değildir.'},
      topicSummary: 'Harmonik taban değiştirme kuralı.',
      keyTakeaway: '1/log_ab N = 1/log_a N + 1/log_b N özdeşliğini kullanın.'
    },
    createdAt: 1725800000000 + 69000
  },
  {
    id: 'q_log_70',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₂ 10 = a ve log₃ 10 = b olduğuna göre log₆ 10 nin a ve b türünden eşiti nedir?',
    options: [
      { id: 'A', text: '(a·b)/(a+b)', isCorrect: true },
      { id: 'B', text: '(a+b)/(a·b)', isCorrect: false },
      { id: 'C', text: 'a+b', isCorrect: false },
      { id: 'D', text: 'a·b', isCorrect: false },
      { id: 'E', text: 'a-b', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '1/log₆ N = 1/log₂ N + 1/log₃ N = 1/a + 1/b = (a+b)/(ab). Buradan log₆ N = (ab)/(a+b).',
      whyOthersIncorrect: {'B': 'Tersidir.', 'C': 'Toplamı değildir.', 'D': 'Çarpımı değildir.', 'E': 'Farkı değildir.'},
      topicSummary: 'Harmonik taban değiştirme kuralı.',
      keyTakeaway: '1/log_ab N = 1/log_a N + 1/log_b N özdeşliğini kullanın.'
    },
    createdAt: 1725800000000 + 70000
  },
  {
    id: 'q_log_71',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₂ 11 = a ve log₃ 11 = b olduğuna göre log₆ 11 nin a ve b türünden eşiti nedir?',
    options: [
      { id: 'A', text: '(a·b)/(a+b)', isCorrect: true },
      { id: 'B', text: '(a+b)/(a·b)', isCorrect: false },
      { id: 'C', text: 'a+b', isCorrect: false },
      { id: 'D', text: 'a·b', isCorrect: false },
      { id: 'E', text: 'a-b', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '1/log₆ N = 1/log₂ N + 1/log₃ N = 1/a + 1/b = (a+b)/(ab). Buradan log₆ N = (ab)/(a+b).',
      whyOthersIncorrect: {'B': 'Tersidir.', 'C': 'Toplamı değildir.', 'D': 'Çarpımı değildir.', 'E': 'Farkı değildir.'},
      topicSummary: 'Harmonik taban değiştirme kuralı.',
      keyTakeaway: '1/log_ab N = 1/log_a N + 1/log_b N özdeşliğini kullanın.'
    },
    createdAt: 1725800000000 + 71000
  },
  {
    id: 'q_log_72',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₂ 12 = a ve log₃ 12 = b olduğuna göre log₆ 12 nin a ve b türünden eşiti nedir?',
    options: [
      { id: 'A', text: '(a·b)/(a+b)', isCorrect: true },
      { id: 'B', text: '(a+b)/(a·b)', isCorrect: false },
      { id: 'C', text: 'a+b', isCorrect: false },
      { id: 'D', text: 'a·b', isCorrect: false },
      { id: 'E', text: 'a-b', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '1/log₆ N = 1/log₂ N + 1/log₃ N = 1/a + 1/b = (a+b)/(ab). Buradan log₆ N = (ab)/(a+b).',
      whyOthersIncorrect: {'B': 'Tersidir.', 'C': 'Toplamı değildir.', 'D': 'Çarpımı değildir.', 'E': 'Farkı değildir.'},
      topicSummary: 'Harmonik taban değiştirme kuralı.',
      keyTakeaway: '1/log_ab N = 1/log_a N + 1/log_b N özdeşliğini kullanın.'
    },
    createdAt: 1725800000000 + 72000
  },
  {
    id: 'q_log_73',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₂ 13 = a ve log₃ 13 = b olduğuna göre log₆ 13 nin a ve b türünden eşiti nedir?',
    options: [
      { id: 'A', text: '(a·b)/(a+b)', isCorrect: true },
      { id: 'B', text: '(a+b)/(a·b)', isCorrect: false },
      { id: 'C', text: 'a+b', isCorrect: false },
      { id: 'D', text: 'a·b', isCorrect: false },
      { id: 'E', text: 'a-b', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '1/log₆ N = 1/log₂ N + 1/log₃ N = 1/a + 1/b = (a+b)/(ab). Buradan log₆ N = (ab)/(a+b).',
      whyOthersIncorrect: {'B': 'Tersidir.', 'C': 'Toplamı değildir.', 'D': 'Çarpımı değildir.', 'E': 'Farkı değildir.'},
      topicSummary: 'Harmonik taban değiştirme kuralı.',
      keyTakeaway: '1/log_ab N = 1/log_a N + 1/log_b N özdeşliğini kullanın.'
    },
    createdAt: 1725800000000 + 73000
  },
  {
    id: 'q_log_74',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₂ 14 = a ve log₃ 14 = b olduğuna göre log₆ 14 nin a ve b türünden eşiti nedir?',
    options: [
      { id: 'A', text: '(a·b)/(a+b)', isCorrect: true },
      { id: 'B', text: '(a+b)/(a·b)', isCorrect: false },
      { id: 'C', text: 'a+b', isCorrect: false },
      { id: 'D', text: 'a·b', isCorrect: false },
      { id: 'E', text: 'a-b', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '1/log₆ N = 1/log₂ N + 1/log₃ N = 1/a + 1/b = (a+b)/(ab). Buradan log₆ N = (ab)/(a+b).',
      whyOthersIncorrect: {'B': 'Tersidir.', 'C': 'Toplamı değildir.', 'D': 'Çarpımı değildir.', 'E': 'Farkı değildir.'},
      topicSummary: 'Harmonik taban değiştirme kuralı.',
      keyTakeaway: '1/log_ab N = 1/log_a N + 1/log_b N özdeşliğini kullanın.'
    },
    createdAt: 1725800000000 + 74000
  },
  {
    id: 'q_log_75',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₂ 15 = a ve log₃ 15 = b olduğuna göre log₆ 15 nin a ve b türünden eşiti nedir?',
    options: [
      { id: 'A', text: '(a·b)/(a+b)', isCorrect: true },
      { id: 'B', text: '(a+b)/(a·b)', isCorrect: false },
      { id: 'C', text: 'a+b', isCorrect: false },
      { id: 'D', text: 'a·b', isCorrect: false },
      { id: 'E', text: 'a-b', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '1/log₆ N = 1/log₂ N + 1/log₃ N = 1/a + 1/b = (a+b)/(ab). Buradan log₆ N = (ab)/(a+b).',
      whyOthersIncorrect: {'B': 'Tersidir.', 'C': 'Toplamı değildir.', 'D': 'Çarpımı değildir.', 'E': 'Farkı değildir.'},
      topicSummary: 'Harmonik taban değiştirme kuralı.',
      keyTakeaway: '1/log_ab N = 1/log_a N + 1/log_b N özdeşliğini kullanın.'
    },
    createdAt: 1725800000000 + 75000
  },
  {
    id: 'q_log_76',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₂ 16 = a ve log₃ 16 = b olduğuna göre log₆ 16 nin a ve b türünden eşiti nedir?',
    options: [
      { id: 'A', text: '(a·b)/(a+b)', isCorrect: true },
      { id: 'B', text: '(a+b)/(a·b)', isCorrect: false },
      { id: 'C', text: 'a+b', isCorrect: false },
      { id: 'D', text: 'a·b', isCorrect: false },
      { id: 'E', text: 'a-b', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '1/log₆ N = 1/log₂ N + 1/log₃ N = 1/a + 1/b = (a+b)/(ab). Buradan log₆ N = (ab)/(a+b).',
      whyOthersIncorrect: {'B': 'Tersidir.', 'C': 'Toplamı değildir.', 'D': 'Çarpımı değildir.', 'E': 'Farkı değildir.'},
      topicSummary: 'Harmonik taban değiştirme kuralı.',
      keyTakeaway: '1/log_ab N = 1/log_a N + 1/log_b N özdeşliğini kullanın.'
    },
    createdAt: 1725800000000 + 76000
  },
  {
    id: 'q_log_77',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₂ 17 = a ve log₃ 17 = b olduğuna göre log₆ 17 nin a ve b türünden eşiti nedir?',
    options: [
      { id: 'A', text: '(a·b)/(a+b)', isCorrect: true },
      { id: 'B', text: '(a+b)/(a·b)', isCorrect: false },
      { id: 'C', text: 'a+b', isCorrect: false },
      { id: 'D', text: 'a·b', isCorrect: false },
      { id: 'E', text: 'a-b', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '1/log₆ N = 1/log₂ N + 1/log₃ N = 1/a + 1/b = (a+b)/(ab). Buradan log₆ N = (ab)/(a+b).',
      whyOthersIncorrect: {'B': 'Tersidir.', 'C': 'Toplamı değildir.', 'D': 'Çarpımı değildir.', 'E': 'Farkı değildir.'},
      topicSummary: 'Harmonik taban değiştirme kuralı.',
      keyTakeaway: '1/log_ab N = 1/log_a N + 1/log_b N özdeşliğini kullanın.'
    },
    createdAt: 1725800000000 + 77000
  },
  {
    id: 'q_log_78',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₂ 18 = a ve log₃ 18 = b olduğuna göre log₆ 18 nin a ve b türünden eşiti nedir?',
    options: [
      { id: 'A', text: '(a·b)/(a+b)', isCorrect: true },
      { id: 'B', text: '(a+b)/(a·b)', isCorrect: false },
      { id: 'C', text: 'a+b', isCorrect: false },
      { id: 'D', text: 'a·b', isCorrect: false },
      { id: 'E', text: 'a-b', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '1/log₆ N = 1/log₂ N + 1/log₃ N = 1/a + 1/b = (a+b)/(ab). Buradan log₆ N = (ab)/(a+b).',
      whyOthersIncorrect: {'B': 'Tersidir.', 'C': 'Toplamı değildir.', 'D': 'Çarpımı değildir.', 'E': 'Farkı değildir.'},
      topicSummary: 'Harmonik taban değiştirme kuralı.',
      keyTakeaway: '1/log_ab N = 1/log_a N + 1/log_b N özdeşliğini kullanın.'
    },
    createdAt: 1725800000000 + 78000
  },
  {
    id: 'q_log_79',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₂ 19 = a ve log₃ 19 = b olduğuna göre log₆ 19 nin a ve b türünden eşiti nedir?',
    options: [
      { id: 'A', text: '(a·b)/(a+b)', isCorrect: true },
      { id: 'B', text: '(a+b)/(a·b)', isCorrect: false },
      { id: 'C', text: 'a+b', isCorrect: false },
      { id: 'D', text: 'a·b', isCorrect: false },
      { id: 'E', text: 'a-b', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '1/log₆ N = 1/log₂ N + 1/log₃ N = 1/a + 1/b = (a+b)/(ab). Buradan log₆ N = (ab)/(a+b).',
      whyOthersIncorrect: {'B': 'Tersidir.', 'C': 'Toplamı değildir.', 'D': 'Çarpımı değildir.', 'E': 'Farkı değildir.'},
      topicSummary: 'Harmonik taban değiştirme kuralı.',
      keyTakeaway: '1/log_ab N = 1/log_a N + 1/log_b N özdeşliğini kullanın.'
    },
    createdAt: 1725800000000 + 79000
  },
  {
    id: 'q_log_80',
    topic: 'Logaritma',
    difficulty: 'intermediate',
    questionText: 'log₂ 20 = a ve log₃ 20 = b olduğuna göre log₆ 20 nin a ve b türünden eşiti nedir?',
    options: [
      { id: 'A', text: '(a·b)/(a+b)', isCorrect: true },
      { id: 'B', text: '(a+b)/(a·b)', isCorrect: false },
      { id: 'C', text: 'a+b', isCorrect: false },
      { id: 'D', text: 'a·b', isCorrect: false },
      { id: 'E', text: 'a-b', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '1/log₆ N = 1/log₂ N + 1/log₃ N = 1/a + 1/b = (a+b)/(ab). Buradan log₆ N = (ab)/(a+b).',
      whyOthersIncorrect: {'B': 'Tersidir.', 'C': 'Toplamı değildir.', 'D': 'Çarpımı değildir.', 'E': 'Farkı değildir.'},
      topicSummary: 'Harmonik taban değiştirme kuralı.',
      keyTakeaway: '1/log_ab N = 1/log_a N + 1/log_b N özdeşliğini kullanın.'
    },
    createdAt: 1725800000000 + 80000
  },
  {
    id: 'q_log_81',
    topic: 'Logaritma',
    difficulty: 'beginner',
    questionText: 'log₂(√8) + log₃(³√9) işleminin sonucu kaçtır?',
    options: [
      { id: 'A', text: '13/6', isCorrect: true },
      { id: 'B', text: '5/2', isCorrect: false },
      { id: 'C', text: '7/3', isCorrect: false },
      { id: 'D', text: '2', isCorrect: false },
      { id: 'E', text: '3', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: 'log₂(2^(3/2)) + log₃(3^(2/3)) = 3/2 + 2/3 = 13/6.',
      whyOthersIncorrect: {'B': '5/2 = 15/6 dır.', 'C': '7/3 = 14/6 dır.', 'D': '2 = 12/6 dır.', 'E': '3 = 18/6 dır.'},
      topicSummary: 'Köklü ifadeler rasyonel üs olarak yazılır: √a^b = a^(b/c).',
      keyTakeaway: 'Köklü dereceleri logaritma önüne katsayı olarak düşürün.'
    },
    createdAt: 1725800000000 + 81000
  },
  {
    id: 'q_log_82',
    topic: 'Logaritma',
    difficulty: 'beginner',
    questionText: 'log_{√2}(2) ifadesi aşağıdakilerden hangisine eşittir?',
    options: [
      { id: 'A', text: '2 log₂(2)', isCorrect: true },
      { id: 'B', text: '1/2 log₂(2)', isCorrect: false },
      { id: 'C', text: 'log₂(2)', isCorrect: false },
      { id: 'D', text: '4 log₂(2)', isCorrect: false },
      { id: 'E', text: '√2 log₂(2)', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '√2 = 2^(1/2) olduğundan taban üssü paydaya gelir: 1/(1/2) log₂(2) = 2 log₂(2).',
      whyOthersIncorrect: {'B': 'Paydaya değil paya 2 katsayısı gelir.', 'C': 'Değişimsiz değildir.', 'D': '4 katı değildir.', 'E': 'Kök2 katsayısı gelmez.'},
      topicSummary: 'log_(a^k) b = (1/k) log_a b kuralı.',
      keyTakeaway: 'Tabandaki üs başa 1/k olarak geçer.'
    },
    createdAt: 1725800000000 + 82000
  },
  {
    id: 'q_log_83',
    topic: 'Logaritma',
    difficulty: 'beginner',
    questionText: 'log_{√2}(3) ifadesi aşağıdakilerden hangisine eşittir?',
    options: [
      { id: 'A', text: '2 log₂(3)', isCorrect: true },
      { id: 'B', text: '1/2 log₂(3)', isCorrect: false },
      { id: 'C', text: 'log₂(3)', isCorrect: false },
      { id: 'D', text: '4 log₂(3)', isCorrect: false },
      { id: 'E', text: '√2 log₂(3)', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '√2 = 2^(1/2) olduğundan taban üssü paydaya gelir: 1/(1/2) log₂(3) = 2 log₂(3).',
      whyOthersIncorrect: {'B': 'Paydaya değil paya 2 katsayısı gelir.', 'C': 'Değişimsiz değildir.', 'D': '4 katı değildir.', 'E': 'Kök2 katsayısı gelmez.'},
      topicSummary: 'log_(a^k) b = (1/k) log_a b kuralı.',
      keyTakeaway: 'Tabandaki üs başa 1/k olarak geçer.'
    },
    createdAt: 1725800000000 + 83000
  },
  {
    id: 'q_log_84',
    topic: 'Logaritma',
    difficulty: 'beginner',
    questionText: 'log_{√2}(4) ifadesi aşağıdakilerden hangisine eşittir?',
    options: [
      { id: 'A', text: '2 log₂(4)', isCorrect: true },
      { id: 'B', text: '1/2 log₂(4)', isCorrect: false },
      { id: 'C', text: 'log₂(4)', isCorrect: false },
      { id: 'D', text: '4 log₂(4)', isCorrect: false },
      { id: 'E', text: '√2 log₂(4)', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '√2 = 2^(1/2) olduğundan taban üssü paydaya gelir: 1/(1/2) log₂(4) = 2 log₂(4).',
      whyOthersIncorrect: {'B': 'Paydaya değil paya 2 katsayısı gelir.', 'C': 'Değişimsiz değildir.', 'D': '4 katı değildir.', 'E': 'Kök2 katsayısı gelmez.'},
      topicSummary: 'log_(a^k) b = (1/k) log_a b kuralı.',
      keyTakeaway: 'Tabandaki üs başa 1/k olarak geçer.'
    },
    createdAt: 1725800000000 + 84000
  },
  {
    id: 'q_log_85',
    topic: 'Logaritma',
    difficulty: 'beginner',
    questionText: 'log_{√2}(5) ifadesi aşağıdakilerden hangisine eşittir?',
    options: [
      { id: 'A', text: '2 log₂(5)', isCorrect: true },
      { id: 'B', text: '1/2 log₂(5)', isCorrect: false },
      { id: 'C', text: 'log₂(5)', isCorrect: false },
      { id: 'D', text: '4 log₂(5)', isCorrect: false },
      { id: 'E', text: '√2 log₂(5)', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '√2 = 2^(1/2) olduğundan taban üssü paydaya gelir: 1/(1/2) log₂(5) = 2 log₂(5).',
      whyOthersIncorrect: {'B': 'Paydaya değil paya 2 katsayısı gelir.', 'C': 'Değişimsiz değildir.', 'D': '4 katı değildir.', 'E': 'Kök2 katsayısı gelmez.'},
      topicSummary: 'log_(a^k) b = (1/k) log_a b kuralı.',
      keyTakeaway: 'Tabandaki üs başa 1/k olarak geçer.'
    },
    createdAt: 1725800000000 + 85000
  },
  {
    id: 'q_log_86',
    topic: 'Logaritma',
    difficulty: 'beginner',
    questionText: 'log_{√2}(6) ifadesi aşağıdakilerden hangisine eşittir?',
    options: [
      { id: 'A', text: '2 log₂(6)', isCorrect: true },
      { id: 'B', text: '1/2 log₂(6)', isCorrect: false },
      { id: 'C', text: 'log₂(6)', isCorrect: false },
      { id: 'D', text: '4 log₂(6)', isCorrect: false },
      { id: 'E', text: '√2 log₂(6)', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '√2 = 2^(1/2) olduğundan taban üssü paydaya gelir: 1/(1/2) log₂(6) = 2 log₂(6).',
      whyOthersIncorrect: {'B': 'Paydaya değil paya 2 katsayısı gelir.', 'C': 'Değişimsiz değildir.', 'D': '4 katı değildir.', 'E': 'Kök2 katsayısı gelmez.'},
      topicSummary: 'log_(a^k) b = (1/k) log_a b kuralı.',
      keyTakeaway: 'Tabandaki üs başa 1/k olarak geçer.'
    },
    createdAt: 1725800000000 + 86000
  },
  {
    id: 'q_log_87',
    topic: 'Logaritma',
    difficulty: 'beginner',
    questionText: 'log_{√2}(7) ifadesi aşağıdakilerden hangisine eşittir?',
    options: [
      { id: 'A', text: '2 log₂(7)', isCorrect: true },
      { id: 'B', text: '1/2 log₂(7)', isCorrect: false },
      { id: 'C', text: 'log₂(7)', isCorrect: false },
      { id: 'D', text: '4 log₂(7)', isCorrect: false },
      { id: 'E', text: '√2 log₂(7)', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '√2 = 2^(1/2) olduğundan taban üssü paydaya gelir: 1/(1/2) log₂(7) = 2 log₂(7).',
      whyOthersIncorrect: {'B': 'Paydaya değil paya 2 katsayısı gelir.', 'C': 'Değişimsiz değildir.', 'D': '4 katı değildir.', 'E': 'Kök2 katsayısı gelmez.'},
      topicSummary: 'log_(a^k) b = (1/k) log_a b kuralı.',
      keyTakeaway: 'Tabandaki üs başa 1/k olarak geçer.'
    },
    createdAt: 1725800000000 + 87000
  },
  {
    id: 'q_log_88',
    topic: 'Logaritma',
    difficulty: 'beginner',
    questionText: 'log_{√2}(8) ifadesi aşağıdakilerden hangisine eşittir?',
    options: [
      { id: 'A', text: '2 log₂(8)', isCorrect: true },
      { id: 'B', text: '1/2 log₂(8)', isCorrect: false },
      { id: 'C', text: 'log₂(8)', isCorrect: false },
      { id: 'D', text: '4 log₂(8)', isCorrect: false },
      { id: 'E', text: '√2 log₂(8)', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '√2 = 2^(1/2) olduğundan taban üssü paydaya gelir: 1/(1/2) log₂(8) = 2 log₂(8).',
      whyOthersIncorrect: {'B': 'Paydaya değil paya 2 katsayısı gelir.', 'C': 'Değişimsiz değildir.', 'D': '4 katı değildir.', 'E': 'Kök2 katsayısı gelmez.'},
      topicSummary: 'log_(a^k) b = (1/k) log_a b kuralı.',
      keyTakeaway: 'Tabandaki üs başa 1/k olarak geçer.'
    },
    createdAt: 1725800000000 + 88000
  },
  {
    id: 'q_log_89',
    topic: 'Logaritma',
    difficulty: 'beginner',
    questionText: 'log_{√2}(9) ifadesi aşağıdakilerden hangisine eşittir?',
    options: [
      { id: 'A', text: '2 log₂(9)', isCorrect: true },
      { id: 'B', text: '1/2 log₂(9)', isCorrect: false },
      { id: 'C', text: 'log₂(9)', isCorrect: false },
      { id: 'D', text: '4 log₂(9)', isCorrect: false },
      { id: 'E', text: '√2 log₂(9)', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '√2 = 2^(1/2) olduğundan taban üssü paydaya gelir: 1/(1/2) log₂(9) = 2 log₂(9).',
      whyOthersIncorrect: {'B': 'Paydaya değil paya 2 katsayısı gelir.', 'C': 'Değişimsiz değildir.', 'D': '4 katı değildir.', 'E': 'Kök2 katsayısı gelmez.'},
      topicSummary: 'log_(a^k) b = (1/k) log_a b kuralı.',
      keyTakeaway: 'Tabandaki üs başa 1/k olarak geçer.'
    },
    createdAt: 1725800000000 + 89000
  },
  {
    id: 'q_log_90',
    topic: 'Logaritma',
    difficulty: 'beginner',
    questionText: 'log_{√2}(10) ifadesi aşağıdakilerden hangisine eşittir?',
    options: [
      { id: 'A', text: '2 log₂(10)', isCorrect: true },
      { id: 'B', text: '1/2 log₂(10)', isCorrect: false },
      { id: 'C', text: 'log₂(10)', isCorrect: false },
      { id: 'D', text: '4 log₂(10)', isCorrect: false },
      { id: 'E', text: '√2 log₂(10)', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '√2 = 2^(1/2) olduğundan taban üssü paydaya gelir: 1/(1/2) log₂(10) = 2 log₂(10).',
      whyOthersIncorrect: {'B': 'Paydaya değil paya 2 katsayısı gelir.', 'C': 'Değişimsiz değildir.', 'D': '4 katı değildir.', 'E': 'Kök2 katsayısı gelmez.'},
      topicSummary: 'log_(a^k) b = (1/k) log_a b kuralı.',
      keyTakeaway: 'Tabandaki üs başa 1/k olarak geçer.'
    },
    createdAt: 1725800000000 + 90000
  },
  {
    id: 'q_log_91',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Richter ölçeğine göre bir depremin büyüklüğü R = log(I / I₀) formülü ile hesaplanır. Şiddeti (I) standart şiddetin (I₀) 100.000 katı olan bir depremin Richter büyüklüğü kaçtır?',
    options: [
      { id: 'A', text: '4', isCorrect: false },
      { id: 'B', text: '5', isCorrect: true },
      { id: 'C', text: '6', isCorrect: false },
      { id: 'D', text: '7', isCorrect: false },
      { id: 'E', text: '8', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'R = log(100.000 I₀ / I₀) = log(10⁵) = 5.',
      whyOthersIncorrect: {'A': '10⁴ içindir.', 'C': '10⁶ içindir.', 'D': '10⁷ içindir.', 'E': '10⁸ içindir.'},
      topicSummary: '10\'un kuvvetleri logaritmada doğrudan üssü verir.',
      keyTakeaway: 'log(10^k) = k mantığı.'
    },
    createdAt: 1725800000000 + 91000
  },
  {
    id: 'q_log_92',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Ses düzeyi L = 10 log(I / I₀) desibel (dB) olarak tanımlanır. Şiddeti I = 10⁻⁴ W/m² ve I₀ = 10⁻¹² W/m² olan bir sesin düzeyi kaç dB\'dir?',
    options: [
      { id: 'A', text: '60', isCorrect: false },
      { id: 'B', text: '70', isCorrect: false },
      { id: 'C', text: '80', isCorrect: true },
      { id: 'D', text: '90', isCorrect: false },
      { id: 'E', text: '100', isCorrect: false }
    ],
    correctOptionId: 'C',
    explanation: {
      whyCorrect: 'L = 10 log(10⁻⁴ / 10⁻¹²) = 10 log(10⁸) = 10 · 8 = 80 dB.',
      whyOthersIncorrect: {'A': '60 dB değildir.', 'B': '70 dB değildir.', 'D': '90 dB değildir.', 'E': '100 dB değildir.'},
      topicSummary: 'Desibel formülünde oran 10^8 olup logaritması 8\'dir, 10 ile çarpılınca 80 olur.',
      keyTakeaway: '10·log(I/I0) formülünde üsler farkını 10 ile çarpın.'
    },
    createdAt: 1725800000000 + 92000
  },
  {
    id: 'q_log_93',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Bir çözeltinin pH değeri pH = -log[H⁺] formülü ile hesaplanır. Hidrojen iyonu derişimi [H⁺] = 10⁻³ M olan bir çözeltinin pH değeri kaçtır?',
    options: [
      { id: 'A', text: '2', isCorrect: false },
      { id: 'B', text: '3', isCorrect: true },
      { id: 'C', text: '4', isCorrect: false },
      { id: 'D', text: '5', isCorrect: false },
      { id: 'E', text: '7', isCorrect: false }
    ],
    correctOptionId: 'B',
    explanation: {
      whyCorrect: 'pH = -log(10⁻³) = -(-3) = 3.',
      whyOthersIncorrect: {'A': 'pH 2 değildir.', 'C': 'pH 4 değildir.', 'D': 'pH 5 değildir.', 'E': 'Nötr pH 7 değildir.'},
      topicSummary: '-log(10^-k) = k eşiti.',
      keyTakeaway: 'pH negatif logaritmaya eşittir.'
    },
    createdAt: 1725800000000 + 93000
  },
  {
    id: 'q_log_94',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Bir radyoaktif izotopun bozunma modeli N(t) = N₀ · 2^(-t/4) olarak veriliyor. Başlangıç miktarının 1/16\'sına düşmesi kaç yıl sürer?',
    options: [
      { id: 'A', text: '16', isCorrect: true },
      { id: 'B', text: '8', isCorrect: false },
      { id: 'C', text: '32', isCorrect: false },
      { id: 'D', text: '4', isCorrect: false },
      { id: 'E', text: '12', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '2^(-t/4) = 1/16 = 2⁻⁴ ⇒ -t/4 = -4 ⇒ t = 16 yıl.',
      whyOthersIncorrect: {'B': '2 yarılanma değildir.', 'C': '8 yarılanma değildir.', 'D': '1 yarılanma değildir.', 'E': '3 yarılanma değildir.'},
      topicSummary: '1/16 = 2^-4 üssü 4 yarılanma periyoduna eşittir.',
      keyTakeaway: '2^(-t/T) = 2^-k denkleminde t = k · T bulunur.'
    },
    createdAt: 1725800000000 + 94000
  },
  {
    id: 'q_log_95',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Bir radyoaktif izotopun bozunma modeli N(t) = N₀ · 2^(-t/5) olarak veriliyor. Başlangıç miktarının 1/16\'sına düşmesi kaç yıl sürer?',
    options: [
      { id: 'A', text: '20', isCorrect: true },
      { id: 'B', text: '10', isCorrect: false },
      { id: 'C', text: '40', isCorrect: false },
      { id: 'D', text: '5', isCorrect: false },
      { id: 'E', text: '15', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '2^(-t/5) = 1/16 = 2⁻⁴ ⇒ -t/5 = -4 ⇒ t = 20 yıl.',
      whyOthersIncorrect: {'B': '2 yarılanma değildir.', 'C': '8 yarılanma değildir.', 'D': '1 yarılanma değildir.', 'E': '3 yarılanma değildir.'},
      topicSummary: '1/16 = 2^-4 üssü 4 yarılanma periyoduna eşittir.',
      keyTakeaway: '2^(-t/T) = 2^-k denkleminde t = k · T bulunur.'
    },
    createdAt: 1725800000000 + 95000
  },
  {
    id: 'q_log_96',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Bir radyoaktif izotopun bozunma modeli N(t) = N₀ · 2^(-t/6) olarak veriliyor. Başlangıç miktarının 1/16\'sına düşmesi kaç yıl sürer?',
    options: [
      { id: 'A', text: '24', isCorrect: true },
      { id: 'B', text: '12', isCorrect: false },
      { id: 'C', text: '48', isCorrect: false },
      { id: 'D', text: '6', isCorrect: false },
      { id: 'E', text: '18', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '2^(-t/6) = 1/16 = 2⁻⁴ ⇒ -t/6 = -4 ⇒ t = 24 yıl.',
      whyOthersIncorrect: {'B': '2 yarılanma değildir.', 'C': '8 yarılanma değildir.', 'D': '1 yarılanma değildir.', 'E': '3 yarılanma değildir.'},
      topicSummary: '1/16 = 2^-4 üssü 4 yarılanma periyoduna eşittir.',
      keyTakeaway: '2^(-t/T) = 2^-k denkleminde t = k · T bulunur.'
    },
    createdAt: 1725800000000 + 96000
  },
  {
    id: 'q_log_97',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Bir radyoaktif izotopun bozunma modeli N(t) = N₀ · 2^(-t/7) olarak veriliyor. Başlangıç miktarının 1/16\'sına düşmesi kaç yıl sürer?',
    options: [
      { id: 'A', text: '28', isCorrect: true },
      { id: 'B', text: '14', isCorrect: false },
      { id: 'C', text: '56', isCorrect: false },
      { id: 'D', text: '7', isCorrect: false },
      { id: 'E', text: '21', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '2^(-t/7) = 1/16 = 2⁻⁴ ⇒ -t/7 = -4 ⇒ t = 28 yıl.',
      whyOthersIncorrect: {'B': '2 yarılanma değildir.', 'C': '8 yarılanma değildir.', 'D': '1 yarılanma değildir.', 'E': '3 yarılanma değildir.'},
      topicSummary: '1/16 = 2^-4 üssü 4 yarılanma periyoduna eşittir.',
      keyTakeaway: '2^(-t/T) = 2^-k denkleminde t = k · T bulunur.'
    },
    createdAt: 1725800000000 + 97000
  },
  {
    id: 'q_log_98',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Bir radyoaktif izotopun bozunma modeli N(t) = N₀ · 2^(-t/8) olarak veriliyor. Başlangıç miktarının 1/16\'sına düşmesi kaç yıl sürer?',
    options: [
      { id: 'A', text: '32', isCorrect: true },
      { id: 'B', text: '16', isCorrect: false },
      { id: 'C', text: '64', isCorrect: false },
      { id: 'D', text: '8', isCorrect: false },
      { id: 'E', text: '24', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '2^(-t/8) = 1/16 = 2⁻⁴ ⇒ -t/8 = -4 ⇒ t = 32 yıl.',
      whyOthersIncorrect: {'B': '2 yarılanma değildir.', 'C': '8 yarılanma değildir.', 'D': '1 yarılanma değildir.', 'E': '3 yarılanma değildir.'},
      topicSummary: '1/16 = 2^-4 üssü 4 yarılanma periyoduna eşittir.',
      keyTakeaway: '2^(-t/T) = 2^-k denkleminde t = k · T bulunur.'
    },
    createdAt: 1725800000000 + 98000
  },
  {
    id: 'q_log_99',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Bir radyoaktif izotopun bozunma modeli N(t) = N₀ · 2^(-t/9) olarak veriliyor. Başlangıç miktarının 1/16\'sına düşmesi kaç yıl sürer?',
    options: [
      { id: 'A', text: '36', isCorrect: true },
      { id: 'B', text: '18', isCorrect: false },
      { id: 'C', text: '72', isCorrect: false },
      { id: 'D', text: '9', isCorrect: false },
      { id: 'E', text: '27', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '2^(-t/9) = 1/16 = 2⁻⁴ ⇒ -t/9 = -4 ⇒ t = 36 yıl.',
      whyOthersIncorrect: {'B': '2 yarılanma değildir.', 'C': '8 yarılanma değildir.', 'D': '1 yarılanma değildir.', 'E': '3 yarılanma değildir.'},
      topicSummary: '1/16 = 2^-4 üssü 4 yarılanma periyoduna eşittir.',
      keyTakeaway: '2^(-t/T) = 2^-k denkleminde t = k · T bulunur.'
    },
    createdAt: 1725800000000 + 99000
  },
  {
    id: 'q_log_100',
    topic: 'Logaritma',
    difficulty: 'advanced',
    questionText: 'Bir radyoaktif izotopun bozunma modeli N(t) = N₀ · 2^(-t/10) olarak veriliyor. Başlangıç miktarının 1/16\'sına düşmesi kaç yıl sürer?',
    options: [
      { id: 'A', text: '40', isCorrect: true },
      { id: 'B', text: '20', isCorrect: false },
      { id: 'C', text: '80', isCorrect: false },
      { id: 'D', text: '10', isCorrect: false },
      { id: 'E', text: '30', isCorrect: false }
    ],
    correctOptionId: 'A',
    explanation: {
      whyCorrect: '2^(-t/10) = 1/16 = 2⁻⁴ ⇒ -t/10 = -4 ⇒ t = 40 yıl.',
      whyOthersIncorrect: {'B': '2 yarılanma değildir.', 'C': '8 yarılanma değildir.', 'D': '1 yarılanma değildir.', 'E': '3 yarılanma değildir.'},
      topicSummary: '1/16 = 2^-4 üssü 4 yarılanma periyoduna eşittir.',
      keyTakeaway: '2^(-t/T) = 2^-k denkleminde t = k · T bulunur.'
    },
    createdAt: 1725800000000 + 100000
  }
];
