import product1 from "../assets/product1.jpg";
import product2 from "../assets/product2.jpg";
import product3 from "../assets/product3.jpg";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Product from "../components/Product";

const products = [
  { id: 1, name: "Urban Terrain Steel Mountain Bike", price: 2039, image: product1 },
  { id: 2, name: "East Coast Premium City Bike", price: 2999, image: product2 },
  { id: 3, name: "VESCO Envy Black City Cycle", price: 3999, image: product3 },
];

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6">Our Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}