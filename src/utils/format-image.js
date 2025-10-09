export const fBase64 = (file) =>
  new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      reject(new Error("Invalid file input"));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file);
  });
