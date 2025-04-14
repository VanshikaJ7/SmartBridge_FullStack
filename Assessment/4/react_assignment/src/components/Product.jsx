import { Link } from "react-router-dom";

export default function Product({ product }) {
  return (
    <div className="bg-white p-4 shadow-lg rounded-lg">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
      <h2 className="text-xl font-bold">{product.name}</h2>
      <p className="text-gray-700">₹{product.price}</p>
      <Link to={`/products/${product.id}`} className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        View Details
      </Link>
    </div>
  );
}