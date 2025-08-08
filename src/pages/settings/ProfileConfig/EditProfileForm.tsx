import { useForm } from '@tanstack/react-form';
import { AnyActionArg, useEffect, useMemo } from 'react';
import Breadcrumbs from '../../../components/shared/Breadcrumb';
import { DropdownField } from '../../../components/shared/form_components/Dropdown';
import MultiImageUploader from '../../../components/shared/form_components/FileDropInput';
import { InputField } from '../../../components/shared/form_components/InputField';
import Header from '../../../components/shared/table_heading/Header';
import {
  IFetchCompany,
  useCreateCompanyDetailsMutation,
  useGetCompanyDetailsQuery,
  useUpdateCompanyDetailsMutation,
} from '../../../server/api/companyHooks';
import { FieldError } from '../../auth/LoginPage';
import { generateProfileValue, IProfileValue } from '../profileObj';
import { get } from 'lodash';

const defaultValues = {
  _id: '',
  name: '',
  ownerNo: '',
  address: '',
  email: '',
  phone: '',
  description: '',
  registrationNo: '',
  city: '',
  zipCode: '',
  openDay: '',
  openTime: '',
  closeTime: '',
  paymentMode: '',
  bankName: '',
  accountNo: '',
  accountHolder: '',
  companyName: '',
  branch: '',
  logo: null,
  qr: [],
  existingQr: '',
};

const EditProfileForm = () => {
  const { data, isLoading, isSuccess } = useGetCompanyDetailsQuery();
  const { mutate: updateProfile, isPending } =
    useUpdateCompanyDetailsMutation();

  const { mutateAsync: createCompanyDetails } =
    useCreateCompanyDetailsMutation();
  const companyData: IFetchCompany = useMemo(() => {
    if (isSuccess) {
      return data?.length > 0 ? data[0] : defaultValues;
    }
    return defaultValues;
  }, [isSuccess, data]);

  const form = useForm({
    defaultValues: generateProfileValue(companyData) as IProfileValue,
    onSubmit: async ({ value }: { value: any }) => {
      const obj = [
        'companyName',
        'name',
        'ownerNo',
        'address',
        'email',
        'phone',
        'description',
        'registrationNo',
        'city',
        'zipCode',
        'openDay',
        'openTime',
        'closeTime',
        'paymentMode',
        'bankName',
        'accountNo',
        'accountHolder',
        'branch',
      ];
      const formdata = new FormData();
      obj.forEach((item) => formdata.append(item, value[item] || ''));
      if (value.logo) formdata.append('logo', value.logo);

      if (Array.isArray(value.qr)) {
        value.qr.forEach((item: File) => formdata.append('qr', item));
      }

      if (companyData._id) {
        updateProfile({ id: companyData._id, body: formdata });
      } else {
        createCompanyDetails({ body: formdata });
      }
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <Header text="Edit Shop Profile" />
        <Breadcrumbs />
      </div>
      <form
        className="grid grid-cols-1 lg:grid-cols-6 gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="col-span-4 p-4 space-y-4 bg-white rounded-lg shadow-lg border-2 border-[#eeeeee]">
          <div>
            <div>
              <h1 className="text-xl font-semibold">General Information</h1>
              <div className="border-b border-[#dedde2] w-full my-2"></div>
            </div>

            <form.Field name="companyName">
              {(field) => (
                <div className="w-full">
                  <InputField
                    label="Shop Name"
                    required
                    placeholder="Enter Name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>
            <div className="flex items-center justify-between gap-4">
              <form.Field name="name">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Owner Name"
                      required
                      placeholder="Enter Owner Name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
              <form.Field name="phone">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Phone Number"
                      required
                      placeholder="eg. +977 327732622"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>

            <div className="flex items-center justify-between gap-4">
              <form.Field name="email">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Email"
                      required
                      placeholder="Enter Email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
              <form.Field name="registrationNo">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Registration Number"
                      required
                      placeholder="Enter Registration Number"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>
          </div>
          {/* Address Section */}
          <div>
            <div>
              <h1 className="text-xl font-semibold">Address</h1>
              <div className="border-b border-[#dedde2] w-full my-2"></div>
            </div>

            <div className="flex items-center gap-4 justify-between">
              <form.Field name="address">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Street Address"
                      required
                      placeholder="Enter Street Address"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="city">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="City"
                      required
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>

            <div className="flex items-center gap-4 justify-between">
              {/* <form.Field name="country">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Country"
                      required
                      value={field.state.value}
                      placeholder="United Kingdom"
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field> */}

              <form.Field name="zipCode">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Zip Code"
                      required
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          {/* Business Hours Section */}
          <div>
            <div>
              <h1 className="text-xl font-semibold">Business Hours</h1>
              <div className="border-b border-[#dedde2] w-full my-2" />
            </div>
            <div className="flex items-center gap-4 justify-between">
              <form.Field name="openDay">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Open Day"
                      required
                      placeholder="Sun-Mon"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="openTime">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Opening Time"
                      type="time"
                      required
                      placeholder="Sun-Mon"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="closeTime">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Closing Time"
                      type="time"
                      required
                      placeholder="Sun-Mon"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          {/* Shop Preferences Section */}
          <div>
            <div>
              <h1 className="text-xl font-semibold">Shop Preference</h1>
              <div className="border-b border-[#dedde2] w-full my-2"></div>
            </div>
            <div className="flex items-center gap-4 justify-between">
              <form.Field name="paymentMode">
                {(field) => (
                  <div className="w-1/2">
                    <DropdownField
                      label="Payment Method"
                      options={[
                        { value: 'cash', label: 'Cash' },
                        { value: 'online', label: 'Online' },
                      ]}
                      required
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      inputClassname="w-full"
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          {/* Bank Details Section */}
          <div>
            <div>
              <h1 className="text-xl font-semibold">Bank Details</h1>
              <div className="border-b border-[#dedde2] w-full my-2" />
            </div>
            <div className="flex items-center gap-4 justify-between">
              <form.Field name="bankName">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Bank Name"
                      required
                      placeholder="Nepal Rastriya Bank Ltd."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="accountNo">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Bank Account Number"
                      required
                      placeholder="012334456676823"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>
            <div className="flex items-center gap-4 justify-between">
              <form.Field name="branch">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Branch"
                      required
                      placeholder="Branch"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
              <form.Field name="accountHolder">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Account Name"
                      required
                      placeholder="Account holder name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="*:bg-[#ffffff] *:border-[#eeeeee] *:border-2 *:shadow-lg *:rounded-xl *:w-full *:p-4 space-y-4">
            <div>
              <h1 className="text-xl font-semibold">Upload Profile Photo</h1>
              <div className="border-b border-[#dedde2] w-full my-2" />
              <form.Field name="logo">
                {(field) => (
                  <MultiImageUploader
                    existingFile={get(companyData, 'logo[0]')}
                    multiple={false}
                    form={form}
                    label="Upload Receipts"
                    value={field.state.value}
                    onChange={(files) => field.handleChange(files)}
                  />
                )}
              </form.Field>
            </div>

            <div>
              <div>
                <h1 className="text-xl font-semibold">Upload QR</h1>
                <div className="border-b border-[#dedde2] w-full my-2" />
              </div>
              <form.Field name="qr">
                {(field) => (
                  <MultiImageUploader
                    multiple
                    existingFiles={form.getFieldValue('existingQr')}
                    existingFileField="existingImages"
                    label="Upload Receipts"
                    value={field.state.value as File[]}
                    onChange={(files: File[]) => field.handleChange(files)}
                    form={form}
                  />
                )}
              </form.Field>
            </div>
          </div>
          <div className="flex justify-end my-4">
            <button
              type="submit"
              className="self-end bg-[#df8d29] text-white px-7 py-2 rounded-xl disabled:bg-[#966830]"
              disabled={isPending}
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
