import React, { useState, useCallback, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { SearchFilterSort } from '../../../components/global/SearchFilterSort';
import { useNavigate } from 'react-router-dom';
import { ProductGridView } from './component/GridView';
import { filterOptions, sortOptions } from '../../../constants/DropDownOptions';
import AddProductDialog from './component/AddproductDialog';

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
    const [addProductDialog, setAddProductDialog] = useState<boolean>(false);
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


    const handleAddProduct = () => {
        // setNewProduct({
        //     title: '',
        //     price: 0,
        //     originalPrice: 0,
        //     rating: 0,
        //     category: '',
        //     onSale: false,
        //     image: '',
        //     status: '',
        //     description: ''
        // });
        setAddProductDialog(true);
        setIsEditing(false);
    };

    const handleDialogClose = () => {
        setAddProductDialog(false);
    }

    const handleAddSubmit = () => {
        console.log("submitted");
    }
    const handleCardClick = (product: Product) => {
        navigate(`/product/${product.id}`, { state: { product } });
    };

    return (
        <div className="container pl-10 pr-4 mx-auto py-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                <button
                    onClick={handleAddProduct}
                    className="bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-white px-4 py-2 flex rounded-lg transition-colors duration-200"
                >
                    <Icon icon="ic:outline-add" fontSize={24} />New Product
                </button>
            </div>

            <div className='p-4 bg-white'>
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

                <ProductGridView filteredData={filteredData} handleCardClick={handleCardClick} />
            </div>
            {addProductDialog &&
                <AddProductDialog onClose={handleDialogClose} onSubmit={handleAddSubmit} />
            }
        </div>
    );

};

export default ProductList;