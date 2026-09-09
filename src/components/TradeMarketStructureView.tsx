import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Zap, 
  Activity, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  RefreshCw
} from 'lucide-react';

export const TradeMarketStructureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trends' | 'structure-shifts' | 'liquidity-fvg' | 'chart-simulator' | 'trade-quiz'>('trends');

  // Simulator step index
  const [simStep, setSimStep] = useState<number>(0);

  // Expandable question state
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Record<number, boolean>>({});

  const toggleQuestion = (id: number) => {
    setExpandedQuestionIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const simStepsData = [
    {
      title: "1. Yükselen Trend Yapısı (Bullish Market Structure)",
      desc: "Fiyat sürekli daha yüksek tepeler (HH - Higher High) ve daha yüksek dipler (HL - Higher Low) yapmaktadır. Piyasada alıcılar hakimdir.",
      type: "bullish",
      pattern: "HH - HL - HH - HL"
    },
    {
      title: "2. Yapı Kırılımı (BOS - Break of Structure)",
      desc: "Fiyat önceki HH tepesini yukarı yönlü kırarak trendin devam edeceğini teyit eder. Bu hareket Break of Structure (BOS) olarak adlandırılır.",
      type: "bos",
      pattern: "BOS Onayı ➔ Yükseliş Devam Eder"
    },
    {
      title: "3. Karakter Değişimi (CHoCH - Change of Character)",
      desc: "Yükselen trendde fiyat, en son yapılan HL (Higher Low) dip seviyesini aşağı yönlü sertçe kırar. Bu durum trendin ayı piyasasına (Bearish) dönebileceğinin ilk habercisidir.",
      type: "choch",
      pattern: "CHoCH ➔ Trend Değişim Sinyali"
    },
    {
      title: "4. Likidite Temizliği & Order Block Testi (Liquidity Sweep & OB Re-Test)",
      desc: "Fiyat kırılım sonrası oluşan FVG (Fair Value Gap) boşluğunu doldurur ve Order Block bölgesinden tepki alarak yeni düşen trend hareketini başlatır.",
      type: "bearish-sweep",
      pattern: "Sell-Side Liquidity Sweep ➔ Ayı Trendi"
    }
  ];

  return (
    <div className="trade-ms-container">
      {/* Header Banner */}
      <div className="trade-banner">
        <div className="banner-badge">
          <TrendingUp className="icon-sm" />
          <span>FINANSAL PİYASALAR • PRICE ACTION & TRADING</span>
        </div>
        <h2 className="banner-title">Market Structure (Piyasa Yapısı)</h2>
        <p className="banner-desc">
          Market Structure; finansal piyasalarda (Kripto, Forex, Borsa) fiyatın oluşturduğu tepe ve dip noktalarının takibi ile trendin yönünü, likidite bölgelerini ve dönüş noktalarını (CHoCH, BOS, FVG) tespit etme metodolojisidir.
        </p>

        {/* Tab Navigation */}
        <div className="trade-tab-bar">
          <button 
            className={`trade-tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            <TrendingUp className="icon-xs" />
            <span>1. Trendler & HH/HL Yapısı</span>
          </button>

          <button 
            className={`trade-tab-btn ${activeTab === 'structure-shifts' ? 'active' : ''}`}
            onClick={() => setActiveTab('structure-shifts')}
          >
            <Activity className="icon-xs" />
            <span>2. BOS & CHoCH Kırılımları</span>
          </button>

          <button 
            className={`trade-tab-btn ${activeTab === 'liquidity-fvg' ? 'active' : ''}`}
            onClick={() => setActiveTab('liquidity-fvg')}
          >
            <Zap className="icon-xs" />
            <span>3. Likidite & FVG Boşlukları</span>
          </button>

          <button 
            className={`trade-tab-btn ${activeTab === 'chart-simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('chart-simulator')}
          >
            <BarChart3 className="icon-xs" />
            <span>4. İnteraktif Grafik Simülatörü</span>
          </button>

          <button 
            className={`trade-tab-btn ${activeTab === 'trade-quiz' ? 'active' : ''}`}
            onClick={() => setActiveTab('trade-quiz')}
          >
            <HelpCircle className="icon-xs" />
            <span>5. Trading Vakaları & Sorular</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TRENDS & HH/HL */}
      {activeTab === 'trends' && (
        <div className="trade-tab-content fade-in">
          <div className="trade-card-grid">
            <div className="trade-card">
              <div className="card-header">
                <ArrowUpRight className="card-icon text-green" />
                <h3>1. Yükselen Trend (Bullish Market Structure)</h3>
              </div>
              <p className="card-text">
                Fiyatın birbirini takip eden daha yüksek tepeler (<strong>HH - Higher High</strong>) ve daha yüksek dipler (<strong>HL - Higher Low</strong>) oluşturduğu piyasa yapısıdır.
              </p>
              <div className="structure-box bullish-border">
                <p>📈 <strong>Kural:</strong> HH ➔ HL ➔ HH ➔ HL dizilimi bozulmadığı sürece piyasa alıcı ağırlıklıdır.</p>
                <div className="tag-row">
                  <span className="ms-tag">HH (Higher High)</span>
                  <span className="ms-tag">HL (Higher Low)</span>
                </div>
              </div>
            </div>

            <div className="trade-card">
              <div className="card-header">
                <ArrowDownRight className="card-icon text-red" />
                <h3>2. Düşen Trend (Bearish Market Structure)</h3>
              </div>
              <p className="card-text">
                Fiyatın sürekli daha düşük tepeler (<strong>LH - Lower High</strong>) ve daha düşük dipler (<strong>LL - Lower Low</strong>) oluşturduğu piyasa yapısıdır.
              </p>
              <div className="structure-box bearish-border">
                <p>📉 <strong>Kural:</strong> LH ➔ LL ➔ LH ➔ LL dizilimi satıcıların piyasaya hakim olduğunu gösterir.</p>
                <div className="tag-row">
                  <span className="ms-tag">LH (Lower High)</span>
                  <span className="ms-tag">LL (Lower Low)</span>
                </div>
              </div>
            </div>

            <div className="trade-card">
              <div className="card-header">
                <RefreshCw className="card-icon" />
                <h3>3. Yatay Piyasa & Konsolidasyon (Ranging Market)</h3>
              </div>
              <p className="card-text">
                Fiyatın belirli bir destek ve direnç kanalı arasında eşit tepeler (<strong>EQH - Equal Highs</strong>) ve eşit dipler (<strong>EQL - Equal Lows</strong>) oluşturarak yatay seyretmesidir.
              </p>
              <div className="structure-box neutral-border">
                <p>📊 <strong>Kural:</strong> Likidite avı öncesi akümülasyon (birikim) veya dağıtım bölgesidir.</p>
                <div className="tag-row">
                  <span className="ms-tag">EQH (Equal Highs)</span>
                  <span className="ms-tag">EQL (Equal Lows)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOS & CHOCH SHIFTS */}
      {activeTab === 'structure-shifts' && (
        <div className="trade-tab-content fade-in">
          <div className="trade-card-grid">
            <div className="trade-card">
              <div className="card-header">
                <Zap className="card-icon" />
                <h3>1. BOS (Break of Structure - Yapı Kırılımı)</h3>
              </div>
              <p className="card-text">
                Mevcut trend yönündeki kilit tepe veya dip noktasının mum kapanışı ile geçilmesidir. Trendin gücünü ve devam edeceğini onaylar.
              </p>
              <div className="concept-detail-box">
                <p>✅ <strong>Bullish BOS:</strong> Yükselen trendde son HH tepe noktasının yukarı yönlü kırılması.</p>
                <p>🔻 <strong>Bearish BOS:</strong> Düşen trendde son LL dip noktasının aşağı yönlü kırılması.</p>
              </div>
            </div>

            <div className="trade-card">
              <div className="card-header">
                <Activity className="card-icon" />
                <h3>2. CHoCH (Change of Character - Karakter Değişimi)</h3>
              </div>
              <p className="card-text">
                Piyasa yapısının yön değiştireceğinin ilk teknik işaretidir. Yükselen trenddeki son HL dip seviyesinin kırılması veya düşen trenddeki son LH tepe seviyesinin aşılmasıdır.
              </p>
              <div className="concept-detail-box highlight-box">
                <p>⚠️ <strong>Önemli Fark:</strong> BOS trend devamı sunarken, CHoCH trendin **tersine döneceğini** (Reversal) müjdeler.</p>
              </div>
            </div>

            <div className="trade-card">
              <div className="card-header">
                <Target className="card-icon" />
                <h3>3. MSS (Market Structure Shift)</h3>
              </div>
              <p className="card-text">
                CHoCH sonrası oluşan displacement (sert hacimli mum hareketi) ile piyasa yönünün kurumsal oyuncular tarafından resmi olarak değiştirilmesidir.
              </p>
              <div className="concept-detail-box">
                <p>🎯 <strong>Strateji:</strong> MSS oluştuktan sonra fiyata hemen atlanmaz; FVG veya Order Block bölgesine geri çekilme (Retrace) beklenir.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIQUIDITY & FVG */}
      {activeTab === 'liquidity-fvg' && (
        <div className="trade-tab-content fade-in">
          <div className="trade-card-grid">
            <div className="trade-card">
              <div className="card-header">
                <Layers className="card-icon" />
                <h3>1. Likidite Bölgeleri (Liquidity Pools)</h3>
              </div>
              <p className="card-text">
                Bireysel yatırımcıların (Retail Traders) stop-loss emirlerinin biriktiği bölgelerdir. Kurumsal paralar bu likiditeleri süpürmeden (Sweep) gerçek hareketi başlatmaz.
              </p>
              <div className="concept-detail-box">
                <p>🔵 <strong>BSL (Buy-side Liquidity):</strong> Eski tepelerin üzerindeki alım stopları.</p>
                <p>🔴 <strong>SSL (Sell-side Liquidity):</strong> Eski diplerin altındaki satım stopları.</p>
              </div>
            </div>

            <div className="trade-card">
              <div className="card-header">
                <Zap className="card-icon text-amber" />
                <h3>2. FVG (Fair Value Gap - Adil Değer Boşluğu)</h3>
              </div>
              <p className="card-text">
                Arka arkaya oluşan 3 mumu kapsayan, 1. mumun gölgesi (wick) ile 3. mumun gölgesi arasında boşluk kalan dengesiz (Imbalance) fiyat alanıdır.
              </p>
              <div className="concept-detail-box">
                <p>🧲 <strong>Mıknatıs Etkisi:</strong> Piyasa verimliliği gereği fiyat neredeyse her zaman FVG boşluğunu doldurmak için geri döner.</p>
              </div>
            </div>

            <div className="trade-card">
              <div className="card-header">
                <BarChart3 className="card-icon" />
                <h3>3. Order Block (OB - Emir Bloğu)</h3>
              </div>
              <p className="card-text">
                Sert bir piyasa kırılımından (BOS / CHoCH) hemen önce oluşan son zıt yönlü mumdur. Büyük kurumsal bankaların emirlerinin toplandığı alandır.
              </p>
              <div className="concept-detail-box">
                <p>🟢 <strong>Bullish OB:</strong> Yükseliş kırılımı öncesi son kırmızı (düşüş) mumu.</p>
                <p>🔴 <strong>Bearish OB:</strong> Düşüş kırılımı öncesi son yeşil (yükseliş) mumu.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INTERACTIVE CHART SIMULATOR */}
      {activeTab === 'chart-simulator' && (
        <div className="trade-tab-content fade-in">
          <div className="chart-sim-panel">
            <div className="sim-header">
              <h3>📈 İnteraktif Market Structure Adım Adım Simülatörü</h3>
              <p>Adımlara tıklayarak Market Structure kırılımını ve trend dönüşünü grafik üzerinde adım adım izleyin:</p>
            </div>

            {/* Step Controls */}
            <div className="sim-step-buttons">
              {simStepsData.map((_, idx) => (
                <button 
                  key={idx}
                  className={`sim-step-btn ${simStep === idx ? 'active' : ''}`}
                  onClick={() => setSimStep(idx)}
                >
                  <span>Adım {idx + 1}</span>
                </button>
              ))}
            </div>

            {/* Visual Canvas Representation */}
            <div className="chart-canvas-box">
              <div className="canvas-header">
                <span className="step-badge">Şu Anki Aşama: {simStepsData[simStep].title}</span>
                <span className="pattern-code">{simStepsData[simStep].pattern}</span>
              </div>

              {/* Graphic Representation */}
              <div className="visual-chart-display">
                <div className="candlestick-chart-graphic">
                  {/* Step 0: Bullish Structure */}
                  <div className={`chart-point p1 ${simStep >= 0 ? 'visible' : ''}`}>
                    <span className="point-tag">HL1</span>
                    <div className="dot"></div>
                  </div>

                  <div className={`chart-point p2 ${simStep >= 0 ? 'visible' : ''}`}>
                    <span className="point-tag">HH1</span>
                    <div className="dot"></div>
                  </div>

                  <div className={`chart-point p3 ${simStep >= 0 ? 'visible' : ''}`}>
                    <span className="point-tag">HL2 (Kilit Dip)</span>
                    <div className="dot highlight-dip"></div>
                  </div>

                  <div className={`chart-point p4 ${simStep >= 1 ? 'visible' : ''}`}>
                    <span className="point-tag">HH2</span>
                    <div className="dot"></div>
                    <span className="bos-label">BOS ➔</span>
                  </div>

                  {/* Step 2: CHoCH Break */}
                  <div className={`chart-point p5 ${simStep >= 2 ? 'visible' : ''}`}>
                    <span className="point-tag text-red">LL1 (CHoCH Kırılımı!)</span>
                    <div className="dot red-dot"></div>
                    <span className="choch-line">---------------- CHoCH ----------------</span>
                  </div>

                  {/* Step 3: FVG Retrace & Bearish Drop */}
                  <div className={`chart-point p6 ${simStep >= 3 ? 'visible' : ''}`}>
                    <span className="point-tag">LH1 (FVG & OB Testi)</span>
                    <div className="dot yellow-dot"></div>
                    <span className="fvg-zone-box">FVG Imbalance Zone</span>
                  </div>
                </div>
              </div>

              <div className="sim-step-explanation">
                <h4>💡 {simStepsData[simStep].title}</h4>
                <p>{simStepsData[simStep].desc}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TRADING QUIZ & CASE STUDIES */}
      {activeTab === 'trade-quiz' && (
        <div className="trade-tab-content fade-in">
          <div className="questions-container">
            <h3>📝 Trade & Market Structure Sınavı ve Vaka İncelemeleri</h3>
            <p className="questions-intro">
              Prop-firm (FTMO, MFF) ve gerçek piyasa teknik analiz mülakatlarında sorulan kilit Market Structure soruları:
            </p>

            <div className="questions-list">
              {[
                {
                  id: 1,
                  title: "Soru 1: BOS ile CHoCH Arasındaki Temel Fark Nedir?",
                  text: "Bir grafikte fiyatın önceki tepeyi kırması durumunda BOS mu yoksa CHoCH mu meydana gelmiştir?",
                  solution: "Eğer grafik mevcut yükselen trend yönünde ilerliyor ve yeni bir yüksek tepe (HH) yapıyorsa bu **BOS (Break of Structure)**'dur ve trendin devam edeceğini teyit eder. Ancak düşen trendde en son yapılan düşü tepe (LH) yukarı kırılırsa bu **CHoCH (Change of Character)**'dir ve trend dönüşü sinyalidir."
                },
                {
                  id: 2,
                  title: "Soru 2: FVG (Fair Value Gap) Neden Mıknatıs Görevi Görür?",
                  text: "Fiyat sert bir mumla yükseldiğinde oluşan FVG boşluğu fiyatı neden kendine çeker?",
                  solution: "Sert hacimli hareket sırasında piyasada tek taraflı (sadece alıcı) emri gerçekleşir ve karşıt satıcı likiditesi oluşmaz. Piyasa yapıcılar (Market Makers) verimliliği sağlamak ve dengesizliği (Imbalance) kapatmak için fiyatı tekrar FVG alanına geri döndürür."
                },
                {
                  id: 3,
                  title: "Soru 3: Likidite Avı (Liquidity Sweep) ve Fakeout",
                  text: "Eşit tepelerin (Equal Highs - EQH) üzerine çıkan fiyat neden hemen ardından ters yönde sertçe düşer?",
                  solution: "EQH üzerinde bireysel yatırımcıların stop-loss emirleri (Buy Stop) birikir. Kurumsal fonlar kendi büyük satış pozisyonlarını doldurabilmek için fiyatı bu stop bölgesine sürüp likiditeyi toplar (Sweep) ve ardından fiyatı aşağı sürer."
                },
                {
                  id: 4,
                  title: "Soru 4: Yüksek Zaman Dilimi (HTF) vs Düşük Zaman Dilimi (LTF)",
                  text: "Market Structure analizinde 4 Saatlik (4H) grafik mi yoksa 5 Dakikalık (5M) grafik mi daha güvenilirdir?",
                  solution: "Yüksek Zaman Dilimi (HTF - 4H/Daily) Market Structure ana yönü belirler ve çok daha yüksek güvenilirliğe sahiptir. 5M gibi Düşük Zaman Dilimleri (LTF) ise sadece HTF yönündeki ana Order Block / FVG bölgelerinden hassas giriş (Entry) aramak için kullanılır."
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
                      <strong>✅ Doğru Yanıt & Çözüm:</strong>
                      <p>{q.solution}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
