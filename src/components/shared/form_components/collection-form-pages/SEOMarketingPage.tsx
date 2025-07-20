import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { InputField } from "../InputField";
import { TextareaField } from "../TextArea";
import { DropdownField } from "../Dropdown";
import { useMultiPageForm } from "../MultiPageFormContext";

// Options for dropdowns
const targetAudienceOptions = [
  { value: "", label: "Select Target Audience" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "unisex", label: "Unisex" },
  { value: "children", label: "Children" },
];

const seasonalityOptions = [
  { value: "year-round", label: "Year-round" },
  { value: "spring", label: "Spring" },
  { value: "summer", label: "Summer" },
  { value: "autumn", label: "Autumn" },
  { value: "winter", label: "Winter" },
];

export const SEOMarketingPage: React.FC = () => {
  const { formData, updateFormData, updateValidation, validationState } =
    useMultiPageForm();

  const [keywordInput, setKeywordInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Validation functions
  const validateSEOTitle = (value: string) => {
    const errors: string[] = [];
    if (value && value.length > 60) {
      errors.push(
        "SEO title should be under 60 characters for optimal display"
      );
    }
    updateValidation("seoTitle", errors.length === 0, errors);
  };

  const validateSEODescription = (value: string) => {
    const errors: string[] = [];
    if (value && value.length > 160) {
      errors.push(
        "SEO description should be under 160 characters for optimal display"
      );
    }
    updateValidation("seoDescription", errors.length === 0, errors);
  };

  // Handle keyword management
  const addKeyword = () => {
    if (
      keywordInput.trim() &&
      !formData.metadata.keywords.includes(keywordInput.trim())
    ) {
      const newKeywords = [...formData.metadata.keywords, keywordInput.trim()];
      updateFormData({
        metadata: {
          ...formData.metadata,
          keywords: newKeywords,
        },
      });
      setKeywordInput("");
    }
  };

  const removeKeyword = (index: number) => {
    const newKeywords = formData.metadata.keywords.filter(
      (_, i) => i !== index
    );
    updateFormData({
      metadata: {
        ...formData.metadata,
        keywords: newKeywords,
      },
    });
  };

  // Handle tag management
  const addTag = () => {
    if (tagInput.trim() && !formData.metadata.tags.includes(tagInput.trim())) {
      const newTags = [...formData.metadata.tags, tagInput.trim()];
      updateFormData({
        metadata: {
          ...formData.metadata,
          tags: newTags,
        },
      });
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = formData.metadata.tags.filter((_, i) => i !== index);
    updateFormData({
      metadata: {
        ...formData.metadata,
        tags: newTags,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Icon
            icon="material-symbols:search"
            className="w-6 h-6 text-[#DF8D28]"
          />
          <h2 className="text-xl font-bold text-gray-900">SEO & Marketing</h2>
        </div>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Optimize for search engines and define marketing attributes.
        </p>
      </div>

      {/* Form Fields */}
      <div className="max-w-2xl mx-auto space-y-6">
        {/* SEO Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon
              icon="material-symbols:seo"
              className="w-5 h-5 text-blue-600"
            />
            Search Engine Optimization
          </h3>

          <div className="space-y-6">
            {/* SEO Title */}
            <div className="space-y-2">
              <InputField
                label="SEO Title"
                placeholder="Enter SEO-optimized title (optional)"
                value={formData.metadata.seoTitle}
                onChange={(e) => {
                  const value = e.target.value;
                  updateFormData({
                    metadata: {
                      ...formData.metadata,
                      seoTitle: value,
                    },
                  });
                  validateSEOTitle(value);
                }}
                onBlur={(e) => validateSEOTitle(e.target.value)}
              />
              <div className="flex justify-between items-center text-sm">
                <p className="text-gray-500">
                  Appears in search engine results and browser tabs
                </p>
                <span
                  className={`${
                    formData.metadata.seoTitle.length > 50
                      ? "text-orange-500"
                      : formData.metadata.seoTitle.length > 60
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}>
                  {formData.metadata.seoTitle.length}/60
                </span>
              </div>
              {validationState.seoTitle?.errors.map((error, index) => (
                <p
                  key={index}
                  className="text-red-500 text-sm flex items-center gap-1">
                  <Icon icon="material-symbols:error" className="w-4 h-4" />
                  {error}
                </p>
              ))}
            </div>

            {/* SEO Description */}
            <div className="space-y-2">
              <TextareaField
                label="SEO Description"
                placeholder="Enter SEO-optimized description (optional)"
                rows={3}
                value={formData.metadata.seoDescription}
                onChange={(e) => {
                  const value = e.target.value;
                  updateFormData({
                    metadata: {
                      ...formData.metadata,
                      seoDescription: value,
                    },
                  });
                  validateSEODescription(value);
                }}
                onBlur={(e) => validateSEODescription(e.target.value)}
              />
              <div className="flex justify-between items-center text-sm">
                <p className="text-gray-500">
                  Appears in search engine results below the title
                </p>
                <span
                  className={`${
                    formData.metadata.seoDescription.length > 140
                      ? "text-orange-500"
                      : formData.metadata.seoDescription.length > 160
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}>
                  {formData.metadata.seoDescription.length}/160
                </span>
              </div>
              {validationState.seoDescription?.errors.map((error, index) => (
                <p
                  key={index}
                  className="text-red-500 text-sm flex items-center gap-1">
                  <Icon icon="material-symbols:error" className="w-4 h-4" />
                  {error}
                </p>
              ))}
            </div>

            {/* SEO Preview */}
            {(formData.metadata.seoTitle ||
              formData.metadata.seoDescription) && (
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium text-gray-900 mb-2">
                  Search Result Preview:
                </h4>
                <div className="border border-gray-200 rounded p-3 bg-gray-50">
                  <h5 className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
                    {formData.metadata.seoTitle ||
                      formData.name ||
                      "Collection Title"}
                  </h5>
                  <p className="text-green-700 text-sm">
                    yourstore.com/collections/
                    {formData.slug || "collection-slug"}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {formData.metadata.seoDescription ||
                      formData.shortDescription ||
                      "Collection description will appear here..."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Keywords Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:label"
              className="w-5 h-5 text-green-600"
            />
            Keywords
          </h3>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Add relevant keywords that customers might use to search for this
              collection. These help with internal search and categorization.
            </p>

            <div className="flex gap-2">
              <InputField
                placeholder="Enter a keyword"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addKeyword();
                  }
                }}
              />
              <button
                type="button"
                onClick={addKeyword}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1">
                <Icon icon="material-symbols:add" className="w-4 h-4" />
                Add
              </button>
            </div>

            {/* Keywords Display */}
            {formData.metadata.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.metadata.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(index)}
                      className="hover:text-green-600">
                      <Icon icon="material-symbols:close" className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tags Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:tag"
              className="w-5 h-5 text-purple-600"
            />
            Tags
          </h3>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Add tags to help organize and filter collections. Tags are useful
              for creating collection groups and marketing campaigns.
            </p>

            <div className="flex gap-2">
              <InputField
                placeholder="Enter a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1">
                <Icon icon="material-symbols:add" className="w-4 h-4" />
                Add
              </button>
            </div>

            {/* Tags Display */}
            {formData.metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.metadata.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="hover:text-purple-600">
                      <Icon icon="material-symbols:close" className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Marketing Attributes */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:campaign"
              className="w-5 h-5 text-orange-600"
            />
            Marketing Attributes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Audience */}
            <div className="space-y-2">
              <DropdownField
                label="Target Audience"
                firstInput="Select target audience"
                options={targetAudienceOptions}
                value={formData.metadata.targetAudience}
                onChange={(e) =>
                  updateFormData({
                    metadata: {
                      ...formData.metadata,
                      targetAudience: e.target.value as any,
                    },
                  })
                }
              />
              <p className="text-sm text-gray-500">
                Primary demographic for this collection
              </p>
            </div>

            {/* Seasonality */}
            <div className="space-y-2">
              <DropdownField
                label="Seasonality"
                options={seasonalityOptions}
                value={formData.metadata.seasonality}
                onChange={(e) =>
                  updateFormData({
                    metadata: {
                      ...formData.metadata,
                      seasonality: e.target.value as any,
                    },
                  })
                }
              />
              <p className="text-sm text-gray-500">
                When this collection is most relevant
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Popularity Score */}
            <div className="space-y-2">
              <InputField
                label="Popularity Score"
                type="number"
                min="0"
                max="100"
                placeholder="0"
                value={formData.metadata.popularity || ""}
                onChange={(e) =>
                  updateFormData({
                    metadata: {
                      ...formData.metadata,
                      popularity: Number(e.target.value) || 0,
                    },
                  })
                }
              />
              <p className="text-sm text-gray-500">
                0-100 scale for internal ranking (0 = new, 100 = most popular)
              </p>
            </div>

            {/* Trending Score */}
            <div className="space-y-2">
              <InputField
                label="Trending Score"
                type="number"
                min="0"
                max="100"
                placeholder="0"
                value={formData.metadata.trendingScore || ""}
                onChange={(e) =>
                  updateFormData({
                    metadata: {
                      ...formData.metadata,
                      trendingScore: Number(e.target.value) || 0,
                    },
                  })
                }
              />
              <p className="text-sm text-gray-500">
                0-100 scale for trending status (higher = more trending)
              </p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon
              icon="material-symbols:help"
              className="w-5 h-5 text-gray-600"
            />
            SEO & Marketing Tips
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • <strong>SEO Title:</strong> Include your main keyword and make
              it compelling for clicks
            </p>
            <p>
              • <strong>SEO Description:</strong> Write a clear, benefit-focused
              description that encourages clicks
            </p>
            <p>
              • <strong>Keywords:</strong> Use terms your customers actually
              search for, not just industry jargon
            </p>
            <p>
              • <strong>Tags:</strong> Keep them consistent across similar
              collections for better organization
            </p>
            <p>
              • <strong>Scores:</strong> Use popularity and trending scores to
              influence collection ordering and recommendations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
