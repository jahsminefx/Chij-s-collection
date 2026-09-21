import slugifyPackage from 'slugify';

export const createSlug = (text) => {
  return slugifyPackage(text, {
    lower: true,
    strict: true,
    trim: true,
  });
};
