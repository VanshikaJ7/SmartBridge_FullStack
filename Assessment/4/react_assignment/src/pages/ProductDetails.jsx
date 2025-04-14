import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import product1 from "../assets/product1.jpg";
import product2 from "../assets/product2.jpg";
import product3 from "../assets/product3.jpg";


const products = [
  { id: 1, name: "Urban Terrain Steel Mountain Bike", price: 2039, image: product1 },
  { id: 2, name: "East Coast Premium City Bike", price: 2999, image: product2 },
  { id: 3, name: "VESCO Envy Black City Cycle", price: 3999, image: product3 },
];

export default function ProductDetails() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4 flex-grow">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={product.image}
            alt={product.name}
            className="w-full md:w-1/2 h-auto object-cover rounded-lg shadow-lg"
          />
          <div className="w-full md:w-1/2">
            <p className="text-gray-700 mb-4">{product.description}</p>
            <p className="text-2xl font-bold">₹{product.price.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}