import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { pink } from '@mui/material/colors';
import { IconButton } from '@material-ui/core';
import { CustomDialog } from 'Components';
import styles from './styles.module.scss';
import ProductFormDialog from './ProductFormDialog';

const logger = (value, string) => {
  // console.log(`CustomTable-${string}: `, value);
};

const CustomTable = ({ list, defaultColumns }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  return (
    <div className={styles.table}>
      <ProductRow data={defaultColumns} isHeads />
      {list.map(({ id, name, imageUrl, stock, price, category, discountedPrice, active, itemId, description, storeItemId }, idx) => (
        <ProductRow
          data={{
            id,
            name,
            image: imageUrl,
            stock,
            price,
            category,
            discountedPrice,
            active,
            itemId,
            description,
            storeItemId
          }}
          setIsOpen={setIsOpen}
          setSelectedRow={setSelectedRow}
          selectedRow={selectedRow}
        />
      ))}
      {isOpen && <ProductFormDialog open={isOpen} setOpen={setIsOpen} fullWidth isEdit productData={selectedRow} />}
    </div>
  );
};
export default CustomTable;

const ProductColumn = ({ value, isActionButton, isImage, onClick }) => (
  <div className={`${styles.product_column} ${isImage && styles.product_column_image}`}>
    {value ? (isImage ? <img className={styles.product_image} src={value} /> : value) : (isActionButton && (
    <div>
      <IconButton aria-label="edit" component="span" onClick={onClick}>
        <EditIcon />
      </IconButton>
      <IconButton aria-label="delete" component="span">
        <DeleteIcon sx={{ color: pink[500] }} />
      </IconButton>
    </div>
    ))}
  </div>
);

const ProductRow = ({ data, data: { id, image, name, category, stock, price, discountedPrice, storeItemId
}, isHeads, onClick, isOpen, setIsOpen, setSelectedRow }) => {
  logger(data);
  const handleEdit = () => {
    setSelectedRow(data);
    setIsOpen(true);
  };
  return (
    <div className={`${styles.product_row} ${isHeads && styles.product_row_head}`}>
      <ProductColumn value={id} />

      {isHeads
        ? <ProductColumn value="Image" />
        : <ProductColumn value={image} isImage />}
      <ProductColumn value={name} />
      <ProductColumn value={category === null ? 'null' : (category.name || 'NaN')} />
      <ProductColumn value={stock || '0'} />
      <ProductColumn value={price} />
      <ProductColumn value={discountedPrice} />
      <ProductColumn value={storeItemId || 'NaN'} />

      {isHeads
        ? <ProductColumn value="Actions" />
        : <ProductColumn isActionButton onClick={handleEdit} />}
    </div>
  );
};
