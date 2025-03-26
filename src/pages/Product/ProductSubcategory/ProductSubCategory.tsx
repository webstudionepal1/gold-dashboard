import React, { useState, useCallback, useEffect } from 'react';
import { Modal } from '../../../components/shared';
import { Table } from '../../../components/shared/Table';
import { SearchFilterSort } from '../../../components/global/SearchFilterSort';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useOutsideClick } from '../../../hooks/UseOutsideClick';


interface ProductSubcategory {
    _id: string;
    name: string;
    description: string;
    totalProducts?: number;
    status: 'Active' | 'Inactive';
    isActive?: boolean;
}

const Productsubcategory: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useOutsideClick(() => setIsModalOpen(false))
    const [isEditing, setIsEditing] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState<ProductSubcategory | null>(null);
    const [productSubcategories, setProductSubcategories] = useState<ProductSubcategory[]>([
        {
            _id: "1",
            name: 'Subcategory 1',
            description: 'Description 1',
            totalProducts: 15,
            status: 'Active',
            isActive: true
        },
        {
            _id: "2",
            name: 'Subcategory 2',
            description: 'Description 2',
            totalProducts: 8,
            status: 'Inactive',
            isActive: false
        },
    ]);
    const [filteredData, setFilteredData] = useState<ProductSubcategory[]>(productSubcategories);
    const [newSubcategory, setNewSubcategory] = useState<Omit<ProductSubcategory, '_id'>>({
        name: '',
        description: '',
        totalProducts: 0,
        status: 'Active',
        isActive: true
    });
    const [formErrors, setFormErrors] = useState<{ name?: string; description?: string }>({});

    // Sync filtered data when productSubcategories changes
    useEffect(() => {
        setFilteredData(productSubcategories);
    }, [productSubcategories]);

    // Search handler
    const handleSearch = useCallback((query: string) => {
        const filtered = productSubcategories.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(filtered);
    }, [productSubcategories]);

    // Filter handler
    const handleFilter = useCallback((filter: string) => {
        const filtered = filter
            ? productSubcategories.filter(item => item.status === filter)
            : productSubcategories;
        setFilteredData(filtered);
    }, [productSubcategories]);

    // Sort handler
    const handleSort = useCallback((sort: string) => {
        const dataToSort = [...filteredData];
        switch (sort) {
            case 'name_asc':
                dataToSort.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name_desc':
                dataToSort.sort((a, b) => b.name.localeCompare(a.name));
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
        { value: 'name_asc', label: 'Name (A-Z)' },
        { value: 'name_desc', label: 'Name (Z-A)' },
        { value: 'products_asc', label: 'Products (Low-High)' },
        { value: 'products_desc', label: 'Products (High-Low)' }
    ];

    const validateForm = () => {
        const errors: { name?: string; description?: string } = {};
        if (!newSubcategory.name.trim()) {
            errors.name = 'Name is required';
        }
        if (!newSubcategory.description.trim()) {
            errors.description = 'Description is required';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddSubcategory = () => {
        setNewSubcategory({
            name: '',
            description: '',
            totalProducts: 0,
            status: 'Active',
            isActive: true
        });
        setIsEditing(false);
        setFormErrors({});
        setIsModalOpen(true);
    };

    const handleEditSubcategory = (row: ProductSubcategory) => {
        setNewSubcategory({
            name: row.name,
            description: row.description,
            totalProducts: row.totalProducts || 0,
            status: row.status,
            isActive: row.isActive
        });
        setSelectedSubcategory(row);
        setIsEditing(true);
        setFormErrors({});
        setIsModalOpen(true);
    };

    const handleSaveSubcategory = () => {
        if (validateForm()) {
            if (isEditing && selectedSubcategory) {
                // Update existing subcategory
                setProductSubcategories(prev =>
                    prev.map(subcategory =>
                        subcategory._id === selectedSubcategory._id
                            ? { ...subcategory, ...newSubcategory }
                            : subcategory
                    )
                );
            } else {
                // Add new subcategory
                const updatedSubcategories = [
                    ...productSubcategories,
                    {
                        ...newSubcategory,
                        _id: Date.now().toString(),
                    },
                ];
                setProductSubcategories(updatedSubcategories);
            }
            setIsModalOpen(false);
            setIsEditing(false);
            setSelectedSubcategory(null);
        }
    };

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
            header: 'Subcategory',
            key: 'name',
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
                <h1 className="text-2xl font-bold text-gray-800">Product Subcategories</h1>
                <button
                    onClick={handleAddSubcategory}
                    className="bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-white px-4 py-2 flex rounded-lg transition-colors duration-200"
                >
                    <Icon icon="ic:outline-add" fontSize={24} />New Subcategory
                </button>
            </div>

            <SearchFilterSort
                onSearch={handleSearch}
                onFilter={handleFilter}
                onSort={handleSort}
                filterOptions={filterOptions}
                sortOptions={sortOptions}
                placeholder="Search here"
            />

            <Table
                columns={tableColumns}
                data={filteredData}
                onButtonClick={setSelectedSubcategory}
                showEdit={true}
                editRow={handleEditSubcategory}
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

            {isModalOpen && (
                <Modal classname="w-[300px]" ref={modalRef}>
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-6">
                            {isEditing ? 'Edit Subcategory' : 'Add New Subcategory'}
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Sub-category
                                </label>
                                <input
                                    id="sub-category"
                                    type="text"
                                    value={newSubcategory.name}
                                    onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                                    className={`border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.name ? 'border-red-500' : ''}`}
                                    placeholder="Enter subcategory name"
                                />
                                {formErrors.name && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    id="description"
                                    value={newSubcategory.description}
                                    onChange={(e) => setNewSubcategory({ ...newSubcategory, description: e.target.value })}
                                    className={`border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.description ? 'border-red-500' : ''}`}
                                    rows={3}
                                    placeholder="Enter description"
                                />
                                {formErrors.description && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-between gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveSubcategory}
                                className="px-7 py-2 bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-white rounded-md text-sm font-medium transition-colors duration-200"
                            >
                                {isEditing ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Productsubcategory;