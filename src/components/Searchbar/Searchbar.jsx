import React, { useState } from 'react';
import { ImSearch } from 'react-icons/im';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import css from './Searchbar.module.css';

const Searchbar = ({ onSubmit }) => {
  const [filter, setFilter] = useState('');

  const inputHandler = event => {
    const { value } = event.currentTarget;
    setFilter(value);
  };

  const submitHandler = event => {
    event.preventDefault();
    if (!filter.trim()) {
      Notify.failure('Fill in the input line');
      return;
    }

    onSubmit(filter);
    reset();
  };

  const reset = () => {
    setFilter('');
  };

  return (
    <header className={css.Searchbar}>
      <form className={css.SearchForm} onSubmit={submitHandler}>
        <button type="submit" className={css.SearchFormButton}>
          <ImSearch size={20} />
          <span className={css.SearchFormButtonLabel}>Search</span>
        </button>
        <input
          className={css.SearchFormInput}
          type="text"
          name="filter"
          value={filter}
          onChange={inputHandler}
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </form>
    </header>
  );
};

export default Searchbar;
