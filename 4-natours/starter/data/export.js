const { promises: fs } = require('fs');
const importData = async () => {
  try {
    const data = await fs.readFile('./data/product_types.json', 'utf8');
    const productTypesData = JSON.parse(data);
    let productSubTypesData = await fs.readFile(
      './data/product_sub_types.json',
      'utf8'
    );
    let productTertiaryTypesData = await fs.readFile(
      './data/product_tertiary_types.json',
      'utf8'
    );
    productSubTypesData = JSON.parse(productSubTypesData);
    productTertiaryTypesData = JSON.parse(productTertiaryTypesData);

    const productSubTypes = productSubTypesData.map((productSubType) => {
      const tertiaryTypes = productTertiaryTypesData.filter(
        (tertiaryType) => tertiaryType.product_sub_type_id === productSubType.id
      );
      return {
        ...productSubType,
        product_tertiary_types: tertiaryTypes,
      };
    });

    const productTypes = productTypesData.map((productType) => {
      const subTypes = productSubTypes.filter(
        (subType) => subType.product_type_id === productType.id
      );
      return {
        ...productType,
        product_sub_types: subTypes,
      };
    });
    return productTypes;
  } catch (error) {
    console.log(error);
  }
};

importData().then((data) =>
  fs.writeFile('./data/export.json', JSON.stringify(data))
);
