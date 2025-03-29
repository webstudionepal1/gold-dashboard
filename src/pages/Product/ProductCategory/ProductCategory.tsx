import React, { useState, useCallback, useEffect } from 'react';
import { Table } from '../../../components/shared/Table';
import { SearchFilterSort } from '../../../components/global/SearchFilterSort';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useOutsideClick } from '../../../hooks/UseOutsideClick';
import { AddProductCategory } from './components/AddProductCategory';

interface ProductSubcategory {
    _id: string;
    category: string;
    subcategory: string;
    description: string;
    totalProducts?: number;
    status: 'Active' | 'Inactive';
    isActive?: boolean;
}

export const ProductCategory: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    //use ref to close the window
    const modalRef = useOutsideClick(() => setIsModalOpen(false))

    const [selectedSubcategory, setSelectedSubcategory] = useState<ProductSubcategory | null>(null);
    
    const [productSubcategories, setProductSubcategories] = useState<ProductSubcategory[]>([
        {
            _id: "1",
            category: "category 1",
            subcategory: 'Subcategory 1',
            description: 'Description 1',
            totalProducts: 15,
            status: 'Active',
            isActive: true
        },
        {
            _id: "2",
            category: "category 2",
            subcategory: 'Subcategory 2',
            description: 'Description 2',
            totalProducts: 8,
            status: 'Inactive',
            isActive: false
        },
    ]);


    const [filteredData, setFilteredData] = useState<ProductSubcategory[]>(productSubcategories);


    useEffect(() => {
        setFilteredData(productSubcategories);
    }, [productSubcategories]);

    const handleSearch = useCallback((query: string) => {
        const filtered = productSubcategories.filter(item =>
            item.category.toLowerCase().includes(query.toLowerCase()) ||
            item.subcategory.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(filtered);
    }, [productSubcategories]);

    const handleFilter = useCallback((filter: string) => {
        const filtered = filter
            ? productSubcategories.filter(item => item.status === filter)
            : productSubcategories;
        setFilteredData(filtered);
    }, [productSubcategories]);

    const handleSort = useCallback((sort: string) => {
        const dataToSort = [...filteredData];
        switch (sort) {
            case 'category_asc':
                dataToSort.sort((a, b) => a.category.localeCompare(b.category));
                break;
            case 'category_desc':
                dataToSort.sort((a, b) => b.category.localeCompare(a.category));
                break;
            case 'subcategory_asc':
                dataToSort.sort((a, b) => a.subcategory.localeCompare(b.subcategory));
                break;
            case 'subcategory_desc':
                dataToSort.sort((a, b) => b.subcategory.localeCompare(a.subcategory));
                break;
            case 'products_asc':
                dataToSort.sort((a, b) => (a.totalProducts || 0) - (b.totalProducts || 0));
                break;
            case 'products_desc':
                dataToSort.sort((a, b) => (b.totalProducts || 0) - (a.totalProducts || 0));
                break;
        }
        setFilteredData(dataToSort);
    }, [filteredData]);

    const filterOptions = [
        { value: '', label: 'All' },
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
    ];

    const sortOptions = [
        { value: 'category_asc', label: 'Category (A-Z)' },
        { value: 'category_desc', label: 'Category (Z-A)' },
        { value: 'subcategory_asc', label: 'Subcategory (A-Z)' },
        { value: 'subcategory_desc', label: 'Subcategory (Z-A)' },
        { value: 'products_asc', label: 'Products (Low-High)' },
        { value: 'products_desc', label: 'Products (High-Low)' }
    ];

 

 


    const handleToggleStatus = (row: ProductSubcategory) => {
        setProductSubcategories(prev =>
            prev.map(subcategory =>
                subcategory._id === row._id
                    ? {
                        ...subcategory,
                        status: subcategory.status === 'Active' ? 'Inactive' : 'Active',
                        isActive: !subcategory.isActive
                    }
                    : subcategory
            )
        );
    };

    const tableColumns = [
        {
            header: 'Category',
            key: 'category',
            render: (value: string) => <span className="font-medium">{value}</span>
        },
        {
            header: 'Subcategory',
            key: 'subcategory',
            render: (value: string) => <span className="font-medium">{value}</span>
        },
        {
            header: 'Description',
            key: 'description',
            render: (value: string) => <span className="text-gray-600">{value}</span>
        },
        {
            header: 'Total Products',
            key: 'totalProducts',
            render: (value: number) => <span className="font-medium">{value || 0}</span>
        },
        {
            header: 'Status',
            key: 'status',
            render: (_: any, row: ProductSubcategory) => (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}
                >
                    {row.status}
                </span>
            )
        }
    ];

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Product Category</h1>
                <button
                    onClick={()=>{setIsModalOpen(true); setSelectedSubcategory(null)}}
                    className="bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-white px-4 py-2 flex gap-2 rounded-lg transition-colors duration-200"
                >
                    <Icon icon="ic:outline-add" fontSize={24} />New Category
                </button>
            </div>
            <div className='bg-white p-4'>
                <SearchFilterSort
                    onSearch={handleSearch}
                    onFilter={handleFilter}
                    onSort={handleSort}
                    filterOptions={filterOptions}
                    sortOptions={sortOptions}
                    placeholder="Search here"
                    showFilter={true}
                    showSort={true}
                    showView={false}
                />

                <Table
                    columns={tableColumns}
                    data={filteredData}
                    onButtonClick={setSelectedSubcategory}
                    showEdit={true}
                    editRow={(row) => {
                        setSelectedSubcategory(row);
                        setIsModalOpen(true);
                    }}
                    showDelete={true}
                    showToggle={true}
                    onToggle={handleToggleStatus}
                    showPagination={true}
                    paginationDetails={{
                        currentPage: 1,
                        limit: 10,
                        totalCount: filteredData.length
                    }}
                    onItemsPerPageChange={() => { }}
                    onPageChange={() => { }}
                />
            </div>
            {isModalOpen && (
               <AddProductCategory  modalRef={modalRef} setOpenModal={setIsModalOpen} editData={selectedSubcategory}/>
            )}
        </div>
    );
};
