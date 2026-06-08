import React, { useEffect, useMemo } from "react";
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
import MetalPriceHistoryTable from "./MetalPriceHistoryTable";
import {
  GRAMS_PER_TOLA,
  formatPrice,
} from "../../../utils/priceConversions";

const validationSchema = Yup.object({
  baseGold999PerTola: Yup.number()
    .required("Gold 99.9 (per tola) is required")
    .positive("Must be greater than 0"),
  baseSilverPerTola: Yup.number()
    .required("Silver (per tola) is required")
    .positive("Must be greater than 0"),
  tolaGrams: Yup.number().required().positive(),
  purity24: Yup.number().required().positive(),
  purity22: Yup.number().required().positive(),
  purity18: Yup.number().required().positive(),
  purity14: Yup.number().required().positive(),
  purity10: Yup.number().required().positive(),
  currency: Yup.string().required(),
});

const MetalPricesForm: React.FC = () => {
  const { data: latest, isLoading } = useGetLatestMetalPricesQuery();
  const { mutateAsync: savePrices, isPending } = useCreateMetalPriceMutation();

  const formik = useFormik({
    initialValues: {
      baseGold999PerTola: 0,
      baseSilverPerTola: 0,
      tolaGrams: GRAMS_PER_TOLA,
      purity24: 99.9,
      purity22: 91.6,
      purity18: 75,
      purity14: 58.3,
      purity10: 41.7,
      currency: "NPR",
    },
    validationSchema,
    onSubmit: async (values) => {
      await savePrices({
        baseGold999PerTola: Number(values.baseGold999PerTola) || 0,
        baseSilverPerTola: Number(values.baseSilverPerTola) || 0,
        tolaGrams: Number(values.tolaGrams) || GRAMS_PER_TOLA,
        purityConfig: {
          "24": Number(values.purity24) || 99.9,
          "22": Number(values.purity22) || 91.6,
          "18": Number(values.purity18) || 75,
          "14": Number(values.purity14) || 58.3,
          "10": Number(values.purity10) || 41.7,
        },
        currency: values.currency,
      });
    },
  });

  useEffect(() => {
    if (!latest?.goldPrice) return;
    const tolaGrams = Number(latest.config?.tolaGrams) || GRAMS_PER_TOLA;
    const baseGold999PerTola =
      Number(latest.config?.baseGold999PerTola) ||
      (Number(latest.goldPrice.pricePerGram || 0) * tolaGrams);
    const baseSilverPerTola =
      Number(latest.config?.baseSilverPerTola) ||
      (Number(latest.silverPrice.pricePerGram || 0) * tolaGrams);

    const purity = latest.config?.purityConfig || {};

    formik.setValues({
      baseGold999PerTola,
      baseSilverPerTola,
      tolaGrams,
      purity24: Number(purity["24"]) || 99.9,
      purity22: Number(purity["22"]) || 91.6,
      purity18: Number(purity["18"]) || 75,
      purity14: Number(purity["14"]) || 58.3,
      purity10: Number(purity["10"]) || 41.7,
      currency: latest.goldPrice.currency || "NPR",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latest?.goldPrice?.pricePerGram, latest?.silverPrice?.pricePerGram]);

  const currency = formik.values.currency || "NPR";
  const baseGold999PerTola = Number(formik.values.baseGold999PerTola) || 0;
  const baseSilverPerTola = Number(formik.values.baseSilverPerTola) || 0;
  const tolaGrams = Number(formik.values.tolaGrams) || GRAMS_PER_TOLA;

  const rows = useMemo(() => {
    const cfg = [
      { label: "24", purity: Number(formik.values.purity24) || 99.9 },
      { label: "22", purity: Number(formik.values.purity22) || 91.6 },
      { label: "18", purity: Number(formik.values.purity18) || 75 },
      { label: "14", purity: Number(formik.values.purity14) || 58.3 },
      { label: "10", purity: Number(formik.values.purity10) || 41.7 },
    ];

    return cfg.map((r) => {
      const goldTola = baseGold999PerTola * (r.purity / 99.9);
      const goldPer10g = goldTola * (10 / tolaGrams);
      const silverTola = baseSilverPerTola * (r.purity / 99.9);
      const silverGram = silverTola / tolaGrams;
      return {
        karat: Number(r.label),
        purity: r.purity,
        goldTola,
        goldPer10g,
        silverTola,
        silverGram,
      };
    });
  }, [
    baseGold999PerTola,
    baseSilverPerTola,
    tolaGrams,
    formik.values.purity10,
    formik.values.purity14,
    formik.values.purity18,
    formik.values.purity22,
    formik.values.purity24,
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: "Settings", path: "/settings/profile-config" },
          { label: "Metal Prices", path: "/settings/metal-prices" },
        ]}
      />
      <Header text="Metal Prices" />

      <div className="max-w-5xl mx-auto px-4 pb-10 space-y-6">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6"
        >
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg">
            <Icon icon="mdi:gold" className="w-6 h-6 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-900">
              Prices are shown on the dashboard ticker. Saving creates a new
              rate and marks it as the latest (auto-calculated by purity from
              gold 99.9 and silver base rates). Short formula: price for any
              carat = base price × (purity% ÷ 99.9). We also convert using 1
              tola = {tolaGrams} grams.
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
              label="Gold 99.9 (per tola)"
              name="baseGold999PerTola"
              type="number"
              required
              value={formik.values.baseGold999PerTola}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.baseGold999PerTola
                  ? (formik.errors.baseGold999PerTola as string | undefined)
                  : undefined
              }
            />
            <InputField
              label="Silver (per tola)"
              name="baseSilverPerTola"
              type="number"
              required
              value={formik.values.baseSilverPerTola}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.baseSilverPerTola
                  ? (formik.errors.baseSilverPerTola as string | undefined)
                  : undefined
              }
            />
            <InputField
              label="1 Tola = (grams)"
              name="tolaGrams"
              type="number"
              required
              step="0.0001"
              value={formik.values.tolaGrams}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.tolaGrams
                  ? (formik.errors.tolaGrams as string | undefined)
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

          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <InputField
                label="24K purity %"
                name="purity24"
                type="number"
                step="0.01"
                value={formik.values.purity24}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputField
                label="22K purity %"
                name="purity22"
                type="number"
                step="0.01"
                value={formik.values.purity22}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputField
                label="18K purity %"
                name="purity18"
                type="number"
                step="0.01"
                value={formik.values.purity18}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputField
                label="14K purity %"
                name="purity14"
                type="number"
                step="0.01"
                value={formik.values.purity14}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputField
                label="10K purity %"
                name="purity10"
                type="number"
                step="0.01"
                value={formik.values.purity10}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {baseGold999PerTola > 0 && baseSilverPerTola > 0 && (
              <div className="text-sm text-gray-700">
                <div className="overflow-x-auto border rounded-lg">
                  <table className="min-w-full text-left">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-3 py-2 font-medium">Purity</th>
                        <th className="px-3 py-2 font-medium">Karat</th>
                        <th className="px-3 py-2 font-medium">Gold (in tola)</th>
                        <th className="px-3 py-2 font-medium">Gold (per 10 gram)</th>
                        <th className="px-3 py-2 font-medium">Silver (in tola)</th>
                        <th className="px-3 py-2 font-medium">Silver (in gram)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {rows.map((r) => (
                        <tr key={r.karat} className="bg-white">
                          <td className="px-3 py-2">{r.purity}</td>
                          <td className="px-3 py-2">{r.karat}</td>
                          <td className="px-3 py-2">{formatPrice(r.goldTola, currency)}</td>
                          <td className="px-3 py-2">
                            {formatPrice(r.goldPer10g, currency)}
                          </td>
                          <td className="px-3 py-2">{formatPrice(r.silverTola, currency)}</td>
                          <td className="px-3 py-2">
                            {formatPrice(r.silverGram, currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Calculation: rowRate = baseRate × (purity% / 99.9). Conversions use 1 tola ={" "}
                  {tolaGrams}g.
                </p>
              </div>
            )}
          </div>

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

        <MetalPriceHistoryTable title="All Saved Metal Price Records" />
      </div>
    </div>
  );
};

export default MetalPricesForm;
