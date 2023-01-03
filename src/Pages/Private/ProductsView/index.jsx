import { Sidebar } from 'Components';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreProducts } from 'Store/actions/store.action';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import EditIcon from '@mui/icons-material/Edit';
import { ComingSoonModel } from 'Components/ComminSoon';
import TestPagination from 'Components/Pagination';
import CustomTable from './CustomTable';
import styles from './styles.module.scss';
import ProductFormDialog from './ProductFormDialog';
import Paginate from '../../../Components/Pagination/Paginate';

const logger = (value, string) => {
  console.log(`ProductView-${string}: `, value);
};
const ActionButton = ({ Icon, title, color, onClick }) => (
  <>
    <button className={`${styles.action_button} ${styles[`action_button_${color}`]}`} onClick={onClick}>
      <span className={`${styles.action_button_icon}`}>
        <Icon className={styles.action_button_icon_mui} />
      </span>
      <span className={styles.action_button_title}>
        {title}
      </span>
    </button>
  </>
);
const HeadActionButtons = ({ setTestPagination }) => {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isComingSoon, setIsComingSoon] = useState(false);

  const defaultActionButtons = [
    {
      title: 'Add new product',
      Icon: AddIcon,
      onClick: () => setIsEditFormOpen(true),
      color: 'primary',
    },
    {
      title: 'Upload File',
      Icon: UploadIcon,
      onClick: () => setIsComingSoon(true),
      color: 'skyblue',
    },
    {
      title: 'Modify Container',
      Icon: EditIcon,
      onClick: () => setIsComingSoon(true),
      color: 'green',
    },
    {
      title: 'Test Pagination',
      Icon: EditIcon,
      onClick: () => setTestPagination(true),
      color: 'skyblue',
    },
  ];
  return (
    <>
      <div className={styles.head_action_buttons}>
        { defaultActionButtons.map((button) => <ActionButton {...button} />) }
      </div>
      {isEditFormOpen && <ProductFormDialog open={isEditFormOpen} setOpen={setIsEditFormOpen} fullWidth />}
      {isComingSoon && <ComingSoonModel open={isComingSoon} setOpen={setIsComingSoon} fullWidth />}

    </>

  );
};

export default function ProductsView() {
  const defaultColumns = {
    id: 'ID',
    image: 'Image',
    name: 'Name',
    category: { name: 'Category' },
    stock: 'Stock',
    price: 'Price',
    discountedPrice: 'Discounted Price',
    storeItemId: 'StoreItemId',
  };
  const [testPagination, setTestPagination] = useState(false);
  const { items, currentStore } = useSelector((state) => state.storeReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    if (currentStore?.id) {
      const data = { storeId: currentStore.id };
      dispatch(getStoreProducts(data, undefined, () => {
      }));
    }
  }, [currentStore]);
  useEffect(() => {
    logger(items);
  }, [items]);
  const [searchProductText, setSearchProductText] = useState('');
  const filterSearchProducts = (list) => {
    const searchedCategory = list.filter(({ name }) => name.toLowerCase().search(searchProductText.toLowerCase()) !== -1);
    return searchedCategory;
  };
  const TextInput = (props) => {
    const { label, placeholder, disabled } = props;
    return (
      <div className={`${styles.input_group} ${disabled ? styles.input_group_disabled : ''}`}>
        {label
        && <label className={styles.input_group_label}>{label || 'NaN'}</label>}
        <input {...props} placeholder={placeholder || label} className={styles.input_group_input} />
      </div>
    );
  };
  return (
    <>
      {testPagination ? (
        <>

          <HeadActionButtons setTestPagination={setTestPagination} />
          <TestPagination />
        </>
      )
        : (
          <div className={styles.main_section}>
            <Sidebar />
            <div className={styles.section_preview}>
              <div className={styles.section_preview_actions}>

                <TextInput
                  placeholder="Search Products"
                  type="text"
                  onChange={(evt) => setSearchProductText(evt.target.value.replace(/[^a-zA-Z ]/g, ''))}
                  defaultValue={searchProductText}
                  value={searchProductText}
                />
                <HeadActionButtons setTestPagination={setTestPagination} />
              </div>
              <CustomTable defaultColumns={defaultColumns} list={filterSearchProducts(items)} />
            </div>
          </div>
        )}
    </>
  );
}
