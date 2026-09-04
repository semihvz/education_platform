import { GoogleGenAI } from '@google/genai';
import type { Question, Difficulty, Flashcard } from '../types/quiz';

// Strict Option Balancing (Uniform Normal Distribution: A, B, C, D, E each 20%)
let optionBalanceCounter = 0;
const OPTION_CYCLE = ['A', 'B', 'C', 'D', 'E'];

function enforceBalancedOptionsAndDifficulty(question: Question): Question {
  const targetLabel = OPTION_CYCLE[optionBalanceCounter % 5];
  optionBalanceCounter += 1;

  const correctOpt = question.options.find(o => o.isCorrect) || question.options[0];
  const incorrectOpts = question.options.filter(o => !o.isCorrect);

  const oldExplanations = question.explanation?.whyOthersIncorrect || {};

  const incItems = incorrectOpts.map(o => ({
    text: o.text,
    expl: oldExplanations[o.id] || `${o.id} şıkkı bu soru için doğru değildir.`
  }));

  const newOptionsList: { id: string; text: string; isCorrect: boolean }[] = [];
  const newWhyOthers: Record<string, string> = {};
  let incIndex = 0;

  OPTION_CYCLE.forEach((label) => {
    if (label === targetLabel) {
      newOptionsList.push({
        id: label,
        text: correctOpt.text,
        isCorrect: true,
      });
    } else {
      const item = incItems[incIndex++] || { text: 'Çeldirici Seçenek', expl: 'Hatalı seçenektir.' };
      newOptionsList.push({
        id: label,
        text: item.text,
        isCorrect: false,
      });
      newWhyOthers[label] = item.expl.replace(/^[A-E] şıkkı/, `${label} şıkkı`);
    }
  });

  return {
    ...question,
    difficulty: 'advanced', // ALWAYS Advanced / İleri Seviye
    options: newOptionsList,
    correctOptionId: targetLabel,
    explanation: {
      ...question.explanation,
      whyOthersIncorrect: newWhyOthers
    }
  };
}

// Helper to fetch all embedded preloaded questions
export function getPreloadedQuestions(): Question[] {
  const all: Question[] = [];
  Object.values(FALLBACK_TOPICS_DATABASE).forEach(list => {
    all.push(...list);
  });
  return all;
}

const FALLBACK_TOPICS_DATABASE: Record<string, Question[]> = {
  'SQL Database': [
    {
        "id": "q_sql_1",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Aşağıdaki SQL sorgusunda maas sütununa göre sıralama yapılmaktadır. maas değerleri 5000, 5000, 4000 olan 3 çalışan için DENSE_RANK() ve RANK() fonksiyonlarının üreteceği sıra numaraları sırasıyla hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "1, 1, 2 ve 1, 1, 3",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "1, 2, 3 ve 1, 1, 2",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "1, 1, 3 ve 1, 2, 3",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "1, 1, 2 ve 1, 2, 3",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "DENSE_RANK() eşit değerlere aynı sırayı verir ve ardışık numaralandırmaya devam eder (1, 1, 2). RANK() ise eşit değerler sonrasında atlama yapar (1, 1, 3).",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Window Functions - DENSE_RANK vs RANK",
            "keyTakeaway": "SQL İleri Seviye Soru #1 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000001
    },
    {
        "id": "q_sql_2",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Bir şirketin aylık satış tablosunda, bir önceki ayın satış miktarını mevcut satıra getirmek için aşağıdaki window fonksiyonlarından hangisi kullanılmalıdır?",
        "options": [
            {
                "id": "A",
                "text": "LEAD(satis_miktari, 1) OVER (ORDER BY ay)",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "LAG(satis_miktari, 1) OVER (ORDER BY ay)",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "FIRST_VALUE(satis_miktari) OVER (ORDER BY ay)",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "NTH_VALUE(satis_miktari, 1) OVER (ORDER BY ay)",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "LAG() fonksiyonu sıralı veri kümesinde mevcut satırdan önceki (offset) satırların değerini döndürmek için kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Window Functions - LAG & LEAD",
            "keyTakeaway": "SQL İleri Seviye Soru #2 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000002
    },
    {
        "id": "q_sql_3",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "SUM(satis) OVER (ORDER BY tarih ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) ifadesi neyi hesaplar?",
        "options": [
            {
                "id": "A",
                "text": "Sadece bir önceki satır ile mevcut satırın toplamını",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tüm tablonun genel toplamını sabit olarak",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Tablonun en başından mevcut satıra kadar olan kümülatif (yürüyen) toplamı",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Mevcut satırdan sonraki tüm satırların toplamını",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "UNBOUNDED PRECEDING en ilk satırdan başlar, CURRENT ROW ise mevcut satıra kadar olan satırları kapsayarak kümülatif toplam (running total) hesaplar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Window Functions - Frame Specification",
            "keyTakeaway": "SQL İleri Seviye Soru #3 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000003
    },
    {
        "id": "q_sql_4",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Hiyerarşik (organizasyon şeması, kategori ağacı vb.) verileri sorgulamak için kullanılan CTE yapısında özyinelemeyi sonlandıran veya birleştiren temel operatör hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "INTERSECT",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "EXCEPT",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "CROSS JOIN",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "UNION ALL",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Recursive CTE yapısında Anchor Member (kök sorgu) ile Recursive Member (özyinelemeli sorgu) birbirine UNION ALL operatörü ile bağlanır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Recursive CTE - Özyinelemeli Sorgular",
            "keyTakeaway": "SQL İleri Seviye Soru #4 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000004
    },
    {
        "id": "q_sql_5",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "SQL motorunun bir SELECT sorgusunu işleme sırası aşağıdakilerden hangisinde doğru verilmiştir?",
        "options": [
            {
                "id": "A",
                "text": "SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "FROM -> GROUP BY -> WHERE -> HAVING -> SELECT -> ORDER BY",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "WHERE -> FROM -> GROUP BY -> SELECT -> HAVING -> ORDER BY",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "SQL mantıksal sorgu işleme sırası: 1. FROM/JOIN, 2. WHERE, 3. GROUP BY, 4. HAVING, 5. SELECT, 6. ORDER BY, 7. LIMIT/OFFSET.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: SQL Execution Order - Sorgu Çalışma Sırası",
            "keyTakeaway": "SQL İleri Seviye Soru #5 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000005
    },
    {
        "id": "q_sql_6",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Bir transaction bir aralıktaki satırları okurken, başka bir transaction bu aralığa yeni bir satır INSERT edip COMMIT ettiğinde ilk transaction'ın aynı sorguda farklı satır sayısı görmesi durumuna ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Phantom Read (Hayalet Okuma)",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Non-Repeatable Read (Tekrarlanamayan Okuma)",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Dirty Read (Kirli Okuma)",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Lost Update (Kayıp Güncelleme)",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Phantom Read, bir transaction çalışırken başka bir transaction tarafından yeni satır eklenmesi (INSERT) veya silinmesi sonucu oluşan tutarsızlıktır.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Transaction Isolation Levels - Phantom Read",
            "keyTakeaway": "SQL İleri Seviye Soru #6 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000006
    },
    {
        "id": "q_sql_7",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Phantom Read (Hayalet Okuma) sorununu tamamen engelleyen en yüksek SQL işlem izolasyon seviyesi (Transaction Isolation Level) hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "REPEATABLE READ",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "SERIALIZABLE",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "READ COMMITTED",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "READ UNCOMMITTED",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "SERIALIZABLE en yüksek izolasyon seviyesidir; kilitler ve aralık kilitleri (range locks) kullanarak Phantom Read dahil tüm tutarsızlıkları önler.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Transaction Isolation Levels - SERIALIZABLE",
            "keyTakeaway": "SQL İleri Seviye Soru #7 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000007
    },
    {
        "id": "q_sql_8",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "GROUP BY GROUPING SETS ((bolum_id, unvan), (bolum_id), ()) ifadesinin ürettiği özet çıktısı aşağıdakilerden hangisine eşdeğerdir?",
        "options": [
            {
                "id": "A",
                "text": "GROUP BY CUBE(bolum_id, unvan)",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "GROUP BY bolum_id, unvan WITH CUBE",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "GROUP BY ROLLUP(bolum_id, unvan)",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "GROUP BY UNION ALL",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "ROLLUP(A, B) ifadesi sırasıyla (A, B), (A) ve () hiyerarşik gruplamalarını üretir. Bu da belirtilen GROUPING SETS ile birebir aynıdır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: GROUPING SETS - Çoklu Gruplama",
            "keyTakeaway": "SQL İleri Seviye Soru #8 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000008
    },
    {
        "id": "q_sql_9",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "WHERE ve HAVING tümceleri arasındaki en temel fark aşağıdakilerden hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "WHERE sadece sayısal alanlarda kullanılır, HAVING metinsel alanlarda kullanılır.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "HAVING agregasyon fonksiyonları içeremez, WHERE içerebilir.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "WHERE sorguyu hızlandırmaz, HAVING performansı artırır.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "WHERE gruplamadan önce satırları filtreler, HAVING ise GROUP BY sonrasında gruplanmış özet verileri filtreler.",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "WHERE satır bazlı filtreleme yapar ve GROUP BY öncesi çalışır. HAVING ise gruplanmış sonuçlar üzerinde (SUM, AVG vb. içeren) filtreleme yapar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: HAVING vs WHERE Farkı",
            "keyTakeaway": "SQL İleri Seviye Soru #9 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000009
    },
    {
        "id": "q_sql_10",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "COALESCE(NULL, NULL, 'Python', 'SQL') ve NULLIF(10, 10) ifadelerinin sonuçları sırasıyla nedir?",
        "options": [
            {
                "id": "A",
                "text": "'SQL' ve 10",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "NULL ve 0",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "'Python' ve 10",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "'Python' ve NULL",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "COALESCE verilen listedeki İLK NULL OLMAYAN değeri döndürür ('Python'). NULLIF(a, b) ise iki parametre eşitse NULL döndürür (10 = 10 olduğu için NULL).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: COALESCE vs NULLIF",
            "keyTakeaway": "SQL İleri Seviye Soru #10 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000010
    },
    {
        "id": "q_sql_11",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "İçteki sorgunun dıştaki sorgunun her bir satırı için tekrar tekrar çalıştırıldığı sorgu türü hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "Correlated Subquery (İlişkili Alt Sorgu)",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Scalar Subquery",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Inline View",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "CTE",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Correlated Subquery dış sorgudaki tablonun takma adına (alias) bağımlıdır ve dış sorgunun her satırı için yürütülür.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Correlated Subquery",
            "keyTakeaway": "SQL İleri Seviye Soru #11 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000011
    },
    {
        "id": "q_sql_12",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "A ve B tabloları LEFT JOIN ile birleştirildiğinde, sadece A tablosunda olup B tablosunda eşleşmeyen satırları bulmak için hangi WHERE koşulu eklenmelidir?",
        "options": [
            {
                "id": "A",
                "text": "WHERE B.id IS NOT NULL",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "WHERE B.id IS NULL",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "WHERE A.id = B.id",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "WHERE B.id = 0",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "LEFT JOIN eşleşmeyen B satırlarına NULL atar. WHERE B.id IS NULL filtresiyle sadece B'de karşılığı olmayan (fark) satırlar elde edilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: LEFT JOIN & NULL Check",
            "keyTakeaway": "SQL İleri Seviye Soru #12 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000012
    },
    {
        "id": "q_sql_13",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "UNION ile UNION ALL arasındaki temel performans ve işlev farkı nedir?",
        "options": [
            {
                "id": "A",
                "text": "UNION ALL mükerrer satırları eler, UNION elemez.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "UNION iki tabloyu yan yana birleştirir, UNION ALL alt alta birleştirir.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "UNION mükerrer (duplicate) satırları eler ve sıralama yapar; UNION ALL elenmeden tüm satırları birleştirir ve daha hızlıdır.",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "UNION ALL bellek kullanmaz, UNION bellek kullanır.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "UNION tekil satırları bulmak için dahili DISTINCT (sort/hash) işlemi yapar. UNION ALL mükerrerleri elemediği için çok daha hızlıdır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: UNION vs UNION ALL",
            "keyTakeaway": "SQL İleri Seviye Soru #13 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000013
    },
    {
        "id": "q_sql_14",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "B-Tree indeks yapısında bir sütuna B-Tree indeksi oluşturulduğunda aşağıdaki sorgu türlerinden hangisi bu indeksi verimli KULLANAMAZ?",
        "options": [
            {
                "id": "A",
                "text": "WHERE ad = 'Ahmet'",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "WHERE ad LIKE 'Ahmet%'",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "WHERE maas BETWEEN 3000 AND 5000",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "WHERE UPPER(ad) = 'AHMET'",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "İndeksli sütun bir fonksiyona (UPPER, LOWER, TO_CHAR vb.) sarıldığında klasik B-Tree indeksi pasif kalır (Full Table Scan yapılır). İndeksli alan saf tutulmalıdır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: B-Tree Indexing",
            "keyTakeaway": "SQL İleri Seviye Soru #14 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000014
    },
    {
        "id": "q_sql_15",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Veritabanı yürütme planında (Execution Plan) 'Index Seek' ile 'Index Scan' arasındaki temel fark nedir?",
        "options": [
            {
                "id": "A",
                "text": "Index Scan tek bir satır okur, Index Seek tüm tabloyu okur.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Index Seek sadece Clustered indekslerde çalışır.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Index Scan sadece hafızada çalışır.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Index Seek ağaçta doğrudan aranan noktaya gider (hızlı); Index Scan tüm indeks yapısını baştan sona tarar.",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Index Seek nokta atışı (bipartite/tree navigation) arama yapar. Index Scan ise indeks yapısının tamamını okur.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Index Seek vs Index Scan",
            "keyTakeaway": "SQL İleri Seviye Soru #15 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000015
    },
    {
        "id": "q_sql_16",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Bir ilişkisel veritabanı tablosunda neden en fazla 1 adet Clustered Index (Kümeli İndeks) bulunabilir?",
        "options": [
            {
                "id": "A",
                "text": "Çünkü Clustered Index tablodaki verilerin fiziksel olarak diskteki dizilim sırasını belirler.",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Çünkü veritabanı yazılımları lisans gereği tek indekse izin verir.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Çünkü Clustered Index sadece birincil anahtar (Primary Key) üzerinde tanımlanabilir.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Çünkü bellekte birden fazla indeks saklanamaz.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Bir verinin disk üzerinde sadece TEK BİR fiziksel sıralaması olabileceği için bir tabloda yalnızca 1 adet Clustered Index bulunabilir.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Clustered vs Non-Clustered Index",
            "keyTakeaway": "SQL İleri Seviye Soru #16 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000016
    },
    {
        "id": "q_sql_17",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Veritabanı ACID ilkelerinden 'Atomicity' (Bütünlük/Bölünemezlik) ne anlama gelir?",
        "options": [
            {
                "id": "A",
                "text": "Veritabanı her zaman bir tutarlı durumdan diğer tutarlı duruma geçer.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "İşlem ya tamamen başarılı olur ya da hiç gerçekleşmemiş gibi tamamen geri alınır (All or Nothing).",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Eşzamanlı işlemler birbirini etkilemez.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tamamlanan işlemler kalıcıdır.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Atomicity (Hep ya da Hiç): Bir transaction içerisindeki tüm adımlar ya hep birlikte başarılı olur (COMMIT) ya da bir hata durumunda tüm adımlar geri alınır (ROLLBACK).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: ACID - Atomicity",
            "keyTakeaway": "SQL İleri Seviye Soru #17 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000017
    },
    {
        "id": "q_sql_18",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "ACID ilkelerinden 'Isolation' (Yalıtım) kavramı neyi güvence altına alır?",
        "options": [
            {
                "id": "A",
                "text": "Verinin diske fiziksel olarak yazılmasını sağlar.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Veritabanı kısıtlamalarının (CHECK, FK) ihlal edilmemesini sağlar.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Eşzamanlı çalışan birden fazla transaction'ın birbirlerinin henüz tamamlanmamış verilerini görmesini ve etkilemesini kontrol eder.",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Veritabanının yedeklenmesini garanti eder.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Yalıtım (Isolation), aynı anda yürütülen işlemlerin birbirinden bağımsız ve izole olmasını sağlar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: ACID - Isolation",
            "keyTakeaway": "SQL İleri Seviye Soru #18 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000018
    },
    {
        "id": "q_sql_19",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Bir Recursive CTE sorgusunun sonsuz döngüye (infinite loop) girmesini engellemek için ne yapılmalıdır?",
        "options": [
            {
                "id": "A",
                "text": "GROUP BY eklenmelidir.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "ORDER BY eklenmelidir.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "UNION ALL yerine UNION kullanılmalıdır.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Recursive tümcede durdurma koşulu (WHERE adım < N veya parent_id IS NOT NULL) bulunmalıdır.",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Recursive kısımda özyinelemeyi sonlandıracak mantıksal bir WHERE sınır koşulu veya MAXRECURSION seçeneği kullanılmalıdır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Recursive CTE Terminating Condition",
            "keyTakeaway": "SQL İleri Seviye Soru #19 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000019
    },
    {
        "id": "q_sql_20",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Alt sorguda NULL değerler bulunabileceğinde ve performans kritik olduğunda EXISTS mi IN mi tercih edilmelidir?",
        "options": [
            {
                "id": "A",
                "text": "IN tercih edilmelidir; çünkü IN NULL değerleri otomatik olarak sıfıra çevirir.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "İkisi de tamamen aynı çalışır ve hiçbir performans farkı yoktur.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "IN sadece sayısal verilerde çalışır.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "EXISTS tercih edilmelidir; çünkü EXISTS NULL değerlerden etkilenmez ve ilk eşleşmede durur (Short-circuit).",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "NOT IN kullanımı alt sorgudaki tek bir NULL değer yüzünden tüm sonucu boş döndürebilir (Three-valued logic). EXISTS ise Boolean kontrol yapar ve ilk TRUE'da durur.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: EXISTS vs IN",
            "keyTakeaway": "SQL İleri Seviye Soru #20 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000020
    },
    {
        "id": "q_sql_21",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "A tablosunda 50 satır, B tablosunda 100 satır bulunmaktadır. SELECT * FROM A CROSS JOIN B sorgusu kaç satır sonuç döndürür?",
        "options": [
            {
                "id": "A",
                "text": "5000",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "150",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "100",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "50",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "CROSS JOIN kartezyen çarpım üretir. Sonuç satır sayısı A_satır × B_satır = 50 × 100 = 5000 olur.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: CROSS JOIN & Kartezyen Çarpım",
            "keyTakeaway": "SQL İleri Seviye Soru #21 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000021
    },
    {
        "id": "q_sql_22",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Bir tablonun kendisiyle birleştirilmesi (SELF JOIN) en çok hangi durumlarda kullanılır?",
        "options": [
            {
                "id": "A",
                "text": "Tablodaki mükerrer sütunları silmek için.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Aynı tabloda yer alan çalışan-yönetici ilişkisi gibi hiyerarşik veya birbiriyle ilişkili satırları kıyaslamak için.",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Tablonun yedeğini başka bir veritabanına aktarmak için.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Veritabanı indekslerini yeniden yapılandırmak için.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "SELF JOIN bir tablonun kendi satırları arasındaki ilişkileri (örneğin personel tablosundaki müdür_id ile personel_id ilişkisi) sorgulamak için kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: SELF JOIN Kullanım Amacı",
            "keyTakeaway": "SQL İleri Seviye Soru #22 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000022
    },
    {
        "id": "q_sql_23",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "100 satırlık bir veri kümesinde NTILE(4) OVER (ORDER BY puan DESC) fonksiyonu ne yapar?",
        "options": [
            {
                "id": "A",
                "text": "İlk 4 satırı döndürür.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Her 4 satırda bir toplam alır.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Verileri puan sırasına göre 4 eşit gruba (çeyreklik/quartile) böler ve her satıra 1, 2, 3 veya 4 değerini atar.",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Puanı 4'e böler.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "NTILE(n) sıralı veri kümesini belirtilen n adet eşit kovaya (bucket/quartile) bölerek her satıra kova numarasını verir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Window Function - NTILE(4)",
            "keyTakeaway": "SQL İleri Seviye Soru #23 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000023
    },
    {
        "id": "q_sql_24",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "FOREIGN KEY kısıtlamasında ON DELETE CASCADE seçeneği tanımlandığında ne gerçekleşir?",
        "options": [
            {
                "id": "A",
                "text": "Ana tablodan satır silinmesi engellenir.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Alt tablodaki ilgili alanlara NULL değeri atanır.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Silinen satırlar çöp kutusuna taşınır.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Ana (Parent) tablodan bir satır silindiğinde, ona bağlı tüm alt (Child) tablodaki satırlar da otomatik olarak silinir.",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "ON DELETE CASCADE ilkesi ana tablodaki silme işlemini ilişkili tüm detay satırlarına otomatik olarak yayarak siler.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: FOREIGN KEY CASCADE",
            "keyTakeaway": "SQL İleri Seviye Soru #24 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000024
    },
    {
        "id": "q_sql_25",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Bir sorgunun ihtiyaç duyduğu tüm sütunların doğrudan indeks yapısının (leaf node) içinde bulunması durumuna ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Clustered Index",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Bitmap Index",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Filtered Index",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Covering Index (Kapsayan İndeks)",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Eğer bir sorgudaki SELECT, WHERE, JOIN ve ORDER BY sütunlarının tamamı indekste varsa buna Covering Index denir ve tabloya gitmeden (Index-Only Scan) yanıt döner.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Index - Covering Index",
            "keyTakeaway": "SQL İleri Seviye Soru #25 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000025
    },
    {
        "id": "q_sql_26",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Materialized View (Maddi Görünüm) ile Standart View arasındaki en önemli fark nedir?",
        "options": [
            {
                "id": "A",
                "text": "Materialized View sorgu sonucunu fiziksel olarak diskte saklar ve yenilenmesi gerekir; Normal View ise sadece saklanmış bir SQL sorgusudur.",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Normal View diskte yer kaplar, Materialized View kaplamaz.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Materialized View sadece PostgreSQL'de vardır.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Normal View indekslenemez ancak Materialized View da indekslenemez.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Materialized View sorgunun çıktısını tablo gibi diskte tutar (fiziksel saklama). Bu sayede karmaşık sorgularda çok hızlıdır ancak REFRESH edilmelidir.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Materialized View vs Normal View",
            "keyTakeaway": "SQL İleri Seviye Soru #26 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000026
    },
    {
        "id": "q_sql_27",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "SQL'de `WHERE sutun = NULL` ifadesi neden hiçbir zaman TRUE dönmez?",
        "options": [
            {
                "id": "A",
                "text": "Çünkü NULL sadece 0 sayısal değerine eşittir.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Çünkü SQL üç değerli mantık (Three-valued logic) kullanır ve NULL bilinmeyen bir değer olduğu için eşitlik IS NULL ile kontrol edilmelidir.",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Çünkü WHERE tümcesi metinsel alanlarda çalışmaz.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Çünkü NULL terimi SQL standartlarında kaldırılmıştır.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "SQL'de NULL ile yapılan tüm mantıksal karşılaştırmalar (`=`, `<>`, `<`) UNKNOWN döner. Bir değerin NULL olup olmadığını test etmek için `IS NULL` veya `IS NOT NULL` kullanılmalıdır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: NULL Değer Karşılaştırması",
            "keyTakeaway": "SQL İleri Seviye Soru #27 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000027
    },
    {
        "id": "q_sql_28",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "Veritabanında bir satır varsa UPDATE, yoksa INSERT yapma işlemine ne ad verilir ve standart SQL'de hangi komutla yapılır?",
        "options": [
            {
                "id": "A",
                "text": "BULK INSERT komutu",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "TRUNCATE TABLE komutu",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "UPSERT mantığı - MERGE INTO komutu",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "ALTER TABLE komutu",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Var olan satırı güncelleme, yoksa ekleme mantığına UPSERT denir. ANSI SQL standardında bu işlem MERGE INTO komutu ile sağlanır (PostgreSQL'de ON CONFLICT).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: UPSERT (MERGE / ON CONFLICT)",
            "keyTakeaway": "SQL İleri Seviye Soru #28 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000028
    },
    {
        "id": "q_sql_29",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "GROUP BY CUBE(A, B, C) ifadesi kaç farklı gruplama kombinasyonu (grouping set) üretir?",
        "options": [
            {
                "id": "A",
                "text": "3",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "6",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "9",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "8 (2^3)",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "CUBE n adet sütun için 2^n kombinasyon üretir. 3 sütun için 2^3 = 8 farklı gruplama seti oluşturur: (A,B,C), (A,B), (A,C), (B,C), (A), (B), (C), ().",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: GROUP BY - CUBE",
            "keyTakeaway": "SQL İleri Seviye Soru #29 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000029
    },
    {
        "id": "q_sql_30",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "LAST_VALUE() window fonksiyonu kullanılırken 'ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING' çerçevesi eklenmezse neden beklenen son satırı vermez?",
        "options": [
            {
                "id": "A",
                "text": "Çünkü LAST_VALUE sadece alfabetik sıralamada çalışır.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Çünkü tablonun sıralaması bozuktur.",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Çünkü LAST_VALUE fonksiyonu NULL değerleri otomatik siler.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Çünkü varsayılan pencere çerçevesi (frame) CURRENT ROW'a kadardır ve her satırda kendisini son satır görür.",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "Varsayılan pencere çerçevesi `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` olduğundan, pencere o anki satırda biter ve LAST_VALUE hep o anki satırı döndürür.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Window Functions - FIRST_VALUE & LAST_VALUE",
            "keyTakeaway": "SQL İleri Seviye Soru #30 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000030
    },
    {
        "id": "q_sql_31",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(31) [Index - Partial / Filtered Index] Sadece belirli bir koşulu sağlayan satırlar için oluşturulan indekse (Örn: WHERE silindi = FALSE) ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Filtered Index (Kısmi / Filtrelenmiş İndeks)",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Clustered Index",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Global Index",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Bitmap Index",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Filtered Index (Partial Index), tablonun tamamı yerine sadece WHERE koşuluna uyan satırları indeksleyerek disk alanı ve bakım maliyetinden tasarruf sağlar.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Index - Partial / Filtered Index",
            "keyTakeaway": "SQL İleri Seviye Soru #31 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000031
    },
    {
        "id": "q_sql_32",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(32) [Transaction - Deadlock (Kilitlenme)] İki farklı transaction'ın birbirinin kilitlediği kaynakları karşılıklı olarak beklemesi sonucu oluşan kilitlenmeye ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Livelock",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Deadlock (Ölümcül Kilitlenme)",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Starvation",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Latch",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Deadlock, Transaction A'nın Kaynak 1'i kilitleyip Kaynak 2'yi beklemesi, Transaction B'nin ise Kaynak 2'yi kilitleyip Kaynak 1'i beklemesi durumudur. VTYS birini kurban (victim) seçerek çözer.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Transaction - Deadlock (Kilitlenme)",
            "keyTakeaway": "SQL İleri Seviye Soru #32 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000032
    },
    {
        "id": "q_sql_33",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(33) [SQL Security - SQL Injection] SQL Injection (SQL Enjeksiyonu) saldırılarını veritabanı uygulama seviyesinde tamamen engellemenin en etkili ve standart yöntemi nedir?",
        "options": [
            {
                "id": "A",
                "text": "Girdileri tırnak işaretlerinden arındırmak",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tüm sorguları büyük harfe çevirmek",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Parametreli Sorgular (Prepared Statements / Parameterized Queries) kullanmak",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Sadece GET istekleri kullanmak",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Prepared Statements (Parametreli Sorgular), kullanıcı girdisini SQL komut kodundan ayırarak veri olarak işler ve SQL Injection'ı %100 engeller.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: SQL Security - SQL Injection",
            "keyTakeaway": "SQL İleri Seviye Soru #33 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000033
    },
    {
        "id": "q_sql_34",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(34) [Database Normalization - 3NF] Üçüncü Normal Form (3NF) şartı aşağıdakilerden hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "Tabloda tekrarlayan sütunların olmaması",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tüm alanların atomik olması",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Foreign key bulunmaması",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tablonun 2NF'de olması ve birincil anahtara geçişli (transitive) bağımlılığın olmaması",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "3NF kuralı: Tablo 2NF olmalı ve birincil anahtar olmayan bir alan, başka bir birincil anahtar olmayan alana bağımlı olmamalıdır (No Transitive Dependency).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - 3NF",
            "keyTakeaway": "SQL İleri Seviye Soru #34 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000034
    },
    {
        "id": "q_sql_35",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(35) [Database Normalization - BCNF] Boyce-Codd Normal Form (BCNF), 3NF'den farklı olarak hangi ekstra kuralı zorunlu kılar?",
        "options": [
            {
                "id": "A",
                "text": "Tabloda hiç NULL değer bulunmaması kuralı",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "En fazla 5 sütun bulunabilmesi kuralı",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Tüm sütunların sayısal olması kuralı",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Her determinantın (belirleyicinin) mutlaka bir aday anahtar (candidate key) olması kuralı",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "BCNF, 3NF'nin daha katı bir halidir. Her X -> Y bağımlılığında X'in mutlaka bir Super Key / Candidate Key olmasını şart koşar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - BCNF",
            "keyTakeaway": "SQL İleri Seviye Soru #35 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000035
    },
    {
        "id": "q_sql_36",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(36) [Constraint - CHECK Constraint] Bir tablodaki `yas` sütununa sadece 18 ve üzeri değerlerin girilebilmesini sağlayan kısıtlama (constraint) hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "CHECK (yas >= 18)",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "DEFAULT (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "FOREIGN KEY (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "UNIQUE (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "CHECK kısıtlaması bir sütuna girilebilecek verilerin belirli bir mantıksal koşula (Boolean expression) uymasını zorunlu kılar.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Constraint - CHECK Constraint",
            "keyTakeaway": "SQL İleri Seviye Soru #36 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000036
    },
    {
        "id": "q_sql_37",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(37) [Storage - CTE vs Temporary Table] Common Table Expression (CTE) ile Geçici Tablo (Temporary Table) arasındaki temel fark nedir?",
        "options": [
            {
                "id": "A",
                "text": "CTE sadece PostgreSQL'de vardır.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "CTE hafızada sadece ilgili sorgu süresince var olan mantıksal bir görünümdür; Temporary Table ise tempdb/oturum içinde fiziksel olarak oluşturulur ve indekslenebilir.",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Temporary Table silinemez.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "CTE diskte yer kaplar, Temporary Table kaplamaz.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "CTE tek bir sorgunun çalışma anı (scope) boyunca geçerli mantıksal yapıdır. Temporary Table ise oturum kapanana kadar tempdb'de fiziksel yaşar ve indekslenebilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Storage - CTE vs Temporary Table",
            "keyTakeaway": "SQL İleri Seviye Soru #37 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000037
    },
    {
        "id": "q_sql_38",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(38) [Query Optimization - SARGABLE Queries] SARGABLE (Search Argument Able) sorgu ifadesi ne anlama gelir?",
        "options": [
            {
                "id": "A",
                "text": "Sorgunun sonucunun bellekte saklanması",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Sorgunun otomatik olarak paralelleştirilmesi",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sorgudaki WHERE koşulunun indeksleri etkin bir şekilde kullanabilecek biçimde yazılmış olması",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Sorguda grafik çizilmesi",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "SARGABLE sorgular, indeksli sütunların üzerinde fonksiyon veya tip dönüşümü yapılmadan yazıldığı için VTYS'nin Index Seek yapabilmesine olanak tanır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Query Optimization - SARGABLE Queries",
            "keyTakeaway": "SQL İleri Seviye Soru #38 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000038
    },
    {
        "id": "q_sql_39",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(39) [Subquery - Scalar Subquery] Scalar Subquery (Skaler Alt Sorgu) ne tür bir sonuç döndürür?",
        "options": [
            {
                "id": "A",
                "text": "Bir tablo dolusu satır ve sütun",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Sadece Boolean (TRUE/FALSE) değer",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sadece dizi (Array) verisi",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tam olarak 1 satır ve 1 sütundan oluşan tek bir değer",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Scalar subquery tek bir hücre (1 satır × 1 sütun) değer döndüren sorgudur. Bu yüzden SELECT listesinde veya matematiksel ifadelerde kullanılabilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Subquery - Scalar Subquery",
            "keyTakeaway": "SQL İleri Seviye Soru #39 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000039
    },
    {
        "id": "q_sql_40",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(40) [JSON Data in SQL - JSON_EXTRACT / ->>] Modern ilişkisel veritabanlarında (PostgreSQL, MySQL vb.) saklanan JSON verisinden bir alanı metin (text) olarak çekmek için hangi operatör/fonksiyon kullanılır?",
        "options": [
            {
                "id": "A",
                "text": "SUM()",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "GROUP_CONCAT()",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "STRING_SPLIT()",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "PostgreSQL'de ->> operatörü / JSON_EXTRACT_TEXT",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "JSON alanlarından metin değeri çekmek için PostgreSQL'de `->>` operatörü, MySQL/SQLite'ta `JSON_EXTRACT()` veya `->>` kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: JSON Data in SQL - JSON_EXTRACT / ->>",
            "keyTakeaway": "SQL İleri Seviye Soru #40 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000040
    },
    {
        "id": "q_sql_41",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(41) [Index - Partial / Filtered Index] Sadece belirli bir koşulu sağlayan satırlar için oluşturulan indekse (Örn: WHERE silindi = FALSE) ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Filtered Index (Kısmi / Filtrelenmiş İndeks)",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Clustered Index",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Global Index",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Bitmap Index",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Filtered Index (Partial Index), tablonun tamamı yerine sadece WHERE koşuluna uyan satırları indeksleyerek disk alanı ve bakım maliyetinden tasarruf sağlar.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Index - Partial / Filtered Index",
            "keyTakeaway": "SQL İleri Seviye Soru #41 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000041
    },
    {
        "id": "q_sql_42",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(42) [Transaction - Deadlock (Kilitlenme)] İki farklı transaction'ın birbirinin kilitlediği kaynakları karşılıklı olarak beklemesi sonucu oluşan kilitlenmeye ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Livelock",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Deadlock (Ölümcül Kilitlenme)",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Starvation",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Latch",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Deadlock, Transaction A'nın Kaynak 1'i kilitleyip Kaynak 2'yi beklemesi, Transaction B'nin ise Kaynak 2'yi kilitleyip Kaynak 1'i beklemesi durumudur. VTYS birini kurban (victim) seçerek çözer.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Transaction - Deadlock (Kilitlenme)",
            "keyTakeaway": "SQL İleri Seviye Soru #42 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000042
    },
    {
        "id": "q_sql_43",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(43) [SQL Security - SQL Injection] SQL Injection (SQL Enjeksiyonu) saldırılarını veritabanı uygulama seviyesinde tamamen engellemenin en etkili ve standart yöntemi nedir?",
        "options": [
            {
                "id": "A",
                "text": "Girdileri tırnak işaretlerinden arındırmak",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tüm sorguları büyük harfe çevirmek",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Parametreli Sorgular (Prepared Statements / Parameterized Queries) kullanmak",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Sadece GET istekleri kullanmak",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Prepared Statements (Parametreli Sorgular), kullanıcı girdisini SQL komut kodundan ayırarak veri olarak işler ve SQL Injection'ı %100 engeller.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: SQL Security - SQL Injection",
            "keyTakeaway": "SQL İleri Seviye Soru #43 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000043
    },
    {
        "id": "q_sql_44",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(44) [Database Normalization - 3NF] Üçüncü Normal Form (3NF) şartı aşağıdakilerden hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "Tabloda tekrarlayan sütunların olmaması",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tüm alanların atomik olması",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Foreign key bulunmaması",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tablonun 2NF'de olması ve birincil anahtara geçişli (transitive) bağımlılığın olmaması",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "3NF kuralı: Tablo 2NF olmalı ve birincil anahtar olmayan bir alan, başka bir birincil anahtar olmayan alana bağımlı olmamalıdır (No Transitive Dependency).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - 3NF",
            "keyTakeaway": "SQL İleri Seviye Soru #44 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000044
    },
    {
        "id": "q_sql_45",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(45) [Database Normalization - BCNF] Boyce-Codd Normal Form (BCNF), 3NF'den farklı olarak hangi ekstra kuralı zorunlu kılar?",
        "options": [
            {
                "id": "A",
                "text": "Tabloda hiç NULL değer bulunmaması kuralı",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "En fazla 5 sütun bulunabilmesi kuralı",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Tüm sütunların sayısal olması kuralı",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Her determinantın (belirleyicinin) mutlaka bir aday anahtar (candidate key) olması kuralı",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "BCNF, 3NF'nin daha katı bir halidir. Her X -> Y bağımlılığında X'in mutlaka bir Super Key / Candidate Key olmasını şart koşar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - BCNF",
            "keyTakeaway": "SQL İleri Seviye Soru #45 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000045
    },
    {
        "id": "q_sql_46",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(46) [Constraint - CHECK Constraint] Bir tablodaki `yas` sütununa sadece 18 ve üzeri değerlerin girilebilmesini sağlayan kısıtlama (constraint) hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "CHECK (yas >= 18)",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "DEFAULT (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "FOREIGN KEY (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "UNIQUE (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "CHECK kısıtlaması bir sütuna girilebilecek verilerin belirli bir mantıksal koşula (Boolean expression) uymasını zorunlu kılar.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Constraint - CHECK Constraint",
            "keyTakeaway": "SQL İleri Seviye Soru #46 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000046
    },
    {
        "id": "q_sql_47",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(47) [Storage - CTE vs Temporary Table] Common Table Expression (CTE) ile Geçici Tablo (Temporary Table) arasındaki temel fark nedir?",
        "options": [
            {
                "id": "A",
                "text": "CTE sadece PostgreSQL'de vardır.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "CTE hafızada sadece ilgili sorgu süresince var olan mantıksal bir görünümdür; Temporary Table ise tempdb/oturum içinde fiziksel olarak oluşturulur ve indekslenebilir.",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Temporary Table silinemez.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "CTE diskte yer kaplar, Temporary Table kaplamaz.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "CTE tek bir sorgunun çalışma anı (scope) boyunca geçerli mantıksal yapıdır. Temporary Table ise oturum kapanana kadar tempdb'de fiziksel yaşar ve indekslenebilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Storage - CTE vs Temporary Table",
            "keyTakeaway": "SQL İleri Seviye Soru #47 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000047
    },
    {
        "id": "q_sql_48",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(48) [Query Optimization - SARGABLE Queries] SARGABLE (Search Argument Able) sorgu ifadesi ne anlama gelir?",
        "options": [
            {
                "id": "A",
                "text": "Sorgunun sonucunun bellekte saklanması",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Sorgunun otomatik olarak paralelleştirilmesi",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sorgudaki WHERE koşulunun indeksleri etkin bir şekilde kullanabilecek biçimde yazılmış olması",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Sorguda grafik çizilmesi",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "SARGABLE sorgular, indeksli sütunların üzerinde fonksiyon veya tip dönüşümü yapılmadan yazıldığı için VTYS'nin Index Seek yapabilmesine olanak tanır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Query Optimization - SARGABLE Queries",
            "keyTakeaway": "SQL İleri Seviye Soru #48 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000048
    },
    {
        "id": "q_sql_49",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(49) [Subquery - Scalar Subquery] Scalar Subquery (Skaler Alt Sorgu) ne tür bir sonuç döndürür?",
        "options": [
            {
                "id": "A",
                "text": "Bir tablo dolusu satır ve sütun",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Sadece Boolean (TRUE/FALSE) değer",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sadece dizi (Array) verisi",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tam olarak 1 satır ve 1 sütundan oluşan tek bir değer",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Scalar subquery tek bir hücre (1 satır × 1 sütun) değer döndüren sorgudur. Bu yüzden SELECT listesinde veya matematiksel ifadelerde kullanılabilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Subquery - Scalar Subquery",
            "keyTakeaway": "SQL İleri Seviye Soru #49 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000049
    },
    {
        "id": "q_sql_50",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(50) [JSON Data in SQL - JSON_EXTRACT / ->>] Modern ilişkisel veritabanlarında (PostgreSQL, MySQL vb.) saklanan JSON verisinden bir alanı metin (text) olarak çekmek için hangi operatör/fonksiyon kullanılır?",
        "options": [
            {
                "id": "A",
                "text": "SUM()",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "GROUP_CONCAT()",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "STRING_SPLIT()",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "PostgreSQL'de ->> operatörü / JSON_EXTRACT_TEXT",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "JSON alanlarından metin değeri çekmek için PostgreSQL'de `->>` operatörü, MySQL/SQLite'ta `JSON_EXTRACT()` veya `->>` kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: JSON Data in SQL - JSON_EXTRACT / ->>",
            "keyTakeaway": "SQL İleri Seviye Soru #50 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000050
    },
    {
        "id": "q_sql_51",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(51) [Index - Partial / Filtered Index] Sadece belirli bir koşulu sağlayan satırlar için oluşturulan indekse (Örn: WHERE silindi = FALSE) ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Filtered Index (Kısmi / Filtrelenmiş İndeks)",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Clustered Index",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Global Index",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Bitmap Index",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Filtered Index (Partial Index), tablonun tamamı yerine sadece WHERE koşuluna uyan satırları indeksleyerek disk alanı ve bakım maliyetinden tasarruf sağlar.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Index - Partial / Filtered Index",
            "keyTakeaway": "SQL İleri Seviye Soru #51 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000051
    },
    {
        "id": "q_sql_52",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(52) [Transaction - Deadlock (Kilitlenme)] İki farklı transaction'ın birbirinin kilitlediği kaynakları karşılıklı olarak beklemesi sonucu oluşan kilitlenmeye ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Livelock",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Deadlock (Ölümcül Kilitlenme)",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Starvation",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Latch",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Deadlock, Transaction A'nın Kaynak 1'i kilitleyip Kaynak 2'yi beklemesi, Transaction B'nin ise Kaynak 2'yi kilitleyip Kaynak 1'i beklemesi durumudur. VTYS birini kurban (victim) seçerek çözer.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Transaction - Deadlock (Kilitlenme)",
            "keyTakeaway": "SQL İleri Seviye Soru #52 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000052
    },
    {
        "id": "q_sql_53",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(53) [SQL Security - SQL Injection] SQL Injection (SQL Enjeksiyonu) saldırılarını veritabanı uygulama seviyesinde tamamen engellemenin en etkili ve standart yöntemi nedir?",
        "options": [
            {
                "id": "A",
                "text": "Girdileri tırnak işaretlerinden arındırmak",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tüm sorguları büyük harfe çevirmek",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Parametreli Sorgular (Prepared Statements / Parameterized Queries) kullanmak",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Sadece GET istekleri kullanmak",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Prepared Statements (Parametreli Sorgular), kullanıcı girdisini SQL komut kodundan ayırarak veri olarak işler ve SQL Injection'ı %100 engeller.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: SQL Security - SQL Injection",
            "keyTakeaway": "SQL İleri Seviye Soru #53 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000053
    },
    {
        "id": "q_sql_54",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(54) [Database Normalization - 3NF] Üçüncü Normal Form (3NF) şartı aşağıdakilerden hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "Tabloda tekrarlayan sütunların olmaması",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tüm alanların atomik olması",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Foreign key bulunmaması",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tablonun 2NF'de olması ve birincil anahtara geçişli (transitive) bağımlılığın olmaması",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "3NF kuralı: Tablo 2NF olmalı ve birincil anahtar olmayan bir alan, başka bir birincil anahtar olmayan alana bağımlı olmamalıdır (No Transitive Dependency).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - 3NF",
            "keyTakeaway": "SQL İleri Seviye Soru #54 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000054
    },
    {
        "id": "q_sql_55",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(55) [Database Normalization - BCNF] Boyce-Codd Normal Form (BCNF), 3NF'den farklı olarak hangi ekstra kuralı zorunlu kılar?",
        "options": [
            {
                "id": "A",
                "text": "Tabloda hiç NULL değer bulunmaması kuralı",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "En fazla 5 sütun bulunabilmesi kuralı",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Tüm sütunların sayısal olması kuralı",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Her determinantın (belirleyicinin) mutlaka bir aday anahtar (candidate key) olması kuralı",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "BCNF, 3NF'nin daha katı bir halidir. Her X -> Y bağımlılığında X'in mutlaka bir Super Key / Candidate Key olmasını şart koşar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - BCNF",
            "keyTakeaway": "SQL İleri Seviye Soru #55 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000055
    },
    {
        "id": "q_sql_56",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(56) [Constraint - CHECK Constraint] Bir tablodaki `yas` sütununa sadece 18 ve üzeri değerlerin girilebilmesini sağlayan kısıtlama (constraint) hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "CHECK (yas >= 18)",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "DEFAULT (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "FOREIGN KEY (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "UNIQUE (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "CHECK kısıtlaması bir sütuna girilebilecek verilerin belirli bir mantıksal koşula (Boolean expression) uymasını zorunlu kılar.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Constraint - CHECK Constraint",
            "keyTakeaway": "SQL İleri Seviye Soru #56 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000056
    },
    {
        "id": "q_sql_57",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(57) [Storage - CTE vs Temporary Table] Common Table Expression (CTE) ile Geçici Tablo (Temporary Table) arasındaki temel fark nedir?",
        "options": [
            {
                "id": "A",
                "text": "CTE sadece PostgreSQL'de vardır.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "CTE hafızada sadece ilgili sorgu süresince var olan mantıksal bir görünümdür; Temporary Table ise tempdb/oturum içinde fiziksel olarak oluşturulur ve indekslenebilir.",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Temporary Table silinemez.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "CTE diskte yer kaplar, Temporary Table kaplamaz.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "CTE tek bir sorgunun çalışma anı (scope) boyunca geçerli mantıksal yapıdır. Temporary Table ise oturum kapanana kadar tempdb'de fiziksel yaşar ve indekslenebilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Storage - CTE vs Temporary Table",
            "keyTakeaway": "SQL İleri Seviye Soru #57 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000057
    },
    {
        "id": "q_sql_58",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(58) [Query Optimization - SARGABLE Queries] SARGABLE (Search Argument Able) sorgu ifadesi ne anlama gelir?",
        "options": [
            {
                "id": "A",
                "text": "Sorgunun sonucunun bellekte saklanması",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Sorgunun otomatik olarak paralelleştirilmesi",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sorgudaki WHERE koşulunun indeksleri etkin bir şekilde kullanabilecek biçimde yazılmış olması",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Sorguda grafik çizilmesi",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "SARGABLE sorgular, indeksli sütunların üzerinde fonksiyon veya tip dönüşümü yapılmadan yazıldığı için VTYS'nin Index Seek yapabilmesine olanak tanır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Query Optimization - SARGABLE Queries",
            "keyTakeaway": "SQL İleri Seviye Soru #58 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000058
    },
    {
        "id": "q_sql_59",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(59) [Subquery - Scalar Subquery] Scalar Subquery (Skaler Alt Sorgu) ne tür bir sonuç döndürür?",
        "options": [
            {
                "id": "A",
                "text": "Bir tablo dolusu satır ve sütun",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Sadece Boolean (TRUE/FALSE) değer",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sadece dizi (Array) verisi",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tam olarak 1 satır ve 1 sütundan oluşan tek bir değer",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Scalar subquery tek bir hücre (1 satır × 1 sütun) değer döndüren sorgudur. Bu yüzden SELECT listesinde veya matematiksel ifadelerde kullanılabilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Subquery - Scalar Subquery",
            "keyTakeaway": "SQL İleri Seviye Soru #59 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000059
    },
    {
        "id": "q_sql_60",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(60) [JSON Data in SQL - JSON_EXTRACT / ->>] Modern ilişkisel veritabanlarında (PostgreSQL, MySQL vb.) saklanan JSON verisinden bir alanı metin (text) olarak çekmek için hangi operatör/fonksiyon kullanılır?",
        "options": [
            {
                "id": "A",
                "text": "SUM()",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "GROUP_CONCAT()",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "STRING_SPLIT()",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "PostgreSQL'de ->> operatörü / JSON_EXTRACT_TEXT",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "JSON alanlarından metin değeri çekmek için PostgreSQL'de `->>` operatörü, MySQL/SQLite'ta `JSON_EXTRACT()` veya `->>` kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: JSON Data in SQL - JSON_EXTRACT / ->>",
            "keyTakeaway": "SQL İleri Seviye Soru #60 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000060
    },
    {
        "id": "q_sql_61",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(61) [Index - Partial / Filtered Index] Sadece belirli bir koşulu sağlayan satırlar için oluşturulan indekse (Örn: WHERE silindi = FALSE) ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Filtered Index (Kısmi / Filtrelenmiş İndeks)",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Clustered Index",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Global Index",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Bitmap Index",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Filtered Index (Partial Index), tablonun tamamı yerine sadece WHERE koşuluna uyan satırları indeksleyerek disk alanı ve bakım maliyetinden tasarruf sağlar.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Index - Partial / Filtered Index",
            "keyTakeaway": "SQL İleri Seviye Soru #61 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000061
    },
    {
        "id": "q_sql_62",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(62) [Transaction - Deadlock (Kilitlenme)] İki farklı transaction'ın birbirinin kilitlediği kaynakları karşılıklı olarak beklemesi sonucu oluşan kilitlenmeye ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Livelock",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Deadlock (Ölümcül Kilitlenme)",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Starvation",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Latch",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Deadlock, Transaction A'nın Kaynak 1'i kilitleyip Kaynak 2'yi beklemesi, Transaction B'nin ise Kaynak 2'yi kilitleyip Kaynak 1'i beklemesi durumudur. VTYS birini kurban (victim) seçerek çözer.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Transaction - Deadlock (Kilitlenme)",
            "keyTakeaway": "SQL İleri Seviye Soru #62 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000062
    },
    {
        "id": "q_sql_63",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(63) [SQL Security - SQL Injection] SQL Injection (SQL Enjeksiyonu) saldırılarını veritabanı uygulama seviyesinde tamamen engellemenin en etkili ve standart yöntemi nedir?",
        "options": [
            {
                "id": "A",
                "text": "Girdileri tırnak işaretlerinden arındırmak",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tüm sorguları büyük harfe çevirmek",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Parametreli Sorgular (Prepared Statements / Parameterized Queries) kullanmak",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Sadece GET istekleri kullanmak",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Prepared Statements (Parametreli Sorgular), kullanıcı girdisini SQL komut kodundan ayırarak veri olarak işler ve SQL Injection'ı %100 engeller.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: SQL Security - SQL Injection",
            "keyTakeaway": "SQL İleri Seviye Soru #63 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000063
    },
    {
        "id": "q_sql_64",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(64) [Database Normalization - 3NF] Üçüncü Normal Form (3NF) şartı aşağıdakilerden hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "Tabloda tekrarlayan sütunların olmaması",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tüm alanların atomik olması",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Foreign key bulunmaması",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tablonun 2NF'de olması ve birincil anahtara geçişli (transitive) bağımlılığın olmaması",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "3NF kuralı: Tablo 2NF olmalı ve birincil anahtar olmayan bir alan, başka bir birincil anahtar olmayan alana bağımlı olmamalıdır (No Transitive Dependency).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - 3NF",
            "keyTakeaway": "SQL İleri Seviye Soru #64 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000064
    },
    {
        "id": "q_sql_65",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(65) [Database Normalization - BCNF] Boyce-Codd Normal Form (BCNF), 3NF'den farklı olarak hangi ekstra kuralı zorunlu kılar?",
        "options": [
            {
                "id": "A",
                "text": "Tabloda hiç NULL değer bulunmaması kuralı",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "En fazla 5 sütun bulunabilmesi kuralı",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Tüm sütunların sayısal olması kuralı",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Her determinantın (belirleyicinin) mutlaka bir aday anahtar (candidate key) olması kuralı",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "BCNF, 3NF'nin daha katı bir halidir. Her X -> Y bağımlılığında X'in mutlaka bir Super Key / Candidate Key olmasını şart koşar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - BCNF",
            "keyTakeaway": "SQL İleri Seviye Soru #65 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000065
    },
    {
        "id": "q_sql_66",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(66) [Constraint - CHECK Constraint] Bir tablodaki `yas` sütununa sadece 18 ve üzeri değerlerin girilebilmesini sağlayan kısıtlama (constraint) hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "CHECK (yas >= 18)",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "DEFAULT (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "FOREIGN KEY (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "UNIQUE (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "CHECK kısıtlaması bir sütuna girilebilecek verilerin belirli bir mantıksal koşula (Boolean expression) uymasını zorunlu kılar.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Constraint - CHECK Constraint",
            "keyTakeaway": "SQL İleri Seviye Soru #66 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000066
    },
    {
        "id": "q_sql_67",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(67) [Storage - CTE vs Temporary Table] Common Table Expression (CTE) ile Geçici Tablo (Temporary Table) arasındaki temel fark nedir?",
        "options": [
            {
                "id": "A",
                "text": "CTE sadece PostgreSQL'de vardır.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "CTE hafızada sadece ilgili sorgu süresince var olan mantıksal bir görünümdür; Temporary Table ise tempdb/oturum içinde fiziksel olarak oluşturulur ve indekslenebilir.",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Temporary Table silinemez.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "CTE diskte yer kaplar, Temporary Table kaplamaz.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "CTE tek bir sorgunun çalışma anı (scope) boyunca geçerli mantıksal yapıdır. Temporary Table ise oturum kapanana kadar tempdb'de fiziksel yaşar ve indekslenebilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Storage - CTE vs Temporary Table",
            "keyTakeaway": "SQL İleri Seviye Soru #67 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000067
    },
    {
        "id": "q_sql_68",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(68) [Query Optimization - SARGABLE Queries] SARGABLE (Search Argument Able) sorgu ifadesi ne anlama gelir?",
        "options": [
            {
                "id": "A",
                "text": "Sorgunun sonucunun bellekte saklanması",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Sorgunun otomatik olarak paralelleştirilmesi",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sorgudaki WHERE koşulunun indeksleri etkin bir şekilde kullanabilecek biçimde yazılmış olması",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Sorguda grafik çizilmesi",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "SARGABLE sorgular, indeksli sütunların üzerinde fonksiyon veya tip dönüşümü yapılmadan yazıldığı için VTYS'nin Index Seek yapabilmesine olanak tanır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Query Optimization - SARGABLE Queries",
            "keyTakeaway": "SQL İleri Seviye Soru #68 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000068
    },
    {
        "id": "q_sql_69",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(69) [Subquery - Scalar Subquery] Scalar Subquery (Skaler Alt Sorgu) ne tür bir sonuç döndürür?",
        "options": [
            {
                "id": "A",
                "text": "Bir tablo dolusu satır ve sütun",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Sadece Boolean (TRUE/FALSE) değer",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sadece dizi (Array) verisi",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tam olarak 1 satır ve 1 sütundan oluşan tek bir değer",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Scalar subquery tek bir hücre (1 satır × 1 sütun) değer döndüren sorgudur. Bu yüzden SELECT listesinde veya matematiksel ifadelerde kullanılabilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Subquery - Scalar Subquery",
            "keyTakeaway": "SQL İleri Seviye Soru #69 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000069
    },
    {
        "id": "q_sql_70",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(70) [JSON Data in SQL - JSON_EXTRACT / ->>] Modern ilişkisel veritabanlarında (PostgreSQL, MySQL vb.) saklanan JSON verisinden bir alanı metin (text) olarak çekmek için hangi operatör/fonksiyon kullanılır?",
        "options": [
            {
                "id": "A",
                "text": "SUM()",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "GROUP_CONCAT()",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "STRING_SPLIT()",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "PostgreSQL'de ->> operatörü / JSON_EXTRACT_TEXT",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "JSON alanlarından metin değeri çekmek için PostgreSQL'de `->>` operatörü, MySQL/SQLite'ta `JSON_EXTRACT()` veya `->>` kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: JSON Data in SQL - JSON_EXTRACT / ->>",
            "keyTakeaway": "SQL İleri Seviye Soru #70 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000070
    },
    {
        "id": "q_sql_71",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(71) [Index - Partial / Filtered Index] Sadece belirli bir koşulu sağlayan satırlar için oluşturulan indekse (Örn: WHERE silindi = FALSE) ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Filtered Index (Kısmi / Filtrelenmiş İndeks)",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Clustered Index",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Global Index",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Bitmap Index",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Filtered Index (Partial Index), tablonun tamamı yerine sadece WHERE koşuluna uyan satırları indeksleyerek disk alanı ve bakım maliyetinden tasarruf sağlar.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Index - Partial / Filtered Index",
            "keyTakeaway": "SQL İleri Seviye Soru #71 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000071
    },
    {
        "id": "q_sql_72",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(72) [Transaction - Deadlock (Kilitlenme)] İki farklı transaction'ın birbirinin kilitlediği kaynakları karşılıklı olarak beklemesi sonucu oluşan kilitlenmeye ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Livelock",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Deadlock (Ölümcül Kilitlenme)",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Starvation",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Latch",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Deadlock, Transaction A'nın Kaynak 1'i kilitleyip Kaynak 2'yi beklemesi, Transaction B'nin ise Kaynak 2'yi kilitleyip Kaynak 1'i beklemesi durumudur. VTYS birini kurban (victim) seçerek çözer.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Transaction - Deadlock (Kilitlenme)",
            "keyTakeaway": "SQL İleri Seviye Soru #72 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000072
    },
    {
        "id": "q_sql_73",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(73) [SQL Security - SQL Injection] SQL Injection (SQL Enjeksiyonu) saldırılarını veritabanı uygulama seviyesinde tamamen engellemenin en etkili ve standart yöntemi nedir?",
        "options": [
            {
                "id": "A",
                "text": "Girdileri tırnak işaretlerinden arındırmak",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tüm sorguları büyük harfe çevirmek",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Parametreli Sorgular (Prepared Statements / Parameterized Queries) kullanmak",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Sadece GET istekleri kullanmak",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Prepared Statements (Parametreli Sorgular), kullanıcı girdisini SQL komut kodundan ayırarak veri olarak işler ve SQL Injection'ı %100 engeller.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: SQL Security - SQL Injection",
            "keyTakeaway": "SQL İleri Seviye Soru #73 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000073
    },
    {
        "id": "q_sql_74",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(74) [Database Normalization - 3NF] Üçüncü Normal Form (3NF) şartı aşağıdakilerden hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "Tabloda tekrarlayan sütunların olmaması",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tüm alanların atomik olması",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Foreign key bulunmaması",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tablonun 2NF'de olması ve birincil anahtara geçişli (transitive) bağımlılığın olmaması",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "3NF kuralı: Tablo 2NF olmalı ve birincil anahtar olmayan bir alan, başka bir birincil anahtar olmayan alana bağımlı olmamalıdır (No Transitive Dependency).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - 3NF",
            "keyTakeaway": "SQL İleri Seviye Soru #74 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000074
    },
    {
        "id": "q_sql_75",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(75) [Database Normalization - BCNF] Boyce-Codd Normal Form (BCNF), 3NF'den farklı olarak hangi ekstra kuralı zorunlu kılar?",
        "options": [
            {
                "id": "A",
                "text": "Tabloda hiç NULL değer bulunmaması kuralı",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "En fazla 5 sütun bulunabilmesi kuralı",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Tüm sütunların sayısal olması kuralı",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Her determinantın (belirleyicinin) mutlaka bir aday anahtar (candidate key) olması kuralı",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "BCNF, 3NF'nin daha katı bir halidir. Her X -> Y bağımlılığında X'in mutlaka bir Super Key / Candidate Key olmasını şart koşar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - BCNF",
            "keyTakeaway": "SQL İleri Seviye Soru #75 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000075
    },
    {
        "id": "q_sql_76",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(76) [Constraint - CHECK Constraint] Bir tablodaki `yas` sütununa sadece 18 ve üzeri değerlerin girilebilmesini sağlayan kısıtlama (constraint) hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "CHECK (yas >= 18)",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "DEFAULT (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "FOREIGN KEY (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "UNIQUE (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "CHECK kısıtlaması bir sütuna girilebilecek verilerin belirli bir mantıksal koşula (Boolean expression) uymasını zorunlu kılar.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Constraint - CHECK Constraint",
            "keyTakeaway": "SQL İleri Seviye Soru #76 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000076
    },
    {
        "id": "q_sql_77",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(77) [Storage - CTE vs Temporary Table] Common Table Expression (CTE) ile Geçici Tablo (Temporary Table) arasındaki temel fark nedir?",
        "options": [
            {
                "id": "A",
                "text": "CTE sadece PostgreSQL'de vardır.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "CTE hafızada sadece ilgili sorgu süresince var olan mantıksal bir görünümdür; Temporary Table ise tempdb/oturum içinde fiziksel olarak oluşturulur ve indekslenebilir.",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Temporary Table silinemez.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "CTE diskte yer kaplar, Temporary Table kaplamaz.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "CTE tek bir sorgunun çalışma anı (scope) boyunca geçerli mantıksal yapıdır. Temporary Table ise oturum kapanana kadar tempdb'de fiziksel yaşar ve indekslenebilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Storage - CTE vs Temporary Table",
            "keyTakeaway": "SQL İleri Seviye Soru #77 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000077
    },
    {
        "id": "q_sql_78",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(78) [Query Optimization - SARGABLE Queries] SARGABLE (Search Argument Able) sorgu ifadesi ne anlama gelir?",
        "options": [
            {
                "id": "A",
                "text": "Sorgunun sonucunun bellekte saklanması",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Sorgunun otomatik olarak paralelleştirilmesi",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sorgudaki WHERE koşulunun indeksleri etkin bir şekilde kullanabilecek biçimde yazılmış olması",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Sorguda grafik çizilmesi",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "SARGABLE sorgular, indeksli sütunların üzerinde fonksiyon veya tip dönüşümü yapılmadan yazıldığı için VTYS'nin Index Seek yapabilmesine olanak tanır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Query Optimization - SARGABLE Queries",
            "keyTakeaway": "SQL İleri Seviye Soru #78 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000078
    },
    {
        "id": "q_sql_79",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(79) [Subquery - Scalar Subquery] Scalar Subquery (Skaler Alt Sorgu) ne tür bir sonuç döndürür?",
        "options": [
            {
                "id": "A",
                "text": "Bir tablo dolusu satır ve sütun",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Sadece Boolean (TRUE/FALSE) değer",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sadece dizi (Array) verisi",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tam olarak 1 satır ve 1 sütundan oluşan tek bir değer",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Scalar subquery tek bir hücre (1 satır × 1 sütun) değer döndüren sorgudur. Bu yüzden SELECT listesinde veya matematiksel ifadelerde kullanılabilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Subquery - Scalar Subquery",
            "keyTakeaway": "SQL İleri Seviye Soru #79 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000079
    },
    {
        "id": "q_sql_80",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(80) [JSON Data in SQL - JSON_EXTRACT / ->>] Modern ilişkisel veritabanlarında (PostgreSQL, MySQL vb.) saklanan JSON verisinden bir alanı metin (text) olarak çekmek için hangi operatör/fonksiyon kullanılır?",
        "options": [
            {
                "id": "A",
                "text": "SUM()",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "GROUP_CONCAT()",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "STRING_SPLIT()",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "PostgreSQL'de ->> operatörü / JSON_EXTRACT_TEXT",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "JSON alanlarından metin değeri çekmek için PostgreSQL'de `->>` operatörü, MySQL/SQLite'ta `JSON_EXTRACT()` veya `->>` kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: JSON Data in SQL - JSON_EXTRACT / ->>",
            "keyTakeaway": "SQL İleri Seviye Soru #80 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000080
    },
    {
        "id": "q_sql_81",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(81) [Index - Partial / Filtered Index] Sadece belirli bir koşulu sağlayan satırlar için oluşturulan indekse (Örn: WHERE silindi = FALSE) ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Filtered Index (Kısmi / Filtrelenmiş İndeks)",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Clustered Index",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Global Index",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Bitmap Index",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Filtered Index (Partial Index), tablonun tamamı yerine sadece WHERE koşuluna uyan satırları indeksleyerek disk alanı ve bakım maliyetinden tasarruf sağlar.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Index - Partial / Filtered Index",
            "keyTakeaway": "SQL İleri Seviye Soru #81 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000081
    },
    {
        "id": "q_sql_82",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(82) [Transaction - Deadlock (Kilitlenme)] İki farklı transaction'ın birbirinin kilitlediği kaynakları karşılıklı olarak beklemesi sonucu oluşan kilitlenmeye ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Livelock",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Deadlock (Ölümcül Kilitlenme)",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Starvation",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Latch",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Deadlock, Transaction A'nın Kaynak 1'i kilitleyip Kaynak 2'yi beklemesi, Transaction B'nin ise Kaynak 2'yi kilitleyip Kaynak 1'i beklemesi durumudur. VTYS birini kurban (victim) seçerek çözer.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Transaction - Deadlock (Kilitlenme)",
            "keyTakeaway": "SQL İleri Seviye Soru #82 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000082
    },
    {
        "id": "q_sql_83",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(83) [SQL Security - SQL Injection] SQL Injection (SQL Enjeksiyonu) saldırılarını veritabanı uygulama seviyesinde tamamen engellemenin en etkili ve standart yöntemi nedir?",
        "options": [
            {
                "id": "A",
                "text": "Girdileri tırnak işaretlerinden arındırmak",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tüm sorguları büyük harfe çevirmek",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Parametreli Sorgular (Prepared Statements / Parameterized Queries) kullanmak",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Sadece GET istekleri kullanmak",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Prepared Statements (Parametreli Sorgular), kullanıcı girdisini SQL komut kodundan ayırarak veri olarak işler ve SQL Injection'ı %100 engeller.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: SQL Security - SQL Injection",
            "keyTakeaway": "SQL İleri Seviye Soru #83 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000083
    },
    {
        "id": "q_sql_84",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(84) [Database Normalization - 3NF] Üçüncü Normal Form (3NF) şartı aşağıdakilerden hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "Tabloda tekrarlayan sütunların olmaması",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tüm alanların atomik olması",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Foreign key bulunmaması",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tablonun 2NF'de olması ve birincil anahtara geçişli (transitive) bağımlılığın olmaması",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "3NF kuralı: Tablo 2NF olmalı ve birincil anahtar olmayan bir alan, başka bir birincil anahtar olmayan alana bağımlı olmamalıdır (No Transitive Dependency).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - 3NF",
            "keyTakeaway": "SQL İleri Seviye Soru #84 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000084
    },
    {
        "id": "q_sql_85",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(85) [Database Normalization - BCNF] Boyce-Codd Normal Form (BCNF), 3NF'den farklı olarak hangi ekstra kuralı zorunlu kılar?",
        "options": [
            {
                "id": "A",
                "text": "Tabloda hiç NULL değer bulunmaması kuralı",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "En fazla 5 sütun bulunabilmesi kuralı",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Tüm sütunların sayısal olması kuralı",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Her determinantın (belirleyicinin) mutlaka bir aday anahtar (candidate key) olması kuralı",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "BCNF, 3NF'nin daha katı bir halidir. Her X -> Y bağımlılığında X'in mutlaka bir Super Key / Candidate Key olmasını şart koşar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - BCNF",
            "keyTakeaway": "SQL İleri Seviye Soru #85 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000085
    },
    {
        "id": "q_sql_86",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(86) [Constraint - CHECK Constraint] Bir tablodaki `yas` sütununa sadece 18 ve üzeri değerlerin girilebilmesini sağlayan kısıtlama (constraint) hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "CHECK (yas >= 18)",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "DEFAULT (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "FOREIGN KEY (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "UNIQUE (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "CHECK kısıtlaması bir sütuna girilebilecek verilerin belirli bir mantıksal koşula (Boolean expression) uymasını zorunlu kılar.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Constraint - CHECK Constraint",
            "keyTakeaway": "SQL İleri Seviye Soru #86 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000086
    },
    {
        "id": "q_sql_87",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(87) [Storage - CTE vs Temporary Table] Common Table Expression (CTE) ile Geçici Tablo (Temporary Table) arasındaki temel fark nedir?",
        "options": [
            {
                "id": "A",
                "text": "CTE sadece PostgreSQL'de vardır.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "CTE hafızada sadece ilgili sorgu süresince var olan mantıksal bir görünümdür; Temporary Table ise tempdb/oturum içinde fiziksel olarak oluşturulur ve indekslenebilir.",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Temporary Table silinemez.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "CTE diskte yer kaplar, Temporary Table kaplamaz.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "CTE tek bir sorgunun çalışma anı (scope) boyunca geçerli mantıksal yapıdır. Temporary Table ise oturum kapanana kadar tempdb'de fiziksel yaşar ve indekslenebilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Storage - CTE vs Temporary Table",
            "keyTakeaway": "SQL İleri Seviye Soru #87 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000087
    },
    {
        "id": "q_sql_88",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(88) [Query Optimization - SARGABLE Queries] SARGABLE (Search Argument Able) sorgu ifadesi ne anlama gelir?",
        "options": [
            {
                "id": "A",
                "text": "Sorgunun sonucunun bellekte saklanması",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Sorgunun otomatik olarak paralelleştirilmesi",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sorgudaki WHERE koşulunun indeksleri etkin bir şekilde kullanabilecek biçimde yazılmış olması",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Sorguda grafik çizilmesi",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "SARGABLE sorgular, indeksli sütunların üzerinde fonksiyon veya tip dönüşümü yapılmadan yazıldığı için VTYS'nin Index Seek yapabilmesine olanak tanır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Query Optimization - SARGABLE Queries",
            "keyTakeaway": "SQL İleri Seviye Soru #88 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000088
    },
    {
        "id": "q_sql_89",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(89) [Subquery - Scalar Subquery] Scalar Subquery (Skaler Alt Sorgu) ne tür bir sonuç döndürür?",
        "options": [
            {
                "id": "A",
                "text": "Bir tablo dolusu satır ve sütun",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Sadece Boolean (TRUE/FALSE) değer",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sadece dizi (Array) verisi",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tam olarak 1 satır ve 1 sütundan oluşan tek bir değer",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Scalar subquery tek bir hücre (1 satır × 1 sütun) değer döndüren sorgudur. Bu yüzden SELECT listesinde veya matematiksel ifadelerde kullanılabilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Subquery - Scalar Subquery",
            "keyTakeaway": "SQL İleri Seviye Soru #89 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000089
    },
    {
        "id": "q_sql_90",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(90) [JSON Data in SQL - JSON_EXTRACT / ->>] Modern ilişkisel veritabanlarında (PostgreSQL, MySQL vb.) saklanan JSON verisinden bir alanı metin (text) olarak çekmek için hangi operatör/fonksiyon kullanılır?",
        "options": [
            {
                "id": "A",
                "text": "SUM()",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "GROUP_CONCAT()",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "STRING_SPLIT()",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "PostgreSQL'de ->> operatörü / JSON_EXTRACT_TEXT",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "JSON alanlarından metin değeri çekmek için PostgreSQL'de `->>` operatörü, MySQL/SQLite'ta `JSON_EXTRACT()` veya `->>` kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: JSON Data in SQL - JSON_EXTRACT / ->>",
            "keyTakeaway": "SQL İleri Seviye Soru #90 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000090
    },
    {
        "id": "q_sql_91",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(91) [Index - Partial / Filtered Index] Sadece belirli bir koşulu sağlayan satırlar için oluşturulan indekse (Örn: WHERE silindi = FALSE) ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Filtered Index (Kısmi / Filtrelenmiş İndeks)",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "Clustered Index",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Global Index",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Bitmap Index",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Filtered Index (Partial Index), tablonun tamamı yerine sadece WHERE koşuluna uyan satırları indeksleyerek disk alanı ve bakım maliyetinden tasarruf sağlar.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Index - Partial / Filtered Index",
            "keyTakeaway": "SQL İleri Seviye Soru #91 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000091
    },
    {
        "id": "q_sql_92",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(92) [Transaction - Deadlock (Kilitlenme)] İki farklı transaction'ın birbirinin kilitlediği kaynakları karşılıklı olarak beklemesi sonucu oluşan kilitlenmeye ne ad verilir?",
        "options": [
            {
                "id": "A",
                "text": "Livelock",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Deadlock (Ölümcül Kilitlenme)",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Starvation",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Latch",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Deadlock, Transaction A'nın Kaynak 1'i kilitleyip Kaynak 2'yi beklemesi, Transaction B'nin ise Kaynak 2'yi kilitleyip Kaynak 1'i beklemesi durumudur. VTYS birini kurban (victim) seçerek çözer.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Transaction - Deadlock (Kilitlenme)",
            "keyTakeaway": "SQL İleri Seviye Soru #92 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000092
    },
    {
        "id": "q_sql_93",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(93) [SQL Security - SQL Injection] SQL Injection (SQL Enjeksiyonu) saldırılarını veritabanı uygulama seviyesinde tamamen engellemenin en etkili ve standart yöntemi nedir?",
        "options": [
            {
                "id": "A",
                "text": "Girdileri tırnak işaretlerinden arındırmak",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tüm sorguları büyük harfe çevirmek",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Parametreli Sorgular (Prepared Statements / Parameterized Queries) kullanmak",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Sadece GET istekleri kullanmak",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Prepared Statements (Parametreli Sorgular), kullanıcı girdisini SQL komut kodundan ayırarak veri olarak işler ve SQL Injection'ı %100 engeller.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: SQL Security - SQL Injection",
            "keyTakeaway": "SQL İleri Seviye Soru #93 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000093
    },
    {
        "id": "q_sql_94",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(94) [Database Normalization - 3NF] Üçüncü Normal Form (3NF) şartı aşağıdakilerden hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "Tabloda tekrarlayan sütunların olmaması",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Tüm alanların atomik olması",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Foreign key bulunmaması",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tablonun 2NF'de olması ve birincil anahtara geçişli (transitive) bağımlılığın olmaması",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "3NF kuralı: Tablo 2NF olmalı ve birincil anahtar olmayan bir alan, başka bir birincil anahtar olmayan alana bağımlı olmamalıdır (No Transitive Dependency).",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - 3NF",
            "keyTakeaway": "SQL İleri Seviye Soru #94 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000094
    },
    {
        "id": "q_sql_95",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(95) [Database Normalization - BCNF] Boyce-Codd Normal Form (BCNF), 3NF'den farklı olarak hangi ekstra kuralı zorunlu kılar?",
        "options": [
            {
                "id": "A",
                "text": "Tabloda hiç NULL değer bulunmaması kuralı",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "En fazla 5 sütun bulunabilmesi kuralı",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Tüm sütunların sayısal olması kuralı",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Her determinantın (belirleyicinin) mutlaka bir aday anahtar (candidate key) olması kuralı",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "BCNF, 3NF'nin daha katı bir halidir. Her X -> Y bağımlılığında X'in mutlaka bir Super Key / Candidate Key olmasını şart koşar.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Database Normalization - BCNF",
            "keyTakeaway": "SQL İleri Seviye Soru #95 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000095
    },
    {
        "id": "q_sql_96",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(96) [Constraint - CHECK Constraint] Bir tablodaki `yas` sütununa sadece 18 ve üzeri değerlerin girilebilmesini sağlayan kısıtlama (constraint) hangisidir?",
        "options": [
            {
                "id": "A",
                "text": "CHECK (yas >= 18)",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "DEFAULT (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "FOREIGN KEY (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "UNIQUE (yas >= 18)",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "CHECK kısıtlaması bir sütuna girilebilecek verilerin belirli bir mantıksal koşula (Boolean expression) uymasını zorunlu kılar.",
            "whyOthersIncorrect": {
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Constraint - CHECK Constraint",
            "keyTakeaway": "SQL İleri Seviye Soru #96 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000096
    },
    {
        "id": "q_sql_97",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(97) [Storage - CTE vs Temporary Table] Common Table Expression (CTE) ile Geçici Tablo (Temporary Table) arasındaki temel fark nedir?",
        "options": [
            {
                "id": "A",
                "text": "CTE sadece PostgreSQL'de vardır.",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "CTE hafızada sadece ilgili sorgu süresince var olan mantıksal bir görünümdür; Temporary Table ise tempdb/oturum içinde fiziksel olarak oluşturulur ve indekslenebilir.",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Temporary Table silinemez.",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "CTE diskte yer kaplar, Temporary Table kaplamaz.",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "CTE tek bir sorgunun çalışma anı (scope) boyunca geçerli mantıksal yapıdır. Temporary Table ise oturum kapanana kadar tempdb'de fiziksel yaşar ve indekslenebilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Storage - CTE vs Temporary Table",
            "keyTakeaway": "SQL İleri Seviye Soru #97 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000097
    },
    {
        "id": "q_sql_98",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(98) [Query Optimization - SARGABLE Queries] SARGABLE (Search Argument Able) sorgu ifadesi ne anlama gelir?",
        "options": [
            {
                "id": "A",
                "text": "Sorgunun sonucunun bellekte saklanması",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Sorgunun otomatik olarak paralelleştirilmesi",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sorgudaki WHERE koşulunun indeksleri etkin bir şekilde kullanabilecek biçimde yazılmış olması",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Sorguda grafik çizilmesi",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "SARGABLE sorgular, indeksli sütunların üzerinde fonksiyon veya tip dönüşümü yapılmadan yazıldığı için VTYS'nin Index Seek yapabilmesine olanak tanır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Query Optimization - SARGABLE Queries",
            "keyTakeaway": "SQL İleri Seviye Soru #98 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000098
    },
    {
        "id": "q_sql_99",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(99) [Subquery - Scalar Subquery] Scalar Subquery (Skaler Alt Sorgu) ne tür bir sonuç döndürür?",
        "options": [
            {
                "id": "A",
                "text": "Bir tablo dolusu satır ve sütun",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Sadece Boolean (TRUE/FALSE) değer",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Sadece dizi (Array) verisi",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Tam olarak 1 satır ve 1 sütundan oluşan tek bir değer",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Scalar subquery tek bir hücre (1 satır × 1 sütun) değer döndüren sorgudur. Bu yüzden SELECT listesinde veya matematiksel ifadelerde kullanılabilir.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "E": "E şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: Subquery - Scalar Subquery",
            "keyTakeaway": "SQL İleri Seviye Soru #99 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000099
    },
    {
        "id": "q_sql_100",
        "topic": "SQL Database",
        "difficulty": "advanced",
        "questionText": "(100) [JSON Data in SQL - JSON_EXTRACT / ->>] Modern ilişkisel veritabanlarında (PostgreSQL, MySQL vb.) saklanan JSON verisinden bir alanı metin (text) olarak çekmek için hangi operatör/fonksiyon kullanılır?",
        "options": [
            {
                "id": "A",
                "text": "SUM()",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "GROUP_CONCAT()",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "STRING_SPLIT()",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Yukarıdakilerin hiçbiri",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "PostgreSQL'de ->> operatörü / JSON_EXTRACT_TEXT",
                "isCorrect": true
            }
        ],
        "correctOptionId": "E",
        "explanation": {
            "whyCorrect": "JSON alanlarından metin değeri çekmek için PostgreSQL'de `->>` operatörü, MySQL/SQLite'ta `JSON_EXTRACT()` veya `->>` kullanılır.",
            "whyOthersIncorrect": {
                "A": "A şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "B": "B şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "C": "C şıkkı bu soru için çeldirici veya yanlış seçenektir.",
                "D": "D şıkkı bu soru için çeldirici veya yanlış seçenektir."
            },
            "topicSummary": "SQL Konu Analizi: JSON Data in SQL - JSON_EXTRACT / ->>",
            "keyTakeaway": "SQL İleri Seviye Soru #100 - Veritabanı ve sorgu optimizasyon kuralı."
        },
        "createdAt": 1710000000100
    }
],
  'İngilizce Grammar': [
    {
        "id": "q_oxford_1",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(1) We gave _____ a meal.",
        "options": [
            {
                "id": "A",
                "text": "at the visitors",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "for the visitors",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "the visitors",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "to the visitors",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Give fiili dolaylı nesne aldığında çift nesneli yapı (give someone something) kullanılır.",
            "whyOthersIncorrect": {
                "A": "Give fiilinden sonra direkt yönelme edatı 'at' kullanılmaz.",
                "B": "Give birine bir şey vermektir; 'for' yerine çift nesneli yapı kullanılır.",
                "D": "Give a meal to the visitors biçiminde edatlı sıradır; şıklarda direkt nesne yapısı 'the visitors' uygundur.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Words and sentences - Give + indirect object",
            "keyTakeaway": "Oxford Grammar Test Soru #1 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000001
    },
    {
        "id": "q_oxford_2",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(2) I'm busy at the moment. _____ on the computer.",
        "options": [
            {
                "id": "A",
                "text": "I work",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "I'm work",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "I'm working",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "I working",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Şu anda gerçekleşmekte olan eylemler için Present Continuous (am/is/are + V-ing) kullanılır.",
            "whyOthersIncorrect": {
                "A": "I work geniş zamandır; 'at the moment' şimdiki zaman gerektirir.",
                "B": "I'm work gramer açısından hatalıdır; be fiilinden sonra V-ing gelir.",
                "D": "I working eksik yapıdır; am yardımcı fiili eksiktir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Present Continuous",
            "keyTakeaway": "Oxford Grammar Test Soru #2 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000002
    },
    {
        "id": "q_oxford_3",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(3) My friend _____ the answer to the question.",
        "options": [
            {
                "id": "A",
                "text": "is know",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "know",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "knowing",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "knows",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Know (bilmek) bir durum fiilidir (stative verb) ve -ing takısı almaz; 3. tekil şahısta Simple Present (knows) kullanılır.",
            "whyOthersIncorrect": {
                "A": "is know hatalı gramer yapısıdır.",
                "B": "My friend 3. tekil şahıstır; -s takısı gerektirir (knows).",
                "C": "knowing yardımcı fiilsiz yüklem olamaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Stative Verbs",
            "keyTakeaway": "Oxford Grammar Test Soru #3 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000003
    },
    {
        "id": "q_oxford_4",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(4) I think I'll buy these shoes. _____ really well.",
        "options": [
            {
                "id": "A",
                "text": "They fit",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "They have fit",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "They're fitting",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "They were fitting",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Fit (tam gelmek) genel durum bildirdiği için Present Simple (They fit) kullanılır.",
            "whyOthersIncorrect": {
                "B": "Present Perfect bu durum için uygun değildir.",
                "C": "Fitting geçici durum vurgusu yapmaz.",
                "D": "Were fitting geçmiş zamandır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Stative & Present Simple",
            "keyTakeaway": "Oxford Grammar Test Soru #4 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000004
    },
    {
        "id": "q_oxford_5",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(5) Where _____ the car?",
        "options": [
            {
                "id": "A",
                "text": "did you park",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "did you parked",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "parked you",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "you parked",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Simple Past soru yapısında 'did + özne + V1' kullanılır.",
            "whyOthersIncorrect": {
                "B": "did kullanıldıktan sonra fiil tekrar -ed takısı almaz.",
                "C": "İngilizcede fiil özneden önce gelerek soru yapılmaz.",
                "D": "Soru cümlesinde did yardımcı fiili zorunludur.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Simple Past Question",
            "keyTakeaway": "Oxford Grammar Test Soru #5 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000005
    },
    {
        "id": "q_oxford_6",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(6) At nine o'clock yesterday morning we _____ for the bus.",
        "options": [
            {
                "id": "A",
                "text": "wait",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "waiting",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "was waiting",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "were waiting",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Geçmişte belirli bir anda devam eden eylemler için Past Continuous (were waiting) kullanılır.",
            "whyOthersIncorrect": {
                "A": "Wait geniş zamandır.",
                "B": "Yardımcı fiilsiz waiting yüklem olamaz.",
                "C": "We öznesi için 'was' değil 'were' kullanılır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Past Continuous",
            "keyTakeaway": "Oxford Grammar Test Soru #6 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000006
    },
    {
        "id": "q_oxford_7",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(7) When I looked round the door, the baby _____ quietly.",
        "options": [
            {
                "id": "A",
                "text": "is sleeping",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "slept",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "was sleeping",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "were sleeping",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Geçmişte bir eylem gerçekleştiğinde devam etmekte olan eylem Past Continuous (was sleeping) ile anlatılır.",
            "whyOthersIncorrect": {
                "A": "Is sleeping şimdiki zamandır.",
                "B": "Slept anlık tamamlanan eylemdir; uyuma süreci devam etmektedir.",
                "D": "The baby tekildir; 'were' kullanılmaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Past Continuous vs Simple Past",
            "keyTakeaway": "Oxford Grammar Test Soru #7 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000007
    },
    {
        "id": "q_oxford_8",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(8) Here's my report. _____ it at last.",
        "options": [
            {
                "id": "A",
                "text": "I finish",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "I finished",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "I'm finished",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "I've finished",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Eylem geçmişte tamamlanmış ve sonucu şu an elde ise Present Perfect (I've finished) kullanılır.",
            "whyOthersIncorrect": {
                "A": "I finish geniş zamandır.",
                "B": "Simple Past raporun şu an elimizde olduğunu vurgulamaz.",
                "C": "I'm finished eylemi ifade etmez.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Present Perfect Result",
            "keyTakeaway": "Oxford Grammar Test Soru #8 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000008
    },
    {
        "id": "q_oxford_9",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(9) I've _____ made some coffee. It's in the kitchen.",
        "options": [
            {
                "id": "A",
                "text": "ever",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "just",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "never",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "yet",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Az önce/henüz yapılmış eylemler için Present Perfect kalıbında 'just' kullanılır.",
            "whyOthersIncorrect": {
                "A": "Ever tecrübe sorgular.",
                "C": "Never olumsuzluk katar.",
                "D": "Yet cümlenin sonunda yer alır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Present Perfect with Just",
            "keyTakeaway": "Oxford Grammar Test Soru #9 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000009
    },
    {
        "id": "q_oxford_10",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(10) We _____ to Ireland for our holidays last year.",
        "options": [
            {
                "id": "A",
                "text": "goes",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "going",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "have gone",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "went",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "'Last year' gibi geçmişte zamanı belirli net ifadelerle Simple Past (went) kullanılır.",
            "whyOthersIncorrect": {
                "A": "Goes geniş zamandır.",
                "B": "Going yalnız yüklem olamaz.",
                "C": "Have gone Present Perfecttir; last year ile kullanılmaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Past Simple Time Adverb",
            "keyTakeaway": "Oxford Grammar Test Soru #10 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000010
    },
    {
        "id": "q_oxford_11",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(11) Rob _____ ill for three weeks. He's still in hospital.",
        "options": [
            {
                "id": "A",
                "text": "had been",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "has been",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "is",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "was",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Geçmişten başlayıp şu ana kadar devam eden ve hala süren durumlar için Present Perfect (has been) kullanılır.",
            "whyOthersIncorrect": {
                "A": "Had been geçmiş öncesidir.",
                "C": "Is 3 haftadır süren geçmiş bağlantısını kapsamaz.",
                "D": "Was hastalığın bittiğini ima eder.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Present Perfect Continuous State",
            "keyTakeaway": "Oxford Grammar Test Soru #11 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000011
    },
    {
        "id": "q_oxford_12",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(12) My arms are aching now because _____ since two o'clock.",
        "options": [
            {
                "id": "A",
                "text": "I'm swimming",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "I swam",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "I swim",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "I've been swimming",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Geçmişte başlayıp şu ana kadar süren ve fiziksel etkisi devam eden eylemlerde Present Perfect Continuous kullanılır.",
            "whyOthersIncorrect": {
                "A": "I'm swimming şu andaki eylemdir.",
                "B": "I swam geçmişte kalmıştır; since ile süreç vermez.",
                "C": "I swim geniş zamandır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Present Perfect Continuous Activity",
            "keyTakeaway": "Oxford Grammar Test Soru #12 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000012
    },
    {
        "id": "q_oxford_13",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(13) I'm very tired. _____ over 400 miles today.",
        "options": [
            {
                "id": "A",
                "text": "I drive",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "I'm driving",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "I've been driving",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "I've driven",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Bugün tamamlanan miktar/mesafe (400 miles) belirtildiğinde Present Perfect (I've driven) tercih edilir.",
            "whyOthersIncorrect": {
                "A": "I drive geniş zamandır.",
                "B": "I'm driving şu anki eylemdir.",
                "C": "Miktar belirtildiğinde -ing yapısı yerine tamamlanmış Perfect yapı tercih edilir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Present Perfect Quantity",
            "keyTakeaway": "Oxford Grammar Test Soru #13 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000013
    },
    {
        "id": "q_oxford_14",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(14) When Martin _____ the car, he took it out for a drive.",
        "options": [
            {
                "id": "A",
                "text": "had repaired",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "has repaired",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "repaired",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "was repairing",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Geçmişteki iki eylemden önce gerçekleşen eylem için Past Perfect (had repaired) kullanılır.",
            "whyOthersIncorrect": {
                "B": "Has repaired şimdiki zamana bağlıdır.",
                "C": "Repaired sıralı eylemlerde öncelik vurgusunu zayıflatır.",
                "D": "Was repairing devam eden süreçtir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Past Perfect Sequence",
            "keyTakeaway": "Oxford Grammar Test Soru #14 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000014
    },
    {
        "id": "q_oxford_15",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(15) Jessica was out of breath because _____.",
        "options": [
            {
                "id": "A",
                "text": "she'd been running",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "she did run",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "she's been running",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "she's run",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Geçmişteki bir durumun (was out of breath) öncesindeki fiziksel sebebini anlatırken Past Perfect Continuous (she'd been running) kullanılır.",
            "whyOthersIncorrect": {
                "B": "She did run vurgulu geçmiş zamandır; süreç sebebini vermez.",
                "C": "She's been running şimdiki zamana bağlıdır.",
                "D": "She's run şimdiki zamandır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Past Perfect Continuous Reason",
            "keyTakeaway": "Oxford Grammar Test Soru #15 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000015
    },
    {
        "id": "q_oxford_16",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(16) Don't worry. I _____ be here to help you.",
        "options": [
            {
                "id": "A",
                "text": "not",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "shall",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "willn't",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "won't",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Birinci tekil şahısta (I) söz verme ve teklif için 'shall' (veya will) kullanılır.",
            "whyOthersIncorrect": {
                "A": "not yalnız fiille birleşmez.",
                "C": "willn't diye bir kelime yoktur.",
                "D": "won't olumsuzdur; yardım edeceğim sözüyle çelişir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Future Intent / Promise",
            "keyTakeaway": "Oxford Grammar Test Soru #16 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000016
    },
    {
        "id": "q_oxford_17",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(17) Our friends _____ meet us at the airport tonight.",
        "options": [
            {
                "id": "A",
                "text": "are",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "are going to",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "go to",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "will be to",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Önceden planlanmış ve kararlaştırılmış gelecek eylemleri için 'be going to' kullanılır.",
            "whyOthersIncorrect": {
                "A": "are eksik yapıdır.",
                "C": "go to geniş zamandır.",
                "D": "will be to hatalı gramerdir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Future Intention / Plan",
            "keyTakeaway": "Oxford Grammar Test Soru #17 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000017
    },
    {
        "id": "q_oxford_18",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(18) _____ a party next Saturday. We've sent out the invitations.",
        "options": [
            {
                "id": "A",
                "text": "We had",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "We have",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "We'll have",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "We're having",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Davetiyeler gönderildiği için kesinleşmiş organizasyonlarda Present Continuous (We're having) kullanılır.",
            "whyOthersIncorrect": {
                "A": "We had geçmiş zamandır.",
                "B": "We have geniş zamandır.",
                "C": "We'll have anlık karardır; davetiye basılmış kesin organizasyondur.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Present Continuous for Future Arrangement",
            "keyTakeaway": "Oxford Grammar Test Soru #18 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000018
    },
    {
        "id": "q_oxford_19",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(19) I'll tell Anna all the news when _____ her.",
        "options": [
            {
                "id": "A",
                "text": "I'll see",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "I'm going to see",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "I see",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "I shall see",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "When, as soon as, before gibi zaman bağlaçlarının bulunduğu yan cümlede future tense yerine Present Simple (I see) kullanılır.",
            "whyOthersIncorrect": {
                "A": "When cümlesinde will kullanılmaz.",
                "B": "When cümlesinde going to kullanılmaz.",
                "D": "When cümlesinde shall kullanılmaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Time Clauses",
            "keyTakeaway": "Oxford Grammar Test Soru #19 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000019
    },
    {
        "id": "q_oxford_20",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(20) At this time tomorrow _____ over the Atlantic.",
        "options": [
            {
                "id": "A",
                "text": "we flying",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "we'll be flying",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "we'll fly",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "we to fly",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Gelecekte belirli bir anda (At this time tomorrow) devam ediyor olacak eylemler için Future Continuous (we'll be flying) kullanılır.",
            "whyOthersIncorrect": {
                "A": "we flying eksik yapıdır.",
                "C": "we'll fly anlık karardır; o andaki sürerliği vermez.",
                "D": "we to fly gramer hatasıdır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Future Continuous",
            "keyTakeaway": "Oxford Grammar Test Soru #20 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000020
    },
    {
        "id": "q_oxford_21",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(21) Where's Rob? _____ a shower?",
        "options": [
            {
                "id": "A",
                "text": "Does he have",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Has he",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Has he got",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Is he having",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Şu an duş almakta olup olmadığını sormak için Present Continuous (Is he having a shower?) kullanılır.",
            "whyOthersIncorrect": {
                "A": "Does he have alışkanlık sorar.",
                "B": "Has he duş almak eyleminde İngilizcede yalnız kullanılmaz.",
                "C": "Has he got sahip olmak demektir; duş alma eylemini kapsamaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Temporary Action in Progress",
            "keyTakeaway": "Oxford Grammar Test Soru #21 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000021
    },
    {
        "id": "q_oxford_22",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(22) I _____ like that coat. It's really nice.",
        "options": [
            {
                "id": "A",
                "text": "am",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "do",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "very",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "yes",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Olumlu cümlede duyguyu ve beğeniyi vurgulamak için fiilin önüne 'do' getirilir (I do like...).",
            "whyOthersIncorrect": {
                "A": "am like 'benzemek' anlamına gelir.",
                "C": "very fiilden önce gelip fiili nitelemez.",
                "D": "yes cümle ortasında fiilden önce kullanılmaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs - Emphatic Do",
            "keyTakeaway": "Oxford Grammar Test Soru #22 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000022
    },
    {
        "id": "q_oxford_23",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(23) What's the weather like in Canada? How often _____ there?",
        "options": [
            {
                "id": "A",
                "text": "does it snow",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "does it snows",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "snow it",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "snows it",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Geniş zaman sorularında 'does + özne + V1' kullanılır.",
            "whyOthersIncorrect": {
                "B": "does kullanıldıktan sonra fiile -s takısı gelmez (snows olamaz).",
                "C": "snow it devriği Türkçe düşünme hatasıdır.",
                "D": "snows it gramer hatasıdır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Questions - Present Simple Question",
            "keyTakeaway": "Oxford Grammar Test Soru #23 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000023
    },
    {
        "id": "q_oxford_24",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(24) Which team _____ the game?",
        "options": [
            {
                "id": "A",
                "text": "did it win",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "did they win",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "won",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "won it",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Soru kelimesi (Which team) cümlenin öznesi olduğunda 'did' yardımcı fiili kullanılmaz, direkt fiil (won) gelir.",
            "whyOthersIncorrect": {
                "A": "Soru kelimesi özne iken did ve it zamiri kullanılmaz.",
                "B": "Soru kelimesi özne olduğu için did kullanılmaz.",
                "D": "won it nesne zamiri tekrarı hatasıdır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Questions - Subject Questions",
            "keyTakeaway": "Oxford Grammar Test Soru #24 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000024
    },
    {
        "id": "q_oxford_25",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(25) What did you leave the meeting early _____ ? ~ I didn't feel very well.",
        "options": [
            {
                "id": "A",
                "text": "away",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "because",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "for",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "like",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "'What ... for?' kalıbı 'Ne için / Neden?' (Why?) sorusunun dengidir.",
            "whyOthersIncorrect": {
                "A": "leave away kalıbı kullanılmaz.",
                "B": "What ... because diye bir soru kalıbı yoktur.",
                "D": "What ... like dış görünüş/özellik sorar.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Questions - Preposition at the End",
            "keyTakeaway": "Oxford Grammar Test Soru #25 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000025
    },
    {
        "id": "q_oxford_26",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(26) Unfortunately the driver _____ the red light.",
        "options": [
            {
                "id": "A",
                "text": "didn't saw",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "didn't see",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "no saw",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "saw not",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Simple Past olumsuz cümlelerde 'didn't + V1' kullanılır.",
            "whyOthersIncorrect": {
                "A": "didn't sonrasında V2 (saw) kullanılamaz, V1 (see) olmalıdır.",
                "C": "no saw gramer hatasıdır.",
                "D": "saw not İngilizcede olumsuz yapma kuralı değildir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Negatives - Simple Past Negative",
            "keyTakeaway": "Oxford Grammar Test Soru #26 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000026
    },
    {
        "id": "q_oxford_27",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(27) You haven't eaten your pudding. _____ it?",
        "options": [
            {
                "id": "A",
                "text": "Are you no want",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Do you no want",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Don't want you",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Don't you want",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Olumsuz soru cümlelerinde 'Don't + özne + V1' (Don't you want...?) kalıbı kullanılır.",
            "whyOthersIncorrect": {
                "A": "Are you no want gramer hatasıdır.",
                "B": "Do you no want hatalı olumsuzluktur.",
                "C": "Don't want you kelime sırası yanlıştır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Questions - Negative Questions",
            "keyTakeaway": "Oxford Grammar Test Soru #27 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000027
    },
    {
        "id": "q_oxford_28",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(28) I really enjoyed the party. It was great, _____ ?",
        "options": [
            {
                "id": "A",
                "text": "is it",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "isn't it",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "was it",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "wasn't it",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Ana cümle olumlu Past Simple (It was) ise, onaylama sorusu (Tag Question) olumsuz Past Simple (wasn't it?) olur.",
            "whyOthersIncorrect": {
                "A": "is it şimdiki zamandır.",
                "B": "isn't it şimdiki zamandır.",
                "C": "was it olumludur; olumlu cümleye olumsuz tag gelir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Questions - Tag Questions",
            "keyTakeaway": "Oxford Grammar Test Soru #28 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000028
    },
    {
        "id": "q_oxford_29",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(29) Are we going the right way? ~ I think _____.",
        "options": [
            {
                "id": "A",
                "text": "indeed",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "it",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "so",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "yes",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Bir soruya 'Öyle sanıyorum / Sanırım öyle' demek için 'I think so' kalıbı kullanılır.",
            "whyOthersIncorrect": {
                "A": "indeed 'gerçekten' demektir; sanı bildiren think ile kalıp oluşturmaz.",
                "B": "I think it cümlesi eksiktir.",
                "D": "I think yes hatalı ifadedir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Answers - So after Think",
            "keyTakeaway": "Oxford Grammar Test Soru #29 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000029
    },
    {
        "id": "q_oxford_30",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(30) The chemist's was open, so luckily I _____ buy some aspirin.",
        "options": [
            {
                "id": "A",
                "text": "can",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "can't",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "did can",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "was able to",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Geçmişte belirli bir anda başarmak/yapa bilmek için 'was/were able to' kullanılır.",
            "whyOthersIncorrect": {
                "A": "can şimdiki zamandır.",
                "B": "can't olumsuzdur.",
                "C": "did can gramer hatasıdır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Modal verbs - Past Ability Specific Event",
            "keyTakeaway": "Oxford Grammar Test Soru #30 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000030
    },
    {
        "id": "q_oxford_31",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(31) Lucy has to work very hard. I _____ do her job, I'm sure.",
        "options": [
            {
                "id": "A",
                "text": "can't",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "couldn't",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "don't",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "shouldn't",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Varsayımsal olarak 'ben onun işini yapamazdım' derken 'couldn't' kullanılır.",
            "whyOthersIncorrect": {
                "A": "can't genel imkansızlıktır; varsayımda couldn't daha uygundur.",
                "C": "don't fiilizdir.",
                "D": "shouldn't tavsiyedir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Modal verbs - Hypothesis / Impossibility",
            "keyTakeaway": "Oxford Grammar Test Soru #31 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000031
    },
    {
        "id": "q_oxford_32",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(32) We had a party last night. _____ spend all morning clearing up the mess.",
        "options": [
            {
                "id": "A",
                "text": "I must have",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "I've been to",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "I've had to",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "I've must",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Geçmişteki eylemden dolayı şu an zorunda kalma durumu 'I've had to' ile ifade edilir.",
            "whyOthersIncorrect": {
                "A": "I must have geçmiş çıkarımdır.",
                "B": "I've been to bir yerde bulunmaktır.",
                "D": "I've must hatalı gramerdir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Modal verbs - Present Result of Past Obligation",
            "keyTakeaway": "Oxford Grammar Test Soru #32 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000032
    },
    {
        "id": "q_oxford_33",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(33) There was no one else at the box office. I _____ in a queue.",
        "options": [
            {
                "id": "A",
                "text": "didn't need to wait",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "mustn't wait",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "needn't have waited",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "needn't wait",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Geçmişte bir zorunluluk olmadığını ve bu yüzden yapılmadığını belirtmek için 'didn't need to wait' kullanılır.",
            "whyOthersIncorrect": {
                "B": "mustn't wait yasaktır.",
                "C": "needn't have waited lüzumsuz yere yapıldı anlamı katar (gişede kimse yokken beklenmedi).",
                "D": "needn't wait şimdiki zamandır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Modal verbs - Past Absence of Obligation",
            "keyTakeaway": "Oxford Grammar Test Soru #33 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000033
    },
    {
        "id": "q_oxford_34",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(34) _____ I carry that bag for you? ~ Oh, thank you.",
        "options": [
            {
                "id": "A",
                "text": "Do",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Shall",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "Will",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Would",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Birinci şahısta (I) yardım teklif ederken 'Shall I ...?' kalıbı kullanılır.",
            "whyOthersIncorrect": {
                "A": "Do I carry alışkanlık sorar.",
                "C": "Will I kendime soru sormak gibidir.",
                "D": "Would I nazik teklif yapmaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Modal verbs - Offers",
            "keyTakeaway": "Oxford Grammar Test Soru #34 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000034
    },
    {
        "id": "q_oxford_35",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(35) I've lost the key. I ought _____ it in a safe place.",
        "options": [
            {
                "id": "A",
                "text": "that I put",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "to be putting",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "to have put",
                "isCorrect": true
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Geçmişte yapılması gerekip de yapılmayan eylemler için 'ought to have + V3' kullanılır.",
            "whyOthersIncorrect": {
                "A": "that I put gramer hatasıdır.",
                "B": "to be putting devam eden eylemdir.",
                "D": "to put şimdiki/gelecek zamandır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Modal verbs - Past Unfulfilled Expectation",
            "keyTakeaway": "Oxford Grammar Test Soru #35 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000035
    },
    {
        "id": "q_oxford_36",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(36) We can't go along here because the road is _____.",
        "options": [
            {
                "id": "A",
                "text": "been repaired",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "being repaired",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "repair",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "repaired",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Şu an tamir edilmekte olduğunu anlatmak için Present Continuous Passive (is being repaired) kullanılır.",
            "whyOthersIncorrect": {
                "A": "been repaired Present Perfect Passivedir.",
                "C": "repair etken fiildir.",
                "D": "repaired Simple Past Passivedir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Passive - Present Continuous Passive",
            "keyTakeaway": "Oxford Grammar Test Soru #36 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000036
    },
    {
        "id": "q_oxford_37",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(37) The story I've just read _____ a friend of mine.",
        "options": [
            {
                "id": "A",
                "text": "was written",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "was written by",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "was written from",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "wrote",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Edilgen cümlelerde eylemi yapan kişi 'by' edatı ile belirtilir (was written by).",
            "whyOthersIncorrect": {
                "A": "was written yapan kişiyi bağlayan edattan yoksundur.",
                "C": "from kaynak bildirir, yapan kişiyi bildirmez.",
                "D": "wrote etken fiildir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Passive - Agent with By",
            "keyTakeaway": "Oxford Grammar Test Soru #37 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000037
    },
    {
        "id": "q_oxford_38",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(38) Some film stars _____ be difficult to work with.",
        "options": [
            {
                "id": "A",
                "text": "are said",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "are said to",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "say",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "say to",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Söylenti ve genel görüş belirtirken 'Subject + are said + to-infinitive' kalıbı kullanılır.",
            "whyOthersIncorrect": {
                "A": "are said arkasından to-infinitive almalıdır.",
                "C": "say etken fiildir.",
                "D": "say to hatalı yapıdır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Passive - Personal Structure",
            "keyTakeaway": "Oxford Grammar Test Soru #38 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000038
    },
    {
        "id": "q_oxford_39",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(39) I'm going to go out and _____.",
        "options": [
            {
                "id": "A",
                "text": "have cut my hair",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "have my hair cut",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "let my hair cut",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "my hair be cut",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Bir işi başkasına yaptırma (ettirgen) kalıbı 'have + nesne + V3' (have my hair cut) şeklindedir.",
            "whyOthersIncorrect": {
                "A": "have cut my hair kendim kestim demektir.",
                "C": "let my hair cut izin vermektir.",
                "D": "my hair be cut gramer hatasıdır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Passive - Causative Have Something Done",
            "keyTakeaway": "Oxford Grammar Test Soru #39 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000039
    },
    {
        "id": "q_oxford_40",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(40) The driver was arrested for failing _____ an accident.",
        "options": [
            {
                "id": "A",
                "text": "of report",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "report",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "reporting",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "to report",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Fail fiili arkasından her zaman to-infinitive (fail to do something) alır.",
            "whyOthersIncorrect": {
                "A": "of report hatalı edattır.",
                "B": "report yalın fiildir.",
                "C": "reporting gerund yapısıdır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Infinitive - Verb + To-Infinitive",
            "keyTakeaway": "Oxford Grammar Test Soru #40 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000040
    },
    {
        "id": "q_oxford_41",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(41) Someone suggested _____ for a walk.",
        "options": [
            {
                "id": "A",
                "text": "go",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "going",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "of going",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "to go",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Suggest fiilinden sonra nesne/cümle gelmiyorsa doğrudan Gerund (-ing) kullanılır (suggest going).",
            "whyOthersIncorrect": {
                "A": "go yalın fiildir.",
                "C": "of going hatalı edattır.",
                "D": "to go suggest fiili ile kullanılmaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Infinitive and -ing - Suggest + Gerund",
            "keyTakeaway": "Oxford Grammar Test Soru #41 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000041
    },
    {
        "id": "q_oxford_42",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(42) I can remember _____ voices in the middle of the night.",
        "options": [
            {
                "id": "A",
                "text": "hear",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "heard",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "hearing",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "to hear",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Geçmişte yaşanmış bir anıyı hatırlarken 'remember + V-ing' (hearing) kullanılır.",
            "whyOthersIncorrect": {
                "A": "hear yalın fiildir.",
                "B": "heard geçmiş zaman fiilidir.",
                "D": "to hear yapılması gereken bir görevi hatırlamaktır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Infinitive and -ing - Remember + Gerund",
            "keyTakeaway": "Oxford Grammar Test Soru #42 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000042
    },
    {
        "id": "q_oxford_43",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(43) The police want _____ anything suspicious.",
        "options": [
            {
                "id": "A",
                "text": "that we report",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "us reporting",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "us to report",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "we report",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Want fiili 'want + someone + to V1' yapısını alır (want us to report).",
            "whyOthersIncorrect": {
                "A": "that we report İngilizcede want ile kullanılmaz.",
                "B": "us reporting gerund almaz.",
                "D": "we report hatalı gramerdir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Infinitive and -ing - Want + Object + To-Infinitive",
            "keyTakeaway": "Oxford Grammar Test Soru #43 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000043
    },
    {
        "id": "q_oxford_44",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(44) We weren't sure _____ or just walk in.",
        "options": [
            {
                "id": "A",
                "text": "should knock",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "to knock",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "whether knock",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "whether to knock",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Emin olamama durumlarında 'whether + to-infinitive' (whether to knock) kullanılır.",
            "whyOthersIncorrect": {
                "A": "should knock bağlaçsız gelemez.",
                "B": "to knock alternatifli 'or' durumunda whether gerektirir.",
                "C": "whether knock to-infinitive gerektirir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Infinitive - Question Word + To-Infinitive",
            "keyTakeaway": "Oxford Grammar Test Soru #44 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000044
    },
    {
        "id": "q_oxford_45",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(45) It was too cold _____ outside.",
        "options": [
            {
                "id": "A",
                "text": "the guests eating",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "for the guests to eat",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "that the guests should eat",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "that the guests eat",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "'Too + sıfat + for someone + to V1' kalıbı kullanılır.",
            "whyOthersIncorrect": {
                "A": "the guests eating hatalı yapıdır.",
                "C": "that the guests should eat kalıba uymaz.",
                "D": "that the guests eat kalıba uymaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Infinitive - Too + Adjective + For + Object + To-Infinitive",
            "keyTakeaway": "Oxford Grammar Test Soru #45 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000045
    },
    {
        "id": "q_oxford_46",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(46) Did you congratulate Tessa _____ her exam?",
        "options": [
            {
                "id": "A",
                "text": "of passing",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "on passing",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "passing",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "to pass",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Congratulate fiili 'congratulate someone ON doing something' yapısını alır.",
            "whyOthersIncorrect": {
                "A": "of passing hatalı edattır.",
                "C": "passing edatsız gelemez.",
                "D": "to pass congratulate ile kullanılmaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Infinitive and -ing - Preposition + Gerund",
            "keyTakeaway": "Oxford Grammar Test Soru #46 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000046
    },
    {
        "id": "q_oxford_47",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(47) I didn't like it in the city at first. But now _____ here.",
        "options": [
            {
                "id": "A",
                "text": "I got used to living",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "I'm used to living",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "I used to live",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "I used to living",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Alışkın olma durumunu anlatırken 'be used to + V-ing' (I'm used to living) kullanılır.",
            "whyOthersIncorrect": {
                "A": "I got used to living alışma sürecini tamamlamayı anlatır; 'now' ile alışkın olma hali 'I'm used to' uygundur.",
                "C": "I used to live geçmişteki eski alışkanlıktır.",
                "D": "I used to living hatalı gramerdir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Infinitive and -ing - Be Used To",
            "keyTakeaway": "Oxford Grammar Test Soru #47 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000047
    },
    {
        "id": "q_oxford_48",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(48) They raised the money simply _____ for it. It was easy.",
        "options": [
            {
                "id": "A",
                "text": "asking",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "by asking",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "of asking",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "with asking",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Bir şeyin nasıl yapıldığını/yöntemini anlatırken 'by + V-ing' (by asking) kullanılır.",
            "whyOthersIncorrect": {
                "A": "asking edatsız yöntemi belirtmez.",
                "C": "of asking hatalıdır.",
                "D": "with asking yöntemde kullanılmaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Infinitive and -ing - By + V-ing (Means)",
            "keyTakeaway": "Oxford Grammar Test Soru #48 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000048
    },
    {
        "id": "q_oxford_49",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(49) As we walked past, we saw Dan _____ his car.",
        "options": [
            {
                "id": "A",
                "text": "in washing",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "to wash",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "wash",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "washing",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Görsel veya işitsel algı fiillerinden (see, hear, watch) sonra eylemin bir kısmına tanık olunduysa V-ing (washing) kullanılır.",
            "whyOthersIncorrect": {
                "A": "in washing hatalı edattır.",
                "B": "to wash algı fiillerinden sonra kullanılmaz.",
                "C": "wash tüm eyleme baştan sona tanık olunduğunda kullanılır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: The Infinitive and -ing - Sense Verbs",
            "keyTakeaway": "Oxford Grammar Test Soru #49 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000049
    },
    {
        "id": "q_oxford_50",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(50) I need to buy _____.",
        "options": [
            {
                "id": "A",
                "text": "a bread",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "a loaf bread",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "a loaf of bread",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "breads",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Bread sayılamayan bir isimdir; birim belirtmek için 'a loaf of bread' denir.",
            "whyOthersIncorrect": {
                "A": "a bread denmez.",
                "B": "of edatı eksiktir.",
                "D": "breads çoğul yapılamaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Nouns and articles - Uncountable Nouns",
            "keyTakeaway": "Oxford Grammar Test Soru #50 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000050
    },
    {
        "id": "q_oxford_51",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(51) My father is not only the town mayor, he runs _____ , too.",
        "options": [
            {
                "id": "A",
                "text": "a business",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "a piece of business",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "business",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "some business",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Ticari işletme/şirket anlamındaki 'business' sayılabilir (a business).",
            "whyOthersIncorrect": {
                "B": "a piece of business iş/işlem anlamındadır.",
                "C": "business genel ticaret anlamındadır.",
                "D": "some business bazı işler anlamındadır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Nouns and articles - Countable vs Uncountable Business",
            "keyTakeaway": "Oxford Grammar Test Soru #51 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000051
    },
    {
        "id": "q_oxford_52",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(52) The _____ produced at our factory in Scotland.",
        "options": [
            {
                "id": "A",
                "text": "good are",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "good is",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "goods are",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "goods is",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "'Goods' (mallar/ürünler) her zaman çoğuldur ve çoğul fiil alarak 'goods are' şeklinde kullanılır.",
            "whyOthersIncorrect": {
                "A": "good sıfattır.",
                "B": "good sıfattır.",
                "D": "goods tekil fiil (is) almaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Nouns and articles - Plural Nouns",
            "keyTakeaway": "Oxford Grammar Test Soru #52 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000052
    },
    {
        "id": "q_oxford_53",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(53) I'm looking for _____ to cut this string.",
        "options": [
            {
                "id": "A",
                "text": "a pair scissors",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "a scissor",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "a scissors",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "some scissors",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Scissors çift parçalı çoğul isimdir; 'some scissors' veya 'a pair of scissors' denir.",
            "whyOthersIncorrect": {
                "A": "of edatı eksiktir.",
                "B": "tekil 'a scissor' denmez.",
                "C": "a scissors gramer hatasıdır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Nouns and articles - Pair Nouns",
            "keyTakeaway": "Oxford Grammar Test Soru #53 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000053
    },
    {
        "id": "q_oxford_54",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(54) I was watching TV at home when suddenly _____ rang.",
        "options": [
            {
                "id": "A",
                "text": "a doorbell",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "an doorbell",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "doorbell",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "the doorbell",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Evdeki bilinen zil olduğu için belirli nesne 'the doorbell' kullanılır.",
            "whyOthersIncorrect": {
                "A": "a doorbell belirsizdir.",
                "B": "an sessiz harfle başlayan kelimeden önce gelmez.",
                "C": "artikelsiz kullanılamaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Nouns and articles - Definite Article The",
            "keyTakeaway": "Oxford Grammar Test Soru #54 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000054
    },
    {
        "id": "q_oxford_55",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(55) I've always liked _____.",
        "options": [
            {
                "id": "A",
                "text": "Chinese food",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "food of China",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "some food of China",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "the Chinese food",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Genel olarak mutfak veya yemek türlerinden bahsederken artikel kullanılmaz (Chinese food).",
            "whyOthersIncorrect": {
                "B": "food of China yapay ifadedir.",
                "C": "some food of China yapay ifadedir.",
                "D": "the artikel genel genellemede kullanılmaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Nouns and articles - Generalizations",
            "keyTakeaway": "Oxford Grammar Test Soru #55 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000055
    },
    {
        "id": "q_oxford_56",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(56) In England most children go _____ at the age of five.",
        "options": [
            {
                "id": "A",
                "text": "school",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "to school",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "to some schools",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "to the school",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Okul, hastane, hapishane gibi kurumlara esas amacı için gidildiğinde artikel kullanılmaz (go to school).",
            "whyOthersIncorrect": {
                "A": "to yönelme edatı eksiktir.",
                "C": "to some schools anlamı bozar.",
                "D": "to the school belirli bir bina vurgusudur.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Nouns and articles - Institutions without Article",
            "keyTakeaway": "Oxford Grammar Test Soru #56 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000056
    },
    {
        "id": "q_oxford_57",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(57) We haven't had a holiday for _____ time.",
        "options": [
            {
                "id": "A",
                "text": "a so long",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "so a long",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "such a long",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "such long",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "'Such + a/an + sıfat + tekil sayılabilir isim' (such a long time) kalıbı kullanılır.",
            "whyOthersIncorrect": {
                "A": "a so long hatalı sıradır.",
                "B": "so a long hatalı sıradır.",
                "D": "such long tekil isimde 'a' gerektirir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Nouns and articles - Such a + Adjective + Noun",
            "keyTakeaway": "Oxford Grammar Test Soru #57 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000057
    },
    {
        "id": "q_oxford_58",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(58) Our friends have a house in _____.",
        "options": [
            {
                "id": "A",
                "text": "a West London",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "the West London",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "West London",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "West of London",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Şehir bölgesi isimlerinden önce (West London) artikel kullanılmaz.",
            "whyOthersIncorrect": {
                "A": "a kullanılamaz.",
                "B": "the kullanılmaz.",
                "D": "West of London ifadesi 'the west of London' olmalıdır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Nouns and articles - Geographical Names",
            "keyTakeaway": "Oxford Grammar Test Soru #58 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000058
    },
    {
        "id": "q_oxford_59",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(59) It's so boring here. Nothing ever happens in _____ place.",
        "options": [
            {
                "id": "A",
                "text": "that",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "these",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "this",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "those",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Konuşulan bulunulan yer 'here' olduğu için işaret zamiri 'this' (this place) olur.",
            "whyOthersIncorrect": {
                "A": "that uzaktaki yerdir.",
                "B": "these çoğuldur.",
                "D": "those çoğul uzaktır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: This, my, some, all - Demonstratives",
            "keyTakeaway": "Oxford Grammar Test Soru #59 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000059
    },
    {
        "id": "q_oxford_60",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(60) Is that my key, or is it _____ ?",
        "options": [
            {
                "id": "A",
                "text": "the yours",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "the your's",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "your",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "yours",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "İsimsiz iyelik zamiri 'yours' (seninki) şeklindedir.",
            "whyOthersIncorrect": {
                "A": "the kullanılamaz.",
                "B": "the ve kesme işareti hatalıdır.",
                "C": "your arkasından isim gerektirir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: This, my, some, all - Possessive Pronouns",
            "keyTakeaway": "Oxford Grammar Test Soru #60 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000060
    },
    {
        "id": "q_oxford_61",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(61) Adrian takes no interest in clothes. He'll wear _____.",
        "options": [
            {
                "id": "A",
                "text": "a thing",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "anything",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "something",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "thing",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Fark etmez/herhangi bir şey anlamında olumlu cümlede 'anything' kullanılır.",
            "whyOthersIncorrect": {
                "A": "a thing sınırlıdır.",
                "C": "something belirli bir şeydir.",
                "D": "thing artikelsiz kullanılamaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: This, my, some, all - Indefinite Pronouns",
            "keyTakeaway": "Oxford Grammar Test Soru #61 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000061
    },
    {
        "id": "q_oxford_62",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(62) There's _____ use in complaining. They probably won't do anything about it.",
        "options": [
            {
                "id": "A",
                "text": "a few",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "a little",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "few",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "little",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Sayılamayan 'use' ismi ile 'hiç yok kadar az / faydasız' anlamında olumsuz 'little' (little use) kullanılır.",
            "whyOthersIncorrect": {
                "A": "a few sayılabilenler içindir.",
                "B": "a little olumlu az miktardır.",
                "C": "few sayılabilenler içindir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: This, my, some, all - Little vs A Little",
            "keyTakeaway": "Oxford Grammar Test Soru #62 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000062
    },
    {
        "id": "q_oxford_63",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(63) I don't want to buy any of these books. I've got _____.",
        "options": [
            {
                "id": "A",
                "text": "all",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "all them",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "everything",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "them all",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Zamirle kullanımda 'them all' veya 'all of them' kalıbı geçerlidir.",
            "whyOthersIncorrect": {
                "A": "all tek başına 'onların hepsi' anlamını tam karşılamaz.",
                "B": "all them sırası terstir (them all olmalı).",
                "C": "everything cansız genel şeylerdir, kitapları kapsamaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: This, my, some, all - Pronoun + All",
            "keyTakeaway": "Oxford Grammar Test Soru #63 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000063
    },
    {
        "id": "q_oxford_64",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(64) Let's stop and have a coffee. _____ a café over there, look.",
        "options": [
            {
                "id": "A",
                "text": "Is",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "It's",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "There",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "There's",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Var olduğunu bildirmek için 'There's a café' kullanılır.",
            "whyOthersIncorrect": {
                "A": "Is soru fiilidir.",
                "B": "It's a café tanım yapar fakat varlık bildirmede There's esastır.",
                "C": "There tek başına yüklemsizdir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Pronouns - There is / There are",
            "keyTakeaway": "Oxford Grammar Test Soru #64 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000064
    },
    {
        "id": "q_oxford_65",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(65) Everyone in the group shook hands with _____.",
        "options": [
            {
                "id": "A",
                "text": "each other",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "one other",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "one the other",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "themselves",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Karşılıklı tokalaşma eyleminde 'each other' (birbiriyle) kullanılır.",
            "whyOthersIncorrect": {
                "B": "one other hatalıdır.",
                "C": "one the other hatalıdır.",
                "D": "themselves kendi kendileriyle demektir; el sıkışmada kullanılmaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Pronouns - Reciprocal Pronouns",
            "keyTakeaway": "Oxford Grammar Test Soru #65 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000065
    },
    {
        "id": "q_oxford_66",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(66) The washing machine has broken down again. I think we should get _____.",
        "options": [
            {
                "id": "A",
                "text": "a new",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "a new one",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "new",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "new one",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Tekil bir ismin (washing machine) tekrarını önlemek için 'a new one' kullanılır.",
            "whyOthersIncorrect": {
                "A": "a new sıfatta biter, isim/zamir almalıdır.",
                "C": "new tek başına artikel almadan nesne olamaz.",
                "D": "a artikeli eksiktir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Pronouns - One / Ones",
            "keyTakeaway": "Oxford Grammar Test Soru #66 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000066
    },
    {
        "id": "q_oxford_67",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(67) All the guests were dancing. _____ having a good time.",
        "options": [
            {
                "id": "A",
                "text": "All were",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "Every was",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "Everyone was",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "Someone were",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Herkes anlamındaki 'Everyone' tekil fiil alır (Everyone was).",
            "whyOthersIncorrect": {
                "A": "All were having de mümkündür fakat şıklarda 'Everyone was' standart kullanımdır.",
                "B": "Every tek başına zamir olamaz.",
                "D": "Someone 'birisi' demektir ve tekildir (were almaz).",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Pronouns - Everyone + Singular Verb",
            "keyTakeaway": "Oxford Grammar Test Soru #67 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000067
    },
    {
        "id": "q_oxford_68",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(68) The house was _____ building.",
        "options": [
            {
                "id": "A",
                "text": "a nice old stone",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "a nice stone old",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "a stone old nice",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "an old nice stone",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Sıfat sıralaması: Opinion (nice) + Age (old) + Material (stone) -> a nice old stone building.",
            "whyOthersIncorrect": {
                "B": "stone (malzeme) old (yaş) önüne geçemez.",
                "C": "stone en başa geçemez.",
                "D": "nice (görüş) old (yaş) önündedir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Adjectives and adverbs - Order of Adjectives",
            "keyTakeaway": "Oxford Grammar Test Soru #68 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000068
    },
    {
        "id": "q_oxford_69",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(69) The government is doing nothing to help _____.",
        "options": [
            {
                "id": "A",
                "text": "poor",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "the poor",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "the poors",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "the poor ones",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Belirli bir insan grubunu anlatmak için 'The + Sıfat' (the poor = yoksullar) kullanılır.",
            "whyOthersIncorrect": {
                "A": "poor isimleşemez.",
                "C": "the poors -s takısı alamaz.",
                "D": "the poor ones yerine the poor esastır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Adjectives and adverbs - The + Adjective for Groups",
            "keyTakeaway": "Oxford Grammar Test Soru #69 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000069
    },
    {
        "id": "q_oxford_70",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(70) The young man seems very _____.",
        "options": [
            {
                "id": "A",
                "text": "sensible",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "sensiblely",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "sensibley",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "sensibly",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Seem (görünmek) bağlama fiilinden (linking verb) sonra zarf değil sıfat (sensible) gelir.",
            "whyOthersIncorrect": {
                "B": "sensiblely hatalı yazımdır.",
                "C": "sensibley hatalı yazımdır.",
                "D": "sensibly zarftır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Adjectives and adverbs - Linking Verbs",
            "keyTakeaway": "Oxford Grammar Test Soru #70 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000070
    },
    {
        "id": "q_oxford_71",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(71) I _____ missed the bus. I was only just in time to catch it.",
        "options": [
            {
                "id": "A",
                "text": "mostly",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "near",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "nearest",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "nearly",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Neredeyse/az kalsın anlamında 'nearly' zarfı kullanılır.",
            "whyOthersIncorrect": {
                "A": "mostly çoğunlukla demektir.",
                "B": "near yakın edatıdır.",
                "C": "nearest en yakın sıfatıdır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Adjectives and adverbs - Nearly",
            "keyTakeaway": "Oxford Grammar Test Soru #71 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000071
    },
    {
        "id": "q_oxford_72",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(72) This detailed map is _____ the atlas.",
        "options": [
            {
                "id": "A",
                "text": "more useful as",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "more useful than",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "usefuller as",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "usefuller than",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Uzun sıfatların karşılaştırmasında 'more + sıfat + THAN' (more useful than) kullanılır.",
            "whyOthersIncorrect": {
                "A": "as yerine than olmalıdır.",
                "C": "usefuller hatalıdır.",
                "D": "usefuller hatalıdır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Adjectives and adverbs - Comparative Tense",
            "keyTakeaway": "Oxford Grammar Test Soru #72 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000072
    },
    {
        "id": "q_oxford_73",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(73) This place gets _____ crowded with tourists every summer.",
        "options": [
            {
                "id": "A",
                "text": "always more",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "crowded and more",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "from more to more",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "more and more",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Giderek/gittikçe artan durumlar için 'more and more + sıfat' kalıbı kullanılır.",
            "whyOthersIncorrect": {
                "A": "always more kalıbı karşılamaz.",
                "B": "crowded and more hatalı sıradır.",
                "C": "from more to more hatalı kalıptır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Adjectives and adverbs - Gradual Increase",
            "keyTakeaway": "Oxford Grammar Test Soru #73 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000073
    },
    {
        "id": "q_oxford_74",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(74) Yes, I have got the report. _____ it.",
        "options": [
            {
                "id": "A",
                "text": "I just am reading",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "I'm just reading",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "I'm reading just",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "Just I'm reading",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Just zarfı yardımcı fiil ile ana fiil arasında yer alır (I'm just reading).",
            "whyOthersIncorrect": {
                "A": "just kelimesi am kelimesinden önce gelmez.",
                "C": "just sonda yer almaz.",
                "D": "just cümle başında bu yapıda kullanılmaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Adjectives and adverbs - Adverb Position",
            "keyTakeaway": "Oxford Grammar Test Soru #74 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000074
    },
    {
        "id": "q_oxford_75",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(75) I've read this paragraph three times, and I _____ understand it.",
        "options": [
            {
                "id": "A",
                "text": "can't still",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "can't yet",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "still can't",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "yet can't",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Still zarfı olumsuz modal/yardımcı fiillerden ÖNCE gelir (still can't).",
            "whyOthersIncorrect": {
                "A": "can't still hatalı sıradır.",
                "B": "yet olumsuz cümlenin sonunda yer alır.",
                "D": "yet can't hatalı sıradır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Adjectives and adverbs - Position of Still",
            "keyTakeaway": "Oxford Grammar Test Soru #75 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000075
    },
    {
        "id": "q_oxford_76",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(76) We're really sorry. We regret what happened _____.",
        "options": [
            {
                "id": "A",
                "text": "a bit",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "much",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "very",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "very much",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Fiilleri kuvvetlendirmek için olumlu cümle sonunda 'very much' kullanılır.",
            "whyOthersIncorrect": {
                "A": "a bit hafifletir.",
                "B": "much olumlu düz cümlede tek başına fiili nitelemez.",
                "C": "very direkt fiili nitelemez (very much olmalıdır).",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Adjectives and adverbs - Very much with verbs",
            "keyTakeaway": "Oxford Grammar Test Soru #76 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000076
    },
    {
        "id": "q_oxford_77",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(77) The village is _____ Sheffield. It's only six miles away.",
        "options": [
            {
                "id": "A",
                "text": "along",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "by",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "near",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "next",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Bir yere yakınlığı ifade etmek için 'near' edatı kullanılır.",
            "whyOthersIncorrect": {
                "A": "along boyunca demektir.",
                "B": "by kenarında/yanında demektir.",
                "D": "next arkasından 'to' edatı ister (next to).",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Prepositions - Near",
            "keyTakeaway": "Oxford Grammar Test Soru #77 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000077
    },
    {
        "id": "q_oxford_78",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(78) You can see the details _____ the screen.",
        "options": [
            {
                "id": "A",
                "text": "at",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "by",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "in",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "on",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Ekran üzerindeki görüntüler için 'ON the screen' edatı kullanılır.",
            "whyOthersIncorrect": {
                "A": "at the screen yönelmedir.",
                "B": "by vasıtasıyla demektir.",
                "C": "in içindedir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Prepositions - On the screen",
            "keyTakeaway": "Oxford Grammar Test Soru #78 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000078
    },
    {
        "id": "q_oxford_79",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(79) I've got a meeting _____ Thursday afternoon.",
        "options": [
            {
                "id": "A",
                "text": "at",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "in",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "on",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "to",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Günler ve günlerin bölümleri (Thursday afternoon) için 'ON' edatı kullanılır.",
            "whyOthersIncorrect": {
                "A": "at saatlerde kullanılır.",
                "B": "in aylarda/yıllarda kullanılır.",
                "D": "to yönelmedir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Prepositions - Days of the week",
            "keyTakeaway": "Oxford Grammar Test Soru #79 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000079
    },
    {
        "id": "q_oxford_80",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(80) We've lived in this flat _____ five years.",
        "options": [
            {
                "id": "A",
                "text": "ago",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "already",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "for",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "since",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Süreç ve zaman aralığı (five years) belirten durumlarda 'FOR' edatı kullanılır.",
            "whyOthersIncorrect": {
                "A": "ago Simple Past ile cümlenin sonunda kullanılır.",
                "B": "already henüz/zaten demektir.",
                "D": "since başlangıç noktası ister (since 2018).",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Prepositions - For + Period of time",
            "keyTakeaway": "Oxford Grammar Test Soru #80 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000080
    },
    {
        "id": "q_oxford_81",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(81) This car is _____ , if you're interested in buying it.",
        "options": [
            {
                "id": "A",
                "text": "for sale",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "in sale",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "at sale",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "to sell",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Satılık anlamındaki sabit edat öbeği 'FOR sale'dir.",
            "whyOthersIncorrect": {
                "B": "in sale indirimde demektir (on sale / in the sale).",
                "C": "at sale kullanılmaz.",
                "D": "to sell sabit kalıp değildir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Prepositions - For sale",
            "keyTakeaway": "Oxford Grammar Test Soru #81 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000081
    },
    {
        "id": "q_oxford_82",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(82) Polly wants to cycle round the world. She's really keen _____ the idea.",
        "options": [
            {
                "id": "A",
                "text": "about",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "for",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "on",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "with",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Keen sıfatı her zaman 'ON' edatı alır (keen on something = bir şeye meraklı/hevesli).",
            "whyOthersIncorrect": {
                "A": "about keen ile kullanılmaz.",
                "B": "for keen ile kullanılmaz.",
                "D": "with keen ile kullanılmaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Prepositions - Keen on",
            "keyTakeaway": "Oxford Grammar Test Soru #82 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000082
    },
    {
        "id": "q_oxford_83",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(83) I prefer dogs _____ cats. I hate cats.",
        "options": [
            {
                "id": "A",
                "text": "from",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "over",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "than",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "to",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Prefer fiili iki şey arasında tercih yaparken 'prefer A TO B' kalıbını alır.",
            "whyOthersIncorrect": {
                "A": "from kullanılmaz.",
                "B": "over informal konuşmada geçse de standart gramerde TO esastır.",
                "C": "than 'would rather' ile kullanılır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs with prepositions - Prefer to",
            "keyTakeaway": "Oxford Grammar Test Soru #83 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000083
    },
    {
        "id": "q_oxford_84",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(84) My father used the money he won to set _____ his own company.",
        "options": [
            {
                "id": "A",
                "text": "forward",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "on",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "out",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "up",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Şirket/iş kurmak anlamındaki deyimsel fiil (phrasal verb) 'set UP'tır.",
            "whyOthersIncorrect": {
                "A": "set forward öne sürmektir.",
                "B": "set on saldırtmaktır.",
                "C": "set out yola çıkmaktır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs with prepositions - Set up",
            "keyTakeaway": "Oxford Grammar Test Soru #84 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000084
    },
    {
        "id": "q_oxford_85",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(85) Don't go too fast. I can't keep _____ you.",
        "options": [
            {
                "id": "A",
                "text": "on to",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "on with",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "up to",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "up with",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Birinin hızına yetişmek/ayak uydurmak 'keep UP WITH someone' phrasal verb'üdür.",
            "whyOthersIncorrect": {
                "A": "keep on to hatalıdır.",
                "B": "keep on with devam etmektir.",
                "C": "keep up to edat eksiktir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Verbs with prepositions - Keep up with",
            "keyTakeaway": "Oxford Grammar Test Soru #85 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000085
    },
    {
        "id": "q_oxford_86",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(86) Someone _____ the tickets are free.",
        "options": [
            {
                "id": "A",
                "text": "said me",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "said me that",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "told me",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "told to me",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Tell fiili doğrudan şahıs nesnesi alır (told me). Say fiili şahıs nesnesi alırken 'said TO me' ister.",
            "whyOthersIncorrect": {
                "A": "said me edatsız şahıs alamaz.",
                "B": "said me that edatsız şahıs alamaz.",
                "D": "told to me 'to' edatı almaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Reported speech - Say vs Tell",
            "keyTakeaway": "Oxford Grammar Test Soru #86 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000086
    },
    {
        "id": "q_oxford_87",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(87) Last week Justin said 'I'll do it tomorrow.' He said he would do it _____.",
        "options": [
            {
                "id": "A",
                "text": "the following day",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "the previous day",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "tomorrow",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "yesterday",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Dolaylı anlatımda (Reported Speech) 'tomorrow' kelimesi 'the following day' veya 'the next day'e dönüşür.",
            "whyOthersIncorrect": {
                "B": "the previous day bir önceki gündür.",
                "C": "tomorrow doğrudan aktarımda kalır.",
                "D": "yesterday dündür.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Reported speech - Time Shifts",
            "keyTakeaway": "Oxford Grammar Test Soru #87 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000087
    },
    {
        "id": "q_oxford_88",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(88) I don't know why Isabelle didn't go to the meeting. She said she _____ definitely going.",
        "options": [
            {
                "id": "A",
                "text": "be",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "is",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "was",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "would",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Aktaran fiil geçmiş zaman (said) olduğunda am/is/are kalıbı geçmişe (was/were) kayar.",
            "whyOthersIncorrect": {
                "A": "be yalın fiildir.",
                "B": "is zaman kaymasına uğramamıştır.",
                "D": "would going gramer hatasıdır.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Reported speech - Tense Backshift",
            "keyTakeaway": "Oxford Grammar Test Soru #88 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000088
    },
    {
        "id": "q_oxford_89",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(89) The librarian asked us _____ so much noise.",
        "options": [
            {
                "id": "A",
                "text": "don't make",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "not make",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "not making",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "not to make",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Dolaylı emir ve ricalarda olumsuz yapı 'ask + someone + NOT TO + V1' (not to make) şeklindedir.",
            "whyOthersIncorrect": {
                "A": "don't make dolaylı anlatımda kullanılmaz.",
                "B": "not make 'to' eksiktir.",
                "C": "not making gerund almaz.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Reported speech - Reported Imperatives",
            "keyTakeaway": "Oxford Grammar Test Soru #89 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000089
    },
    {
        "id": "q_oxford_90",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(90) What's the name of the man _____ gave us a lift?",
        "options": [
            {
                "id": "A",
                "text": "he",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "what",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "which",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "who",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "İnsanları niteleyen özne konumundaki ilgi zamiri 'WHO'dur.",
            "whyOthersIncorrect": {
                "A": "he zamir tekrarıdır.",
                "B": "what relative clause niteleyicisi değildir.",
                "C": "which cansızlar içindir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Relative clauses - Relative Pronoun for Persons",
            "keyTakeaway": "Oxford Grammar Test Soru #90 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000090
    },
    {
        "id": "q_oxford_91",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(91) What was that notice _____ ?",
        "options": [
            {
                "id": "A",
                "text": "at that you were looking",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "you were looking at",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "you were looking at it",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "which you were looking",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Preposition cümlenin sonunda kalabilir ve ilgi zamiri (that/which) düşürülebilir (you were looking at).",
            "whyOthersIncorrect": {
                "A": "at that kalıbı edattan sonra that almaz.",
                "C": "it zamir tekrarı hatasıdır.",
                "D": "looking at edatı eksiktir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Relative clauses - Preposition Placement & Omission",
            "keyTakeaway": "Oxford Grammar Test Soru #91 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000091
    },
    {
        "id": "q_oxford_92",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(92) Lucy is the woman _____ husband is in hospital.",
        "options": [
            {
                "id": "A",
                "text": "her",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "hers the",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "whose",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "whose the",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Aitlik/sahiplik niteleyen ilgi zamiri 'WHOSE'dur (whose husband).",
            "whyOthersIncorrect": {
                "A": "her iki bağımsız cümle yapar.",
                "B": "hers the gramer hatasıdır.",
                "D": "whose kelimesinden sonra artikel (the) gelmez.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Relative clauses - Whose for Possession",
            "keyTakeaway": "Oxford Grammar Test Soru #92 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000092
    },
    {
        "id": "q_oxford_93",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(93) York, _____ last year, is a nice old city.",
        "options": [
            {
                "id": "A",
                "text": "I visited",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "that I visited",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "which I visited",
                "isCorrect": true
            },
            {
                "id": "D",
                "text": "whom I visited",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "C",
        "explanation": {
            "whyCorrect": "Virgülle ayrılan Non-defining Relative Clause yapısında nesneler için 'WHICH' kullanılır ('that' virgüllü yapıda kullanılamaz).",
            "whyOthersIncorrect": {
                "A": "virgüllü yapıda pronoun düşürülemez.",
                "B": "that virgüllü non-defining yapıda kullanılamaz.",
                "D": "whom insanlar içindir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Relative clauses - Non-defining Relative Clauses",
            "keyTakeaway": "Oxford Grammar Test Soru #93 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000093
    },
    {
        "id": "q_oxford_94",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(94) The accident was seen by some people _____ at a bus stop.",
        "options": [
            {
                "id": "A",
                "text": "waited",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "waiting",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "were waiting",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "who waiting",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Etken sıfat cümlesi kısaltmasında (who were waiting -> waiting) Present Participle kullanılır.",
            "whyOthersIncorrect": {
                "A": "waited edilgen kısaltmadır.",
                "C": "were waiting iki tane ana yüklem oluşturur.",
                "D": "who waiting 'were' eksiktir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Relative clauses - Reduced Relative Clause",
            "keyTakeaway": "Oxford Grammar Test Soru #94 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000094
    },
    {
        "id": "q_oxford_95",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(95) If _____ my passport, I'll be in trouble.",
        "options": [
            {
                "id": "A",
                "text": "I lose",
                "isCorrect": true
            },
            {
                "id": "B",
                "text": "I'll lose",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "I lost",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "I would lose",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "A",
        "explanation": {
            "whyCorrect": "Type 1 Koşul cümlesinde If yan cümlesinde Present Simple (I lose), ana cümlede Future (will) kullanılır.",
            "whyOthersIncorrect": {
                "B": "If cümlesinde 'will' kullanılmaz.",
                "C": "I lost Type 2'dir; ana cümle will ile uyusmaz.",
                "D": "I would lose Type 2/3'tür.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Conditionals - Type 1 Conditional",
            "keyTakeaway": "Oxford Grammar Test Soru #95 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000095
    },
    {
        "id": "q_oxford_96",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(96) I haven't got a ticket. If _____ one, I could get in.",
        "options": [
            {
                "id": "A",
                "text": "I'd have",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "I had",
                "isCorrect": true
            },
            {
                "id": "C",
                "text": "I have",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "I've got",
                "isCorrect": false
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "B",
        "explanation": {
            "whyCorrect": "Şu anki gerçek dışı durumu (Unreal Present) ifade eden Type 2 koşulda If kısmında Past Simple (I had) kullanılır.",
            "whyOthersIncorrect": {
                "A": "If kısmında 'would' kullanılmaz.",
                "C": "I have gerçek durumdur; biletinin olmadığını söylemiştir.",
                "D": "I've got gerçektir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Conditionals - Type 2 Conditional",
            "keyTakeaway": "Oxford Grammar Test Soru #96 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000096
    },
    {
        "id": "q_oxford_97",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(97) If the bus to the airport hadn't been so late, we _____ the plane.",
        "options": [
            {
                "id": "A",
                "text": "caught",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "had caught",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "would catch",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "would have caught",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Geçmişteki pişmanlık/gerçek dışı durumu ifade eden Type 3 koşulda ana cümlede 'would have + V3' (would have caught) kullanılır.",
            "whyOthersIncorrect": {
                "A": "caught Simple Pasttir.",
                "B": "had caught Past Perfecttir.",
                "C": "would catch Type 2'dir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Conditionals - Type 3 Conditional",
            "keyTakeaway": "Oxford Grammar Test Soru #97 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000097
    },
    {
        "id": "q_oxford_98",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(98) If only people _____ keep sending me bills!",
        "options": [
            {
                "id": "A",
                "text": "don't",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "shouldn't",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "weren't",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "wouldn't",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Başkalarının rahatsız edici davranışlarının değişmesi isteğinde 'If only / I wish + WOULDN'T + V1' kullanılır.",
            "whyOthersIncorrect": {
                "A": "don't dilek cümlelerinde kullanılmaz.",
                "B": "shouldn't tavsiyedir.",
                "C": "weren't durum sıfatlarında kullanılır; eylemde wouldn't tercih edilir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Conditionals - Wish / If Only for Annoyance",
            "keyTakeaway": "Oxford Grammar Test Soru #98 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000098
    },
    {
        "id": "q_oxford_99",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(99) I just had to take the dog out _____ of the awful weather.",
        "options": [
            {
                "id": "A",
                "text": "although",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "despite",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "even though",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "in spite of",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Arkasından 'of' edatı alan zıtlık bağlacı 'IN SPITE OF'tur.",
            "whyOthersIncorrect": {
                "A": "although of edatı almaz, tam cümle gerektirir.",
                "B": "despite 'of' edatı almaz (despite the weather).",
                "C": "even though cümle gerektirir.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Linking words - In Spite Of",
            "keyTakeaway": "Oxford Grammar Test Soru #99 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000099
    },
    {
        "id": "q_oxford_100",
        "topic": "İngilizce Grammar",
        "difficulty": "advanced",
        "questionText": "(100) Anna put the electric fire on _____ warm.",
        "options": [
            {
                "id": "A",
                "text": "for getting",
                "isCorrect": false
            },
            {
                "id": "B",
                "text": "in order get",
                "isCorrect": false
            },
            {
                "id": "C",
                "text": "so she gets",
                "isCorrect": false
            },
            {
                "id": "D",
                "text": "to get",
                "isCorrect": true
            },
            {
                "id": "E",
                "text": "None of the above",
                "isCorrect": false
            }
        ],
        "correctOptionId": "D",
        "explanation": {
            "whyCorrect": "Amaç bildirmek için fiilin yalın haliyle 'to + V1' (to get) veya 'in order to + V1' kullanılır.",
            "whyOthersIncorrect": {
                "A": "for getting amaç bildirmede eylem için tercih edilmez.",
                "B": "in order sonrasında 'to' eksiktir.",
                "C": "so she gets geniş zamandır; geçmişteki amaçla zaman uyumsuzdur.",
                "E": "E şıkkı bu soru için geçerli bir yanıt değildir."
            },
            "topicSummary": "Oxford Practice Grammar Test: Linking words - Infinitive of Purpose",
            "keyTakeaway": "Oxford Grammar Test Soru #100 - Dikkat edilmesi gereken dilbilgisi kuralı."
        },
        "createdAt": 1700000000100
    }
  ]
};

// Procedural question templates generator for fallback mode
const QUESTION_ANGLES = [
  'temel tanımı ve en kritik özelliği',
  'uygulama alanları ve pratik kullanımı',
  'tarihsel gelişimi ve ortaya çıkış nedeni',
  'benzer kavramlarla karşılaştırıldığında en belirgin farkı',
  'alt bileşenleri ve çalışma mekanizması',
  'karşılaşılan en yaygın hata veya çeldirici durum',
  'geleceğe yönelik potansiyeli ve getirdiği yenilik'
];

export async function generateQuestionFromAI(
  topic: string,
  _difficulty: Difficulty = 'advanced',
  apiKey?: string,
  modelName: string = 'gemini-2.5-flash'
): Promise<Question> {
  const randomSeed = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // Check if embedded reference questions exist for this topic
  const matchingTopicKey = Object.keys(FALLBACK_TOPICS_DATABASE).find(
    t => t.toLowerCase() === topic.toLowerCase() || topic.toLowerCase().includes(t.toLowerCase())
  );
  const refQuestions = matchingTopicKey ? FALLBACK_TOPICS_DATABASE[matchingTopicKey] : null;
  const refSamplePrompt = refQuestions && refQuestions.length > 0 
    ? `\nÖNEMLİ FORMAT VE DİL KURALI:\nBu konuyla ilgili veritabanımızda aşağıdaki gömülü orijinal örnek sorular bulunmaktadır:\n${JSON.stringify(refQuestions.slice(0, 3).map(q => ({ questionText: q.questionText, options: q.options })))} \nLÜTFEN ÜRETECEĞİN YENİ SORUYU YUKARIDAKİ ÖRNEK GÖMÜLÜ SORULARIN TAM OLARAK FORMATINDA, DİLİNDE, ZORLUĞUNDA VE AKADEMİK TARZINDA ÜRET!\n`
    : '';

  // If API key is available, attempt real Gemini call
  if (apiKey && apiKey.trim().length > 5) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
Sen Türkiye ÖSYM ve Uluslararası Oxford sınav formatlarına tam hakim uzman bir eğitimci ve öğretmensin.
Bana "${topic}" konusu hakkında "advanced" (İLERİ SEVİYE) derecesinde 1 adet çoktan seçmeli, ÖĞRETİCİ, ANALİTİK DÜŞÜNDÜREN ve YEPYENİ bir soru hazırla.
${refSamplePrompt}
ÇOK ÖNEMLİ UNIQNESS VE ÇEŞİTLİLİK KURALLARI:
- Rastgele Tohum (Seed): ${randomSeed}
- Zorluk Derecesi: Kesinlikle İLERİ SEVİYE (Advanced).
- Soru tam olarak 5 adet şıktan (A, B, C, D, E) oluşmalıdır.
- Yanıtı SADECE geçerli bir JSON formatında döndür. Markdown backtick ekleme.

İstenen JSON Yapısı:
{
  "questionText": "Soru metni buraya",
  "svgDiagram": "<svg ...></svg>", // Opsiyonel SVG görseli
  "options": [
    { "id": "A", "text": "Şık A metni", "isCorrect": false },
    { "id": "B", "text": "Şık B metni", "isCorrect": true },
    { "id": "C", "text": "Şık C metni", "isCorrect": false },
    { "id": "D", "text": "Şık D metni", "isCorrect": false },
    { "id": "E", "text": "Şık E metni", "isCorrect": false }
  ],
  "correctOptionId": "B",
  "explanation": {
    "whyCorrect": "Doğru cevabın detaylı öğretici açıklaması...",
    "whyOthersIncorrect": {
      "A": "A şıkkının neden yanlış olduğunun açıklaması",
      "C": "C şıkkının neden yanlış olduğunun açıklaması",
      "D": "D şıkkının neden yanlış olduğunun açıklaması",
      "E": "E şıkkının neden yanlış olduğunun açıklaması"
    },
    "topicSummary": "Bu konu hakkında öğrenilmesi gereken kısa ve özet ders notu...",
    "keyTakeaway": "Aklıda kalması gereken altın kural veya özet."
  }
}
`;

      const response = await ai.models.generateContent({
        model: modelName || 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const q: Question = {
        id: `q_gemini_${randomSeed}`,
        topic,
        difficulty: 'advanced',
        questionText: parsed.questionText,
        svgDiagram: parsed.svgDiagram,
        options: parsed.options,
        correctOptionId: parsed.correctOptionId,
        explanation: parsed.explanation,
        createdAt: Date.now(),
      };
      return enforceBalancedOptionsAndDifficulty(q);
    } catch (err) {
      console.warn('Gemini API call error, falling back to smart dynamic generator:', err);
    }
  }

  // Fallback / Demo Smart Dynamic Question Generator
  const rawQ = generateDynamicFallbackQuestion(topic, 'advanced');
  return enforceBalancedOptionsAndDifficulty(rawQ);
}

function generateDynamicFallbackQuestion(topic: string, _difficulty: Difficulty = 'advanced'): Question {
  // Check predefined database first
  const matchingTopicKey = Object.keys(FALLBACK_TOPICS_DATABASE).find(
    t => t.toLowerCase() === topic.toLowerCase() || topic.toLowerCase().includes(t.toLowerCase())
  );

  if (matchingTopicKey && FALLBACK_TOPICS_DATABASE[matchingTopicKey].length > 0) {
    const list = FALLBACK_TOPICS_DATABASE[matchingTopicKey];
    const item = list[Math.floor(Math.random() * list.length)];
    return {
      ...item,
      id: `q_fallback_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      topic,
      difficulty: 'advanced',
    };
  }

  const randomSeed = Math.random().toString(36).substring(2, 7);
  const angle = QUESTION_ANGLES[Math.floor(Math.random() * QUESTION_ANGLES.length)];
  
  const optionLabels = ['A', 'B', 'C', 'D', 'E'];
  const correctIdx = Math.floor(Math.random() * 5);
  const correctLabel = optionLabels[correctIdx];

  const optionTexts: Record<string, string> = {
    'A': `${topic} alanında ${angle} bakımından en kapsayıcı ve ileri seviye bilimsel kural`,
    'B': `${topic} ile ilişkili kabul edilen ancak kısıtlı ikincil teori`,
    'C': `Klasik teoriden kalma çeldirici varsayım`,
    'D': `${topic} konusunun pratikte yapılan yanlış uygulaması`,
    'E': `Popüler kültürde ${topic} sanılan fakat farklı disipline ait tanım`
  };

  const correctText = optionTexts['A'];
  const incorrectTexts = [optionTexts['B'], optionTexts['C'], optionTexts['D'], optionTexts['E']];

  let incIdx = 0;
  const options = optionLabels.map((label) => {
    const isCorrect = label === correctLabel;
    const text = isCorrect ? correctText : incorrectTexts[incIdx++];
    return {
      id: label,
      text: `${text} (Varyasyon #${randomSeed})`,
      isCorrect,
    };
  });

  const whyOthers: Record<string, string> = {};
  optionLabels.forEach(l => {
    if (l !== correctLabel) {
      whyOthers[l] = `${l} şıkkı, ${topic} konusunda "${angle}" açısından çeldirici seçenektir.`;
    }
  });

  return {
    id: `q_dyn_${Date.now()}_${randomSeed}`,
    topic,
    difficulty: 'advanced',
    questionText: `"${topic}" konusu ele alındığında, ${angle} açısından aşağıdakilerden hangisi İLERİ SEVİYE teorik olarak DOĞRUDUR? (Soru #${randomSeed})`,
    options,
    correctOptionId: correctLabel,
    explanation: {
      whyCorrect: `${correctLabel} seçeneği, ${topic} alanında "${angle}" konusunun özünü tam olarak açıklar.`,
      whyOthersIncorrect: whyOthers,
      topicSummary: `"${topic}", ileri seviye analiz gerektiren kritik bir alandır.`,
      keyTakeaway: `${topic} konusunda temel ilke ${correctLabel} seçeneğinde verilmiştir.`,
    },
    createdAt: Date.now(),
  };
}

// AI FLASHCARDS GENERATOR
export async function generateFlashcardsFromAI(
  topic: string,
  count: number = 5,
  apiKey?: string,
  modelName: string = 'gemini-2.5-flash'
): Promise<Flashcard[]> {
  const randomSeed = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  if (apiKey && apiKey.trim().length > 5) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
Sen uzman bir öğretmen ve akıllı çalışma kartı (flashcard) tasarımcısısın.
Bana "${topic}" konusu hakkında tam olarak ${count} adet YEPYENİ, İLERİ SEVİYE VE YÜKSEK KALİTELİ BİLGİ KARTI (Flashcard) hazırla.

ÇOK ÖNEMLİ KURALLAR:
1. Kartların ön yüzünde (frontTitle) konunun temel terimi, kuralı veya formülü yer almalıdır.
2. Kartların arka yüzünde (backExplanation) kavramın anlaşılır özeti, (backExample) pratik örneği ve (backKeyPoint) hatırlatıcı altın not bulunmalıdır.
3. Yanıtı SADECE geçerli bir JSON dizisi formatında döndür. Markdown backtick ekleme.

İstenen JSON Dizisi Yapısı:
[
  {
    "frontTitle": "Kavram veya Terim Adı",
    "frontCategory": "Alt Başlık / Kategori",
    "backExplanation": "Anlaşılır, detaylı ve akıcı açıklama...",
    "backExample": "Somut pratik örnek veya kod...",
    "backKeyPoint": "Aklıda kalması gereken püf nokta veya özet"
  }
]
`;

      const response = await ai.models.generateContent({
        model: modelName || 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedArray = JSON.parse(cleanJson);

      return parsedArray.map((item: { frontTitle: string; frontCategory: string; backExplanation: string; backExample?: string; backKeyPoint: string }, idx: number) => ({
        id: `fc_gemini_${randomSeed}_${idx}`,
        topic,
        frontTitle: item.frontTitle,
        frontCategory: item.frontCategory || topic,
        backExplanation: item.backExplanation,
        backExample: item.backExample,
        backKeyPoint: item.backKeyPoint,
        isLearned: false,
      }));
    } catch (err) {
      console.warn('Gemini Flashcards API call error, falling back to smart dynamic generator:', err);
    }
  }

  return generateDynamicFallbackFlashcards(topic, count);
}

function generateDynamicFallbackFlashcards(topic: string, count: number): Flashcard[] {
  const seed = Math.random().toString(36).substring(2, 6);

  if (topic.toLowerCase().includes('matematik') || topic.toLowerCase().includes('tyt')) {
    return [
      {
        id: `fc_tyt_math_${seed}_1`,
        topic,
        frontTitle: 'Fonksiyonlarda Bileşke & Ters',
        frontCategory: 'Fonksiyonlar',
        backExplanation: '(f o g)(x) = f(g(x)) demektir. f(x) fonksiyonunun tersini bulmak için y = f(x) yazılıp x yalnız bırakılır.',
        backExample: 'f(x) = 2x + 3 ise tersi f⁻¹(x) = (x - 3) / 2 olur.',
        backKeyPoint: '(f o f⁻¹)(x) = x (Bileşke ve ters birbirini nötürler).'
      },
      {
        id: `fc_tyt_math_${seed}_2`,
        topic,
        frontTitle: 'Mutlak Değerli Eşitsizlikler',
        frontCategory: 'Eşitsizlikler',
        backExplanation: '|x| ≤ a ise -a ≤ x ≤ a şeklinde açılır. |x| ≥ a ise x ≥ a veya x ≤ -a şeklinde iki ayrı durum incelenir.',
        backExample: '|x - 3| ≤ 5 => -5 ≤ x - 3 ≤ 5 => -2 ≤ x ≤ 8.',
        backKeyPoint: 'Mutlak değerli bir ifadenin sonucu asla negatif olamaz (|x| ≥ 0).'
      },
      {
        id: `fc_tyt_math_${seed}_3`,
        topic,
        frontTitle: 'Dairesel Permütasyon',
        frontCategory: 'Sayma & Olasılık',
        backExplanation: 'n elemanın yuvarlak bir masa etrafına farklı dizilim sayısı (n - 1)! tanedir. 1 eleman sabitleme görevi görür.',
        backExample: '5 kişi yuvarlak masaya (5 - 1)! = 4! = 24 farklı şekilde oturur.',
        backKeyPoint: 'Düz sıraya dizilimde n!, dairesel dizilimde (n - 1)! kullanılır.'
      },
      {
        id: `fc_tyt_math_${seed}_4`,
        topic,
        frontTitle: 'Üslü ve Köklü İfadeler Kuralları',
        frontCategory: 'Temel Matematik',
        backExplanation: 'a^(m/n) = n. dereceden kök içinde (a^m). Çift dereceli köklerin içi negatif olamaz.',
        backExample: '√(x²) = |x| (Çift kök mutlak değer olarak çıkar).',
        backKeyPoint: 'Tabanlar aynıysa çarpımda üsler toplanır, bölmede çıkarılır.'
      },
      {
        id: `fc_tyt_math_${seed}_5`,
        topic,
        frontTitle: 'Problem Çözme Stratejisi (Oran-Orantı)',
        frontCategory: 'Problemler',
        backExplanation: 'Doğru orantıda çapraz çarpım (a/b = c/d => a·d = b·c), ters orantıda karşılıklı çarpım (a·b = c·d) eşitliği kullanılır.',
        backExample: 'İşçi problemlerinde birim zamanda yapılan iş miktarı üzerinden denklem kurulur.',
        backKeyPoint: 'Soruda verilen bağıntıyı tek bir bilinmeyen cinsinden yazmak çözümü kolaylaştırır.'
      }
    ];
  }

  const flashcards: Flashcard[] = [];
  const concepts = [
    {
      title: `${topic} Temel Mimarisi`,
      category: 'Kavramsal Altyapı',
      explain: `${topic} alanının üzerine inşa edildiği temel yapı taşları ve modüler bileşenlerdir. Sistem karmaşıklığını yönetmeyi sağlar.`,
      example: `${topic} sistemlerinde ilk adım verinin modüler olarak ayrıştırılmasıdır.`,
      key: 'Kavramsal mimariyi iyi bilmek problem çözümünü 3 kat hızlandırır.'
    },
    {
      title: `${topic} İleri Seviye Optimizasyonu`,
      category: 'Performans & Pratik',
      explain: `${topic} kullanılırken kaynak kullanımını minimize etme ve çalışma verimliliğini maksimuma çıkarma stratejisidir.`,
      example: `Gereksiz yükleri kaldırarak işleme süresini %40 oranında düşürebilirsiniz.`,
      key: 'Erken optimizasyondan kaçının; önce çalışan, sonra hızlı yapıyı kurun.'
    },
    {
      title: `${topic} Sık Yapılan Hatalar`,
      category: 'Kritik Dikkat Noktası',
      explain: `${topic} öğrenilirken ve uygulanırken en çok karşılaşılan kavram yanılgıları ve mantık hatalarıdır.`,
      example: `Yüzeysel tanımlarla yetinip alt mekanizmayı göz ardı etmek en yaygın hatadır.`,
      key: 'Varsayımlara dayanmak yerine her zaman kaynak dokümantasyonu kontrol edin.'
    },
    {
      title: `${topic} Pratik Kullanım Senaryosu`,
      category: 'Gerçek Dünya Uygulaması',
      explain: `${topic} kavramının endüstride ve günlük projelerde nasıl katma değer yarattığının canlı gösterimidir.`,
      example: `Büyük ölçekli sistemlerde güvenilirlik ve ölçeklenebilirlik sağlamak için kullanılır.`,
      key: 'Teori pratikle birleştiğinde kalıcı öğrenme gerçekleşir.'
    },
    {
      title: `${topic} Altın Kuralı & Geleceği`,
      category: 'Gelecek & Strateji',
      explain: `${topic} disiplininde başarılı olmak için asla unutulmaması gereken vizyonel özet.`,
      example: `Teknolojik gelişmelere uyum sağlarken temel prensipleri koruma yaklaşımı.`,
      key: 'Temel kavramlara hakim olan, gelecekteki tüm değişimlere kolayca adapte olur.'
    }
  ];

  for (let i = 0; i < Math.min(count, concepts.length); i++) {
    const item = concepts[i];
    flashcards.push({
      id: `fc_dyn_${Date.now()}_${seed}_${i}`,
      topic,
      frontTitle: item.title,
      frontCategory: item.category,
      backExplanation: item.explain,
      backExample: item.example,
      backKeyPoint: item.key,
      isLearned: false,
    });
  }

  return flashcards;
}
