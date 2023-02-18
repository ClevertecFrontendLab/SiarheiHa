import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import { useGetBooksQuery, useGetCategoriesQuery } from '../../api';
import { useAppDispatch } from '../../store';
import { showToast } from '../../store/toast-slice';
import { View } from '../../types/types';
import { BookCard } from '../book-card';

import styles from './book-list.module.scss';

interface BookListProps {
  view: View;
}

const BookList: React.FC<BookListProps> = ({ view }) => {
  const { data: books, error: booksError } = useGetBooksQuery('');
  const { data: categories, error: categoriesError } = useGetCategoriesQuery('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (booksError || categoriesError) {
      dispatch(showToast());
    }
  }, [booksError, categoriesError, dispatch]);

  const getPathByCategoryName = (name: string) => {
    if (categories) {
      return categories.find((category) => category.name === name)?.path;
    }

    return '';
  };

  const classes = classNames(styles.main, view === 'list' ? styles.list : styles.table);

  return (
    <ul className={classes}>
      {books &&
        !booksError &&
        !categoriesError &&
        books.map((book) => {
          const categoryPath = getPathByCategoryName(book.categories[0]);

          return (
            <li key={book.id}>
              <NavLink to={`/books/${categoryPath}/${book.id}`}>
                <BookCard book={book} variant={view === 'list' ? 'large' : 'small'} />
              </NavLink>
            </li>
          );
        })}
    </ul>
  );
};

export { BookList };