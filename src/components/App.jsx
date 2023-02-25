import React, { useEffect, useState } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import fetchImages from '../services/api';

const App = () => {
  const [filter, setFilter] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [largeImageURL, setLargeImageUrl] = useState('');

  useEffect(() => {
    if (!filter) {
      return;
    }
    setLoading(true);

    fetchImages(filter, page, perPage)
      .then(response => {
        const newImages = response.hits.map(
          ({ id, webformatURL, largeImageURL }) => ({
            id,
            webformatURL,
            largeImageURL,
          })
        );
        setImages(() => [...images, ...newImages]);
        setTotal(response.totalHits);
        setStatus('resolved');
      })
      .catch(error => {
        setError(error);
        setStatus('rejected');
      })
      .finally(setLoading(false));
  }, [filter, page, perPage]);

  const filterHandler = newFilter => {
    setFilter(newFilter);
    setImages([]);
    setPage(1);
  };

  const loadMoreHandler = () => {
    setPage(prevState => prevState + 1);
  };

  const openModal = largeImageURL => {
    setModal(true);
    setLargeImageUrl(largeImageURL);
  };

  const closeModal = () => {
    setModal(true);
  };

  return (
    <>
      <Searchbar onSubmit={filterHandler} />
      <main>
        {page === 1 && loading && <Loader />}
        {status === 'resolved' && (
          <div>
            <ImageGallery images={images} openModal={openModal} />
            {page !== 1 && loading && <Loader />}
            {!loading && page < Math.ceil(total / perPage) && (
              <Button loadMore={loadMoreHandler} />
            )}
          </div>
        )}
        {status === 'rejected' && !loading && (
          <p className="notFound">{error.message}</p>
        )}
        {modal && (
          <Modal largeImageURL={largeImageURL} closeModal={closeModal} />
        )}
      </main>
    </>
  );
};

export default App;
