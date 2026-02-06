// SearchBar component - reusable search input with submit
import React, { useState } from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ initialValue = '', placeholder = 'Search…', onSubmit }) => {
  const [value, setValue] = useState(initialValue);

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
    >
      <input
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
      <button className={styles.button} type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchBar;

