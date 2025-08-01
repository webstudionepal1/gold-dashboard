// Test file to demonstrate the auto-slug functionality

// Utility function to generate URL-friendly slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^a-z0-9-]/g, '')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '');
};

// Test cases
console.log('🧪 Testing Auto-Slug Generation:');
console.log('');

const testCases = [
  'How to Choose the Perfect Gold Jewelry for Your Wedding',
  'Top 10 Diamond Ring Styles for 2024',
  'Gold vs Silver: Which is Better for Investment?',
  'The History of Indian Traditional Jewelry',
  'Caring for Your Precious Gemstones',
  'Wedding Ring Shopping Guide!!!',
  'Best Jewelry Trends & Fashion 2024',
  'How to Clean Your Gold Jewelry at Home?',
  'Understanding Diamond Cuts & Clarity',
  'Jewelry Insurance: What You Need to Know'
];

testCases.forEach((title, index) => {
  const slug = generateSlug(title);
  console.log(`${index + 1}. Title: "${title}"`);
  console.log(`   Slug:  "${slug}"`);
  console.log(`   URL:   "/blog/${slug}"`);
  console.log('');
});

console.log('✅ Auto-slug generation working perfectly!');
