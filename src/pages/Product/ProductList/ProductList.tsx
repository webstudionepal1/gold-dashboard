import React, { useState, useCallback, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { SearchFilterSort } from '../../../components/global/SearchFilterSort';
import { useNavigate } from 'react-router-dom';
import ArrowIcon from './component/ArrowIcon';

// Updated Product interface to match ProductDescription
interface Product {
    id: string;
    title: string;
    price: number;
    originalPrice: number;
    rating: number;
    category: string;
    onSale: boolean;
    image: string;
    status?: string;           // Added optional status
    description?: string;      // Added optional description
}

const ProductList: React.FC = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[]>([
        // Updated initial data with description
        ...Array(8).fill(null).map((_, index) => ({
            id: (index + 1).toString(),
            title: "Gold Studs",
            price: 1425.0,
            originalPrice: 1420.0,
            rating: 3,
            category: "Gold",
            onSale: true,
            image: "https://media.istockphoto.com/id/154956296/photo/gold-ring.jpg?b=1&s=612x612&w=0&k=20&c=Kl8MUlh_s8ECE2nSpKqSX9OE4DiJSOUWTk5iTWRuDY8=",
            status: 'Active',
            description: "Elegant gold studs perfect for any occasion. Crafted with 18K gold and featuring a secure clasp."
        }))
    ]);
    const [filteredData, setFilteredData] = useState<Product[]>(products);
    const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
        title: '',
        price: 0,
        originalPrice: 0,
        rating: 0,
        category: '',
        onSale: false,
        image: '',
        status: '',
        description: ''
    });

    useEffect(() => {
        setFilteredData(products);
    }, [products]);

    const handleSearch = useCallback((query: string) => {
        const filtered = products.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
        );
        setFilteredData(filtered);
    }, [products]);

    const handleFilter = useCallback((filter: string) => {
        const filtered = filter
            ? products.filter(item => item.category === filter || item.status === filter)
            : products;
        setFilteredData(filtered);
    }, [products]);

    const handleSort = useCallback((sort: string) => {
        const dataToSort = [...filteredData];
        switch (sort) {
            case 'title_asc':
                dataToSort.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title_desc':
                dataToSort.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'price_asc':
                dataToSort.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                dataToSort.sort((a, b) => b.price - a.price);
                break;
            case 'rating_asc':
                dataToSort.sort((a, b) => a.rating - b.rating);
                break;
            case 'rating_desc':
                dataToSort.sort((a, b) => b.rating - a.rating);
                break;
        }
        setFilteredData(dataToSort);
    }, [filteredData]);

    const filterOptions = [
        { value: '', label: 'All' },
        { value: 'Gold', label: 'Gold' },
        { value: 'Silver', label: 'Silver' },
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
    ];

    const sortOptions = [
        { value: 'title_asc', label: 'Title (A-Z)' },
        { value: 'title_desc', label: 'Title (Z-A)' },
        { value: 'price_asc', label: 'Price (Low-High)' },
        { value: 'price_desc', label: 'Price (High-Low)' },
        { value: 'rating_asc', label: 'Rating (Low-High)' },
        { value: 'rating_desc', label: 'Rating (High-Low)' }
    ];

    const handleAddProduct = () => {
        setNewProduct({
            title: '',
            price: 0,
            originalPrice: 0,
            rating: 0,
            category: '',
            onSale: false,
            image: '',
            status: '',
            description: ''
        });
        setIsEditing(false);
    };

    const handleCardClick = (product: Product) => {
        // Pass the entire product object as state
        navigate(`/product/${product.id}`, { state: { product } });
    };

    return (
        <div className="container mx-auto pl-10 pr-4 py-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                <button
                    onClick={handleAddProduct}
                    className="bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-white px-4 py-2 flex rounded-lg transition-colors duration-200"
                >
                    <Icon icon="ic:outline-add" fontSize={24} />New Product
                </button>
            </div>

            <div className='bg-white p-4'>
                <SearchFilterSort
                    onSearch={handleSearch}
                    onFilter={handleFilter}
                    onSort={handleSort}
                    onViewChange={() => { }}
                    showFilter={true}
                    showSort={true}
                    showView={true}
                    filterOptions={filterOptions}
                    sortOptions={sortOptions}
                    placeholder="Search products..."
                />

                <div className='grid grid-cols-4 w-auto gap-3'>
                    {filteredData.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-sm overflow-hidden h-80 flex flex-col cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleCardClick(product)}
                        >
                            <div className='flex justify-between my-4'>
                                <div className="flex flex-col gap-6">
                                    <ArrowIcon />
                                </div>
                                <span className="text-xs text-white font-medium rounded-sm bg-lightbrown py-1 px-2">Sale</span>
                            </div>
                            <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.title}
                                className="object-contain w-auto h-auto"
                            />
                            <span className="text-sm font-medium text-brown bg-brown bg-opacity-'status bg-opacity-40 flex justify-center">
                                {product.category}
                            </span>
                            <div className="flex justify-between px-2 items-center mb-2">
                                <h3 className="text-md font-medium text-black">{product.title}</h3>
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Icon
                                            key={i}
                                            icon={i < product.rating ? "mdi:star" : "mdi:star-outline"}
                                            className={`w-4 h-4 ${i < product.rating ? "text-yellow" : "text-gray-300"}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                                {product.onSale && (
                                    <span className="text-[#C2BDBA] line-through text-sm">
                                        ${product.originalPrice.toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

};

export default ProductList;