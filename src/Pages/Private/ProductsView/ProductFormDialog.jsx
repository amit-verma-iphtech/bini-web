import { CustomDialog } from 'Components';
import React, { useState, useEffect } from 'react';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { useSelector } from 'react-redux';
import * as api from 'Api/request';
import ToggleSwitch from 'Components/Toggle';
import ImageIcon from '@mui/icons-material/Image';
import FetchDataButton from 'Components/FetchButton';
import styles from './styles.module.scss';

const TextInput = (props) => {
  const { label, placeholder, disabled } = props;
  return (
    <div className={`${styles.input_group} ${disabled ? styles.input_group_disabled : ''}`}>
      <label className={styles.input_group_label}>{label || 'NaN'}</label>
      <input {...props} placeholder={placeholder || label} className={styles.input_group_input} />
    </div>
  );
};
const SelectInput = (props) => {
  const { label, placeholder, options, onChange, value, defaultValue, disabled } = props;
  return (
    <div className={styles.input_group}>
      <label className={styles.input_group_label}>{label || 'NaN'}</label>
      <select
        disabled={disabled}
        placeholder={placeholder || label}
        onChange={onChange}
        className={styles.input_group_input}
        defaultValue={defaultValue}
        value={value}
      >
        <option value="">Please Select Value</option>

        {options?.map(({ name, value }) => <option value={value}>{name}</option>)}
      </select>
    </div>
  );
};
const ActionButton = (props) => {
  const { title } = props;
  return <button type="button" {...props}>{title}</button>;
};

const initialFormData = {
  id: '',
  name: '',
  stock: '',
  description: '',
  price: '',
  image: '',
  category: '',
  discountedPrice: '',
  active: false
};
const initialProductData = {
  name: '',
  description: '',
  imageUrl: '',
  id: '',
};
const initialCategoryData = {
  id: '',
  name: ''
};
const defaultCategories = [
  { name: 'Category 1', value: 'category1' },
  { name: 'Category 2', value: 'category2' },
];
const customOptions = [
  { name: 'DEMO', value: 'DEMO' }
];

const ProductForm = ({
  form_head_title,
  isEdit,
  form_action_submit_title,
  productData,
  setOpen,
  isItemNotInSuggestedItemsList,
  setIsItemNotInSuggestedItemsList,
  isCategoryNotInSuggestedList,
  setIsCategoryNotInSuggestedList
}) => {
  const {
    storeReducer: { items, currentStore },
  } = useSelector((state) => state);
  const [formData, setFormData] = useState(initialFormData);
  const [selectedProduct, setSelectedProduct] = useState(initialProductData);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryData);

  const [categories, setCategories] = useState(defaultCategories);
  const [availableProducts, setAvailableProduct] = useState([]);

  const [loading, setLoading] = React.useState(false);

  const handleCloseForm = (params) => {
    setOpen(false);
  };

  const handleResetInputs = () => {
    setFormData(initialFormData);
    setSelectedProduct(initialProductData);
    setSelectedCategory(initialCategoryData);
  };
  const handleSetEditData = () => {
    if (!isEdit) return;
    console.clear();
    console.log('productData-->', productData);
    setSelectedCategory(productData.category);
    setSelectedProduct({
      id: productData.itemId,
      name: productData.name,
      imageUrl: productData.imageUrl,
      description: productData.description,
    });
    setFormData(productData);
  };

  useEffect(() => {
    if (isItemNotInSuggestedItemsList) {
      handleResetInputs();
    } else {
      handleSetEditData();
    }
  }, [isItemNotInSuggestedItemsList]);

  useEffect(() => {
    handleSetEditData();
  }, [isEdit]);

  const handleChange = (event) => {
    const data = { ...formData };
    data[event.target.name] = event.target.value;
    setFormData(data);
  };
  const handleSelect = () => {

  };

  const [isSelectProduct, setIsSelectProduct] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  useEffect(async () => {
    setLoadingItems(true);
    setLoadingCategories(true);
    const payload = {
      shouldNotIncludeStoreId: currentStore.id,
      // limit: 10,
      ...productData?.itemId && { itemId: productData.itemId },
    };
    await api.requestGetItems(payload).then((response) => {
      if (response.code === 200) {
        setAvailableProduct(response.data);
      }
    }).catch((err) => console.log(err));
    setTimeout(() => { setLoadingItems(false); }, 1000);

    await api.requestGetAllCategories().then((response) => {
      console.log('ppp-->categories-->', response);
      if (response.code === 200) {
        setCategories(response.data);
      }
    }).catch((err) => console.log(err));
    setTimeout(() => { setLoadingCategories(false); }, 1000);
  }, [currentStore?.id]);

  const handleSelectProduct = (event) => {
    const selected = availableProducts.find(({ id }) => event.currentTarget.value * 1 === id * 1);
    if (selected) {
      return setSelectedProduct({ ...selected, image: selected.imageUrl });
    }
  };

  const handleSelectCategory = (event) => {
    const selected = categories.find(({ id }) => event.currentTarget.value * 1 === id * 1);
    if (selected) {
      return setSelectedCategory({ ...selected });
    }
  };
  useEffect(() => {
    console.log('ppp selectProductChange--->', selectedProduct);
  }, [selectedProduct]);

  const handleCreateStoreProduct = async () => {
    const payload = {
      ...selectedProduct.id && { itemId: selectedProduct.id },
      ...selectedCategory.i && { categoryId: selectedCategory.id },

      price: formData.price,
      stock: formData.stock,
      discountedPrice: formData.discountedPrice,
      active: true,
      storeId: currentStore.id,
      storeItemId: formData.storeItemId,

      isNewCategory: isCategoryNotInSuggestedList,
      newCategoryName: formData.newCategoryName,

      isNewItem: isItemNotInSuggestedItemsList,
      name: formData.name,
      description: formData.description,
      imageUrl: formData.imageUrl,

    };

    const response = await api.requestCreateStoreProduct(payload);
    console.log('createStoreProduct--->', response, payload);
    if (response.code === 200) {
      alert('Product created');
      return handleCloseForm();
    }
    alert(response.message);
    return handleCloseForm();
  };

  const handleUpdateStoreProduct = async () => {
    const payload = {
      ...selectedProduct.id && { itemId: selectedProduct.id },
      ...selectedCategory.id && { categoryId: selectedCategory.id },
      ...formData.storeItemId && ({ storeItemId: formData.storeItemId }),

      id: formData.id,

      price: formData.price,
      stock: formData.stock,
      discountedPrice: formData.discountedPrice,
      active: true,
      storeId: currentStore.id,

      isNewCategory: isCategoryNotInSuggestedList,
      newCategoryName: formData.newCategoryName,

      isNewItem: isItemNotInSuggestedItemsList,
      name: formData.name,
      description: formData.description,
      imageUrl: formData.imageUrl,

    };

    const response = await api.requestUpdateStoreProduct(payload);
    console.log('createStoreProduct--->', response, payload);
    if (response.code === 200) {
      alert('Product Updated');
      return handleCloseForm();
    }
    alert(response.message);
    return handleCloseForm();
  };
  const [searchItemText, setSearchItemText] = useState('');
  const [searchCategoryText, setSearchCategoryText] = useState('');
  const filterSearchItems = (list) => {
    const searchedItems = list.filter(({ name }) => name.toLowerCase().search(searchItemText.toLowerCase()) !== -1);
    return searchedItems.map(({ id, name }) => ({ value: id, name: name.length > 150 ? `${name.slice(0, 150)}...` : name }));
  };
  const filterSearchCategory = (list) => {
    const searchedCategory = list.filter(({ name }) => name.toLowerCase().search(searchCategoryText.toLowerCase()) !== -1);
    return searchedCategory.map(({ id, name }) => ({ value: id, name: name.length > 150 ? `${name.slice(0, 150)}...` : name }));
  };

  return (
    <>
      <div className={styles.product_form}>
        <div className={styles.product_form_head}>
          <div className={styles.product_form_head_title}>
            {form_head_title}
          </div>
          {selectedProduct.imageUrl ? (
            <>
              <div className={styles.product_form_head_image}>
                <img src={selectedProduct.imageUrl} />
              </div>
            </>
          ) : (
            <>
              <div className={styles.product_form_head_add_image}>
                <label htmlFor="product_image_upload">
                  {isItemNotInSuggestedItemsList
                    ? <AddAPhotoIcon className={styles.product_form_head_add_image_icon} />
                    : <ImageIcon className={styles.product_form_head_add_image_icon} />}
                </label>
                <input id="product_image_upload" type="file" disabled={!isItemNotInSuggestedItemsList} />
              </div>
            </>
          )}
        </div>
        <div className={styles.product_form_input}>
          <div className={styles.product_form_input_group}>
            <TextInput
              disabled={isItemNotInSuggestedItemsList}
              label="Search Product"
              type="text"
              onChange={(evt) => setSearchItemText(evt.target.value)}
              defaultValue={searchItemText}
            />
            <TextInput
              disabled={isItemNotInSuggestedItemsList}
              label="Search Category"
              type="text"
              onChange={(evt) => setSearchCategoryText(evt.target.value)}
              defaultValue={searchCategoryText}
            />
          </div>
          <div className={styles.product_form_input_group}>
            <SelectInput
              disabled={isItemNotInSuggestedItemsList}
              onChange={handleSelectProduct}
              defaultValue={selectedProduct?.id}
              value={selectedProduct?.id}
              label="Select Products"
              options={filterSearchItems(availableProducts)}
              customOptions={customOptions}
              isLoading={loadingItems}
            />
          </div>
          <div className={styles.product_form_input_group}>
            <ToggleSwitch
              defaultChecked={isItemNotInSuggestedItemsList}
              onToggle={(value) => setIsItemNotInSuggestedItemsList(value)}
              title="Product not found in select option? Toggle me to create completely new product!"
            />
          </div>

          <div className={styles.product_form_input_group}>
            <TextInput
              disabled={!isItemNotInSuggestedItemsList}
              label="Name"
              type="text"
              name="name"
              onChange={handleChange}
              defaultValue={selectedProduct?.name}
            />
            <TextInput
              label="Image Url"
              type="text"
              name="imageUrl"
              onChange={handleChange}
              disabled={!isItemNotInSuggestedItemsList}
              defaultValue={selectedProduct?.imageUrl}
              // disabled
              // defaultValue={isItemNotInSuggestedItemsList
              //   ? 'Upload Image by clicking camera icon, url will automatically generated on server end!' : selectedProduct?.imageUrl}
            />
          </div>
          <div className={styles.product_form_input_group}>
            <TextInput
              disabled={!isItemNotInSuggestedItemsList}
              label="Description"
              type="text"
              name="description"
              onChange={handleChange}
              defaultValue={selectedProduct?.description}
            />
          </div>
          <div className={styles.product_form_input_group}>
            <TextInput
              label="Price"
              type="text"
              name="price"
              onChange={(event) => setFormData({ ...formData, price: event.target.value })}
              defaultValue={formData?.price}
            />
            <TextInput
              label="Discounted Price"
              type="text"
              name="discountedPrice"
              onChange={handleChange}
              defaultValue={formData?.discountedPrice}
            />
          </div>
          <div className={styles.product_form_input_group}>
            <TextInput label="Stock" type="text" name="stock" onChange={handleChange} defaultValue={formData?.stock} />
            <TextInput label="StoreItemId" type="text" name="storeItemId" onChange={handleChange} defaultValue={formData?.storeItemId} />

          </div>
          <div className={styles.product_form_input_group}>
            <SelectInput
              onChange={handleSelectCategory}
              disabled={isCategoryNotInSuggestedList}
              // value={selectedStore?.value}
              value={selectedCategory.id}
              // className="search-wrapper-input"
              defaultValue={selectedCategory.id}
              label="Select Category"
              options={filterSearchCategory(categories)}
              customOptions={customOptions}
              isLoading={loadingCategories}
            />
          </div>
          <div className={styles.product_form_input_group}>
            <ToggleSwitch
              defaultChecked={isCategoryNotInSuggestedList}
              onToggle={(value) => setIsCategoryNotInSuggestedList(value)}
              title="Category not found in select option? Toggle me to create completely new category!"
            />
            <FetchDataButton {...{ loading, setLoading }} />
          </div>
          <div className={styles.product_form_input_group}>
            <TextInput
              disabled={!isCategoryNotInSuggestedList}
              label="New Category Name"
              type="text"
              name="newCategoryName"
              onChange={handleChange}
              defaultValue={formData?.newCategoryName}
            />
            {/* </div> */}
          </div>
        </div>
        {' '}
        <div className={styles.product_form_action}>
          <ActionButton
            onClick={() => {
              isEdit ? handleUpdateStoreProduct() : handleCreateStoreProduct();
            }}
            title={form_action_submit_title}
            className={styles.product_form_action_button}
          />
        </div>
      </div>
    </>
  );
};
const ProductFormDialog = (props) => {
  const { open, setOpen, isEdit } = props;
  const [isItemNotInSuggestedItemsList, setIsItemNotInSuggestedItemsList] = useState(false);
  const [isCategoryNotInSuggestedList, setIsCategoryNotInSuggestedList] = useState(false);
  const form_head_title = isItemNotInSuggestedItemsList
    ? 'Create New Item & Insert as Product In Store' : (isEdit ? 'Edit Store Product' : 'Insert Store Product');
  const form_action_submit_title = isItemNotInSuggestedItemsList
    ? 'Create Item & Insert as Product in Store' : (isEdit ? 'Update Product' : 'Insert Product');

  return (
    <>
      <CustomDialog open={open} setOpen={setOpen} fullWidth>
        <ProductForm
          {...props}
          {...{ isItemNotInSuggestedItemsList,
            setIsItemNotInSuggestedItemsList,
            form_head_title,
            form_action_submit_title,
            isCategoryNotInSuggestedList,
            setIsCategoryNotInSuggestedList }}
        />
      </CustomDialog>
    </>
  );
};
export default ProductFormDialog;
