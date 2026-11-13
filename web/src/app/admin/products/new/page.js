import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage(){
    return(
        <section>
            <h1 className = "page-title">Add Product</h1>
            <ProductForm />
        </section>
    )
}