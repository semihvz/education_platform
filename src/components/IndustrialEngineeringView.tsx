import React, { useState, useMemo } from 'react';
import { 
  Factory, 
  Workflow, 
  Boxes, 
  Calculator, 
  HelpCircle, 
  PackageCheck, 
  GitBranch, 
  BookOpen,
  ChevronDown,
  ChevronUp,
  Database,
  Terminal,
  Play,
  Copy,
  Check,
  Code,
  Cpu
} from 'lucide-react';

interface MRPMatrixRow {
  week: number;
  grossReq: number;
  scheduledReceipts: number;
  onHand: number;
  netReq: number;
  plannedOrderReceipts: number;
  plannedOrderReleases: number;
}

interface SQLQueryExample {
  id: string;
  category: string;
  title: string;
  description: string;
  sql: string;
  resultHeaders: string[];
  resultRows: (string | number)[][];
}

interface PythonCodeExample {
  id: string;
  category: string;
  title: string;
  description: string;
  code: string;
  output: string;
}

const SQL_EXAMPLES_DATABASE: SQLQueryExample[] = [
  {
    id: 'query-1',
    category: 'Stok & Depo Yönetimi',
    title: '1. Kritik Emniyet Stoğu Uyarısı Sorgusu',
    description: 'Eldeki stok miktarı (on_hand_qty) belirlenen emniyet stoğunun (safety_stock) altına düşmüş olan malzemeleri ve eksik miktarları bulur.',
    sql: `SELECT 
    item_code AS Malzeme_Kodu,
    item_name AS Malzeme_Adi,
    on_hand_qty AS Eldeki_Stok,
    safety_stock AS Emniyet_Stogu,
    (safety_stock - on_hand_qty) AS Eksik_Miktar
FROM Inventory
WHERE on_hand_qty < safety_stock
ORDER BY Eksik_Miktar DESC;`,
    resultHeaders: ['Malzeme_Kodu', 'Malzeme_Adi', 'Eldeki_Stok', 'Emniyet_Stogu', 'Eksik_Miktar'],
    resultRows: [
      ['M-102', 'Li-Ion Batarya Hücresi', 25, 50, 25],
      ['M-405', 'Alüminyum Profil 40x40', 12, 30, 18],
      ['M-801', 'Rulman 6204-ZZ', 8, 20, 12]
    ]
  },
  {
    id: 'query-2',
    category: 'Üretim & Kalite Analitiği',
    title: '2. Vardiya Bazında Hurda & Kalite Verimlilik Raporu',
    description: 'Her bir üretim hattı ve vardiya için üretilen sağlam parça sayısı, hurda miktarı ve Kalite Oranı % değerini hesaplar.',
    sql: `SELECT 
    production_line AS Uretim_Hatti,
    shift_code AS Vardiya,
    SUM(produced_qty) AS Toplam_Uretim,
    SUM(scrap_qty) AS Hurda_Adedi,
    ROUND( (SUM(produced_qty - scrap_qty) * 100.0 / SUM(produced_qty)), 2 ) AS Kalite_Orani_Yuzde
FROM ProductionLogs
WHERE log_date = CURRENT_DATE
GROUP BY production_line, shift_code
HAVING SUM(produced_qty) > 0
ORDER BY Kalite_Orani_Yuzde ASC;`,
    resultHeaders: ['Uretim_Hatti', 'Vardiya', 'Toplam_Uretim', 'Hurda_Adedi', 'Kalite_Orani_Yuzde'],
    resultRows: [
      ['Hatt-1 (Montaj)', 'Vardiya 2 (Gece)', 450, 36, '%92.00'],
      ['Hatt-2 (Pres)', 'Vardiya 1 (Gündüz)', 1200, 48, '%96.00'],
      ['Hatt-3 (Kaynak)', 'Vardiya 1 (Gündüz)', 800, 16, '%98.00']
    ]
  },
  {
    id: 'query-3',
    category: 'Tedarik Zinciri & Satın Alma',
    title: '3. Tedarikçi Gecikme & Zamanında Teslimat (OTD) Skoru',
    description: 'Tedarikçilerin verilen satın alma siparişlerinde taahhüt edilen teslim tarihi ile gerçekleşen teslim tarihini karşılaştırarak Zamanında Teslimat Oranını hesaplar.',
    sql: `SELECT 
    s.supplier_name AS Tedarikci_Adi,
    COUNT(po.po_id) AS Toplam_Siparis,
    SUM(CASE WHEN po.actual_delivery_date <= po.promised_date THEN 1 ELSE 0 END) AS Zamaninda_Teslim,
    ROUND(
      SUM(CASE WHEN po.actual_delivery_date <= po.promised_date THEN 1 ELSE 0 END) * 100.0 / COUNT(po.po_id),
      1
    ) AS OTD_Skoru_Yuzde
FROM PurchaseOrders po
JOIN Suppliers s ON po.supplier_id = s.supplier_id
GROUP BY s.supplier_name
ORDER BY OTD_Skoru_Yuzde DESC;`,
    resultHeaders: ['Tedarikci_Adi', 'Toplam_Siparis', 'Zamaninda_Teslim', 'OTD_Skoru_Yuzde'],
    resultRows: [
      ['Bosch Sanayi A.Ş.', 45, 43, '%95.5'],
      ['SKF Rulman Ltd.', 30, 27, '%90.0'],
      ['Er Demir Çelik A.Ş.', 20, 14, '%70.0']
    ]
  },
  {
    id: 'query-4',
    category: 'Pencere Fonksiyonları (Window Functions)',
    title: '4. Makine Arızaları Arası Ortalama Süre (MTBF Analizi)',
    description: 'LAG() pencere fonksiyonunu kullanarak makinelerin bir önceki arıza tarihi ile mevcut arıza tarihi arasındaki zaman farkını (Duruşlar Arası Süre) hesaplar.',
    sql: `SELECT 
    machine_id AS Makine_Kodu,
    downtime_start AS Ariza_Tarihi,
    LAG(downtime_start, 1) OVER (PARTITION BY machine_id ORDER BY downtime_start) AS Bir_Onceki_Ariza,
    DATEDIFF('hour', 
      LAG(downtime_start, 1) OVER (PARTITION BY machine_id ORDER BY downtime_start),
      downtime_start
    ) AS Calisma_Suresi_Saat
FROM MaintenanceLogs
ORDER BY machine_id, downtime_start DESC;`,
    resultHeaders: ['Makine_Kodu', 'Ariza_Tarihi', 'Bir_Onceki_Ariza', 'Calisma_Suresi_Saat'],
    resultRows: [
      ['CNC-01', '2026-09-08 14:30', '2026-09-02 09:15', 149],
      ['CNC-01', '2026-09-02 09:15', '2026-08-25 11:00', 190],
      ['PRESS-04', '2026-09-07 18:00', '2026-09-01 08:00', 154]
    ]
  }
];

const PYTHON_EXAMPLES_DATABASE: PythonCodeExample[] = [
  {
    id: 'py-1',
    category: 'Yöneylem Araştırması & Kar Maksimizasyonu',
    title: '1. PuLP ile Lineer Programlama (Üretim Planlama Optimizasyonu)',
    description: 'Ürün A ve Ürün B için hammadde ve işçilik kısıtları altında toplam karı maksimize eden optimal üretim miktarlarını çözer.',
    code: `import pulp

# Model Oluşturma (Kar Maksimizasyonu)
model = pulp.LpProblem("Üretim_Planlama_Optimizasyonu", pulp.LpMaximize)

# Karar Değişkenleri (Üretilecek Miktarlar)
x1 = pulp.LpVariable('Ürün_A_Miktari', lowBound=0, cat='Integer')
x2 = pulp.LpVariable('Ürün_B_Miktari', lowBound=0, cat='Integer')

# Amaç Fonksiyonu (Maksimum Kar: Ürün A -> 50 TL, Ürün B -> 40 TL)
model += 50 * x1 + 40 * x2, "Toplam_Kar"

# Kısıtlar (Hammadde ve Makine Saat Kapasitesi)
model += 2 * x1 + 3 * x2 <= 120, "Hammadde_Kisitlanisi"
model += 4 * x1 + 2 * x2 <= 160, "Makine_Saati_Kisiti"

# Çözüm
model.solve()

print(f"Optimal Çözüm Durumu: {pulp.LpStatus[model.status]}")
print(f"Üretilecek Ürün A Miktarı: {x1.varValue} Adet")
print(f"Üretilecek Ürün B Miktarı: {x2.varValue} Adet")
print(f"Maksimum Elde Edilen Kar: {pulp.value(model.objective)} TL")`,
    output: `Optimal Çözüm Durumu: Optimal
Üretilecek Ürün A Miktarı: 30.0 Adet
Üretilecek Ürün B Miktarı: 20.0 Adet
Maksimum Elde Edilen Kar: 2300.0 TL`
  },
  {
    id: 'py-2',
    category: 'Tedarik Zinciri & Talep Tahminleme',
    title: '2. Pandas ile Hareketli Ortalama (Moving Average) Tahmini',
    description: 'Geçmiş 6 aylık ürün satış verilerini Pandas ile işleyerek 3 aylık Hareketli Ortalama yöntemiyle gelecek dönem talep tahminini hesaplar.',
    code: `import pandas as pd
import numpy as np

# Geçmiş Satış Veri Seti
data = {
    'Ay': ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    'Gercek_Satis': [420, 450, 480, 510, 530, 560]
}
df = pd.DataFrame(data)

# 3 Aylık Hareketli Ortalama Hesabı
df['3_Aylik_HO'] = df['Gercek_Satis'].rolling(window=3).mean()

# Gelecek Ay (Temmuz) Tahmini
temmuz_tahmini = df['Gercek_Satis'].tail(3).mean()

print(df.to_string(index=False))
print(f"\\n🔮 Temmuz Ayı Tahmini Satış Miktarı: {temmuz_tahmini:.1f} Adet")`,
    output: `     Ay  Gercek_Satis  3_Aylik_HO
   Ocak           420         NaN
  Şubat           450         NaN
   Mart           480       450.0
  Nisan           510       480.0
  Mayıs           530       506.7
Haziran           560       533.3

🔮 Temmuz Ayı Tahmini Satış Miktarı: 533.3 Adet`
  },
  {
    id: 'py-3',
    category: 'Stok Yönetimi & EOQ Hesabı',
    title: '3. Ekonomik Sipariş Miktarı (EOQ) & Toplam Maliyet Fonksiyonu',
    description: 'Verilen talep, sipariş ve elde tutma maliyeti değerlerine göre EOQ ve minimum toplam stok maliyetini (Total Cost) hesaplar.',
    code: `import math

def eoq_hesapla(D, S, H):
    # D: Yıllık Talep, S: Sipariş Maliyeti, H: Elde Tutma Maliyeti
    EOQ = math.sqrt((2 * D * S) / H)
    toplam_maliyet = (D / EOQ) * S + (EOQ / 2) * H
    siparis_sayisi = D / EOQ
    return EOQ, toplam_maliyet, siparis_sayisi

D = 12000  # Adet/yıl
S = 150    # TL/sipariş
H = 5      # TL/adet/yıl

eoq, tc, n = eoq_hesapla(D, S, H)

print(f"Optimal Sipariş Miktarı (EOQ): {eoq:.2f} Adet")
print(f"Yıllık Sipariş Sayısı: {n:.1f} Sipariş")
print(f"Minimum Yıllık Toplam Stok Maliyeti: {tc:.2f} TL")`,
    output: `Optimal Sipariş Miktarı (EOQ): 848.53 Adet
Yıllık Sipariş Sayısı: 14.1 Sipariş
Minimum Yıllık Toplam Stok Maliyeti: 4242.64 TL`
  },
  {
    id: 'py-4',
    category: 'Simülasyon & Kuyruk Teorisi (SimPy)',
    title: '4. Fabrika Kalite Kontrol Kuyruk Simülasyonu',
    description: 'Rastgele üreteçler (Random/Exponential) kullanarak kalite kontrol istasyonundaki ortalama bekleme süresini simüle eder.',
    code: `import random

def kalite_kontrol_simulasyonu(parca_sayisi=100, ort_gelis_suresi=5.0, ort_islem_suresi=4.0):
    bekleme_sureleri = []
    mevcut_zaman = 0.0
    istasyon_musait_zaman = 0.0
    
    for i in range(parca_sayisi):
        gelis_araligi = random.expovariate(1.0 / ort_gelis_suresi)
        mevcut_zaman += gelis_araligi
        
        bekleme = max(0.0, istasyon_musait_zaman - mevcut_zaman)
        bekleme_sureleri.append(bekleme)
        
        islem_suresi = random.expovariate(1.0 / ort_islem_suresi)
        istasyon_musait_zaman = max(mevcut_zaman, istasyon_musait_zaman) + islem_suresi

    ort_bekleme = sum(bekleme_sureleri) / len(bekleme_sureleri)
    print(f"Simüle Edilen Parça Sayısı: {parca_sayisi}")
    print(f"Parça Başına Ortalama Kuyrukta Bekleme Süresi: {ort_bekleme:.2f} Dakika")

random.seed(42)
kalite_kontrol_simulasyonu()`,
    output: `Simüle Edilen Parça Sayısı: 100
Parça Başına Ortalama Kuyrukta Bekleme Süresi: 1.84 Dakika`
  }
];

export const IndustrialEngineeringView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mrp-theory' | 'bom-tree' | 'mrp-simulator' | 'mrp-questions' | 'ie-sql' | 'ie-python'>('mrp-theory');

  // MRP Simulator States
  const [initialOnHand, setInitialOnHand] = useState<number>(30);
  const [safetyStock, setSafetyStock] = useState<number>(10);
  const [leadTime, setLeadTime] = useState<number>(2); // in weeks
  const [lotSize, setLotSize] = useState<number>(50); // Lot-for-Lot (0) or Fixed Lot Size (e.g. 50)
  const [grossReqs, setGrossReqs] = useState<number[]>([0, 20, 40, 30, 60, 50, 40, 70]);

  // SQL Interactive Playground State
  const [selectedSqlQueryId, setSelectedSqlQueryId] = useState<string>('query-1');
  const [copiedQueryId, setCopiedQueryId] = useState<string | null>(null);

  // Python Interactive Playground State
  const [selectedPyCodeId, setSelectedPyCodeId] = useState<string>('py-1');
  const [copiedPyId, setCopiedPyId] = useState<string | null>(null);

  // Expandable question answers state
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Record<number, boolean>>({});

  const toggleQuestion = (id: number) => {
    setExpandedQuestionIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentSqlQuery = useMemo(() => {
    return SQL_EXAMPLES_DATABASE.find(q => q.id === selectedSqlQueryId) || SQL_EXAMPLES_DATABASE[0];
  }, [selectedSqlQueryId]);

  const currentPyCode = useMemo(() => {
    return PYTHON_EXAMPLES_DATABASE.find(p => p.id === selectedPyCodeId) || PYTHON_EXAMPLES_DATABASE[0];
  }, [selectedPyCodeId]);

  const handleCopySql = (sqlText: string, id: string) => {
    navigator.clipboard.writeText(sqlText);
    setCopiedQueryId(id);
    setTimeout(() => setCopiedQueryId(null), 2000);
  };

  const handleCopyPy = (pyText: string, id: string) => {
    navigator.clipboard.writeText(pyText);
    setCopiedPyId(id);
    setTimeout(() => setCopiedPyId(null), 2000);
  };

  // Calculate dynamic MRP Matrix
  const mrpTableData: MRPMatrixRow[] = useMemo(() => {
    const rows: MRPMatrixRow[] = [];
    let currentOnHand = initialOnHand;

    for (let w = 0; w < 8; w++) {
      const gross = grossReqs[w] || 0;
      const sched = 0; // standard scheduled receipts

      const projectedBeforeNet = currentOnHand + sched;
      
      let net = 0;
      let plannedRec = 0;

      if (projectedBeforeNet - gross < safetyStock) {
        net = (gross + safetyStock) - projectedBeforeNet;
        
        // Lot sizing
        if (lotSize > 0) {
          plannedRec = Math.ceil(net / lotSize) * lotSize;
        } else {
          plannedRec = net; // Lot for Lot (L4L)
        }
      }

      currentOnHand = projectedBeforeNet - gross + plannedRec;

      rows.push({
        week: w + 1,
        grossReq: gross,
        scheduledReceipts: sched,
        onHand: currentOnHand,
        netReq: net,
        plannedOrderReceipts: plannedRec,
        plannedOrderReleases: 0
      });
    }

    // Second pass for Planned Order Release with Lead Time offset
    for (let w = 0; w < 8; w++) {
      const releaseWeekIndex = w - leadTime;
      if (releaseWeekIndex >= 0 && releaseWeekIndex < 8) {
        rows[releaseWeekIndex].plannedOrderReleases += rows[w].plannedOrderReceipts;
      }
    }

    return rows;
  }, [initialOnHand, safetyStock, leadTime, lotSize, grossReqs]);

  const handleGrossReqChange = (index: number, val: number) => {
    const newReqs = [...grossReqs];
    newReqs[index] = Math.max(0, val);
    setGrossReqs(newReqs);
  };

  return (
    <div className="ie-mrp-container">
      {/* Header Banner */}
      <div className="ie-banner">
        <div className="banner-badge">
          <Factory className="icon-sm" />
          <span>ENDÜSTRİ MÜHENDİSLİĞİ • ÜRETİM, OPTİMİZASYON & KODLAMA</span>
        </div>
        <h2 className="banner-title">Endüstri Mühendisliği Portal</h2>
        <p className="banner-desc">
          Malzeme İhtiyaç Planlaması (MRP), Ürün Ağaçları (BOM), Yöneylem Araştırması, Python Optimizasyonu ve SQL Veritabanı Analitiği.
        </p>

        {/* Tab Navigation */}
        <div className="ie-tab-bar">
          <button 
            className={`ie-tab-btn ${activeTab === 'mrp-theory' ? 'active' : ''}`}
            onClick={() => setActiveTab('mrp-theory')}
          >
            <BookOpen className="icon-xs" />
            <span>1. MRP Konu Anlatımı</span>
          </button>

          <button 
            className={`ie-tab-btn ${activeTab === 'bom-tree' ? 'active' : ''}`}
            onClick={() => setActiveTab('bom-tree')}
          >
            <GitBranch className="icon-xs" />
            <span>2. Ürün Ağacı (BOM)</span>
          </button>

          <button 
            className={`ie-tab-btn ${activeTab === 'mrp-simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('mrp-simulator')}
          >
            <Calculator className="icon-xs" />
            <span>3. MRP Matris Simülatörü</span>
          </button>

          <button 
            className={`ie-tab-btn ${activeTab === 'mrp-questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('mrp-questions')}
          >
            <HelpCircle className="icon-xs" />
            <span>4. Örnek Sorular & Vakalar</span>
          </button>

          <button 
            className={`ie-tab-btn ${activeTab === 'ie-sql' ? 'active' : ''}`}
            onClick={() => setActiveTab('ie-sql')}
          >
            <Database className="icon-xs" />
            <span>5. SQL Sorguları</span>
          </button>

          <button 
            className={`ie-tab-btn ${activeTab === 'ie-python' ? 'active' : ''}`}
            onClick={() => setActiveTab('ie-python')}
          >
            <Code className="icon-xs" />
            <span>6. Python Programlama</span>
          </button>
        </div>
      </div>

      {/* TAB 1: THEORY & CONCEPTS */}
      {activeTab === 'mrp-theory' && (
        <div className="ie-tab-content fade-in">
          <div className="ie-card-grid">
            <div className="ie-card">
              <div className="card-header">
                <Boxes className="card-icon" />
                <h3>1. MRP Sisteminin Temel Girdileri</h3>
              </div>
              <ul className="ie-list">
                <li>
                  <strong>Ana Üretim Çizelgesi (MPS - Master Production Schedule):</strong> Hangi nihai üründen, ne zaman, kaç adet üretileceğini belirten çizelgedir.
                </li>
                <li>
                  <strong>Ürün Ağacı (BOM - Bill of Materials):</strong> Ürünün yapısını ve montaj seviyelerini belirten bileşen listesidir.
                </li>
                <li>
                  <strong>Stok Durum Kayıtları (Inventory Status Records):</strong> Eldeki stok (On-hand), emniyet stoğu (Safety stock) ve verilmiş siparişleri (Scheduled receipts) içerir.
                </li>
              </ul>
            </div>

            <div className="ie-card">
              <div className="card-header">
                <Workflow className="card-icon" />
                <h3>2. MRP Matris Terimleri & Denklemleri</h3>
              </div>
              <div className="formula-box">
                <p><strong>Brüt İhtiyaç (Gross Requirements):</strong> İlgili dönemde ihtiyaç duyulan toplam miktar.</p>
                <p><strong>Net İhtiyaç (Net Requirements):</strong> <code>Net İhtiyaç = Brüt İhtiyaç + Emniyet Stoğu - (Eldeki Stok + Gelecek Siparişler)</code></p>
                <p><strong>Planlanan Sipariş Teslimatı (Planned Order Receipts):</strong> Net ihtiyacı karşılamak üzere siparişin eline ulaşacağı miktar.</p>
                <p><strong>Planlanan Sipariş Verilişi (Planned Order Release):</strong> Teslimat süresi (Lead Time) kadar önce sisteme salınan sipariş miktarı.</p>
              </div>
            </div>

            <div className="ie-card">
              <div className="card-header">
                <PackageCheck className="card-icon" />
                <h3>3. Lot Büyüklüğü (Lot Sizing) Yöntemleri</h3>
              </div>
              <div className="lot-types-grid">
                <div className="lot-type-box">
                  <h4>L4L (Lot-for-Lot)</h4>
                  <p>Her dönem tam ihtiyaç kadar sipariş verilir. Stok tutma maliyetini sıfırlar fakat sipariş hazırlık (setup) maliyetini artırabilir.</p>
                </div>
                <div className="lot-type-box">
                  <h4>EOQ (Ekonomik Sipariş Miktarı)</h4>
                  <p>Elde tutma maliyeti ile sipariş verme maliyetini dengeleyen sabit miktar formülü: <code>EOQ = √[(2 · D · S) / H]</code></p>
                </div>
                <div className="lot-type-box">
                  <h4>POQ (Periyodik Sipariş Miktarı)</h4>
                  <p>Belirli aralıklarla (ör. 2 haftada bir) sonraki dönemlerin toplam ihtiyacı kadar sipariş açılması prensibine dayanır.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BILL OF MATERIALS (BOM) VISUALIZER */}
      {activeTab === 'bom-tree' && (
        <div className="ie-tab-content fade-in">
          <div className="bom-visual-card">
            <h3>📌 Örnek Ürün Ağacı (BOM) Hiyerarşisi</h3>
            <p className="bom-subtitle">Örnek Ürün: <strong>Elektrikli Bisiklet (Model EB-100)</strong></p>

            <div className="bom-tree-diagram">
              {/* Level 0 */}
              <div className="tree-node level-0">
                <div className="node-box">
                  <span className="node-level">Seviye 0</span>
                  <span className="node-title">🚴 Elektrikli Bisiklet (1 Adet)</span>
                  <span className="node-meta">Tedarik Süresi: 1 Hafta</span>
                </div>
              </div>

              <div className="tree-branches">
                {/* Level 1 Components */}
                <div className="tree-branch-item">
                  <div className="tree-node level-1">
                    <div className="node-box">
                      <span className="node-level">Seviye 1</span>
                      <span className="node-title">⚙️ Kadro Grubu (1 Adet)</span>
                      <span className="node-meta">Tedarik Süresi: 2 Hafta</span>
                    </div>
                  </div>
                  <div className="tree-sub-branches">
                    <div className="tree-node level-2">
                      <div className="node-box">
                        <span className="node-level">Seviye 2</span>
                        <span className="node-title">🔩 Alüminyum Boru (4 Metre)</span>
                      </div>
                    </div>
                    <div className="tree-node level-2">
                      <div className="node-box">
                        <span className="node-level">Seviye 2</span>
                        <span className="node-title">🎨 Toz Boya (0.5 kg)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tree-branch-item">
                  <div className="tree-node level-1">
                    <div className="node-box">
                      <span className="node-level">Seviye 1</span>
                      <span className="node-title">🔋 Batarya & Motor Seti (1 Adet)</span>
                      <span className="node-meta">Tedarik Süresi: 3 Hafta</span>
                    </div>
                  </div>
                  <div className="tree-sub-branches">
                    <div className="tree-node level-2">
                      <div className="node-box">
                        <span className="node-level">Seviye 2</span>
                        <span className="node-title">⚡ Li-Ion Hücre (40 Adet)</span>
                      </div>
                    </div>
                    <div className="tree-node level-2">
                      <div className="node-box">
                        <span className="node-level">Seviye 2</span>
                        <span className="node-title">🔌 Kontrol Kartı (1 Adet)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tree-branch-item">
                  <div className="tree-node level-1">
                    <div className="node-box">
                      <span className="node-level">Seviye 1</span>
                      <span className="node-title">🛞 Tekerlek Takımı (2 Adet)</span>
                      <span className="node-meta">Tedarik Süresi: 1 Hafta</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bom-calculation-example">
              <h4>🧮 Ürün Ağacı İhtiyaç Patlatma (Explosion) Örneği:</h4>
              <p>
                100 Adet Elektrikli Bisiklet üretmek için gerekli toplam parça miktarları:
              </p>
              <ul>
                <li><strong>Kadro Grubu:</strong> 100 × 1 = 100 Adet</li>
                <li><strong>Tekerlek Takımı:</strong> 100 × 2 = 200 Adet</li>
                <li><strong>Li-Ion Hücre:</strong> 100 × 1 × 40 = 4.000 Adet</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INTERACTIVE MRP SIMULATOR */}
      {activeTab === 'mrp-simulator' && (
        <div className="ie-tab-content fade-in">
          <div className="mrp-sim-panel">
            <div className="sim-controls-grid">
              <div className="control-group">
                <label>Eldeki Stok (On-Hand):</label>
                <input 
                  type="number" 
                  value={initialOnHand}
                  onChange={(e) => setInitialOnHand(Number(e.target.value))}
                />
              </div>

              <div className="control-group">
                <label>Emniyet Stoğu (Safety Stock):</label>
                <input 
                  type="number" 
                  value={safetyStock}
                  onChange={(e) => setSafetyStock(Number(e.target.value))}
                />
              </div>

              <div className="control-group">
                <label>Tedarik Süresi / Lead Time (Hafta):</label>
                <input 
                  type="number" 
                  min="1" 
                  max="4" 
                  value={leadTime}
                  onChange={(e) => setLeadTime(Number(e.target.value))}
                />
              </div>

              <div className="control-group">
                <label>Lot Büyüklüğü (0 = L4L, &gt;0 = Sabit Lot):</label>
                <input 
                  type="number" 
                  value={lotSize}
                  onChange={(e) => setLotSize(Number(e.target.value))}
                />
              </div>
            </div>

            {/* MRP Matrix Table */}
            <div className="mrp-table-wrapper">
              <table className="mrp-matrix-table">
                <thead>
                  <tr>
                    <th className="row-header">MRP Satırları / Haftalar</th>
                    {mrpTableData.map(r => (
                      <th key={r.week}>Hafta {r.week}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Gross Requirements Input Row */}
                  <tr className="row-gross">
                    <td className="row-title">Brüt İhtiyaç (Gross Requirements)</td>
                    {grossReqs.map((val, idx) => (
                      <td key={idx} className="cell-input">
                        <input 
                          type="number"
                          value={val}
                          onChange={(e) => handleGrossReqChange(idx, Number(e.target.value))}
                        />
                      </td>
                    ))}
                  </tr>

                  {/* Scheduled Receipts */}
                  <tr>
                    <td className="row-title">Gelecek Siparişler (Scheduled Receipts)</td>
                    {mrpTableData.map(r => (
                      <td key={r.week}>{r.scheduledReceipts}</td>
                    ))}
                  </tr>

                  {/* On-Hand Inventory */}
                  <tr className="row-onhand">
                    <td className="row-title">Eldeki Stok (Projected On-Hand)</td>
                    {mrpTableData.map(r => (
                      <td key={r.week} className={r.onHand < safetyStock ? 'alert-stock' : ''}>
                        {r.onHand}
                      </td>
                    ))}
                  </tr>

                  {/* Net Requirements */}
                  <tr className="row-net">
                    <td className="row-title">Net İhtiyaç (Net Requirements)</td>
                    {mrpTableData.map(r => (
                      <td key={r.week} className={r.netReq > 0 ? 'highlight-net' : ''}>
                        {r.netReq}
                      </td>
                    ))}
                  </tr>

                  {/* Planned Order Receipts */}
                  <tr>
                    <td className="row-title">Planlanan Sipariş Teslimatı (Order Receipts)</td>
                    {mrpTableData.map(r => (
                      <td key={r.week}>{r.plannedOrderReceipts}</td>
                    ))}
                  </tr>

                  {/* Planned Order Releases */}
                  <tr className="row-release">
                    <td className="row-title">Planlanan Sipariş Açılışı (Order Releases)</td>
                    {mrpTableData.map(r => (
                      <td key={r.week} className={r.plannedOrderReleases > 0 ? 'highlight-release' : ''}>
                        {r.plannedOrderReleases}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="sim-summary">
              <p>💡 <strong>Not:</strong> Tedarik süresi (Lead Time) {leadTime} hafta olduğundan, Hafta {leadTime + 1}'deki sipariş teslimatı için Hafta 1'de sipariş açılması (Order Release) gerekmektedir.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MRP EXERCISES & CASE PROBLEMS */}
      {activeTab === 'mrp-questions' && (
        <div className="ie-tab-content fade-in">
          <div className="questions-container">
            <h3>📝 Endüstri Mühendisliği MRP Vaka & Soru Bankası</h3>
            <p className="questions-intro">
              Üretim planlama sınavları ve fabrika uygulama mülakatlarında karşılaşılan klasik MRP soruları ve detaylı çözümleri:
            </p>

            <div className="questions-list">
              {[
                {
                  id: 1,
                  title: "Soru 1: Emniyet Stoğu ve Lead Time Hesabı",
                  text: "Bir montaj fabrikasında X bileşeninin eldeki stoğu 40 adet, emniyet stoğu 15 adettir. 3. Haftadaki brüt ihtiyaç 80 adet ve tedarik süresi 2 haftadır. Lot-for-Lot (L4L) yöntemi uygulandığına göre sipariş ne zaman ve kaç adet açılmalıdır?",
                  solution: "Net İhtiyaç = Brüt İhtiyaç + Emniyet Stoğu - Eldeki Stok = 80 + 15 - 40 = 55 Adet. L4L yönteminde sipariş miktarı 55 adettir. Lead time 2 hafta olduğu için 3. Hafta teslimatı için 1. Haftada 55 adet sipariş açılmalıdır (Planned Order Release)."
                },
                {
                  id: 2,
                  title: "Soru 2: Ürün Ağacı (BOM) İhtiyaç Patlatması",
                  text: "A ürününden 1 adet üretmek için 2 adet B ve 3 adet C bileşeni gerekmektedir. 1 adet B bileşeni üretmek için ise 4 adet D hammaddesi gerekmektedir. 50 adet A ürünü üretilmesi için toplam kaç adet D hammaddesi gereklidir?",
                  solution: "A → 2 B → 2 × 4 D = 8 D hammaddesi. 50 adet A ürünü için toplam D miktarı = 50 × 8 = 400 Adet D hammaddesi gereklidir."
                },
                {
                  id: 3,
                  title: "Soru 3: EOQ Lot Büyüklüğü Hesaplaması",
                  text: "Yıllık toplam malzeme ihtiyacı D = 10.000 adet, sipariş verme maliyeti S = 50 TL/sipariş ve birim yıllık stok tutma maliyeti H = 4 TL/adet/yıl olduğuna göre Ekonomik Sipariş Miktarı (EOQ) kaçtır?",
                  solution: "EOQ = √[(2 · D · S) / H] = √[(2 · 10.000 · 50) / 4] = √[1.000.000 / 4] = √[250.000] = 500 Adet."
                },
                {
                  id: 4,
                  title: "Soru 4: MRP II ile MRP I Arasındaki Temel Fark",
                  text: "MRP I (Malzeme İhtiyaç Planlaması) ile MRP II (Üretim Kaynakları Planlaması) arasındaki temel fark nedir?",
                  solution: "MRP I yalnızca malzeme ve bileşen ihtiyacına odaklanırken; MRP II iş gücü, makine kapasiteleri, finansal kaynaklar ve üretim maliyetlerini de dahil eden entegre bir kapasite planlama sistemidir."
                }
              ].map(q => (
                <div key={q.id} className="question-item-card">
                  <div className="q-card-header" onClick={() => toggleQuestion(q.id)}>
                    <span className="q-title">{q.title}</span>
                    <button className="q-toggle-btn">
                      {expandedQuestionIds[q.id] ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </div>
                  <p className="q-text">{q.text}</p>
                  
                  {expandedQuestionIds[q.id] && (
                    <div className="q-solution-box fade-in">
                      <strong>✅ Çözüm & Açıklama:</strong>
                      <p>{q.solution}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: INDUSTRIAL ENGINEERING SQL TOPICS */}
      {activeTab === 'ie-sql' && (
        <div className="ie-tab-content fade-in">
          {/* SQL Overview Header */}
          <div className="sql-intro-card">
            <div className="sql-intro-header">
              <Database className="sql-header-icon" />
              <div>
                <h3>Endüstri Mühendisliğinde SQL ve Veri Tabanı Konuları</h3>
                <p>ERP (SAP, Oracle), MES ve Tedarik Zinciri sistemlerinde üretim, stok, verimlilik ve kalite analizleri için en çok kullanılan SQL konuları:</p>
              </div>
            </div>

            <div className="sql-topics-grid">
              <div className="sql-topic-box">
                <h4>1. Temel Sorgulama & Filtreleme</h4>
                <p><code>SELECT</code>, <code>WHERE</code>, <code>AND/OR</code>, <code>BETWEEN</code>, <code>IN</code>, <code>LIKE</code></p>
                <span className="topic-badge">Stok, Sipariş & Müşteri Filtreleme</span>
              </div>

              <div className="sql-topic-box">
                <h4>2. Gruplama & Aggregation</h4>
                <p><code>GROUP BY</code>, <code>HAVING</code>, <code>SUM()</code>, <code>AVG()</code>, <code>COUNT()</code></p>
                <span className="topic-badge">Vardiya Uretim & Hurda Oranları</span>
              </div>

              <div className="sql-topic-box">
                <h4>3. Tablo İlişkileri & Birleştirme</h4>
                <p><code>INNER JOIN</code>, <code>LEFT JOIN</code>, <code>RIGHT JOIN</code>, <code>FULL JOIN</code></p>
                <span className="topic-badge">BOM, Tedarikçi & İş Emri Birleştirme</span>
              </div>

              <div className="sql-topic-box">
                <h4>4. İleri Seviye & Window Functions</h4>
                <p><code>ROW_NUMBER()</code>, <code>RANK()</code>, <code>LAG()</code>, <code>LEAD()</code>, <code>OVER()</code></p>
                <span className="topic-badge">Makine Duruş & MTBF Analizi</span>
              </div>
            </div>
          </div>

          {/* Interactive SQL Query Playground */}
          <div className="sql-playground-card">
            <div className="playground-header">
              <div className="p-title-group">
                <Terminal className="p-icon" />
                <h4>💻 İnteraktif Endüstri Mühendisliği SQL Sorgu Simülatörü</h4>
              </div>
              <span className="p-subtitle">Canlı Sorgu Örnekleri Seçip Çalıştırın</span>
            </div>

            {/* Query Selection Buttons */}
            <div className="query-selector-buttons">
              {SQL_EXAMPLES_DATABASE.map(q => (
                <button 
                  key={q.id}
                  className={`query-select-btn ${selectedSqlQueryId === q.id ? 'active' : ''}`}
                  onClick={() => setSelectedSqlQueryId(q.id)}
                >
                  <Database className="btn-icon-xs" />
                  <span>{q.title}</span>
                </button>
              ))}
            </div>

            {/* Selected Query Details */}
            <div className="query-detail-box">
              <div className="query-meta">
                <span className="query-category-tag">{currentSqlQuery.category}</span>
                <h5>{currentSqlQuery.title}</h5>
                <p>{currentSqlQuery.description}</p>
              </div>

              {/* SQL Code Box with Copy Button */}
              <div className="sql-code-container">
                <div className="code-top-bar">
                  <span className="code-lang">ANSI SQL • Production Data Query</span>
                  <button 
                    className="copy-sql-btn"
                    onClick={() => handleCopySql(currentSqlQuery.sql, currentSqlQuery.id)}
                  >
                    {copiedQueryId === currentSqlQuery.id ? (
                      <>
                        <Check className="icon-xs text-green" />
                        <span>Kopyalandı!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="icon-xs" />
                        <span>Kodu Kopyala</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="sql-code-block">
                  <code>{currentSqlQuery.sql}</code>
                </pre>
              </div>

              {/* Simulated Query Result Table */}
              <div className="query-result-wrapper">
                <div className="result-top-bar">
                  <Play className="icon-xs text-green" />
                  <span>Sorgu Çıktısı (Simüle Edilen Veri Tabanı Sonucu - {currentSqlQuery.resultRows.length} Satır)</span>
                </div>
                <table className="sql-result-table">
                  <thead>
                    <tr>
                      {currentSqlQuery.resultHeaders.map((h, i) => (
                        <th key={i}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentSqlQuery.resultRows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: INDUSTRIAL ENGINEERING PYTHON PROGRAMMING */}
      {activeTab === 'ie-python' && (
        <div className="ie-tab-content fade-in">
          {/* Python Intro Header */}
          <div className="sql-intro-card">
            <div className="sql-intro-header">
              <Code className="sql-header-icon" />
              <div>
                <h3>Endüstri Mühendisliğinde Python Programlama & Veri Analitiği</h3>
                <p>Optimizasyon (OR), Yöneylem Araştırması, Talep Tahmini, Stok Analitiği ve Fabrika Simülasyonlarında en çok kullanılan Python kütüphaneleri ve algoritmaları:</p>
              </div>
            </div>

            <div className="sql-topics-grid">
              <div className="sql-topic-box">
                <h4>1. PuLP & SciPy (Optimizasyon)</h4>
                <p>Lineer Programlama (LP), Tam Sayılı Programlama (IP), Kar Maksimizasyonu & Maliyet Minimizasyonu</p>
                <span className="topic-badge">Yöneylem Araştırması</span>
              </div>

              <div className="sql-topic-box">
                <h4>2. Pandas & NumPy (Veri Analizi)</h4>
                <p>Veri Temizleme, Stok Matrisleri, Üretim Raporlaması & Zaman Serisi Analizleri</p>
                <span className="topic-badge">Veri Bilimi & Raporlama</span>
              </div>

              <div className="sql-topic-box">
                <h4>3. Statsmodels & Scikit-Learn</h4>
                <p>Talep Tahminleme (Forecasting), Hareketli Ortalama (Moving Average) & Regresyon</p>
                <span className="topic-badge">Tedarik Zinciri Tahmini</span>
              </div>

              <div className="sql-topic-box">
                <h4>4. SimPy & Random (Simülasyon)</h4>
                <p>Kuyruk Teorisi (Queueing Theory), Montaj Hattı Simülasyonu & Monte Carlo Analizi</p>
                <span className="topic-badge">Süreç Simülasyonu</span>
              </div>
            </div>
          </div>

          {/* Interactive Python Code Playground */}
          <div className="sql-playground-card">
            <div className="playground-header">
              <div className="p-title-group">
                <Cpu className="p-icon" />
                <h4>🐍 İnteraktif Endüstri Mühendisliği Python Kod Simülatörü</h4>
              </div>
              <span className="p-subtitle">Canlı Python Senaryoları Seçin ve Kod/Çıktıyı İnceleyin</span>
            </div>

            {/* Script Selector Buttons */}
            <div className="query-selector-buttons">
              {PYTHON_EXAMPLES_DATABASE.map(p => (
                <button 
                  key={p.id}
                  className={`query-select-btn ${selectedPyCodeId === p.id ? 'active' : ''}`}
                  onClick={() => setSelectedPyCodeId(p.id)}
                >
                  <Code className="btn-icon-xs" />
                  <span>{p.title}</span>
                </button>
              ))}
            </div>

            {/* Selected Python Code Details */}
            <div className="query-detail-box">
              <div className="query-meta">
                <span className="query-category-tag">{currentPyCode.category}</span>
                <h5>{currentPyCode.title}</h5>
                <p>{currentPyCode.description}</p>
              </div>

              {/* Python Code Block with Copy */}
              <div className="sql-code-container">
                <div className="code-top-bar">
                  <span className="code-lang">Python 3.11 • Industrial Engineering Analytics Script</span>
                  <button 
                    className="copy-sql-btn"
                    onClick={() => handleCopyPy(currentPyCode.code, currentPyCode.id)}
                  >
                    {copiedPyId === currentPyCode.id ? (
                      <>
                        <Check className="icon-xs text-green" />
                        <span>Kopyalandı!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="icon-xs" />
                        <span>Kodu Kopyala</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="sql-code-block">
                  <code>{currentPyCode.code}</code>
                </pre>
              </div>

              {/* Terminal Output Console */}
              <div className="query-result-wrapper">
                <div className="result-top-bar">
                  <Terminal className="icon-xs text-green" />
                  <span>Terminal Çıktısı (Simüle Edilen Script Konsolu)</span>
                </div>
                <pre className="terminal-console-output">
                  <code>{currentPyCode.output}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
