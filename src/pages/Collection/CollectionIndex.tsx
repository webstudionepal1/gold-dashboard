import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchFilterSort } from '../../components/global/SearchFilterSort';
import {
  IFetchCollection,
  useDeleteCollectionMutation,
  useGetAllCollectionsQuery,
} from '../../server/api/collectionHooks';
import MasterTable from '../../components/shared/MasterTable';
import Header from '../../components/shared/table_heading/Header';
import { get } from 'lodash';
import SafeImage from '../../components/ui/SafeImage';

// Filter and sort options for collections
const filterOptions = [
  { label: 'All Collections', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Featured', value: 'featured' },
  { label: 'Limited Edition', value: 'limited' },
  { label: 'Material', value: 'material' },
  { label: 'Gemstone', value: 'gemstone' },
  { label: 'Style', value: 'style' },
  { label: 'Occasion', value: 'occasion' },
];

const sortOptions = [
  { label: 'Name (A-Z)', value: 'name_asc' },
  { label: 'Name (Z-A)', value: 'name_desc' },
  { label: 'Created Date (Newest)', value: 'created_desc' },
  { label: 'Created Date (Oldest)', value: 'created_asc' },
  { label: 'Sort Order', value: 'sort_order' },
  { label: 'Total Products', value: 'products_desc' },
];

const CollectionIndex: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [sortValue, setSortValue] = useState('');

  // Fetch collections
  const { data: collections = [], isLoading } = useGetAllCollectionsQuery();
  const deleteCollectionMutation = useDeleteCollectionMutation();

  // Table columns configuration
  const columns = useMemo(
    () => [
      {
        key: 'name',
        title: 'Collection Name',
        width: '20%',
        render: (value: string, row: IFetchCollection) => (
          <div className="flex items-center gap-3">
            {row.images && row.images.length > 0 && (
              <SafeImage
                src={`${import.meta.env.VITE_API_IMAGE_BASE_URL}${
                  row.bannerImage
                }`}
                alt={row.name}
                className="w-10 h-10 rounded-lg object-cover cursor-default"
              />
            )}
            <div>
              <p className="font-medium text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{row.slug}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'collectionType',
        title: 'Type',
        width: '12%',
        render: (value: string) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
            {value?.replace('_', ' ') || 'Custom'}
          </span>
        ),
      },
      {
        key: 'collectionMode',
        title: 'Mode',
        width: '10%',
        render: (value: string) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
              value === 'automatic'
                ? 'bg-green-100 text-green-800'
                : value === 'hybrid'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        key: 'totalProducts',
        title: 'Products',
        width: '8%',
        render: (value: number) => (
          <span className="text-sm font-medium">{value || 0}</span>
        ),
      },
      {
        key: 'materialType',
        title: 'Material',
        width: '10%',
        render: (value: string) =>
          value ? (
            <span className="text-sm capitalize">
              {value?.replace('_', ' ') || value}
            </span>
          ) : (
            <span className="text-gray-400">-</span>
          ),
      },
      {
        key: 'gemstoneType',
        title: 'Gemstone',
        width: '10%',
        render: (value: string) =>
          value && value !== 'none' ? (
            <span className="text-sm capitalize">{value}</span>
          ) : (
            <span className="text-gray-400">-</span>
          ),
      },
      {
        key: 'isActive',
        title: 'Status',
        width: '8%',
        render: (value: boolean) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {value ? 'Active' : 'Inactive'}
          </span>
        ),
      },
      {
        key: 'isFeatured',
        title: 'Featured',
        width: '8%',
        render: (value: boolean) => (
          <div className="flex justify-center">
            {value ? (
              <Icon
                icon="material-symbols:star"
                className="w-5 h-5 text-yellow-500"
              />
            ) : (
              <Icon
                icon="material-symbols:star-outline"
                className="w-5 h-5 text-gray-300"
              />
            )}
          </div>
        ),
      },
      {
        key: 'isLimitedEdition',
        title: 'Limited',
        width: '8%',
        render: (value: boolean) => (
          <div className="flex justify-center">
            {value ? (
              <Icon
                icon="material-symbols:timer"
                className="w-5 h-5 text-orange-500"
              />
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        ),
      },
      {
        key: 'sortOrder',
        title: 'Order',
        width: '6%',
        render: (value: number) => (
          <span className="text-sm">{value || 0}</span>
        ),
      },
    ],
    []
  );

  // Filter and search logic
  const filteredAndSortedCollections = useMemo(() => {
    let filtered = collections;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (collection) =>
          collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          collection.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          collection.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filterValue) {
      filtered = filtered.filter((collection) => {
        switch (filterValue) {
          case 'active':
            return collection.isActive;
          case 'inactive':
            return !collection.isActive;
          case 'featured':
            return collection.isFeatured;
          case 'limited':
            return collection.isLimitedEdition;
          default:
            return collection.collectionType === filterValue;
        }
      });
    }

    // Apply sorting
    if (sortValue) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortValue) {
          case 'name_asc':
            return a.name.localeCompare(b.name);
          case 'name_desc':
            return b.name.localeCompare(a.name);
          case 'created_desc':
            return (
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
            );
          case 'created_asc':
            return (
              new Date(a.createdAt || 0).getTime() -
              new Date(b.createdAt || 0).getTime()
            );
          case 'sort_order':
            return (a.sortOrder || 0) - (b.sortOrder || 0);
          case 'products_desc':
            return (b.totalProducts || 0) - (a.totalProducts || 0);
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [collections, searchTerm, filterValue, sortValue]);

  // Convert to table format
  const tableData = useMemo(() => {
    return filteredAndSortedCollections.map((collection) => ({
      id: collection._id,
      ...collection,
    }));
  }, [filteredAndSortedCollections]);

  // Event handlers
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleFilter = useCallback((value: string) => {
    setFilterValue(value);
  }, []);

  const handleSort = useCallback((value: string) => {
    setSortValue(value);
  }, []);

  const handleEdit = useCallback(
    (collection: IFetchCollection) => {
      navigate(`/collection/edit/${collection._id}`);
    },
    [navigate]
  );

  const handleView = useCallback(
    (collection: IFetchCollection) => {
      navigate(`/collection/${collection._id}`);
    },
    [navigate]
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (window.confirm('Are you sure you want to delete this collection?')) {
        deleteCollectionMutation.mutate(id);
      }
    },
    [deleteCollectionMutation]
  );

  return (
    <div className="container mx-auto py-auto">
      <Header text="Collections">
        <Link to="/collection/add">
          <button className="bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-sm text-white px-4 py-2 flex items-center gap-2 rounded-lg transition-colors duration-200">
            <Icon icon="ic:outline-add" fontSize={18} />
            New Collection
          </button>
        </Link>
      </Header>
      <div className="p-4">
        <MasterTable
          columns={columns}
          onDelete={(id) => handleDelete(id)}
          editAction={handleEdit}
          viewAction={handleView}
          filterSection={
            <SearchFilterSort
              onSearch={handleSearch}
              onFilter={handleFilter}
              onSort={handleSort}
              onViewChange={() => {}}
              showFilter={true}
              showSort={true}
              showView={false}
              filterOptions={filterOptions}
              sortOptions={sortOptions}
              placeholder="Search collections..."
            />
          }
          rows={tableData}
          showAction
          loading={isLoading}
          emptyStateMessage="No collections found"
        />
      </div>
    </div>
  );
};

export default CollectionIndex;
