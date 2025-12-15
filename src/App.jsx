import { useState, useEffect } from 'react'

// ========================================
// 設定 - GASデプロイURL（自分のURLに変更）
// ========================================
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbxcVdT0GoZ1rBhocAKSxyPrUadHEjQKzIhAUiyc6rZDbhic6TH_x4eDdM9IMkbQdceJYA/exec'

// ========================================
// スタイル
// ========================================
const styles = {
  container: {
    fontFamily: "'Noto Sans JP', sans-serif",
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#0f0f23',
    minHeight: '100vh',
    color: '#e0e0e0'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0
  },
  subtitle: {
    fontSize: '14px',
    color: '#888',
    marginTop: '4px'
  },
  refreshBtn: {
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  filters: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  filterBtn: {
    padding: '8px 16px',
    border: '1px solid #333',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s'
  },
  filterBtnActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
    color: 'white'
  },
  filterBtnInactive: {
    backgroundColor: 'transparent',
    color: '#888'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '16px'
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #2a2a4a',
    position: 'relative'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  ticker: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff'
  },
  name: {
    fontSize: '13px',
    color: '#888',
    marginTop: '2px'
  },
  scoreBox: {
    textAlign: 'center',
    padding: '8px 16px',
    borderRadius: '8px',
    minWidth: '70px'
  },
  scoreValue: {
    fontSize: '24px',
    fontWeight: '700'
  },
  scoreGrade: {
    fontSize: '12px',
    marginTop: '2px'
  },
  themeBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500',
    marginRight: '8px'
  },
  earningsBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500'
  },
  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '6px',
    marginTop: '12px'
  },
  metric: {
    textAlign: 'center',
    padding: '8px 4px',
    backgroundColor: '#0f0f23',
    borderRadius: '6px'
  },
  metricValue: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#fff'
  },
  metricLabel: {
    fontSize: '9px',
    color: '#666',
    marginTop: '2px'
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #2a2a4a'
  },
  price: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#fff'
  },
  change: {
    fontSize: '14px',
    fontWeight: '500'
  },
  loading: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#888'
  },
  noData: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
    fontSize: '13px'
  }
}

const themeColors = {
  'AI・半導体': { bg: '#1e3a5f', text: '#60a5fa' },
  '宇宙': { bg: '#3b1f5f', text: '#a78bfa' },
  '防衛': { bg: '#3f1f1f', text: '#f87171' },
  'エネルギー': { bg: '#1f3f1f', text: '#4ade80' }
}

const getScoreColor = (score) => {
  if (score === null) return { bg: '#333', text: '#888' }
  if (score >= 80) return { bg: '#064e3b', text: '#34d399' }
  if (score >= 60) return { bg: '#1e3a5f', text: '#60a5fa' }
  if (score >= 40) return { bg: '#4a4a00', text: '#facc15' }
  return { bg: '#4a1010', text: '#f87171' }
}

const getEarningsBadgeStyle = (days) => {
  if (days <= 7) return { backgroundColor: '#dc2626', color: '#fff' } // 赤
  if (days <= 14) return { backgroundColor: '#f59e0b', color: '#fff' } // オレンジ
  if (days <= 30) return { backgroundColor: '#7c3aed', color: '#fff' } // 紫
  return { backgroundColor: '#4b5563', color: '#fff' } // グレー
}

const formatMarketCap = (cap, market) => {
  if (!cap) return '-'
  if (market === 'JP') {
    const oku = cap / 100000000
    if (oku >= 10000) return `${(oku / 10000).toFixed(1)}兆`
    return `${oku.toFixed(0)}億`
  } else {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(1)}T`
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(0)}B`
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(0)}M`
    return `$${cap}`
  }
}

const formatPrice = (price, market) => {
  if (!price) return '-'
  if (market === 'JP') {
    return `¥${Math.round(price).toLocaleString()}`
  }
  return `$${price.toFixed(2)}`
}

const formatEarningsDate = (isoDate) => {
  if (!isoDate) return null
  const date = new Date(isoDate)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

function App() {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [activeTheme, setActiveTheme] = useState('all')
  const [activeMarket, setActiveMarket] = useState('all')
  
  const themes = ['all', 'AI・半導体', '宇宙', '防衛', 'エネルギー']
  const markets = ['all', 'US', 'JP']
  
  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${GAS_API_URL}?action=getScores`)
      const data = await response.json()
      setStocks(data.stocks || [])
      setLastUpdated(data.lastUpdated)
    } catch (error) {
      console.error('Fetch error:', error)
    }
    setLoading(false)
  }
  
  useEffect(() => {
    fetchData()
  }, [])
  
  const filteredStocks = stocks.filter(stock => {
    if (activeTheme !== 'all' && stock.theme !== activeTheme) return false
    if (activeMarket !== 'all' && stock.market !== activeMarket) return false
    return true
  })
  
  const sortedStocks = [...filteredStocks].sort((a, b) => (b.score || -1) - (a.score || -1))
  
  const earningsSoonCount = stocks.filter(s => 
    s.daysToEarnings !== null && s.daysToEarnings >= 0 && s.daysToEarnings <= 30
  ).length
  
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>📊 投資スコアリングダッシュボード</h1>
          <p style={styles.subtitle}>
            {stocks.length}銘柄 | 4テーマ | 決算30日以内 {earningsSoonCount}件
            {lastUpdated && ` | 更新: ${new Date(lastUpdated).toLocaleString('ja-JP')}`}
          </p>
        </div>
        <button style={styles.refreshBtn} onClick={fetchData} disabled={loading}>
          {loading ? '⏳ 取得中...' : '🔄 データ更新'}
        </button>
      </header>
      
      <div style={styles.filters}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#666' }}>テーマ:</span>
          {themes.map(theme => (
            <button
              key={theme}
              style={{
                ...styles.filterBtn,
                ...(activeTheme === theme ? styles.filterBtnActive : styles.filterBtnInactive)
              }}
              onClick={() => setActiveTheme(theme)}
            >
              {theme === 'all' ? '全て' : theme}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#666' }}>市場:</span>
          {markets.map(market => (
            <button
              key={market}
              style={{
                ...styles.filterBtn,
                ...(activeMarket === market ? styles.filterBtnActive : styles.filterBtnInactive)
              }}
              onClick={() => setActiveMarket(market)}
            >
              {market === 'all' ? '全て' : market === 'US' ? '🇺🇸 米国' : '🇯🇵 日本'}
            </button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div style={styles.loading}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</p>
          <p>データを取得中...</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {sortedStocks.map(stock => {
            const scoreColor = getScoreColor(stock.score)
            const themeColor = themeColors[stock.theme] || { bg: '#333', text: '#888' }
            const distFromHigh = stock.yearHigh > 0 
              ? (((stock.yearHigh - stock.price) / stock.yearHigh) * 100).toFixed(1)
              : '-'
            
            const showEarnings = stock.daysToEarnings !== null && stock.daysToEarnings >= 0 && stock.daysToEarnings <= 60
            
            return (
              <div key={`${stock.ticker}-${stock.theme}`} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <div style={styles.ticker}>
                      {stock.market === 'US' ? '🇺🇸' : '🇯🇵'} {stock.ticker}
                    </div>
                    <div style={styles.name}>{stock.name}</div>
                  </div>
                  <div style={{ ...styles.scoreBox, backgroundColor: scoreColor.bg }}>
                    <div style={{ ...styles.scoreValue, color: scoreColor.text }}>
                      {stock.score !== null ? stock.score : '-'}
                    </div>
                    <div style={{ ...styles.scoreGrade, color: scoreColor.text }}>
                      {stock.grade}
                    </div>
                  </div>
                </div>
                
                {/* バッジ */}
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ 
                    ...styles.themeBadge, 
                    backgroundColor: themeColor.bg,
                    color: themeColor.text 
                  }}>
                    {stock.theme}
                  </span>
                  {showEarnings && (
                    <span style={{ 
                      ...styles.earningsBadge, 
                      ...getEarningsBadgeStyle(stock.daysToEarnings)
                    }}>
                      📅 {formatEarningsDate(stock.earningsDate)} 
                      {stock.daysToEarnings === 0 ? '（今日）' : `（${stock.daysToEarnings}日後）`}
                      {stock.earningsBonus > 0 && ` +${stock.earningsBonus}pt`}
                    </span>
                  )}
                </div>
                
                {stock.score !== null ? (
                  <>
                    <div style={styles.metrics}>
                      <div style={styles.metric}>
                        <div style={{ 
                          ...styles.metricValue, 
                          color: parseFloat(distFromHigh) <= 15 ? '#34d399' : '#facc15'
                        }}>
                          -{distFromHigh}%
                        </div>
                        <div style={styles.metricLabel}>高値から</div>
                      </div>
                      <div style={styles.metric}>
                        <div style={styles.metricValue}>
                          {formatMarketCap(stock.marketCap, stock.market)}
                        </div>
                        <div style={styles.metricLabel}>時価総額</div>
                      </div>
                      <div style={styles.metric}>
                        <div style={{ 
                          ...styles.metricValue,
                          color: stock.pe > 0 && stock.pe <= 30 ? '#34d399' : '#facc15'
                        }}>
                          {stock.pe > 0 ? stock.pe.toFixed(1) : 'N/A'}
                        </div>
                        <div style={styles.metricLabel}>PER</div>
                      </div>
                    </div>
                    
                    <div style={styles.priceRow}>
                      <span style={styles.price}>
                        {formatPrice(stock.price, stock.market)}
                      </span>
                      <span style={{ 
                        ...styles.change,
                        color: (stock.change || 0) >= 0 ? '#34d399' : '#f87171'
                      }}>
                        {(stock.change || 0) >= 0 ? '+' : ''}{(stock.change || 0).toFixed(2)}%
                      </span>
                    </div>
                  </>
                ) : (
                  <div style={styles.noData}>
                    {stock.note || 'データなし'}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      
      <footer style={{ marginTop: '40px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
        <p>⚠️ 投資は自己責任で。参考情報であり投資助言ではありません。</p>
        <p style={{ marginTop: '8px' }}>
          スコア: 高値距離(40点) + 時価総額(25点) + PER(20点) + 決算ボーナス(15点)
        </p>
      </footer>
    </div>
  )
}

export default App