import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function formatMoney(value) {
  return money.format(value || 0)
}

function getRoute() {
  const path = window.location.pathname.replace(/\/$/, '')
  const match = path.match(/^\/products\/([^/]+)$/)
  return match ? { page: 'detail', slug: decodeURIComponent(match[1]) } : { page: 'home' }
}

function App() {
  const [route, setRoute] = useState(getRoute)
  const [products, setProducts] = useState([])
  const [activeProduct, setActiveProduct] = useState(null)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const onPopState = () => setRoute(getRoute())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadProducts() {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(`${API_BASE_URL}/products`)
        if (!response.ok) throw new Error('Unable to fetch products')
        const result = await response.json()
        if (!ignore) setProducts(result.data || [])
      } catch (err) {
        if (!ignore) setError(err.message || 'Something went wrong')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadProducts()
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadProduct() {
      if (route.page !== 'detail') {
        setActiveProduct(null)
        setSelectedVariantIndex(0)
        return
      }

      const cachedProduct = products.find((product) => product.slug === route.slug)
      if (cachedProduct) {
        setActiveProduct(cachedProduct)
        setSelectedVariantIndex(0)
        return
      }

      try {
        setDetailLoading(true)
        setError('')
        const response = await fetch(`${API_BASE_URL}/products/${route.slug}`)
        if (!response.ok) throw new Error('Product not found')
        const result = await response.json()
        if (!ignore) {
          setActiveProduct(result.data)
          setSelectedVariantIndex(0)
        }
      } catch (err) {
        if (!ignore) {
          setActiveProduct(null)
          setError(err.message || 'Something went wrong')
        }
      } finally {
        if (!ignore) setDetailLoading(false)
      }
    }

    loadProduct()
    return () => {
      ignore = true
    }
  }, [products, route])

  function navigate(path) {
    window.history.pushState({}, '', path)
    setRoute(getRoute())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const productForDetail = activeProduct || products.find((product) => product.slug === route.slug)
  const selectedVariant = productForDetail?.variants?.[selectedVariantIndex] || productForDetail?.variants?.[0]
  const bestPlan = useMemo(() => {
    return selectedVariant?.emiplans?.reduce((lowest, plan) => {
      if (!lowest) return plan
      return plan.monthlyPayment < lowest.monthlyPayment ? plan : lowest
    }, null)
  }, [selectedVariant])

  if (route.page === 'detail') {
    return (
      <ProductDetail
        product={productForDetail}
        selectedVariant={selectedVariant}
        selectedVariantIndex={selectedVariantIndex}
        setSelectedVariantIndex={setSelectedVariantIndex}
        bestPlan={bestPlan}
        loading={detailLoading || (!productForDetail && loading)}
        error={error}
        onBack={() => navigate('/')}
      />
    )
  }

  return (
    <ProductList
      products={products}
      loading={loading}
      error={error}
      onOpen={(slug) => navigate(`/products/${slug}`)}
    />
  )
}

function ProductList({ products, loading, error, onOpen }) {
  return (
    <main className="app-shell">
      <header className="store-header">
        <div>
          <p className="eyebrow">EMI Store - Smartphones on EMI</p>
          <h1>Choose your phone</h1>
        </div>
        <div className="trust-strip" aria-label="Shopping benefits">
          <span>No-cost EMI</span>
          <span>Instant approval</span>
          <span>Cashback offers</span>
        </div>
      </header>

      {error && <StatusMessage title="Could not load products" message={error} />}
      {loading && <ProductSkeleton />}

      {!loading && !error && (
        <section className="product-grid" aria-label="Available phones">
          {products.map((product) => {
            const firstVariant = product.variants?.[0]
            const startingPlan = firstVariant?.emiplans?.at(-1)
            const discount = Math.max((firstVariant?.mrp || 0) - (firstVariant?.price || 0), 0)

            return (
              <button
                className="product-card"
                key={product.slug}
                type="button"
                onClick={() => onOpen(product.slug)}
              >
                <span className="brand">{product.brand}</span>
                <div className="phone-image-wrap">
                  <img src={firstVariant?.image} alt={product.name} />
                </div>
                <div className="product-card-copy">
                  <h2>{product.name}</h2>
                  <p>{firstVariant?.color} | {firstVariant?.storage}</p>
                </div>
                <div className="price-row">
                  <strong>{formatMoney(firstVariant?.price)}</strong>
                  <span>{formatMoney(firstVariant?.mrp)}</span>
                </div>
                <div className="card-footer">
                  <span>From {formatMoney(startingPlan?.monthlyPayment)}/mo</span>
                  {discount > 0 && <b>Save {formatMoney(discount)}</b>}
                </div>
              </button>
            )
          })}
        </section>
      )}
    </main>
  )
}

function ProductDetail({
  product,
  selectedVariant,
  selectedVariantIndex,
  setSelectedVariantIndex,
  bestPlan,
  loading,
  error,
  onBack,
}) {
  if (loading) {
    return (
      <main className="app-shell">
        <button className="back-button" type="button" onClick={onBack}>Back</button>
        <ProductSkeleton />
      </main>
    )
  }

  if (error || !product || !selectedVariant) {
    return (
      <main className="app-shell">
        <button className="back-button" type="button" onClick={onBack}>Back</button>
        <StatusMessage title="Product unavailable" message={error || 'This product could not be found.'} />
      </main>
    )
  }

  const savings = Math.max((selectedVariant.mrp || 0) - (selectedVariant.price || 0), 0)

  return (
    <main className="app-shell detail-shell">
      <button className="back-button" type="button" onClick={onBack}>Back</button>

      <section className="detail-hero">
        <div className="detail-media">
          <img src={selectedVariant.image} alt={`${product.name} in ${selectedVariant.color}`} />
        </div>

        <div className="detail-copy">
          <p className="eyebrow">{product.brand}</p>
          <h1>{product.name}</h1>
          <p className="selected-line">{selectedVariant.color} | {selectedVariant.storage}</p>

          <div className="detail-price">
            <strong>{formatMoney(selectedVariant.price)}</strong>
            <span>{formatMoney(selectedVariant.mrp)}</span>
            {savings > 0 && <b>{formatMoney(savings)} off</b>}
          </div>

          <div className="variant-panel">
            <div className="section-heading">
              <h2>Color and variant</h2>
              <span>{product.variants.length} options</span>
            </div>
            <div className="variant-options">
              {product.variants.map((variant, index) => (
                <button
                  className={`variant-button ${index === selectedVariantIndex ? 'active' : ''}`}
                  key={`${variant.color}-${variant.storage}`}
                  type="button"
                  onClick={() => setSelectedVariantIndex(index)}
                >
                  <span className="swatch" style={{ background: colorToSwatch(variant.color) }} />
                  <span>
                    <strong>{variant.color}</strong>
                    <small>{variant.storage}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {bestPlan && (
            <div className="approval-band">
              <span>Best monthly plan</span>
              <strong>{formatMoney(bestPlan.monthlyPayment)}/mo for {bestPlan.tenure} months</strong>
            </div>
          )}
        </div>
      </section>

      <section className="emi-section">
        <div className="section-heading">
          <h2>EMI plans</h2>
          <span>Based on selected color and storage</span>
        </div>

        <div className="emi-grid">
          {selectedVariant.emiplans.map((plan) => (
            <article className="emi-card" key={`${selectedVariant.color}-${plan.tenure}`}>
              <div>
                <p>{plan.tenure} months</p>
                <h3>{formatMoney(plan.monthlyPayment)}</h3>
                <span>per month</span>
              </div>
              <dl>
                <div>
                  <dt>Interest</dt>
                  <dd>{plan.interestRate === 0 ? 'No cost' : `${plan.interestRate}%`}</dd>
                </div>
                <div>
                  <dt>Cashback</dt>
                  <dd>{formatMoney(plan.cashback)}</dd>
                </div>
                <div>
                  <dt>Total Repayment</dt>
                  <dd>{formatMoney(plan.monthlyPayment * plan.tenure - plan.cashback)}</dd>
                </div>
              </dl>
              <button type="button">Select plan</button>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

function ProductSkeleton() {
  return (
    <section className="product-grid loading-grid" aria-label="Loading products">
      {[1, 2, 3].map((item) => (
        <div className="product-card skeleton-card" key={item}>
          <span />
          <div />
          <p />
          <p />
        </div>
      ))}
    </section>
  )
}

function StatusMessage({ title, message }) {
  return (
    <section className="status-message">
      <h2>{title}</h2>
      <p>{message}</p>
      <p>Make sure the backend server is running on port 5000.</p>
    </section>
  )
}

function colorToSwatch(color) {
  const value = color.toLowerCase()
  if (value.includes('silver')) return '#d9dde4'
  if (value.includes('blue')) return '#173c72'
  if (value.includes('violet')) return '#7d6ba6'
  if (value.includes('dawn')) return '#f0eee6'
  return '#17191f'
}

export default App
