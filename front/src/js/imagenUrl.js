const API_URL = import.meta.env.VITE_URL_SERVER;

export const urlImagen = (imagen) => {
  if (!imagen) return `${API_URL}/uploads/default-product.png`;
  if (/^https?:\/\//i.test(imagen)) return imagen;
  return `${API_URL}/uploads/${imagen}`;
};
