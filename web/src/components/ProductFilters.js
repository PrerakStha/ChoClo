import Link from "next/link";

export default function ProductFilters({ params, categories }) {
  return (
    // the key remounts the form whenever the URL changes, so the fields always match it
    <form key={JSON.stringify(params)} method="get" action="/products" className="filters">
      <input
        type="search"
        name="search"
        placeholder="Search products"
        aria-label="Search products"
        defaultValue={params.search ?? ""}
      />

      <select name="category" aria-label="Category" defaultValue={params.category ?? ""}>
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>{c.name}</option>
        ))}
      </select>

      <input
        type="number"
        name="minPrice"
        min="0"
        inputMode="numeric"
        placeholder="Min NPR"
        aria-label="Minimum price in rupees"
        defaultValue={params.minPrice ?? ""}
      />
      <input
        type="number"
        name="maxPrice"
        min="0"
        inputMode="numeric"
        placeholder="Max NPR"
        aria-label="Maximum price in rupees"
        defaultValue={params.maxPrice ?? ""}
      />

      <select name="sort" aria-label="Sort by" defaultValue={params.sort ?? "newest"}>
        <option value="newest">Newest</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
        <option value="name-asc">Name: A to Z</option>
      </select>

      <label className="filters-check">
        <input
          type="checkbox"
          name="inStock"
          value="1"
          defaultChecked={params.inStock === "1"}
        />
        In stock
      </label>

      <button type="submit" className="btn-small">Apply</button>
      <Link href="/products" className="link-btn">Clear</Link>
    </form>
  );
}