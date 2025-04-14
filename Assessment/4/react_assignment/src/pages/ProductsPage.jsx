import { Link } from "react-router-dom";
import product1 from "../assets/product1.jpg";
import product2 from "../assets/product2.jpg";
import product3 from "../assets/product3.jpg";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const products = [
  { id: 1, name: "Urban Terrain Steel Mountain Bike", price: 2039, image: product1 },
  { id: 2, name: "East Coast Premium City Bike", price: 2999, image: product2 },
  { id: 3, name: "VESCO Envy Black City Cycle", price: 3999, image: product3 },
];

export default function ProductsPage() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6">All Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 shadow-lg rounded-lg">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p className="text-gray-700">₹{product.price.toLocaleString("en-IN")}</p>
              <Link
                to={`/products/${product.id}`}
                className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}