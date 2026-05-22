import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react/dist/iconify.js";
import Breadcrumbs from "../../../components/shared/Breadcrumb";
import Header from "../../../components/shared/table_heading/Header";
import { InputField } from "../../../components/shared/form_components/InputField";
import { Button } from "../../../components/shared/form_components/Button";
import {
  useCreateMetalPriceMutation,
  useGetLatestMetalPricesQuery,
} from "../../../server/api/metalPricesHooks";
import { formatPricePerTola } from "../../../utils/priceConversions";

const validationSchema = Yup.object({
  fineGold24kPerGram: Yup.number()
    .required("Fine gold price is required")
    .positive("Must be greater than 0"),
  tejabiGold22kPerGram: Yup.number().min(0, "Cannot be negative"),
  silverPerGram: Yup.number()
    .required("Silver price is required")
    .positive("Must be greater than 0"),
  currency: Yup.string().required(),
});

const MetalPricesForm: React.FC = () => {
  const { data: latest, isLoading } = useGetLatestMetalPricesQuery();
  const { mutateAsync: savePrices, isPending } = useCreateMetalPriceMutation();

  const formik = useFormik({
    initialValues: {
      fineGold24kPerGram: 0,
      tejabiGold22kPerGram: 0,
      silverPerGram: 0,
      currency: "NPR",
    },
    validationSchema,
    onSubmit: async (values) => {
      await savePrices({
        fineGold24kPerGram: values.fineGold24kPerGram,
        tejabiGold22kPerGram: values.tejabiGold22kPerGram || undefined,
        silverPerGram: values.silverPerGram,
        currency: values.currency,
      });
    },
  });

  useEffect(() => {
    if (!latest?.goldPrice) return;
    formik.setValues({
      fineGold24kPerGram: latest.goldPrice.pricePerGram || 0,
      tejabiGold22kPerGram: latest.tejabiGold22k?.pricePerGram || 0,
      silverPerGram: latest.silverPrice?.pricePerGram || 0,
      currency: latest.goldPrice.currency || "NPR",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latest?.goldPrice?.pricePerGram, latest?.silverPrice?.pricePerGram]);

  const currency = formik.values.currency || "NPR";
  const fineGram = Number(formik.values.fineGold24kPerGram) || 0;
  const silverGram = Number(formik.values.silverPerGram) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: "Settings", path: "/settings/profile-config" },
          { label: "Metal Prices", path: "/settings/metal-prices" },
        ]}
      />
      <Header text="Metal Prices" />

      <div className="max-w-3xl mx-auto px-4 pb-10">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6"
        >
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg">
            <Icon icon="mdi:gold" className="w-6 h-6 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-900">
              Prices are shown on the dashboard ticker. Saving creates a new
              rate and marks it as the latest (fine 24k, optional tejabi 22k,
              silver).
            </p>
          </div>

          {isLoading ? (
            <p className="text-gray-500 text-sm">Loading current rates…</p>
          ) : latest?.lastUpdated || latest?.goldPrice?.timestamp ? (
            <p className="text-sm text-gray-600">
              Last updated:{" "}
              {new Date(
                latest.lastUpdated || latest.goldPrice?.timestamp || ""
              ).toLocaleString()}
            </p>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Fine Gold 24k (per gram)"
              name="fineGold24kPerGram"
              type="number"
              required
              value={formik.values.fineGold24kPerGram}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.fineGold24kPerGram
                  ? formik.errors.fineGold24kPerGram
                  : undefined
              }
            />
            <InputField
              label="Tejabi Gold 22k (per gram, optional)"
              name="tejabiGold22kPerGram"
              type="number"
              value={formik.values.tejabiGold22kPerGram}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <InputField
              label="Silver (per gram)"
              name="silverPerGram"
              type="number"
              required
              value={formik.values.silverPerGram}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.silverPerGram
                  ? formik.errors.silverPerGram
                  : undefined
              }
            />
            <InputField
              label="Currency"
              name="currency"
              value={formik.values.currency}
              onChange={formik.handleChange}
            />
          </div>

          {fineGram > 0 && (
            <div className="text-sm text-gray-600 space-y-1 border-t pt-4">
              <p>
                Fine gold per tola: {formatPricePerTola(fineGram, currency)}
              </p>
              {silverGram > 0 && (
                <p>
                  Silver per tola: {formatPricePerTola(silverGram, currency)}
                </p>
              )}
              {formik.values.tejabiGold22kPerGram > 0 && (
                <p>
                  Tejabi 22k per tola:{" "}
                  {formatPricePerTola(
                    Number(formik.values.tejabiGold22kPerGram),
                    currency
                  )}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#DF8D28] hover:bg-[#c77a1f] text-white px-6"
            >
              {isPending ? "Saving…" : "Save metal prices"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MetalPricesForm;
