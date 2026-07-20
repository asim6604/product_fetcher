import { useEffect, useState } from "react"
import axios from "axios"

function App() {
  const [products, setProducts] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [query, setQuery] = useState("")

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err))
  }, [])

  const handleSearch = async () => {
    const res = await axios.get(`http://localhost:5000/api/products/search?q=${query}`)
    setSearchResults(res.data)
  }

  const displayProducts = searchResults.length > 0 ? searchResults : products

  return (
    <div style={{ padding: "20px" }}>
      <h1>Clothing Store</h1>
      
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        style={{ padding: "10px", width: "300px", marginBottom: "20px" }}
      />
      <button onClick={handleSearch} style={{ padding: "10px 20px" }}>Search</button>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "20px" }}>
        {displayProducts.map((product, index) => (
          <div key={index} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
            <h3>{product.title || product.metadata?.title}</h3>
            <p>{product.category || product.metadata?.category}</p>
            <a href={product.url || product.metadata?.url} target="_blank">View Product</a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App