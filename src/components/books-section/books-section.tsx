import { useEffect, useState } from 'react';

import { useGetCategoriesQuery } from '../../api';
import { useGetFilteredBooksQuery } from '../../hooks';
import { hideLoader, hideToast, setSearchString, showLoader, showToast, useAppDispatch } from '../../store';
import { View } from '../../types/types';
import { BookList } from '../book-list';
import { Controls } from '../controls';
import { SearchMessage } from '../search-message';

import styles from './books-section.module.scss';

const BooksSection = () => {
  const [view, setView] = useState<View>('table');
  const onViewSelect = (newView: View) => setView(newView);
  const dispatch = useAppDispatch();
  const { data: books, error: booksError, isLoading: isBookLoading, refetch } = useGetFilteredBooksQuery();
  const { data: categories, error: categoriesError, isLoading: isCategoriesLoading } = useGetCategoriesQuery('');
  const error = booksError || categoriesError;
  const isLoading = isBookLoading || isCategoriesLoading;

  useEffect(() => {
    dispatch(hideToast());
    refetch();
  }, [dispatch, refetch]);

  useEffect(() => {
    if (isLoading) {
      dispatch(hideToast());
      dispatch(showLoader());
    } else if (books && categories) {
      dispatch(hideLoader());
    }
  }, [books, categories, dispatch, error, isLoading]);

  useEffect(() => {
    if (error) {
      dispatch(showToast());
      dispatch(hideLoader());
    }
  }, [error, dispatch]);

  useEffect(
    () => () => {
      dispatch(setSearchString({ searchString: '' }));
    },
    [dispatch]
  );

  if (!books || error) {
    return null;
  }

  return (
    <section className={styles.books}>
      <Controls selectedButton={view} onViewClick={onViewSelect} />
      {books.length ? (
        <BookList view={view} books={books} />
      ) : (
        <SearchMessage text='В этой категории книг ещё нет' testId='empty-category' />
      )}
    </section>
  );
};

export { BooksSection };
