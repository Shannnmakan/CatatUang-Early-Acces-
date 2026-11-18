import { useState, useMemo, useEffect, useRef } from 'react'

const STORAGE_KEY = 'catatuang_neobrutal_v2'
const CLOUD_STORAGE_PREFIX = 'catatuang_gcloud_backup_'
const APP_VERSION = 'v2.4.0 (Build 2026.11.18)'

const EMPTY_AVATAR = { id: 'empty', type: 'empty', label: 'Kosong', bg: '#ffffff' }

const AVATAR_PRESETS = [
  EMPTY_AVATAR,
  { id: 'cat-boss', type: 'emoji', emoji: '🐱', label: 'Kucing Bos', bg: '#fef08a' },
  { id: 'robot-neo', type: 'emoji', emoji: '🤖', label: 'Robot Neo', bg: '#bae6fd' },
  { id: 'ninja-hemat', type: 'emoji', emoji: '🥷', label: 'Ninja Hemat', bg: '#ddd6fe' },
  { id: 'sultan-kaya', type: 'emoji', emoji: '👑', label: 'Sultan', bg: '#fed7aa' },
  { id: 'rocket-cuan', type: 'emoji', emoji: '🚀', label: 'Roket Cuan', bg: '#fbcfe8' },
  { id: 'bear-cute', type: 'emoji', emoji: '🐻', label: 'Beruang', bg: '#bef264' },
  { id: 'fox-smart', type: 'emoji', emoji: '🦊', label: 'Rubah Cerdas', bg: '#fca5a5' },
  { id: 'alien-cool', type: 'emoji', emoji: '👾', label: 'Retro Pixel', bg: '#c4b5fd' },
]

const THEME_PRESETS = [
  { id: 'classic', name: 'Klasik Lemon', bg: '#fefce8', headerBg: '#fefce8', accent: '#bef264', cardTint: '#fffbeb', text: '#000000' },
  { id: 'mint', name: 'Mint Segar', bg: '#dcfce7', headerBg: '#dcfce7', accent: '#bef264', cardTint: '#f0fdf4', text: '#000000' },
  { id: 'sakura', name: 'Sakura Pop', bg: '#fce7f3', headerBg: '#fce7f3', accent: '#f472b6', cardTint: '#fdf2f8', text: '#000000' },
  { id: 'lavender', name: 'Lavender Ungu', bg: '#ede9fe', headerBg: '#ede9fe', accent: '#c4b5fd', cardTint: '#f5f3ff', text: '#000000' },
  { id: 'ocean', name: 'Biru Langit', bg: '#e0f2fe', headerBg: '#e0f2fe', accent: '#7dd3fc', cardTint: '#f0f9ff', text: '#000000' },
  { id: ' cream', name: 'Krem Hangat', bg: '#fef9f3', headerBg: '#fef9f3', accent: '#fed7aa', cardTint: '#fff7ed', text: '#000000' },
]

const WALLET_TEMPLATES = [
  { tag: 'BANK', icon: 'account_balance', budgetIcon: 'credit_card', bg: '#fed7aa', cardBg: 'bg-[#fed7aa]', badge: '🏦', badgeBg: '#ffffff' },
  { tag: 'E-WALLET', icon: 'smartphone', budgetIcon: 'payments', bg: '#bae6fd', cardBg: 'bg-[#bae6fd]', badge: '📱', badgeBg: '#bae6fd' },
  { tag: 'CASH', icon: 'payments', budgetIcon: 'savings', bg: '#bef264', cardBg: 'bg-[#bef264]', badge: '💵', badgeBg: '#fef08a' },
  { tag: 'TABUNGAN', icon: 'savings', budgetIcon: 'account_balance_wallet', bg: '#ddd6fe', cardBg: 'bg-[#ddd6fe]', badge: '💎', badgeBg: '#ddd6fe' },
  { tag: 'INVESTASI', icon: 'trending_up', budgetIcon: 'monitoring', bg: '#fbcfe8', cardBg: 'bg-[#fbcfe8]', badge: '📈', badgeBg: '#fbcfe8' },
]

const WALLET_COLOR_CHOICES = [
  { label: 'Peach', hex: '#fed7aa', tw: 'bg-[#fed7aa]' },
  { label: 'Biru', hex: '#bae6fd', tw: 'bg-[#bae6fd]' },
  { label: 'Lime', hex: '#bef264', tw: 'bg-[#bef264]' },
  { label: 'Pink', hex: '#fbcfe8', tw: 'bg-[#fbcfe8]' },
  { label: 'Ungu', hex: '#ddd6fe', tw: 'bg-[#ddd6fe]' },
  { label: 'Kuning', hex: '#fef08a', tw: 'bg-[#fef08a]' },
]

const DEFAULT_CATEGORY_BUDGETS = [
  { id: 'Makan & Minum', label: 'Makan & Minum', short: 'Mkn', pillLabel: 'Makan', emoji: '🍔', icon: 'restaurant', limit: 0, cardBg: 'bg-neo-peach', reportCardBg: 'bg-[#fff1f2]', accentBg: 'bg-[#f87171]', barBg: 'bg-amber-400' },
  { id: 'Tagihan & Utilitas', label: 'Tagihan & Kos', short: 'Tghn', pillLabel: 'Tagihan', emoji: '⚡', icon: 'home', limit: 0, cardBg: 'bg-[#bae6fd]', reportCardBg: 'bg-[#f0f9ff]', accentBg: 'bg-[#38bdf8]', barBg: 'bg-[#38bdf8]' },
  { id: 'Belanja', label: 'Belanja Kebutuhan', short: 'Blnj', pillLabel: 'Belanja', emoji: '🛍️', icon: 'shopping_bag', limit: 0, cardBg: 'bg-neo-yellow', reportCardBg: 'bg-[#f7fee7]', accentBg: 'bg-[#bef264]', barBg: 'bg-teal-500' },
  { id: 'Transportasi', label: 'Transportasi', short: 'Trns', pillLabel: 'Transp', emoji: '🚗', icon: 'directions_car', limit: 0, cardBg: 'bg-neo-lime', reportCardBg: 'bg-[#fefce8]', accentBg: 'bg-[#fde047]', barBg: 'bg-black' },
  { id: 'Hiburan', label: 'Hiburan & Hobi', short: 'Hbrn', pillLabel: 'Hiburan', emoji: '🎬', icon: 'local_activity', limit: 0, cardBg: 'bg-neo-pink', reportCardBg: 'bg-[#fdf2f8]', accentBg: 'bg-[#f472b6]', barBg: 'bg-[#ff4d6d]' },
]

const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]
const MONTHS_SHORT_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

function formatIDR(num) {
  if (isNaN(num) || num === null || num === undefined) return '0'
  return new Intl.NumberFormat('id-ID').format(Math.abs(Math.round(num)))
}

function formatCompactM(num) {
  const abs = Math.abs(num)
  if (abs >= 1000000) {
    return 'Rp ' + (abs / 1000000).toFixed(2).replace('.', ',').replace(/,00$/, '') + 'M'
  }
  return 'Rp ' + formatIDR(abs)
}

function formatDateIndo(isoDate) {
  if (!isoDate) return '18 Nov 2026'
  const parts = isoDate.split('-')
  if (parts.length !== 3) return isoDate
  const year = Number(parts[0])
  const monthIdx = Number(parts[1]) - 1
  const day = Number(parts[2])
  return `${day} ${MONTHS_SHORT_ID[monthIdx] || 'Nov'} ${year}`
}

function formatMonthYearIndo(isoDate) {
  if (!isoDate) return 'November 2026'
  const parts = isoDate.split('-')
  const year = Number(parts[0])
  const monthIdx = Number(parts[1]) - 1
  return `${MONTHS_ID[monthIdx] || 'November'} ${year}`
}

function getDaysInMonth(isoDate) {
  if (!isoDate) return { day: 18, totalDays: 30 }
  const [y, m, d] = isoDate.split('-').map(Number)
  const totalDays = new Date(y, m, 0).getDate()
  return { day: d || 1, totalDays: totalDays || 30 }
}

// ============================================================================
// DRAGGABLE HORIZONTAL SCROLL STRIP
// ============================================================================
function HorizontalScroll({ children, className = '' }) {
  const ref = useRef(null)
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const onMouseDown = (e) => {
    if (!ref.current) return
    isDown.current = true
    startX.current = e.pageX - ref.current.offsetLeft
    scrollLeft.current = ref.current.scrollLeft
  }
  const onMouseLeave = () => {
    isDown.current = false
  }
  const onMouseUp = () => {
    isDown.current = false
  }
  const onMouseMove = (e) => {
    if (!isDown.current || !ref.current) return
    e.preventDefault()
    const x = e.pageX - ref.current.offsetLeft
    const walk = (x - startX.current) * 1.5
    ref.current.scrollLeft = scrollLeft.current - walk
  }
  const onWheel = (e) => {
    if (!ref.current) return
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      ref.current.scrollLeft += e.deltaY
    }
  }

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onWheel={onWheel}
      className={`overflow-x-auto cursor-grab active:cursor-grabbing select-none ${className}`}
      style={{ scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}
    >
      {children}
    </div>
  )
}

// ============================================================================
// UNIFIED BOTTOM NAVIGATION BAR (IDENTICAL ACROSS ALL PAGES)
// ============================================================================
function UnifiedBottomNav({ activeScreen, onNavigate }) {
  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: 'home' },
    { id: 'anggaran', label: 'Anggaran', icon: 'account_balance_wallet' },
    { id: 'catat-cepat', label: 'Catat', icon: 'add', isFab: true },
    { id: 'laporan', label: 'Laporan', icon: 'bar_chart' },
  ]

  return (
    <nav className="fixed bottom-3 inset-x-0 z-40 px-4 max-w-md mx-auto pointer-events-none pb-safe">
      <div className="bg-black text-white rounded-full p-2 border-[2.5px] border-black shadow-brutal-lg flex items-center justify-between pointer-events-auto gap-1">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id
          if (item.isFab) {
            return (
              <button
                key={item.id}
                type="button"
                aria-label="Catat Cepat Transaksi"
                onClick={() => onNavigate('catat-cepat')}
                className={`w-11 h-11 rounded-full border-[2.5px] border-black text-black font-bold flex items-center justify-center shadow-brutal-sm hover:scale-105 active:scale-95 transition-all shrink-0 ${
                  isActive ? 'bg-[#fef08a] ring-2 ring-white' : 'bg-[#bef264]'
                }`}
              >
                <span className="material-symbols-outlined !text-[24px] font-black">add</span>
              </button>
            )
          }

          if (isActive) {
            return (
              <button
                key={item.id}
                type="button"
                aria-current="page"
                onClick={() => onNavigate(item.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-black font-display font-extrabold text-xs border-[2px] border-black shadow-brutal-sm transition-transform active:scale-95 shrink-0"
              >
                <span className="material-symbols-outlined !text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          }

          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              onClick={() => onNavigate(item.id)}
              className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors active:scale-90 shrink-0"
            >
              <span className="material-symbols-outlined !text-[20px]">{item.icon}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

// ============================================================================
// AVATAR BADGE COMPONENT & GOOGLE AVATAR BUILDER
// ============================================================================
function buildGoogleAvatar(email, name, photoURL) {
  const displayName = name || email || 'User'
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=bef264&color=000000&bold=true&size=128`
  return {
    id: 'google-account',
    type: 'image',
    label: `Google (${displayName})`,
    bg: '#bef264',
    src: photoURL || `https://unavatar.io/google/${encodeURIComponent(email)}?fallback=${encodeURIComponent(fallback)}`,
  }
}

function AvatarButton({ avatar, onClick, isGoogleConnected, googleUser }) {
  const fallbackUrl = googleUser
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(googleUser.name || googleUser.email)}&background=bef264&color=000000&bold=true&size=128`
    : ''
  const isEmpty = !avatar || avatar.type === 'empty' || avatar.id === 'empty'

  return (
    <button
      type="button"
      onClick={onClick}
      title={googleUser ? `Akun Google: ${googleUser.email}` : 'Profil, Avatar & Pengaturan'}
      style={{ backgroundColor: isEmpty ? '#f4f4f5' : avatar?.bg || '#ffffff' }}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl border-[2.5px] border-black shadow-brutal-sm overflow-visible active:translate-x-0.5 active:translate-y-0.5 transition-transform shrink-0"
    >
      {isEmpty ? (
        <span className="material-symbols-outlined text-black/35 !text-[22px] select-none">person</span>
      ) : avatar?.type === 'image' ? (
        <img
          alt="Avatar"
          className="w-full h-full object-cover rounded-[9px]"
          src={avatar.src}
          onError={(e) => {
            e.currentTarget.onerror = null
            if (fallbackUrl) e.currentTarget.src = fallbackUrl
          }}
        />
      ) : (
        <span className="text-xl leading-none select-none">{avatar?.emoji}</span>
      )}
      {isGoogleConnected && (
        <span
          title={`Tersinkron dengan Google (${googleUser?.email || ''})`}
          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border-[1.5px] border-black flex items-center justify-center text-[9px] font-black text-black shadow-sm"
        >
          G
        </span>
      )}
    </button>
  )
}

export default function App() {
  const [savedState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  // Navigation & Theme
  const [activeScreen, setActiveScreen] = useState('beranda') // 'beranda' | 'laporan' | 'anggaran' | 'catat-cepat' | 'pengaturan'
  const [themeId, setThemeId] = useState(() => savedState?.themeId || 'classic')
  const [googleUser, setGoogleUser] = useState(() => savedState?.googleUser || null) // { email, name, lastSync }
  const [avatar, setAvatar] = useState(() => {
    if (
      savedState?.avatar &&
      savedState.avatar.id !== 'default-photo' &&
      savedState.avatar.id !== 'google-account' &&
      savedState.avatar.type === 'emoji'
    ) {
      return savedState.avatar
    }
    if (savedState?.googleUser) {
      return buildGoogleAvatar(savedState.googleUser.email, savedState.googleUser.name)
    }
    return EMPTY_AVATAR
  })
  const [userName, setUserName] = useState(() => savedState?.userName || 'Pengguna CatatUang')
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [loginEmailInput, setLoginEmailInput] = useState('')
  const [loginNameInput, setLoginNameInput] = useState('')

  // Date & Period Synchronization State
  const [selectedDate, setSelectedDate] = useState(() => savedState?.selectedDate || '2026-11-18')
  const [dateFilterMode, setDateFilterMode] = useState(() => savedState?.dateFilterMode || 'all-month') // 'all-month' | 'exact-date'
  const [dateModalOpen, setDateModalOpen] = useState(false)

  // Core Financial Data (Starts at 0 / Manual configuration)
  const [isBalanceHidden, setIsBalanceHidden] = useState(false)
  const [wallets, setWallets] = useState(() => savedState?.wallets || [])
  const [transactions, setTransactions] = useState(() => savedState?.transactions || [])
  const [masterBudget, setMasterBudget] = useState(() => savedState?.masterBudget ?? 0)
  const [categoryBudgets, setCategoryBudgets] = useState(() => savedState?.categoryBudgets || DEFAULT_CATEGORY_BUDGETS)

  // Modals for Manual Wallet Management & Budget Management
  const [walletFormModal, setWalletFormModal] = useState(null) // null | { mode: 'add'|'edit', id?, name, tag, balance, bg }
  const [budgetModalOpen, setBudgetModalOpen] = useState(false)
  const [budgetForm, setBudgetForm] = useState({ master: '', categories: {} })

  // Laporan Screen State
  const [reportFilter, setReportFilter] = useState('kategori')
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState('pdf')

  // Quick Add Screen State (preserved until "Simpan Transaksi" is pressed)
  const [txType, setTxType] = useState(() => savedState?.draftTxType || 'pengeluaran') // 'pengeluaran' | 'pemasukan' | 'transfer'
  const [expression, setExpression] = useState(() => savedState?.draftExpression || '0')
  const [selectedCategory, setSelectedCategory] = useState(() => savedState?.draftCategory || 'Makan & Minum')
  const [selectedWalletId, setSelectedWalletId] = useState('')
  const [targetWalletId, setTargetWalletId] = useState('')
  const [txNote, setTxNote] = useState(() => savedState?.draftTxNote || '')
  const [toastMsg, setToastMsg] = useState(null)

  const currentTheme = THEME_PRESETS.find((t) => t.id === themeId) || THEME_PRESETS[0]

  // Keep selectedWalletId valid when wallets change
  useEffect(() => {
    if (wallets.length > 0) {
      if (!wallets.some((w) => w.id === selectedWalletId)) {
        setSelectedWalletId(wallets[0].id)
      }
      if (!wallets.some((w) => w.id === targetWalletId)) {
        setTargetWalletId(wallets[1]?.id || wallets[0].id)
      }
    } else {
      setSelectedWalletId('')
      setTargetWalletId('')
    }
  }, [wallets, selectedWalletId, targetWalletId])

  // Firebase Auth State Listener (Auto-detect login across reloads)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.firebase && window.firebase.auth) {
      try {
        const unsubscribe = window.firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            const userObj = {
              email: user.email,
              name: user.displayName || user.email?.split('@')[0] || 'User',
              picture: user.photoURL || null,
              uid: user.uid,
              lastSync: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            }
            setGoogleUser(userObj)
            setUserName(userObj.name)
            setAvatar(buildGoogleAvatar(userObj.email, userObj.name, userObj.picture))
          }
        })
        return () => unsubscribe()
      } catch (err) {
        console.warn('Firebase auth listener skipped:', err)
      }
    }
  }, [])

  // Auto-save to localStorage & Google account storage if logged in
  useEffect(() => {
    const payload = {
      themeId,
      avatar,
      userName,
      googleUser,
      selectedDate,
      dateFilterMode,
      wallets,
      transactions,
      masterBudget,
      categoryBudgets,
      draftTxType: txType,
      draftExpression: expression,
      draftCategory: selectedCategory,
      draftTxNote: txNote,
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      if (googleUser?.email) {
        localStorage.setItem(
          CLOUD_STORAGE_PREFIX + googleUser.email.toLowerCase(),
          JSON.stringify({ ...payload, syncedAt: new Date().toISOString() })
        )
      }
    } catch (e) {
      console.error(e)
    }
  }, [themeId, avatar, userName, googleUser, selectedDate, dateFilterMode, wallets, transactions, masterBudget, categoryBudgets, txType, expression, selectedCategory, txNote])

  const navigateTo = (screen) => {
    setActiveScreen(screen)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const triggerToast = () => {}

  // Date helpers
  const selectedMonthPrefix = selectedDate.slice(0, 7) // 'YYYY-MM'
  const { day: currentDayNum, totalDays: totalDaysInMonth } = getDaysInMonth(selectedDate)

  const shiftSelectedDate = (daysDelta) => {
    const [y, m, d] = selectedDate.split('-').map(Number)
    const dt = new Date(y, m - 1, d + daysDelta)
    const ny = dt.getFullYear()
    const nm = String(dt.getMonth() + 1).padStart(2, '0')
    const nd = String(dt.getDate()).padStart(2, '0')
    setSelectedDate(`${ny}-${nm}-${nd}`)
  }

  // Filter transactions synchronized with the selected date / month
  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => (t.date || '2026-11-18').startsWith(selectedMonthPrefix))
  }, [transactions, selectedMonthPrefix])

  const visibleTransactions = useMemo(() => {
    if (dateFilterMode === 'exact-date') {
      return transactions.filter((t) => t.date === selectedDate)
    }
    return monthTransactions
  }, [transactions, monthTransactions, dateFilterMode, selectedDate])

  // Group visible transactions by exact date (sorted newest first)
  const groupedTransactions = useMemo(() => {
    const map = new Map()
    const sorted = [...visibleTransactions].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    sorted.forEach((tx) => {
      const d = tx.date || selectedDate
      const list = map.get(d) || []
      list.push(tx)
      map.set(d, list)
    })
    return Array.from(map.entries()).map(([date, items]) => ({
      date,
      label: date === selectedDate ? `Tanggal Dipilih (${formatDateIndo(date)})` : formatDateIndo(date),
      items,
      total: items.reduce((acc, i) => acc + i.amount, 0),
    }))
  }, [visibleTransactions, selectedDate])

  // Wallet modal handlers (Manual configuration by user)
  const openAddWalletModal = () => {
    setWalletFormModal({
      mode: 'add',
      name: '',
      tag: 'BANK',
      balance: '',
      bg: '#fed7aa',
    })
  }

  const openEditWalletModal = (w) => {
    setWalletFormModal({
      mode: 'edit',
      id: w.id,
      name: w.name,
      tag: w.tag,
      balance: w.balance ? String(w.balance) : '0',
      bg: w.bg || '#fed7aa',
    })
  }

  const handleSaveWalletForm = (e) => {
    e.preventDefault()
    if (!walletFormModal) return
    const nameTrim = walletFormModal.name.trim()
    if (!nameTrim) {
      triggerToast('Masukkan nama dompet terlebih dahulu!')
      return
    }
    const balNum = Number(String(walletFormModal.balance).replace(/[^0-9-]/g, '')) || 0
    const tpl = WALLET_TEMPLATES.find((t) => t.tag === walletFormModal.tag) || WALLET_TEMPLATES[0]

    if (walletFormModal.mode === 'add') {
      const newWallet = {
        id: 'w_' + Date.now(),
        key: nameTrim,
        name: nameTrim,
        shortName: nameTrim,
        tag: walletFormModal.tag,
        icon: tpl.icon,
        budgetIcon: tpl.budgetIcon,
        balance: balNum,
        bg: walletFormModal.bg,
        cardBg: `bg-[${walletFormModal.bg}]`,
        iconBg: 'bg-white',
        badge: tpl.badge,
        badgeBg: '#ffffff',
      }
      setWallets((prev) => [...prev, newWallet])
      setSelectedWalletId(newWallet.id)
      triggerToast(`⚡ Dompet "${nameTrim}" berhasil ditambahkan!`)
    } else {
      setWallets((prev) =>
        prev.map((w) =>
          w.id === walletFormModal.id
            ? {
                ...w,
                key: nameTrim,
                name: nameTrim,
                shortName: nameTrim,
                tag: walletFormModal.tag,
                icon: tpl.icon,
                budgetIcon: tpl.budgetIcon,
                balance: balNum,
                bg: walletFormModal.bg,
              }
            : w
        )
      )
      triggerToast(`⚡ Dompet "${nameTrim}" diperbarui!`)
    }
    setWalletFormModal(null)
  }

  const handleDeleteWallet = (walletId) => {
    setWallets((prev) => prev.filter((w) => w.id !== walletId))
    setWalletFormModal(null)
    triggerToast('Dompet dihapus.')
  }

  // Calculator evaluation
  const evaluatedAmount = useMemo(() => {
    try {
      const sanitized = expression.replace(/[^0-9+\-*/.]/g, '')
      if (!sanitized) return 0
      const res = Function(`'use strict'; return (${sanitized})`)()
      return Math.max(0, Math.round(Number(res) || 0))
    } catch {
      return 0
    }
  }, [expression])

  const formattedFormula = useMemo(() => {
    return expression
      .replace(/\+/g, ' + ')
      .replace(/-/g, ' - ')
      .replace(/\*/g, ' × ')
      .replace(/\//g, ' ÷ ')
  }, [expression])

  const handleKeyPress = (key) => {
    if (key === 'backspace') {
      const next = expression.slice(0, -1)
      setExpression(next || '0')
    } else if (key === '=') {
      setExpression(String(evaluatedAmount))
    } else if (['+', '-', '*', '/'].includes(key)) {
      const lastChar = expression.slice(-1)
      if (['+', '-', '*', '/'].includes(lastChar)) {
        setExpression(expression.slice(0, -1) + key)
      } else {
        setExpression(expression + key)
      }
    } else if (key === '000') {
      if (expression === '0') return
      setExpression(expression + '000')
    } else {
      if (expression === '0' && key !== '.') {
        setExpression(key)
      } else {
        setExpression(expression + key)
      }
    }
  }

  const handleSaveTransaction = () => {
    const amount = evaluatedAmount
    if (amount <= 0) {
      triggerToast('Masukkan nominal lebih dari Rp 0!')
      return
    }

    let currentWallets = wallets
    let sourceWallet = currentWallets.find((w) => w.id === selectedWalletId) || currentWallets[0]

    // Auto-create a default wallet if user hasn't added one yet so "Simpan Transaksi" always succeeds & clears input
    if (!sourceWallet) {
      sourceWallet = {
        id: 'w_' + Date.now(),
        key: 'Dompet Utama',
        name: 'Dompet Utama',
        shortName: 'Dompet Utama',
        tag: 'CASH',
        icon: 'payments',
        budgetIcon: 'savings',
        balance: 0,
        bg: '#bef264',
        cardBg: 'bg-[#bef264]',
        iconBg: 'bg-white',
        badge: '💵',
        badgeBg: '#fef08a',
      }
      currentWallets = [sourceWallet]
      setSelectedWalletId(sourceWallet.id)
    }

    if (txType === 'transfer') {
      const destWallet = currentWallets.find((w) => w.id === targetWalletId)
      if (!destWallet || sourceWallet.id === destWallet.id) {
        triggerToast('Pilih dompet tujuan yang berbeda!')
        return
      }
      const newTx = {
        id: 'tx_' + Date.now(),
        type: 'transfer',
        date: selectedDate,
        title: txNote.trim() || `Transfer ${sourceWallet.name} → ${destWallet.name}`,
        category: 'Transfer Dompet',
        walletId: sourceWallet.id,
        targetWalletId: destWallet.id,
        wallet: `${sourceWallet.name} → ${destWallet.name}`,
        amount: -amount,
        icon: 'swap_horiz',
        iconBg: '#bae6fd',
      }
      setTransactions((prev) => [newTx, ...prev])
      setWallets(
        currentWallets.map((w) => {
          if (w.id === sourceWallet.id) return { ...w, balance: w.balance - amount }
          if (w.id === destWallet.id) return { ...w, balance: w.balance + amount }
          return w
        })
      )
      // Reset input ONLY after pressing Simpan Transaksi
      setExpression('0')
      setTxNote('')
      triggerToast(`⚡ Transfer Rp ${formatIDR(amount)} pada ${formatDateIndo(selectedDate)} berhasil!`)
      return
    }

    const isIncome = txType === 'pemasukan'
    const signedAmount = isIncome ? amount : -amount
    const categoryIcons = {
      'Makan & Minum': { icon: 'restaurant', bg: '#fed7aa' },
      Transportasi: { icon: 'local_gas_station', bg: '#bae6fd' },
      Belanja: { icon: 'shopping_bag', bg: '#ddd6fe' },
      'Tagihan & Utilitas': { icon: 'bolt', bg: '#fed7aa' },
      Hiburan: { icon: 'local_activity', bg: '#fca5a5' },
      Kesehatan: { icon: 'medical_services', bg: '#bef264' },
      'Gaji / Bonus': { icon: 'payments', bg: '#bef264' },
    }
    const catMeta = categoryIcons[selectedCategory] || { icon: 'receipt_long', bg: '#fef08a' }

    const newTx = {
      id: 'tx_' + Date.now(),
      type: txType,
      date: selectedDate,
      title: txNote.trim() || selectedCategory,
      category: selectedCategory,
      walletId: sourceWallet.id,
      wallet: sourceWallet.name,
      amount: signedAmount,
      icon: catMeta.icon,
      iconBg: catMeta.bg,
    }

    setTransactions((prev) => [newTx, ...prev])
    setWallets(
      currentWallets.map((w) => (w.id === sourceWallet.id ? { ...w, balance: w.balance + signedAmount } : w))
    )

    // Clear input immediately after pressing Simpan Transaksi
    setExpression('0')
    setTxNote('')
    triggerToast(`⚡ Tersimpan Rp ${formatIDR(amount)} (${formatDateIndo(selectedDate)})!`)
  }

  const handleDeleteTransaction = (id) => {
    const target = transactions.find((t) => t.id === id)
    if (!target) return
    setTransactions((prev) => prev.filter((t) => t.id !== id))
    if (target.type === 'transfer') {
      const amt = Math.abs(target.amount)
      setWallets((prev) =>
        prev.map((w) => {
          if (w.id === target.walletId) return { ...w, balance: w.balance + amt }
          if (w.id === target.targetWalletId) return { ...w, balance: w.balance - amt }
          return w
        })
      )
    } else {
      setWallets((prev) =>
        prev.map((w) =>
          w.id === target.walletId || w.name === target.wallet ? { ...w, balance: w.balance - target.amount } : w
        )
      )
    }
    triggerToast('Transaksi dihapus & saldo disesuaikan.')
  }

  // Budget Modal
  const openBudgetModal = () => {
    const catMap = {}
    categoryBudgets.forEach((c) => {
      catMap[c.id] = c.limit ? String(c.limit) : ''
    })
    setBudgetForm({
      master: masterBudget ? String(masterBudget) : '',
      categories: catMap,
    })
    setBudgetModalOpen(true)
  }

  const saveBudgetModal = (e) => {
    e.preventDefault()
    const nextMaster = Number(String(budgetForm.master).replace(/[^0-9]/g, '')) || 0
    setMasterBudget(nextMaster)
    setCategoryBudgets((prev) =>
      prev.map((c) => ({
        ...c,
        limit: Number(String(budgetForm.categories[c.id] ?? '').replace(/[^0-9]/g, '')) || 0,
      }))
    )
    setBudgetModalOpen(false)
    triggerToast('⚡ Target anggaran berhasil disimpan!')
  }

  // Login dengan Google Firebase (One-click)
  const handleGoogleFirebaseLogin = async () => {
    if (typeof window !== 'undefined' && window.firebase && window.firebase.auth) {
      try {
        const provider = new window.firebase.auth.GoogleAuthProvider()
        const result = await window.firebase.auth().signInWithPopup(provider)
        const user = result.user
        const name = user.displayName || user.email?.split('@')[0] || 'User'
        const syncedGoogleAvatar = buildGoogleAvatar(user.email, name, user.photoURL)
        const cloudKey = CLOUD_STORAGE_PREFIX + (user.email || '').toLowerCase()
        const existingCloudRaw = localStorage.getItem(cloudKey)

        const userObj = {
          email: user.email,
          name: name,
          picture: user.photoURL || null,
          uid: user.uid,
          lastSync: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        }
        setGoogleUser(userObj)
        setUserName(name)
        setAvatar(syncedGoogleAvatar)

        if (existingCloudRaw) {
          try {
            const cloudData = JSON.parse(existingCloudRaw)
            if (cloudData.wallets) setWallets(cloudData.wallets)
            if (cloudData.transactions) setTransactions(cloudData.transactions)
            if (cloudData.masterBudget !== undefined) setMasterBudget(cloudData.masterBudget)
            if (cloudData.categoryBudgets) setCategoryBudgets(cloudData.categoryBudgets)
            if (cloudData.themeId) setThemeId(cloudData.themeId)
          } catch (e) {
            console.warn(e)
          }
        }
        setLoginModalOpen(false)
        triggerToast(`✅ Login Google berhasil (${name})!`)
      } catch (err) {
        console.error('Firebase Auth Error:', err)
        if (err.code === 'auth/popup-closed-by-user') {
          triggerToast('⚠️ Login Google dibatalkan.')
        } else if (err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
          triggerToast('⚠️ Aktifkan Google Sign-in di Firebase Console!')
        } else {
          triggerToast(`⚠️ Gagal login Google: ${err.message}`)
        }
      }
    } else {
      triggerToast('Firebase Auth belum siap. Gunakan form manual di bawah.')
    }
  }

  const handleGoogleLogout = async () => {
    if (typeof window !== 'undefined' && window.firebase && window.firebase.auth) {
      try {
        await window.firebase.auth().signOut()
      } catch (e) {
        console.warn('Signout error:', e)
      }
    }
    setGoogleUser(null)
    setAvatar(EMPTY_AVATAR)
    setLoginModalOpen(false)
    triggerToast('Keluar dari akun Google.')
  }

  // Fallback Login Manual
  const handleGoogleLogin = (e) => {
    e.preventDefault()
    const email = loginEmailInput.trim() || 'pengguna@gmail.com'
    const name = loginNameInput.trim() || email.split('@')[0]
    const cloudKey = CLOUD_STORAGE_PREFIX + email.toLowerCase()
    const existingCloudRaw = localStorage.getItem(cloudKey)
    const syncedGoogleAvatar = buildGoogleAvatar(email, name, null)

    const userObj = {
      email,
      name,
      picture: syncedGoogleAvatar.src,
      lastSync: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    }
    setGoogleUser(userObj)
    setUserName(name)
    setAvatar(syncedGoogleAvatar)

    if (existingCloudRaw) {
      try {
        const cloudData = JSON.parse(existingCloudRaw)
        if (cloudData.wallets) setWallets(cloudData.wallets)
        if (cloudData.transactions) setTransactions(cloudData.transactions)
        if (cloudData.masterBudget !== undefined) setMasterBudget(cloudData.masterBudget)
        if (cloudData.categoryBudgets) setCategoryBudgets(cloudData.categoryBudgets)
        if (cloudData.themeId) setThemeId(cloudData.themeId)
        triggerToast(`✅ Login manual tersimpan & data dipulihkan (${email})!`)
      } catch {
        triggerToast(`✅ Login manual tersimpan (${email})!`)
      }
    } else {
      triggerToast(`✅ Login manual tersimpan (${email})!`)
    }
    setLoginModalOpen(false)
  }

  const handleManualCloudSync = () => {
    if (!googleUser) {
      setLoginModalOpen(true)
      return
    }
    const updatedUser = {
      ...googleUser,
      lastSync: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    }
    setGoogleUser(updatedUser)
    setAvatar(buildGoogleAvatar(googleUser.email, googleUser.name))
    triggerToast(`✅ Progres & Avatar disinkronkan dengan Akun Google (${googleUser.email})!`)
  }

  const resetAllToZero = () => {
    setWallets([])
    setTransactions([])
    setMasterBudget(0)
    setCategoryBudgets(DEFAULT_CATEGORY_BUDGETS)
    setExpression('0')
    setTxNote('')
    setAvatar(EMPTY_AVATAR)
    setGoogleUser(null)
    localStorage.removeItem(STORAGE_KEY)
    triggerToast('Semua data & dompet direset kembali ke 0!')
  }

  // Computed metrics synchronized with active date/month filter
  const totalBalance = wallets.reduce((acc, w) => acc + w.balance, 0)
  const totalIncome = visibleTransactions
    .filter((t) => t.type === 'pemasukan' || (t.type !== 'transfer' && t.amount > 0))
    .reduce((acc, t) => acc + Math.abs(t.amount), 0)
  const totalExpense = visibleTransactions
    .filter((t) => t.type === 'pengeluaran' || (t.type !== 'transfer' && t.amount < 0))
    .reduce((acc, t) => acc + Math.abs(t.amount), 0)

  const expenseTxCount = visibleTransactions.filter(
    (t) => t.type === 'pengeluaran' || (t.type !== 'transfer' && t.amount < 0)
  ).length
  const remainingBudget = Math.max(0, masterBudget - totalExpense)
  const usedBudgetPct = masterBudget > 0 ? Math.min(100, Math.round((totalExpense / masterBudget) * 100)) : 0
  const remainingBudgetPct =
    masterBudget > 0 ? Math.max(0, Number((100 - (totalExpense / masterBudget) * 100).toFixed(1))) : 0
  const dailySafeSpend =
    remainingBudget > 0 ? Math.round(remainingBudget / Math.max(1, totalDaysInMonth - currentDayNum + 1)) : 0
  const dailyAverageExpense = totalExpense > 0 ? Math.round(totalExpense / Math.max(1, currentDayNum)) : 0

  const categoryStats = useMemo(() => {
    return categoryBudgets.map((cat) => {
      const matchingTx = visibleTransactions.filter(
        (t) => (t.type === 'pengeluaran' || (t.type !== 'transfer' && t.amount < 0)) && t.category === cat.id
      )
      const spent = matchingTx.reduce((acc, t) => acc + Math.abs(t.amount), 0)
      const sharePct = totalExpense > 0 ? Math.round((spent / totalExpense) * 100) : 0
      const limitPct = cat.limit > 0 ? Math.min(100, Math.round((spent / cat.limit) * 100)) : 0
      const remaining = cat.limit - spent
      return {
        ...cat,
        spent,
        txCount: matchingTx.length,
        sharePct,
        limitPct,
        remaining,
      }
    })
  }, [categoryBudgets, visibleTransactions, totalExpense])

  const activeWalletObj = wallets.find((w) => w.id === selectedWalletId) || wallets[0] || { name: 'Belum Ada Dompet', balance: 0 }

  // ============================================================================
  // SHARED TOP HEADER (WITH INTERACTIVE DATE PICKER & AVATAR MENU)
  // ============================================================================
  const renderSharedHeader = (subtitleBadge = null) => (
    <header
      style={{ backgroundColor: currentTheme.headerBg }}
      className="fixed top-0 inset-x-0 z-40 backdrop-blur-md border-b-[2.5px] border-black pt-safe transition-colors"
    >
      <div className="h-16 px-3 flex items-center justify-between gap-2 max-w-md mx-auto">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => navigateTo('beranda')}
            style={{ backgroundColor: currentTheme.accent }}
            className="w-9 h-9 rounded-xl border-2 border-black shadow-brutal-sm flex items-center justify-center font-display font-extrabold text-black text-sm shrink-0 neo-btn"
          >
            CU
          </button>
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-sm text-black tracking-tight leading-none truncate">
                CatatUang
              </span>
              {subtitleBadge && (
                <span className="text-[9px] font-display font-extrabold uppercase px-1.5 py-0.5 bg-white border border-black rounded-md shrink-0">
                  {subtitleBadge}
                </span>
              )}
            </div>
            {/* Interactive Date Selector right below App Name */}
            <div className="mt-1 flex items-center">
              <button
                type="button"
                onClick={() => setDateModalOpen(true)}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#ffedd5] hover:bg-[#fed7aa] border border-black rounded-full shadow-[1px_1px_0px_#000] text-[9.5px] font-display font-bold uppercase tracking-wider text-black active:translate-x-0.5 active:translate-y-0.5 transition-transform truncate"
              >
                <span className="material-symbols-outlined !text-[11px] leading-none">calendar_today</span>
                <span className="truncate">
                  {dateFilterMode === 'exact-date'
                    ? formatDateIndo(selectedDate)
                    : `${formatDateIndo(selectedDate)} • Bln`}
                </span>
                <span className="material-symbols-outlined !text-[12px] leading-none">expand_more</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Actions: Login Button & Avatar */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setLoginModalOpen(true)}
            title={googleUser ? `Akun: ${googleUser.email}` : 'Masuk Akun'}
            className={`h-9 px-2 flex items-center justify-center gap-1.5 rounded-xl border-2 border-black shadow-neo-sm text-black neo-btn ${
              googleUser ? 'bg-[#bef264]' : 'bg-white hover:bg-[#fef08a]'
            }`}
          >
            <span className="w-4 h-4 rounded bg-white border border-black flex items-center justify-center text-[10px] font-black text-black shrink-0">
              G
            </span>
            <span className="text-[10px] font-display font-extrabold whitespace-nowrap max-w-[65px] truncate">
              {googleUser ? (googleUser.name ? googleUser.name.split(' ')[0] : 'Akun') : 'Masuk'}
            </span>
          </button>
          <AvatarButton
            avatar={avatar}
            isGoogleConnected={Boolean(googleUser)}
            googleUser={googleUser}
            onClick={() => navigateTo('pengaturan')}
          />
        </div>
      </div>
    </header>
  )

  // ============================================================================
  // SHARED MODALS (DATE PICKER, WALLET EDITOR, BUDGET EDITOR, GOOGLE CLOUD LOGIN)
  // ============================================================================
  const renderSharedModals = () => (
    <>
      {/* 1. Date & Synchronization Modal */}
      {dateModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setDateModalOpen(false)
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-[#fefce8] border-[3px] border-black rounded-3xl p-5 shadow-brutal-xl w-full max-w-sm flex flex-col gap-3.5">
            <div className="flex items-center justify-between pb-2 border-b-2 border-black">
              <div>
                <h3 className="font-display font-extrabold text-base text-black">Atur Tanggal & Sinkronisasi</h3>
                <p className="text-xs font-semibold text-black/70">
                  Sinkronkan pengeluaran berdasarkan tanggal pilihan
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border-2 border-black shadow-neo-sm flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase text-black">Pilih Tanggal Aktif:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) setSelectedDate(e.target.value)
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black bg-white font-display font-extrabold text-sm text-black focus:outline-none shadow-neo-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-extrabold uppercase text-black">Mode Tampilan Data & Pengeluaran:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDateFilterMode('exact-date')}
                  className={`p-2.5 rounded-xl border-2 border-black font-display text-xs font-extrabold text-left neo-btn ${
                    dateFilterMode === 'exact-date' ? 'bg-[#bef264] shadow-neo' : 'bg-white shadow-neo-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="material-symbols-outlined !text-[16px]">today</span>
                    {dateFilterMode === 'exact-date' && <span>✓</span>}
                  </div>
                  <div>Per Tanggal Ini</div>
                  <div className="text-[10px] font-normal text-black/70">{formatDateIndo(selectedDate)}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setDateFilterMode('all-month')}
                  className={`p-2.5 rounded-xl border-2 border-black font-display text-xs font-extrabold text-left neo-btn ${
                    dateFilterMode === 'all-month' ? 'bg-[#bef264] shadow-neo' : 'bg-white shadow-neo-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="material-symbols-outlined !text-[16px]">date_range</span>
                    {dateFilterMode === 'all-month' && <span>✓</span>}
                  </div>
                  <div>Satu Bulan Penuh</div>
                  <div className="text-[10px] font-normal text-black/70">{formatMonthYearIndo(selectedDate)}</div>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setDateModalOpen(false)
                triggerToast(
                  `📅 Tanggal diatur ke ${formatDateIndo(selectedDate)} (${
                    dateFilterMode === 'exact-date' ? 'Filter Harian' : 'Filter Bulanan'
                  })`
                )
              }}
              className="w-full py-3 rounded-2xl bg-black text-[#bef264] font-display font-extrabold text-sm border-2 border-black shadow-neo neo-btn"
            >
              Terapkan Tanggal
            </button>
          </div>
        </div>
      )}

      {/* 2. Manual Wallet Add/Edit Modal */}
      {walletFormModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setWalletFormModal(null)
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <form
            onSubmit={handleSaveWalletForm}
            className="bg-[#fef9f3] border-[3px] border-black rounded-3xl p-5 shadow-brutal-xl w-full max-w-sm flex flex-col gap-3"
          >
            <div className="flex items-center justify-between pb-2 border-b-2 border-black">
              <h3 className="font-extrabold text-base text-black">
                {walletFormModal.mode === 'add' ? '+ Tambah Dompet Manual' : `Atur Dompet: ${walletFormModal.name}`}
              </h3>
              <button
                type="button"
                onClick={() => setWalletFormModal(null)}
                className="w-8 h-8 rounded-full bg-white border-2 border-black shadow-neo-sm flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold uppercase text-black">Nama Dompet / Rekening</label>
              <input
                type="text"
                autoFocus
                placeholder="Contoh: BCA Payroll, GoPay, Dompet Tunai"
                value={walletFormModal.name}
                onChange={(e) => setWalletFormModal((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border-2 border-black bg-white font-bold text-sm text-black focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold uppercase text-black">Jenis Menu Dompet (Scroll ke Samping)</label>
              <HorizontalScroll className="flex gap-2 pb-1">
                {WALLET_TEMPLATES.map((t) => {
                  const active = walletFormModal.tag === t.tag
                  return (
                    <button
                      key={t.tag}
                      type="button"
                      onClick={() => setWalletFormModal((prev) => ({ ...prev, tag: t.tag, bg: t.bg }))}
                      className={`shrink-0 px-3 py-1.5 rounded-xl border-2 border-black text-xs font-extrabold flex items-center gap-1.5 neo-btn ${
                        active ? 'bg-[#bef264] shadow-neo' : 'bg-white shadow-neo-sm'
                      }`}
                    >
                      <span>{t.badge}</span>
                      <span>{t.tag}</span>
                    </button>
                  )
                })}
              </HorizontalScroll>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold uppercase text-black">Warna Kartu Dompet</label>
              <div className="flex items-center gap-2">
                {WALLET_COLOR_CHOICES.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setWalletFormModal((prev) => ({ ...prev, bg: c.hex }))}
                    style={{ backgroundColor: c.hex }}
                    className={`w-8 h-8 rounded-xl border-2 border-black flex items-center justify-center ${
                      walletFormModal.bg === c.hex ? 'ring-2 ring-black shadow-neo' : ' opacity-80'
                    }`}
                  >
                    {walletFormModal.bg === c.hex && <span className="text-xs font-black">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold uppercase text-black">Nominal Saldo Saat Ini (Rp)</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={walletFormModal.balance}
                onChange={(e) =>
                  setWalletFormModal((prev) => ({ ...prev, balance: e.target.value.replace(/[^0-9-]/g, '') }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black bg-white font-extrabold text-lg text-black focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              {walletFormModal.mode === 'edit' && (
                <button
                  type="button"
                  onClick={() => handleDeleteWallet(walletFormModal.id)}
                  className="px-3.5 py-3 rounded-2xl bg-[#fca5a5] text-black font-extrabold text-xs border-2 border-black shadow-neo neo-btn"
                >
                  Hapus
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-3 rounded-2xl bg-[#bef264] text-black font-extrabold text-sm border-2 border-black shadow-neo neo-btn"
              >
                Simpan Dompet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Budget Manual Modal */}
      {budgetModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setBudgetModalOpen(false)
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4"
        >
          <form
            onSubmit={saveBudgetModal}
            className="bg-[#fef9f3] border-[3px] border-black rounded-3xl p-5 shadow-brutal-xl w-full max-w-md flex flex-col gap-3 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b-2 border-black">
              <div>
                <h3 className="font-extrabold text-base text-black">Atur Anggaran Bulanan</h3>
                <p className="text-xs font-semibold text-black/70">Isi manual target anggaran mulai dari Rp 0</p>
              </div>
              <button
                type="button"
                onClick={() => setBudgetModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border-2 border-black shadow-neo-sm flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold uppercase text-black">Target Anggaran Utama (Rp)</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={budgetForm.master}
                onChange={(e) => setBudgetForm((prev) => ({ ...prev, master: e.target.value.replace(/[^0-9]/g, '') }))}
                className="w-full px-3 py-2 rounded-xl border-2 border-black bg-[#bef264]/40 font-extrabold text-sm text-black focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <span className="text-xs font-extrabold uppercase text-black">Batas Per Kategori (Rp)</span>
              {categoryBudgets.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-2 bg-white p-2 rounded-xl border-2 border-black"
                >
                  <span className="text-xs font-bold text-black truncate">
                    {c.emoji} {c.label}
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={budgetForm.categories[c.id] ?? ''}
                    onChange={(e) =>
                      setBudgetForm((prev) => ({
                        ...prev,
                        categories: { ...prev.categories, [c.id]: e.target.value.replace(/[^0-9]/g, '') },
                      }))
                    }
                    className="w-32 px-2.5 py-1 rounded-lg border-2 border-black text-right font-extrabold text-xs text-black focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-1 rounded-2xl bg-black text-[#bef264] font-extrabold text-sm border-2 border-black shadow-neo neo-btn"
            >
              Simpan Anggaran
            </button>
          </form>
        </div>
      )}

      {/* 4. Login dengan Google Modal */}
      {loginModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setLoginModalOpen(false)
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border-[3px] border-black rounded-3xl p-5 shadow-brutal-xl w-full max-w-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#bef264] border-2 border-black shadow-neo-sm flex items-center justify-center font-display font-black text-base text-black">
                  G
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base text-black">Login dengan Google</h3>
                  <p className="text-[11px] font-semibold text-black/70">Sinkronkan progres & avatar dengan akun Google</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLoginModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border-2 border-black shadow-neo-sm flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {googleUser ? (
              <div className="flex flex-col gap-3">
                <div className="p-3.5 rounded-2xl bg-[#dcfce7] border-2 border-black shadow-neo-sm flex items-center gap-3">
                  <img
                    alt={googleUser.name}
                    src={googleUser.picture || buildGoogleAvatar(googleUser.email, googleUser.name).src}
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        googleUser.name || googleUser.email
                      )}&background=bef264&color=000000&bold=true&size=128`
                    }}
                    className="w-11 h-11 rounded-full bg-white border-2 border-black object-cover shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-extrabold text-sm text-black truncate">{googleUser.name}</span>
                    <span className="text-xs font-bold text-black/75 truncate">{googleUser.email}</span>
                    <span className="text-[10px] font-extrabold text-[#15803d] mt-0.5">
                      ● Avatar & Progres Tersinkron (Update: {googleUser.lastSync})
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleManualCloudSync}
                  className="w-full py-3 rounded-2xl bg-[#bef264] text-black font-extrabold text-xs border-2 border-black shadow-neo flex items-center justify-center gap-2 neo-btn"
                >
                  <span className="material-symbols-outlined text-[18px]">sync</span>
                  <span>Sinkronkan Progres & Avatar Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleGoogleLogout}
                  className="w-full py-2.5 rounded-2xl bg-[#fee2e2] text-[#ba1a1a] font-extrabold text-xs border-2 border-black shadow-neo-sm neo-btn"
                >
                  Keluar (Logout Google)
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Instant In-App Login (Guaranteed to work on Android APK) */}
                <div className="bg-[#fefce8] p-3 rounded-2xl border-2 border-black shadow-neo-sm flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-black">phonelink_setup</span>
                    <span className="font-display font-extrabold text-xs text-black uppercase">
                      Masuk Langsung di HP (APK)
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-black/70 leading-snug">
                    Ketik Nama & Email Google Anda. Foto profil resmi Google dan catatan Anda akan otomatis terhubung!
                  </p>

                  <form onSubmit={handleGoogleLogin} className="flex flex-col gap-2 mt-1">
                    <div className="flex flex-col gap-0.5">
                      <label className="text-[10px] font-extrabold uppercase text-black">Nama Anda</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Daffa"
                        value={loginNameInput}
                        onChange={(e) => setLoginNameInput(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border-2 border-black bg-white font-bold text-xs text-black focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <label className="text-[10px] font-extrabold uppercase text-black">Email Google</label>
                      <input
                        type="email"
                        required
                        placeholder="nama@gmail.com"
                        value={loginEmailInput}
                        onChange={(e) => setLoginEmailInput(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border-2 border-black bg-white font-bold text-xs text-black focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 mt-1 rounded-xl bg-black text-[#bef264] font-display font-black text-xs border-2 border-black shadow-neo flex items-center justify-center gap-2 neo-btn"
                    >
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>Hubungkan Akun Google</span>
                    </button>
                  </form>
                </div>

                <div className="flex items-center gap-2 my-0.5">
                  <div className="h-[1.5px] bg-black/15 flex-1"></div>
                  <span className="text-[10px] font-bold text-black/40 uppercase">atau via browser</span>
                  <div className="h-[1.5px] bg-black/15 flex-1"></div>
                </div>

                {/* One-Click Google Firebase Browser Popup */}
                <button
                  type="button"
                  onClick={handleGoogleFirebaseLogin}
                  className="w-full py-2.5 px-3 rounded-2xl bg-white hover:bg-[#fef08a] text-black font-display font-extrabold text-[11px] border-2 border-black shadow-neo-sm flex items-center justify-center gap-2 neo-btn"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Buka Dialog Google di Browser</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )

  // ============================================================================
  // SCREEN 5: PENGATURAN, AVATAR, TEMA, LOGIN DENGAN GOOGLE & TENTANG APLIKASI
  // ============================================================================
  if (activeScreen === 'pengaturan') {
    const avatarList = googleUser
      ? [buildGoogleAvatar(googleUser.email, googleUser.name), ...AVATAR_PRESETS]
      : AVATAR_PRESETS

    return (
      <div
        style={{ backgroundColor: currentTheme.bg }}
        className="text-black flex flex-col min-h-screen selection:bg-[#bef264] font-body transition-colors"
      >
        {renderSharedHeader('PENGATURAN')}

        <main className="flex-1 flex flex-col w-full max-w-md mx-auto px-4 pt-28 pb-40 gap-4">
          {/* 1. Profil, Avatar & Login dengan Google Card */}
          <div className="bg-white rounded-3xl border-[2.5px] border-black p-4 shadow-brutal-lg flex flex-col gap-3.5">
            <div className="flex items-center gap-3">
              <div
                style={{ backgroundColor: !avatar || avatar.type === 'empty' ? '#f4f4f5' : avatar?.bg || '#ffffff' }}
                className="w-16 h-16 rounded-2xl border-[2.5px] border-black shadow-brutal flex items-center justify-center overflow-hidden shrink-0"
              >
                {!avatar || avatar.type === 'empty' ? (
                  <span className="material-symbols-outlined text-black/35 !text-[36px] select-none">person</span>
                ) : avatar?.type === 'image' ? (
                  <img
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    src={avatar.src}
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        userName || 'CU'
                      )}&background=bef264&color=000000&bold=true&size=128`
                    }}
                  />
                ) : (
                  <span className="text-3xl">{avatar?.emoji}</span>
                )}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="font-display font-extrabold text-base text-black bg-transparent border-b border-dashed border-black/40 focus:outline-none focus:border-black truncate"
                />
                <span className="text-xs font-bold text-black/70 truncate mt-0.5">
                  {googleUser ? `G • ${googleUser.email}` : 'Belum login dengan Google'}
                </span>
                <div className="mt-1.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLoginModalOpen(true)}
                    className="px-3 py-1 rounded-full bg-[#bef264] border-2 border-black shadow-neo-sm font-display text-[11px] font-extrabold text-black neo-btn"
                  >
                    {googleUser ? 'Akun Google Aktif' : 'Login dengan Google'}
                  </button>
                </div>
              </div>
            </div>

            {/* Ubah Icon Avatar (Horizontal Scroll) */}
            <div className="flex flex-col gap-2 pt-2 border-t-2 border-black/10">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs font-extrabold uppercase tracking-wide text-black">
                  Ubah Icon Avatar (Geser ke Samping)
                </span>
                <span className="text-[10px] font-bold text-black/60">{avatar?.label}</span>
              </div>
              <HorizontalScroll className="flex gap-2.5 pb-1">
                {avatarList.map((preset) => {
                  const isSelected = avatar?.id === preset.id
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setAvatar(preset)
                        triggerToast(`Avatar diubah ke ${preset.label}!`)
                      }}
                      style={{ backgroundColor: preset.bg || '#ffffff' }}
                      className={`shrink-0 w-14 h-16 rounded-2xl border-2 border-black flex flex-col items-center justify-center gap-1 p-1 neo-btn ${
                        isSelected ? 'ring-2 ring-black shadow-neo' : 'opacity-85 shadow-neo-sm'
                      }`}
                    >
                      {preset.type === 'empty' ? (
                        <div className="w-8 h-8 rounded-full border border-dashed border-black/40 bg-zinc-100 flex items-center justify-center">
                          <span className="material-symbols-outlined text-black/40 !text-[18px]">person</span>
                        </div>
                      ) : preset.type === 'image' ? (
                        <img
                          alt={preset.label}
                          className="w-8 h-8 rounded-full border border-black object-cover"
                          src={preset.src}
                          onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              userName || 'G'
                            )}&background=bef264&color=000000&bold=true&size=128`
                          }}
                        />
                      ) : (
                        <span className="text-xl leading-none">{preset.emoji}</span>
                      )}
                      <span className="text-[9px] font-extrabold text-black truncate w-full text-center">
                        {preset.label}
                      </span>
                    </button>
                  )
                })}
              </HorizontalScroll>
            </div>
          </div>

          {/* 2. Pilih Tema Aplikasi */}
          <div className="bg-white rounded-3xl border-[2.5px] border-black p-4 shadow-brutal-lg flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#fef08a] border-2 border-black shadow-neo-sm flex items-center justify-center">
                  <span className="material-symbols-outlined !text-[18px]">palette</span>
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-sm text-black">Tema Aplikasi</h3>
                  <p className="text-[11px] font-semibold text-black/70">Pilih suasana warna Neobrutalism</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {THEME_PRESETS.map((t) => {
                const active = themeId === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setThemeId(t.id)
                      triggerToast(`🎨 Tema "${t.name}" diaktifkan!`)
                    }}
                    style={{ backgroundColor: t.bg }}
                    className={`p-3 rounded-2xl border-2 border-black flex items-center justify-between neo-btn ${
                      active ? 'shadow-neo ring-2 ring-black' : 'shadow-neo-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        style={{ backgroundColor: t.accent }}
                        className="w-5 h-5 rounded-full border-2 border-black shrink-0"
                      ></span>
                      <span className="font-display text-xs font-extrabold text-black truncate">{t.name}</span>
                    </div>
                    {active && <span className="text-xs font-black">✓</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 3. Tentang Aplikasi & Versi Aplikasi */}
          <div className="bg-white rounded-3xl border-[2.5px] border-black p-4 shadow-brutal-lg flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#bae6fd] border-2 border-black shadow-neo-sm flex items-center justify-center">
                <span className="material-symbols-outlined !text-[18px]">info</span>
              </div>
              <div>
                <h3 className="font-display font-extrabold text-sm text-black">Tentang Aplikasi</h3>
                <p className="text-[11px] font-semibold text-black/70">CatatUang Expense Tracker (Neobrutalism)</p>
              </div>
            </div>
            <p className="text-xs text-black/80 font-medium leading-relaxed bg-[#fefce8] p-3 rounded-2xl border-2 border-black">
              <strong>CatatUang</strong> adalah aplikasi pencatat keuangan pribadi bergaya <em>Neobrutalism</em> yang dirancang agar cepat, transparan, dan mudah dikustomisasi secara manual mulai dari Rp 0. Mendukung multi-dompet, kalkulator rumus cepat, grafik proporsi kategori, sinkronisasi tanggal, dan pencadangan Google Cloud.
            </p>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f1f5f9] border-2 border-black">
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold uppercase text-black/60">Versi Aplikasi</span>
                <span className="font-display text-xs font-extrabold text-black">{APP_VERSION}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#bef264] border-2 border-black text-[10px] font-extrabold shadow-neo-sm">
                Terbaru ✓
              </span>
            </div>

            <button
              type="button"
              onClick={resetAllToZero}
              className="w-full py-3 rounded-2xl bg-[#fee2e2] text-[#ba1a1a] font-display font-extrabold text-xs border-2 border-black shadow-neo flex items-center justify-center gap-2 neo-btn"
            >
              <span className="material-symbols-outlined !text-[18px]">restart_alt</span>
              <span>Reset Seluruh Data Kembali ke Rp 0</span>
            </button>
          </div>
        </main>

        <UnifiedBottomNav activeScreen={activeScreen} onNavigate={navigateTo} />
        {renderSharedModals()}
      </div>
    )
  }

  // ============================================================================
  // SCREEN 4: QUICK ADD TRANSAKSI (Neobrutalism Rapi)
  // ============================================================================
  if (activeScreen === 'catat-cepat') {
    const quickCategories = [
      { id: 'Makan & Minum', short: 'Makan', iconBg: '#ffffff', svg: <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" strokeLinecap="round" strokeLinejoin="round" /> },
      { id: 'Transportasi', short: 'Transport', iconBg: '#bae6fd', svg: <path d="M5 17h14m-12 0l-1.5-6h15l-1.5 6M4 17a2 2 0 104 0 2 2 0 00-4 0zm12 0a2 2 0 104 0 2 2 0 00-4 0zM6 8l1.5-3h9L18 8" strokeLinecap="round" strokeLinejoin="round" /> },
      { id: 'Belanja', short: 'Belanja', iconBg: '#ddd6fe', svg: <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" /> },
      { id: 'Tagihan & Utilitas', short: 'Tagihan', iconBg: '#fed7aa', svg: <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" /> },
      { id: 'Hiburan', short: 'Hiburan', iconBg: '#fca5a5', svg: <path d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" strokeLinecap="round" strokeLinejoin="round" /> },
      { id: 'Kesehatan', short: 'Kesehatan', iconBg: '#bef264', svg: <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10M12 14v4m-2-2h4" strokeLinecap="round" strokeLinejoin="round" /> },
      { id: 'Gaji / Bonus', short: 'Gaji', iconBg: '#fef08a', svg: <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" /> },
    ]

    const displayCardBg =
      txType === 'pengeluaran' ? 'bg-[#bef264]' : txType === 'pemasukan' ? 'bg-[#fef08a]' : 'bg-[#bae6fd]'

    return (
      <div
        style={{ backgroundColor: currentTheme.bg }}
        className="text-black min-h-screen flex flex-col font-sans selection:bg-[#bef264] selection:text-black transition-colors"
      >
        {renderSharedHeader('CATAT CEPAT')}

        <main className="flex-1 flex flex-col w-full max-w-md mx-auto px-4 pt-28 pb-40">
          {/* Segmented Type Selector */}
          <div className="p-1.5 bg-white border-2 border-black rounded-2xl shadow-neo flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setTxType('pengeluaran')}
              className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 border-2 font-sans font-bold text-xs sm:text-sm transition-all duration-150 neo-btn ${
                txType === 'pengeluaran'
                  ? 'border-black bg-[#fca5a5] text-black shadow-neo-sm'
                  : 'border-transparent bg-transparent text-black'
              }`}
            >
              <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Pengeluaran</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTxType('pemasukan')
                setSelectedCategory('Gaji / Bonus')
              }}
              className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 border-2 font-sans font-bold text-xs sm:text-sm transition-all duration-150 neo-btn ${
                txType === 'pemasukan'
                  ? 'border-black bg-[#bef264] text-black shadow-neo-sm'
                  : 'border-transparent bg-transparent text-black'
              }`}
            >
              <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Pemasukan</span>
            </button>
            <button
              type="button"
              onClick={() => setTxType('transfer')}
              className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 border-2 font-sans font-bold text-xs sm:text-sm transition-all duration-150 neo-btn ${
                txType === 'transfer'
                  ? 'border-black bg-[#bae6fd] text-black shadow-neo-sm'
                  : 'border-transparent bg-transparent text-black'
              }`}
            >
              <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Transfer</span>
            </button>
          </div>

          {/* Giant Interactive Currency & Expression Card */}
          <div
            className={`mt-3 border-2 border-black rounded-2xl p-3.5 shadow-neo ${displayCardBg} relative overflow-hidden transition-colors duration-200`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider font-sans bg-white px-2.5 py-1 rounded-lg border-2 border-black shadow-neo-sm">
                Rumus Aktif
              </span>
              <span className="font-sans text-xs font-bold text-black px-3 py-1 rounded-full bg-white border-2 border-black shadow-neo-sm tracking-tight">
                {formattedFormula}
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-3 mb-1.5">
              <span className="font-sans text-xl font-extrabold text-black/70">Rp</span>
              <span className="font-sans text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
                {formatIDR(evaluatedAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t-2 border-black/20 text-black">
              <span className="font-sans text-xs font-bold text-black/80">Hasil Evaluasi:</span>
              <span className="font-sans text-xs font-extrabold px-3 py-1 rounded-lg bg-black text-white shadow-neo-sm">
                = Rp {formatIDR(evaluatedAmount)}
              </span>
            </div>
          </div>

          {/* Category Selection OR Transfer Destination */}
          {txType !== 'transfer' ? (
            <div className="mt-3 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-sm font-extrabold text-black uppercase tracking-wide">
                    Pilih Kategori
                  </span>
                  <span className="px-2 py-0.5 rounded-full border border-black bg-[#fef08a] text-black font-grotesk font-black text-[10px] shadow-neo-sm uppercase">
                    Wajib
                  </span>
                </div>
                <span className="font-sans text-xs font-bold text-black/70">
                  {txType === 'pemasukan' ? 'Sumber Pemasukan' : 'Kebutuhan Harian'}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {quickCategories.map((cat) => {
                  const isActive = selectedCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border-2 border-black transition-all neo-btn text-black ${
                        isActive ? 'bg-[#fef08a] shadow-neo' : 'bg-white shadow-neo-sm'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center shadow-neo-sm shrink-0"
                        style={{ backgroundColor: isActive ? '#ffffff' : cat.iconBg }}
                      >
                        <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {cat.svg}
                        </svg>
                      </div>
                      <span className="font-sans text-xs font-bold text-center truncate w-full">{cat.short}</span>
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={() => triggerToast('Pilih kategori yang tersedia.')}
                  className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border-2 border-dashed border-black bg-white/70 shadow-neo-sm transition-all neo-btn text-black"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-black bg-white flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="font-sans text-xs font-bold text-center truncate w-full">Lainnya</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex flex-col">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-sans text-sm font-extrabold text-black uppercase tracking-wide">
                  Ke Dompet Tujuan (Geser ke Samping)
                </span>
              </div>
              <HorizontalScroll className="flex items-center gap-2 pb-1">
                {wallets.map((w) => {
                  const isActive = targetWalletId === w.id
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setTargetWalletId(w.id)}
                      className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 border-black text-xs neo-btn text-black ${
                        isActive ? 'bg-[#bae6fd] shadow-neo font-extrabold' : 'bg-white shadow-neo-sm font-bold'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full border border-black flex items-center justify-center text-[9px] font-black shrink-0"
                        style={{ backgroundColor: w.bg }}
                      >
                        {w.badge}
                      </div>
                      <span>{w.name}</span>
                    </button>
                  )
                })}
              </HorizontalScroll>
            </div>
          )}

          {/* Sumber Dana (Scrollable + Manual Add Button) */}
          <div className="mt-3 flex flex-col">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-sans text-sm font-extrabold text-black uppercase tracking-wide">
                {txType === 'pemasukan' ? 'Masuk Ke Dompet' : 'Sumber Dana'}
              </span>
              <span className="font-grotesk text-xs font-bold text-black bg-white px-2 py-0.5 border border-black rounded shadow-neo-sm">
                Saldo: {activeWalletObj.balance < 0 ? '-' : ''}Rp {formatIDR(activeWalletObj.balance)}
              </span>
            </div>
            <HorizontalScroll className="flex items-center gap-2 pb-1">
              {wallets.map((w) => {
                const isActive = selectedWalletId === w.id
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setSelectedWalletId(w.id)}
                    className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 border-black text-xs neo-btn text-black ${
                      isActive ? 'bg-[#bef264] shadow-neo font-extrabold' : 'bg-white shadow-neo-sm font-bold'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full border border-black flex items-center justify-center text-[9px] font-black shrink-0"
                      style={{ backgroundColor: w.bg }}
                    >
                      {w.badge}
                    </div>
                    <span>{w.name}</span>
                    {isActive && (
                      <svg className="w-4 h-4 text-black stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                )
              })}
              <button
                type="button"
                onClick={openAddWalletModal}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-dashed border-black bg-[#fef08a] shadow-neo-sm text-xs font-extrabold text-black neo-btn"
              >
                <span>+ Buat Dompet</span>
              </button>
            </HorizontalScroll>
          </div>

          {/* Tanggal (Synced) & Catatan Bar */}
          <div className="mt-2.5 grid grid-cols-12 gap-2">
            <button
              type="button"
              onClick={() => setDateModalOpen(true)}
              className="col-span-5 bg-white border-2 border-black rounded-xl p-2 flex items-center gap-1.5 shadow-neo-sm neo-btn text-left"
            >
              <svg className="w-5 h-5 text-black stroke-[2] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex flex-col truncate">
                <span className="text-[9px] font-black uppercase text-black/60 font-sans tracking-wide">Tanggal</span>
                <span className="font-sans text-xs font-bold text-black truncate">{formatDateIndo(selectedDate)}</span>
              </div>
            </button>
            <div className="col-span-7 bg-white border-2 border-black rounded-xl p-2 flex items-center gap-1.5 shadow-neo-sm focus-within:shadow-neo transition-all">
              <svg className="w-5 h-5 text-black stroke-[2] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="text"
                value={txNote}
                onChange={(e) => setTxNote(e.target.value)}
                placeholder="Ketik catatan transaksi..."
                className="w-full bg-transparent border-0 p-0 font-sans text-xs font-semibold text-black placeholder:text-black/50 focus:outline-none focus:ring-0 truncate"
              />
            </div>
          </div>

          {/* Matrix Keypad */}
          <div className="mt-3 bg-white border-2 border-black rounded-2xl p-2.5 shadow-neo">
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '7', key: '7', bg: 'bg-[#fef08a]' },
                { label: '8', key: '8', bg: 'bg-[#fef08a]' },
                { label: '9', key: '9', bg: 'bg-[#fef08a]' },
                { label: '÷', key: '/', bg: 'bg-[#ddd6fe]' },
                { label: '4', key: '4', bg: 'bg-[#fef08a]' },
                { label: '5', key: '5', bg: 'bg-[#fef08a]' },
                { label: '6', key: '6', bg: 'bg-[#fef08a]' },
                { label: '×', key: '*', bg: 'bg-[#ddd6fe]' },
                { label: '1', key: '1', bg: 'bg-[#fef08a]' },
                { label: '2', key: '2', bg: 'bg-[#fef08a]' },
                { label: '3', key: '3', bg: 'bg-[#fef08a]' },
                { label: '−', key: '-', bg: 'bg-[#ddd6fe]' },
                { label: '0', key: '0', bg: 'bg-[#fef08a]' },
                { label: '000', key: '000', bg: 'bg-white', textSize: 'text-sm' },
                { label: 'C', key: 'clear', bg: 'bg-white', textSize: 'text-sm' },
                { label: '+', key: '+', bg: 'bg-[#ddd6fe]' },
              ].map((btn) => (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() => (btn.key === 'clear' ? setExpression('0') : handleKeyPress(btn.key))}
                  className={`h-11 rounded-xl border-2 border-black ${btn.bg} text-black font-sans ${
                    btn.textSize || 'text-lg'
                  } font-bold flex items-center justify-center shadow-neo-sm neo-btn`}
                >
                  {btn.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleKeyPress('backspace')}
                className="col-span-2 h-11 rounded-xl border-2 border-black bg-[#fca5a5] text-black font-sans text-sm font-extrabold flex items-center justify-center gap-1.5 shadow-neo-sm neo-btn"
              >
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.5-7.5H20a1 1 0 011 1v13a1 1 0 01-1 1H9.5L3 12z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Hapus</span>
              </button>
              <button
                type="button"
                onClick={() => handleKeyPress('=')}
                className="col-span-2 h-11 rounded-xl border-2 border-black bg-[#bef264] text-black font-sans text-sm font-extrabold flex items-center justify-center gap-1.5 shadow-neo-sm neo-btn"
              >
                <span>= Hitung</span>
              </button>
            </div>
          </div>

          {/* Primary Bottom Action CTA */}
          <div className="mt-3 w-full pb-1">
            <button
              type="button"
              onClick={handleSaveTransaction}
              className="w-full h-14 py-3.5 px-4 rounded-2xl border-2 border-black bg-black text-white hover:bg-neutral-900 font-sans font-bold text-base flex items-center justify-center gap-2.5 shadow-neo-lg neo-btn transition-transform"
            >
              <svg className="w-5 h-5 text-[#bef264] stroke-[3] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="tracking-tight font-extrabold">
                Simpan Transaksi (Rp {formatIDR(evaluatedAmount)})
              </span>
            </button>
          </div>
        </main>

        <UnifiedBottomNav activeScreen={activeScreen} onNavigate={navigateTo} />
        {renderSharedModals()}
      </div>
    )
  }

  // ============================================================================
  // SCREEN 2: LAPORAN & GRAFIK VISUAL (Neobrutalism)
  // ============================================================================
  if (activeScreen === 'laporan') {
    const topCategory = [...categoryStats].sort((a, b) => b.spent - a.spent)[0]

    return (
      <div
        style={{ backgroundColor: currentTheme.bg }}
        className="text-[#1b1b1d] flex flex-col min-h-screen selection:bg-[#bef264] font-body-md antialiased transition-colors"
      >
        {renderSharedHeader('LAPORAN')}

        <main className="flex-1 flex flex-col relative w-full max-w-md mx-auto px-4 pt-28 pb-40">
          <div className="flex flex-col w-full pb-4 space-y-4">
            {/* Period Selector & Quick Actions */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={() => setDateModalOpen(true)}
                className="flex items-center justify-between bg-[#fef08a] border-2 border-black rounded-full py-2 px-3.5 shadow-[2.5px_2.5px_0px_#000] neo-btn flex-1"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white border border-black flex items-center justify-center">
                    <span className="material-symbols-outlined text-[15px]">calendar_today</span>
                  </div>
                  <span className="font-label-md text-xs font-bold text-black">
                    {dateFilterMode === 'exact-date' ? formatDateIndo(selectedDate) : formatMonthYearIndo(selectedDate)}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-black">expand_more</span>
              </button>
              <button
                aria-label="Unduh Laporan"
                onClick={() => setExportModalOpen(true)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#fed7aa] border-2 border-black shadow-[2.5px_2.5px_0px_#000] text-black neo-btn font-label-md text-xs font-bold flex-shrink-0"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Ekspor</span>
              </button>
            </div>

            {/* Segmented Control View Filter Pills */}
            <div className="flex items-center justify-between bg-white border-2 border-black rounded-full p-1.5 shadow-[3px_3px_0px_#000] gap-1">
              {[
                { id: 'kategori', label: 'Kategori' },
                { id: 'arus-kas', label: 'Arus Kas' },
                { id: 'tren', label: 'Tren Bulan' },
              ].map((pill) => {
                const active = reportFilter === pill.id
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setReportFilter(pill.id)}
                    className={`flex-1 py-1.5 px-2 rounded-full font-label-md text-xs text-center font-bold border-2 transition-all ${
                      active
                        ? 'bg-[#bef264] border-black shadow-[2px_2px_0px_#000] text-black'
                        : 'text-black border-transparent hover:border-black/30'
                    }`}
                  >
                    {pill.label}
                  </button>
                )
              })}
            </div>

            {/* Neobrutalist Hero Card: Capsule Liquid Bar & Expense Overview */}
            <div className="flex flex-col bg-[#a78bfa] rounded-[2rem] border-[2.5px] border-black p-5 shadow-[4px_4px_0px_#000] relative overflow-hidden">
              <div className="flex items-start justify-between w-full mb-2">
                <div className="flex flex-col">
                  <span className="font-label-sm text-[11px] font-extrabold uppercase tracking-wider text-black/80">
                    Total Pengeluaran ({dateFilterMode === 'exact-date' ? formatDateIndo(selectedDate) : formatMonthYearIndo(selectedDate)})
                  </span>
                  <span className="font-headline-xl text-[32px] leading-tight text-black font-extrabold tracking-tight">
                    {formatCompactM(totalExpense)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setDateModalOpen(true)}
                    className="w-9 h-9 rounded-full bg-white border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black neo-btn"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  </button>
                  <button
                    onClick={openBudgetModal}
                    className="w-9 h-9 rounded-full bg-white border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black neo-btn"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">tune</span>
                  </button>
                </div>
              </div>

              <div className="inline-flex self-start items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border-2 border-black shadow-[2px_2px_0px_#000] mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#bef264] border border-black"></span>
                <span className="font-label-sm text-[10px] font-black uppercase text-black">
                  {expenseTxCount} Transaksi • {totalExpense === 0 ? 'Mulai Dari 0' : 'Tersinkronisasi'}
                </span>
              </div>

              {/* Capsule Liquid Fill Chart Bar */}
              <div className="relative bg-white/40 rounded-2xl p-3 border-2 border-black shadow-[2px_2px_0px_#000] my-1">
                <div className="grid grid-cols-5 gap-2.5 h-44 items-end pt-5 px-1">
                  {categoryStats.map((cat) => (
                    <div key={cat.id} className="flex flex-col items-center h-full justify-end gap-1.5 relative">
                      <div className="absolute -top-4 bg-black text-white px-1.5 py-0.5 rounded-full font-label-sm text-[9px] font-bold z-10 shadow-[1px_1px_0px_#000]">
                        {cat.sharePct}%
                      </div>
                      <div className="relative w-full flex-1 bg-white rounded-full border-2 border-black overflow-hidden flex flex-col justify-end">
                        <div
                          className={`w-full ${cat.accentBg} ${
                            cat.sharePct > 0 ? 'border-t-2 border-black' : ''
                          } rounded-b-full transition-all duration-700`}
                          style={{ height: `${cat.sharePct}%` }}
                        >
                          {cat.sharePct > 8 && (
                            <div className="w-full h-2 bg-white/40 rounded-full mx-auto my-1 max-w-[80%]"></div>
                          )}
                        </div>
                      </div>
                      <span className="font-label-md text-[11px] font-black text-black">{cat.short}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proportion Micro Pills Row */}
              <div className="flex flex-wrap items-center justify-between gap-1.5 mt-3 pt-2 border-t-2 border-black/20">
                {categoryStats.map((cat) => (
                  <span
                    key={cat.id}
                    className={`flex-1 text-center py-0.5 px-1 rounded-full ${cat.accentBg} border border-black font-label-sm text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_#000] truncate`}
                  >
                    {cat.pillLabel} {cat.sharePct}%
                  </span>
                ))}
              </div>
            </div>

            {/* Two Mini Neobrutal Stat Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#fed7aa] border-2 border-black rounded-2xl p-3.5 shadow-[3px_3px_0px_#000] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center text-black">
                    <span className="material-symbols-outlined text-[18px]">trending_up</span>
                  </div>
                  <span className="font-label-sm text-[10px] font-black uppercase text-black bg-white px-2 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_#000]">
                    Sisa
                  </span>
                </div>
                <div className="mt-3 flex flex-col">
                  <span className="font-label-md text-xs font-bold text-black/80 block">Sisa Saldo Aman</span>
                  <span className="font-headline-md text-[17px] font-extrabold text-black tracking-tight mt-0.5">
                    {totalBalance < 0 ? '-' : ''}Rp {formatIDR(totalBalance)}
                  </span>
                </div>
              </div>
              <div className="bg-[#fbcfe8] border-2 border-black rounded-2xl p-3.5 shadow-[3px_3px_0px_#000] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center text-black">
                    <span className="material-symbols-outlined text-[18px]">query_stats</span>
                  </div>
                  <span className="font-label-sm text-[10px] font-black uppercase text-black bg-white px-2 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_#000]">
                    Harian
                  </span>
                </div>
                <div className="mt-3 flex flex-col">
                  <span className="font-label-md text-xs font-bold text-black/80 block">Rerata Per Hari</span>
                  <span className="font-headline-md text-[17px] font-extrabold text-black tracking-tight mt-0.5">
                    Rp {formatIDR(dailyAverageExpense)}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Category Breakdown List */}
            <div className="flex flex-col bg-white rounded-2xl p-4 border-2 border-black shadow-[3.5px_3.5px_0px_#000] space-y-3.5">
              <div className="flex items-center justify-between pb-1 border-b-2 border-black/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-black"></span>
                  <span className="font-headline-md text-base text-black font-extrabold tracking-tight">
                    Rincian Kategori
                  </span>
                </div>
                <button
                  onClick={() => navigateTo('catat-cepat')}
                  className="font-label-md text-xs text-black font-extrabold underline decoration-2 hover:bg-[#bef264] px-1.5 py-0.5 rounded transition-colors"
                  type="button"
                >
                  + Isi Manual
                </button>
              </div>

              {categoryStats.map((cat) => (
                <div
                  key={cat.id}
                  className={`flex flex-col space-y-2 p-2.5 rounded-xl ${cat.reportCardBg} border-2 border-black shadow-[2px_2px_0px_#000]`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg ${cat.accentBg} border-2 border-black flex items-center justify-center text-black flex-shrink-0`}
                      >
                        <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-headline-sm text-sm text-black font-bold truncate">{cat.label}</span>
                        <span className="font-label-sm text-[11px] text-black/70 font-semibold">
                          {cat.txCount} Transaksi
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-numeric-display text-sm text-black font-extrabold">
                        Rp {formatIDR(cat.spent)}
                      </span>
                      <span
                        className={`font-label-sm text-[10px] ${cat.accentBg} text-black font-black px-1.5 py-0.2 rounded border border-black`}
                      >
                        {cat.sharePct}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-white rounded-full h-2.5 border-[1.5px] border-black overflow-hidden">
                    <div
                      className={`${cat.accentBg} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${cat.sharePct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Primary Floating Action Button */}
            <div className="flex flex-col gap-2 pt-1 pb-4">
              <button
                onClick={() => setExportModalOpen(true)}
                className="w-full py-3.5 flex items-center justify-center gap-2 rounded-2xl bg-[#bef264] text-black border-[2.5px] border-black font-headline-md text-base font-extrabold shadow-[4px_4px_0px_#000] neo-btn"
                type="button"
              >
                <div className="w-7 h-7 rounded-full bg-white border border-black flex items-center justify-center">
                  <span className="material-symbols-outlined text-[17px]">ios_share</span>
                </div>
                <span>Ekspor Laporan (.xlsx, .pdf)</span>
              </button>
            </div>
          </div>

          {exportModalOpen && (
            <div
              onClick={(e) => {
                if (e.target === e.currentTarget) setExportModalOpen(false)
              }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end p-4"
            >
              <div className="bg-[#dcfce7] border-[3px] border-black rounded-[2rem] p-5 shadow-[6px_6px_0px_#000] flex flex-col space-y-4 max-w-md mx-auto w-full">
                <div className="flex items-center justify-between pb-2 border-b-2 border-black">
                  <div className="flex flex-col">
                    <span className="font-headline-md text-lg text-black font-extrabold">Ekspor Dokumen</span>
                    <span className="font-body-sm text-xs text-black/80 font-medium">
                      Periode {formatDateIndo(selectedDate)}
                    </span>
                  </div>
                  <button
                    onClick={() => setExportModalOpen(false)}
                    className="w-9 h-9 rounded-full bg-white border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-black neo-btn"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => setExportFormat('pdf')}
                    className={`flex flex-col items-start p-3.5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] neo-btn text-left ${
                      exportFormat === 'pdf' ? 'bg-[#fef08a]' : 'bg-white'
                    }`}
                    type="button"
                  >
                    <span className="font-headline-sm text-sm text-black font-extrabold">Dokumen PDF</span>
                  </button>
                  <button
                    onClick={() => setExportFormat('xlsx')}
                    className={`flex flex-col items-start p-3.5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] neo-btn text-left ${
                      exportFormat === 'xlsx' ? 'bg-[#fef08a]' : 'bg-white'
                    }`}
                    type="button"
                  >
                    <span className="font-headline-sm text-sm text-black font-extrabold">Excel (.xlsx)</span>
                  </button>
                </div>
                <button
                  onClick={() => {
                    setExportModalOpen(false)
                    triggerToast(`Laporan .${exportFormat.toUpperCase()} berhasil diunduh!`)
                  }}
                  className="w-full h-12 flex items-center justify-center rounded-xl bg-black text-[#bef264] font-headline-sm text-sm font-extrabold border-2 border-black shadow-[3px_3px_0px_#000] neo-btn"
                  type="button"
                >
                  Mulai Unduh Laporan
                </button>
              </div>
            </div>
          )}
        </main>

        <UnifiedBottomNav activeScreen={activeScreen} onNavigate={navigateTo} />
        {renderSharedModals()}
      </div>
    )
  }

  // ============================================================================
  // SCREEN 3: ANGGARAN & DOMPET (Neobrutalism)
  // ============================================================================
  if (activeScreen === 'anggaran') {
    return (
      <div
        style={{ backgroundColor: currentTheme.bg }}
        className="text-neo-dark min-h-screen flex flex-col selection:bg-[#bef264] font-sans transition-colors"
      >
        {renderSharedHeader('ANGGARAN')}

        <main className="flex-1 flex flex-col w-full max-w-md mx-auto px-4 pt-28 pb-40">
          <div className="flex flex-col gap-4 mt-1">
            {/* Card Master Anggaran (Neobrutalism Lilac) */}
            <div className="rounded-2xl bg-neo-lilac border-[2.5px] border-black shadow-neo p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 bg-white border-[2px] border-black rounded-full px-2.5 py-1 shadow-neo-sm">
                  <div className="w-4 h-4 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px] text-black">account_balance_wallet</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-black uppercase tracking-wider">Anggaran Utama</span>
                </div>
                <button
                  type="button"
                  onClick={openBudgetModal}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neo-lime border-[2px] border-black text-[11px] font-extrabold text-black shadow-neo-sm neo-btn"
                >
                  <span className="w-2 h-2 rounded-full bg-black"></span>
                  {masterBudget === 0 ? 'ATUR TARGET' : usedBudgetPct >= 100 ? 'OVER LIMIT' : 'SEHAT'}
                </button>
              </div>

              <div>
                <span className="text-xs font-semibold text-black/80 block">Sisa Anggaran Tersedia</span>
                <div className="flex items-baseline justify-between mt-0.5">
                  <h2 className="font-extrabold text-[28px] tracking-tight text-black leading-none">
                    Rp {formatIDR(remainingBudget)}
                  </h2>
                  <span className="text-[11px] font-extrabold bg-white border-[2px] border-black px-2 py-0.5 rounded-lg shadow-neo-sm">
                    {remainingBudgetPct}% Sisa
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="w-full bg-white rounded-full h-4 border-[2px] border-black p-0.5 overflow-hidden shadow-inner">
                  <div
                    className="bg-neo-lime h-full rounded-full border-r-[2px] border-black transition-all duration-500"
                    style={{ width: `${usedBudgetPct}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold text-black px-0.5">
                  <span>
                    Terpakai: Rp {formatIDR(totalExpense)} ({usedBudgetPct}%)
                  </span>
                  <span>Total: Rp {formatIDR(masterBudget)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-neo-yellow border-[2px] border-black rounded-xl p-2.5 shadow-neo-sm">
                <div className="w-7 h-7 rounded-lg bg-black text-neo-yellow border-[1.5px] border-black flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-neo-yellow">bolt</span>
                </div>
                <p className="text-xs text-black leading-tight font-medium">
                  {masterBudget === 0 ? (
                    <>
                      Klik tombol <span className="font-extrabold underline">Set Budget</span> di bawah untuk mengisi batas anggaran manual.
                    </>
                  ) : (
                    <>
                      Rekomendasi belanja:{' '}
                      <span className="font-extrabold underline decoration-black">
                        Maks. Rp {formatIDR(dailySafeSpend)} / hari
                      </span>{' '}
                      agar saldo tetap aman.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Section 01: Batas Kategori */}
            <section className="flex flex-col gap-3 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-neo-peach border-[2px] border-black shadow-neo-sm flex items-center justify-center font-extrabold text-black text-xs">
                    01
                  </div>
                  <h3 className="font-extrabold text-[16px] tracking-tight text-black">Batas Kategori</h3>
                </div>
                <button
                  onClick={openBudgetModal}
                  className="inline-flex items-center gap-1 bg-white border-[2px] border-black shadow-neo-sm px-3 py-1 rounded-full text-xs font-bold hover:bg-neo-yellow active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                  type="button"
                >
                  <div className="w-4 h-4 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px] text-black">add_circle</span>
                  </div>
                  <span>Set Budget</span>
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {categoryStats.map((cat) => {
                  const isOver = cat.limit > 0 && cat.spent > cat.limit
                  const isWarn = cat.limit > 0 && !isOver && cat.limitPct >= 80
                  return (
                    <div
                      key={cat.id}
                      onClick={openBudgetModal}
                      className={`${cat.cardBg} border-[2.5px] border-black rounded-2xl p-3.5 shadow-neo flex flex-col gap-2.5 cursor-pointer`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-white border-[2px] border-black shadow-neo-sm flex items-center justify-center text-xl shrink-0">
                            {cat.emoji}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-extrabold text-[14px] text-black leading-tight truncate">
                              {cat.label}
                            </span>
                            <span className="text-xs font-semibold text-black/75">
                              Limit Rp {formatIDR(cat.limit)}
                            </span>
                          </div>
                        </div>
                        {isOver ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ff7b90] text-black border-[1.5px] border-black text-[10.5px] font-extrabold shadow-neo-sm shrink-0">
                            🚨 Over Rp {formatIDR(cat.spent - cat.limit)}
                          </span>
                        ) : isWarn ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neo-yellow border-[1.5px] border-black text-black text-[10.5px] font-extrabold shadow-neo-sm shrink-0">
                            ⚠️ Hampir Limit ({cat.limitPct}%)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-black border-[1.5px] border-black text-[10.5px] font-extrabold shadow-neo-sm shrink-0">
                            ✅ {cat.limit > 0 ? `${cat.limitPct}%` : '0%'}
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-white rounded-full h-3 border-[2px] border-black p-0.5 overflow-hidden">
                        <div
                          className={`${cat.barBg} h-full rounded-full ${
                            cat.limitPct > 0 ? 'border-r-[2px] border-black' : ''
                          } transition-all duration-500`}
                          style={{ width: `${cat.limitPct}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-black">
                        <span>Terpakai: Rp {formatIDR(cat.spent)}</span>
                        <span className="bg-white border-[1.5px] border-black px-2 py-0.5 rounded-md shadow-neo-sm text-[11px]">
                          Sisa Rp {formatIDR(Math.max(0, cat.remaining))}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Section 02: Saldo Akun & Dompet (Manual + Scrollable) */}
            <section className="flex flex-col gap-3 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-neo-lilac border-[2px] border-black shadow-neo-sm flex items-center justify-center font-extrabold text-black text-xs">
                    02
                  </div>
                  <h3 className="font-extrabold text-[16px] tracking-tight text-black">Dompet Saya (Manual)</h3>
                </div>
                <button
                  onClick={openAddWalletModal}
                  className="inline-flex items-center gap-1 bg-[#bef264] border-[2px] border-black shadow-neo-sm px-3 py-1 rounded-full text-xs font-extrabold neo-btn"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px] text-black">add</span>
                  <span>Tambah Dompet</span>
                </button>
              </div>

              <HorizontalScroll className="flex gap-3 pb-2 -mx-4 px-4">
                {wallets.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => openEditWalletModal(card)}
                    style={{ backgroundColor: card.bg }}
                    className="shrink-0 w-44 border-[2.5px] border-black rounded-2xl p-3.5 shadow-neo flex flex-col justify-between gap-3 cursor-pointer hover:translate-y-[-2px] transition-transform"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-white border-[2px] border-black shadow-neo-sm flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px] text-black">{card.icon}</span>
                      </div>
                      <span className="text-[10px] font-extrabold bg-white border-[1.5px] border-black px-2 py-0.5 rounded-full">
                        {card.tag}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-black/80 block truncate">{card.name}</span>
                      <p className="text-sm font-extrabold text-black mt-0.5 leading-tight">
                        {card.balance < 0 ? '-' : ''}Rp {formatIDR(card.balance)}
                      </p>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={openAddWalletModal}
                  className="shrink-0 w-44 min-h-[116px] bg-white/80 hover:bg-[#fef08a] border-[2.5px] border-dashed border-black rounded-2xl p-3.5 shadow-neo-sm flex flex-col items-center justify-center gap-1.5 text-black neo-btn"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#bef264] border-2 border-black flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                  </div>
                  <span className="font-display text-xs font-extrabold">+ Atur Dompet Baru</span>
                </button>
              </HorizontalScroll>

              <button
                type="button"
                onClick={() => {
                  setTxType('transfer')
                  navigateTo('catat-cepat')
                }}
                className="w-full h-12 rounded-2xl bg-neo-yellow border-[2.5px] border-black shadow-neo hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 font-extrabold text-sm text-black"
              >
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px] text-black">sync_alt</span>
                </div>
                <span>Transfer Antar Dompet</span>
              </button>
            </section>
          </div>
        </main>

        <UnifiedBottomNav activeScreen={activeScreen} onNavigate={navigateTo} />
        {renderSharedModals()}
      </div>
    )
  }

  // ============================================================================
  // SCREEN 1: DASHBOARD RINGKASAN BULANAN (Neobrutalism)
  // ============================================================================
  return (
    <div
      style={{ backgroundColor: currentTheme.bg }}
      className="text-black flex flex-col min-h-screen selection:bg-[#bef264] selection:text-black font-body transition-colors"
    >
      {renderSharedHeader()}

      <main className="flex-1 flex flex-col relative w-full px-4 pt-28 pb-40 max-w-md mx-auto">
        <div className="flex flex-col w-full gap-4">
          {/* 1. Date & Day Velocity Pill Banner (Synchronized with Header Date) */}
          <div className="flex items-center justify-between bg-white px-3 py-2 rounded-2xl border-[2.5px] border-black shadow-brutal">
            <div className="flex items-center gap-1.5">
              <button
                aria-label="Tanggal sebelumnya"
                onClick={() => shiftSelectedDate(-1)}
                className="w-7 h-7 rounded-lg bg-[#fed7aa] border-[2px] border-black flex items-center justify-center text-black active:translate-x-0.5 active:translate-y-0.5 shadow-brutal-sm shrink-0"
                type="button"
              >
                <span className="material-symbols-outlined !text-[16px]">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={() => setDateModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[#bef264] border-[2px] border-black rounded-xl shadow-brutal-sm neo-btn"
              >
                <span className="material-symbols-outlined !text-[15px] text-black">calendar_month</span>
                <span className="font-display font-bold text-[11px] uppercase tracking-wider text-black">
                  {formatDateIndo(selectedDate)}
                </span>
              </button>
              <button
                aria-label="Tanggal berikutnya"
                onClick={() => shiftSelectedDate(1)}
                className="w-7 h-7 rounded-lg bg-[#fed7aa] border-[2px] border-black flex items-center justify-center text-black active:translate-x-0.5 active:translate-y-0.5 shadow-brutal-sm shrink-0"
                type="button"
              >
                <span className="material-symbols-outlined !text-[16px]">chevron_right</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() =>
                setDateFilterMode((prev) => (prev === 'exact-date' ? 'all-month' : 'exact-date'))
              }
              title="Klik untuk ganti filter Harian / Bulanan"
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#bae6fd] border-[2px] border-black rounded-xl shadow-brutal-sm neo-btn"
            >
              <span className="w-2 h-2 rounded-full bg-[#ef4444] border border-black inline-block"></span>
              <span className="font-display font-bold text-[11px] text-black whitespace-nowrap">
                {dateFilterMode === 'exact-date' ? `Harian (${currentDayNum}/${totalDaysInMonth})` : `Hari ${currentDayNum}/${totalDaysInMonth}`}
              </span>
            </button>
          </div>

          {/* 2. Hero Balance & Cash Flow Summary */}
          <div
            style={{ backgroundColor: currentTheme.accent }}
            className="relative overflow-hidden text-black rounded-3xl border-[2.5px] border-black p-4 shadow-brutal-lg transition-colors"
          >
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-black inline-block"></span>
                  <span className="font-display text-[11px] uppercase tracking-wider font-extrabold text-black">
                    Total Sisa Saldo ({wallets.length} Dompet)
                  </span>
                </div>
                <button
                  aria-label="Sembunyikan saldo"
                  onClick={() => setIsBalanceHidden((prev) => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border-[2px] border-black text-black font-display text-xs font-bold shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5 transition-transform"
                  type="button"
                >
                  <span className="material-symbols-outlined !text-[16px]">
                    {isBalanceHidden ? 'visibility_off' : 'visibility'}
                  </span>
                  <span>Privasi</span>
                </button>
              </div>

              <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-2xl border-[2.5px] border-black shadow-brutal-sm">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-base text-black font-bold">
                    {totalBalance < 0 ? '-Rp' : 'Rp'}
                  </span>
                  <span className="font-display text-3xl tracking-tight font-extrabold text-black">
                    {isBalanceHidden ? '••••••••' : formatIDR(totalBalance)}
                  </span>
                </div>
                <span className="inline-flex items-center justify-center px-2 py-0.5 bg-[#fed7aa] rounded-lg border-[2px] border-black text-xs font-display font-extrabold">
                  IDR
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                <div
                  onClick={() => {
                    setTxType('pemasukan')
                    setSelectedCategory('Gaji / Bonus')
                    navigateTo('catat-cepat')
                  }}
                  className="flex flex-col bg-white p-3 rounded-2xl border-[2.5px] border-black shadow-brutal-sm cursor-pointer hover:bg-[#f0fdf4] transition-colors"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-5 h-5 rounded-full bg-[#bef264] border-[1.5px] border-black flex items-center justify-center text-black shrink-0">
                      <span className="material-symbols-outlined !text-[13px] font-bold">arrow_upward</span>
                    </div>
                    <span className="font-display text-[11px] font-bold uppercase tracking-wider text-black">
                      Pemasukan
                    </span>
                  </div>
                  <span className="font-display text-sm text-[#15803d] font-extrabold leading-tight">
                    +Rp {isBalanceHidden ? '••••••' : formatIDR(totalIncome)}
                  </span>
                </div>
                <div
                  onClick={() => {
                    setTxType('pengeluaran')
                    navigateTo('catat-cepat')
                  }}
                  className="flex flex-col bg-white p-3 rounded-2xl border-[2.5px] border-black shadow-brutal-sm cursor-pointer hover:bg-[#fff1f2] transition-colors"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-5 h-5 rounded-full bg-[#fbcfe8] border-[1.5px] border-black flex items-center justify-center text-[#ba1a1a] shrink-0">
                      <span className="material-symbols-outlined !text-[13px] font-bold">arrow_downward</span>
                    </div>
                    <span className="font-display text-[11px] font-bold uppercase tracking-wider text-black">
                      Pengeluaran
                    </span>
                  </div>
                  <span className="font-display text-sm text-[#ba1a1a] font-extrabold leading-tight">
                    -Rp {isBalanceHidden ? '••••••' : formatIDR(totalExpense)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Multi-Dompet Horizontal Carousel (Manual Setup + Sideways Drag/Scroll) */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#bae6fd] border-[2px] border-black shadow-brutal-sm flex items-center justify-center text-black shrink-0">
                  <span className="material-symbols-outlined !text-[17px]">account_balance_wallet</span>
                </div>
                <h2 className="font-display font-bold text-base tracking-tight text-black">Dompet Saya</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setTxType('transfer')
                    navigateTo('catat-cepat')
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#fed7aa] text-black border-[2px] border-black rounded-xl font-display text-xs font-bold shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  type="button"
                >
                  <span className="material-symbols-outlined !text-[14px]">swap_horiz</span>
                  <span>Transfer</span>
                </button>
                <button
                  onClick={openAddWalletModal}
                  className="font-display text-xs text-black font-extrabold underline decoration-2 hover:text-[#524584] transition-colors"
                  type="button"
                >
                  + Atur Saldo
                </button>
              </div>
            </div>

            {/* Draggable & Scrollable Horizontal Strip */}
            <HorizontalScroll className="flex gap-3 pb-2 -mx-4 px-4 snap-x snap-mandatory">
              {wallets.map((w) => (
                <div
                  key={w.id}
                  onClick={() => openEditWalletModal(w)}
                  style={{ backgroundColor: w.bg }}
                  className="snap-start shrink-0 w-44 p-3.5 rounded-2xl border-[2.5px] border-black shadow-brutal flex flex-col justify-between hover:translate-y-[-2px] transition-transform cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-white border-[2px] border-black shadow-brutal-sm flex items-center justify-center text-black shrink-0">
                      <span className="material-symbols-outlined !text-[20px]">{w.icon}</span>
                    </div>
                    <span className="font-display text-[10px] px-2 py-0.5 rounded-full bg-white border-[1.5px] border-black font-extrabold text-black">
                      {w.tag}
                    </span>
                  </div>
                  <div>
                    <span className="font-body text-xs font-bold text-black/80 block truncate">{w.name}</span>
                    <span className="font-display text-sm text-black font-extrabold">
                      {isBalanceHidden ? 'Rp ••••••' : `${w.balance < 0 ? '-' : ''}Rp ${formatIDR(w.balance)}`}
                    </span>
                  </div>
                </div>
              ))}

              {/* Manual Add Wallet Card Always Available in Horizontal Scroll */}
              <button
                type="button"
                onClick={openAddWalletModal}
                className="snap-start shrink-0 w-44 min-h-[116px] bg-white/90 hover:bg-[#fef08a] p-3.5 rounded-2xl border-[2.5px] border-dashed border-black shadow-brutal-sm flex flex-col items-center justify-center gap-1.5 text-center neo-btn"
              >
                <div className="w-9 h-9 rounded-xl bg-[#bef264] border-[2px] border-black shadow-brutal-sm flex items-center justify-center text-black">
                  <span className="material-symbols-outlined !text-[20px]">add</span>
                </div>
                <span className="font-display text-xs font-extrabold text-black">+ Tambah Dompet</span>
                <span className="font-body text-[10px] font-semibold text-black/65">Atur manual nama & saldo</span>
              </button>
            </HorizontalScroll>
          </div>

          {/* 4. Quick Budget Progress Bar */}
          <div
            onClick={openBudgetModal}
            className="bg-white p-4 rounded-3xl border-[2.5px] border-black shadow-brutal-lg flex flex-col gap-3 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#e9d5ff] border-[2px] border-black shadow-brutal-sm flex items-center justify-center text-black shrink-0">
                  <span className="material-symbols-outlined !text-[18px]">donut_small</span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-black leading-tight">Batas Bulanan</h3>
                  <span className="font-body text-xs text-black/70 font-semibold">
                    Target mak. Rp {formatIDR(masterBudget)}
                  </span>
                </div>
              </div>
              <span className="font-display text-[11px] px-2.5 py-1 rounded-full bg-[#bef264] border-[2px] border-black text-black font-extrabold shadow-brutal-sm">
                {masterBudget === 0 ? 'Atur Manual' : `Aman (${usedBudgetPct}%)`}
              </span>
            </div>
            <div className="w-full bg-[#f1f5f9] h-4 rounded-full border-[2px] border-black overflow-hidden p-0.5">
              <div
                className="bg-[#bef264] h-full rounded-full border-r-[2px] border-black transition-all duration-500"
                style={{ width: `${usedBudgetPct}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between font-display text-xs font-bold text-black">
              <span>
                Terpakai: <span className="font-extrabold">Rp {formatIDR(totalExpense)}</span>
              </span>
              <span className="text-[#15803d]">Sisa: Rp {formatIDR(remainingBudget)}</span>
            </div>
          </div>

          {/* 5. Riwayat Transaksi Terbaru (Synchronized with Selected Date/Month) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#fbcfe8] border-[2px] border-black shadow-brutal-sm flex items-center justify-center text-black shrink-0">
                  <span className="material-symbols-outlined !text-[17px]">receipt_long</span>
                </div>
                <h2 className="font-display font-bold text-base tracking-tight text-black">
                  Transaksi ({dateFilterMode === 'exact-date' ? formatDateIndo(selectedDate) : formatMonthYearIndo(selectedDate)})
                </h2>
              </div>
              <button
                onClick={() => navigateTo('catat-cepat')}
                className="font-display text-xs text-black font-bold underline decoration-2 hover:text-[#524584] transition-colors"
                type="button"
              >
                + Tambah Manual
              </button>
            </div>

            {groupedTransactions.length === 0 ? (
              <div className="bg-white rounded-2xl border-[2.5px] border-dashed border-black p-6 shadow-brutal flex flex-col items-center justify-center text-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-[#fef08a] border-2 border-black shadow-brutal-sm flex items-center justify-center">
                  <span className="material-symbols-outlined !text-[24px] text-black">post_add</span>
                </div>
                <span className="font-display font-extrabold text-sm text-black">
                  Belum Ada Transaksi pada {dateFilterMode === 'exact-date' ? formatDateIndo(selectedDate) : formatMonthYearIndo(selectedDate)}
                </span>
                <p className="font-body text-xs text-black/70 max-w-xs">
                  Atur dompet manual di bagian <strong>Dompet Saya</strong> di atas, lalu tekan tombol <strong>+</strong> untuk mencatat pengeluaran/pemasukan pada tanggal ini.
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {wallets.length === 0 && (
                    <button
                      type="button"
                      onClick={openAddWalletModal}
                      className="px-3.5 py-2 rounded-xl bg-[#fed7aa] border-2 border-black shadow-brutal-sm font-display font-extrabold text-xs text-black neo-btn"
                    >
                      + Buat Dompet Dulu
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => navigateTo('catat-cepat')}
                    className="px-4 py-2 rounded-xl bg-[#bef264] border-2 border-black shadow-brutal-sm font-display font-extrabold text-xs text-black neo-btn"
                  >
                    + Catat Transaksi
                  </button>
                </div>
              </div>
            ) : (
              groupedTransactions.map((group) => (
                <div key={group.date} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between px-0.5">
                    <span className="font-display text-[11px] font-bold uppercase tracking-wider text-black bg-[#fed7aa] px-2 py-0.5 rounded-lg border-[2px] border-black shadow-brutal-sm">
                      {group.label}
                    </span>
                    <span
                      className={`font-display text-xs font-bold ${
                        group.total < 0 ? 'text-[#ba1a1a]' : 'text-[#15803d]'
                      } bg-white px-2 py-0.5 rounded-lg border-[2px] border-black shadow-brutal-sm`}
                    >
                      {group.total < 0 ? '-' : '+'}Rp {formatIDR(group.total)}
                    </span>
                  </div>
                  <div className="flex flex-col bg-white rounded-2xl border-[2.5px] border-black shadow-brutal overflow-hidden divide-y-[2px] divide-black">
                    {group.items.map((tx) => {
                      const isPos = tx.amount > 0
                      return (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between p-3 hover:bg-[#fff7ed] transition-colors gap-2"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              style={{ backgroundColor: tx.iconBg }}
                              className="w-10 h-10 rounded-xl border-[2px] border-black shadow-brutal-sm flex items-center justify-center text-black shrink-0"
                            >
                              <span className="material-symbols-outlined !text-[20px]">{tx.icon}</span>
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-body font-bold text-sm text-black truncate">{tx.title}</span>
                              <span className="font-body text-xs text-black/70 font-semibold truncate">
                                {tx.category} • {tx.wallet}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <div
                              className={`px-2.5 py-1 ${
                                isPos ? 'bg-[#dcfce7]' : 'bg-[#fee2e2]'
                              } rounded-xl border-[2px] border-black shadow-brutal-sm`}
                            >
                              <span
                                className={`font-display text-xs ${
                                  isPos ? 'text-[#15803d]' : 'text-[#ba1a1a]'
                                } font-extrabold`}
                              >
                                {isPos ? '+' : '-'}Rp {formatIDR(tx.amount)}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteTransaction(tx.id)}
                              aria-label="Hapus transaksi"
                              className="w-7 h-7 rounded-lg bg-white border border-black flex items-center justify-center text-black/70 hover:text-[#ba1a1a] hover:bg-[#fee2e2]"
                            >
                              <span className="material-symbols-outlined !text-[15px]">delete</span>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <UnifiedBottomNav activeScreen={activeScreen} onNavigate={navigateTo} />
      {renderSharedModals()}
    </div>
  )
}
