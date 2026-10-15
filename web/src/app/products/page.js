import { formatPrice } from "../../lib/format.js";
import ProductCard from "../../components/ProductCard.js";


export default async function ProductsPage() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/`,{
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }
    const products = await res.json();

    return (
        <main>
            <h1> Products </h1>
            {products.length === 0 ? (<p>No Products found!</p>) 
            : (<div>{products.map((product)=>(<ProductCard key={product.id} product={product}/>))} </div>)}
        </main>
    )
}
