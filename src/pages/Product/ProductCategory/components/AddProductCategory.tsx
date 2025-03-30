import { Modal } from "../../../../components/shared"
import { useForm } from '@tanstack/react-form';


interface propTypes{
    modalRef: React.RefObject<HTMLDivElement | null>
    editData?: any
    setOpenModal:React.Dispatch<React.SetStateAction<boolean>>
}

export const AddProductCategory = ({modalRef,editData ,setOpenModal}: propTypes) => {
    
    // const form=useForm
      const form = useForm({
          defaultValues: {
              category: editData?.category ??" ",
              subcategory: editData?.subcategory ??" ",
              description:editData?.description ??" ",
        },
        validators: {
        },

    onSubmit: async ({ value }) => {
        console.log(value)
    },
  });

    return   <Modal classname='w-[450px]' ref={modalRef}>
                    
                
        <form className="p-6" onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
                }}>
                        <h2 className="text-xl font-semibold mb-6">
                            {editData ? 'Edit Category' : 'Add New Category'}
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                    </label>
                    <form.Field name="category">
                        {(field) => (
                                <input
                                    id="category"
                                    type="text"
                                    value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                    className={`border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500}`}
                                    placeholder="Enter Category name"
                                    />
                                    )}
                                    </form.Field>
                            </div>
                            <div>
                                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                                    Subcategory
                    </label>
                    <form.Field name="subcategory">
                        {(field) => (
                                <input
                                    id="subcategory"
                                    type="text"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className={`border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                    placeholder="Enter Subcategory name"
                                />
                                  )}
                    </form.Field>
                               
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                    </label>
                    <form.Field name="description">
                        {(field) => (
                            
                        
                                <textarea
                                    id="description"
                                    value={field.state.value}
                                onChange={(e) =>field.handleChange(e.target.value)}
                                    className={`border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                    rows={3}
                                    placeholder="Enter short description"
                            />
                            )}
                    </form.Field>
                              
                            </div>
                        </div>
                        <div className="mt-6 flex justify-between gap-3">
                <button
                    type="button"
                                onClick={() => setOpenModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                               type='submit'
                                className="px-7 py-2 bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-white rounded-md text-sm font-medium transition-colors duration-200"
                            >
                                {editData ? 'Update' : 'Add'}
                            </button>
                        </div>
        </form>
        </Modal>
}