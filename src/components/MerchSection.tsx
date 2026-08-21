import { merchItems, amazeStoreUrl } from './merchData';

export default function MerchSection() {
  return (
    <section className="merch-section">
      <div className="section-header">
        <h2>Merchandise</h2>
        <a href={amazeStoreUrl} target="_blank" rel="noopener noreferrer" className="view-all-link">
          View Full Store →
        </a>
      </div>

      <div className="merch-grid">
        {merchItems.map((item) => (
          <div key={item.id} className="merch-card">
            <div className="image-container">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="merch-info">
              <h3>{item.name}</h3>
              <p className="category">{item.category}</p>
              <p className="price">${item.price.toFixed(2)}</p>
              
              <div className="merch-actions">
                <a 
                  href={item.itemUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-view"
                >
                  View Item
                </a>
                <a 
                  href={item.itemUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-buy"
                >
                  Buy Now
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
