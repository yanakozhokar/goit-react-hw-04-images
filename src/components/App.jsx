import React, { Component } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import fetchImages from '../services/api';

class App extends Component {
  state = {
    filter: '',
    images: [],
    page: 1,
    per_page: 12,
    total: 0,
    status: 'idle',
    error: null,
    loading: false,
    modal: false,
    largeImageURL: '',
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.filter !== this.state.filter ||
      prevState.page !== this.state.page
    ) {
      this.setState({
        loading: true,
      });

      fetchImages(this.state.filter, this.state.page, this.state.per_page)
        .then(response => {
          const newImages = response.hits.map(
            ({ id, webformatURL, largeImageURL }) => ({
              id,
              webformatURL,
              largeImageURL,
            })
          );
          this.setState({
            images: [...this.state.images, ...newImages],
            total: response.totalHits,
            status: 'resolved',
          });
        })
        .catch(error => {
          this.setState({
            error,
            status: 'rejected',
          });
        })
        .finally(this.setState({ loading: false }));
    }
  }

  filterHandler = newFilter => {
    this.setState({
      filter: newFilter,
      images: [],
      page: 1,
    });
  };

  loadMoreHandler = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  openModal = largeImageURL => {
    this.setState({
      modal: true,
      largeImageURL,
    });
  };

  closeModal = () => {
    this.setState({
      modal: false,
    });
  };

  render() {
    const { status, loading, error, modal, page } = this.state;

    return (
      <>
        <Searchbar onSubmit={this.filterHandler} />
        <main>
          {page === 1 && loading && <Loader />}
          {status === 'resolved' && (
            <div>
              <ImageGallery
                images={this.state.images}
                openModal={this.openModal}
              />
              {page !== 1 && loading && <Loader />}
              {!loading &&
                this.state.page <
                  Math.ceil(this.state.total / this.state.per_page) && (
                  <Button loadMore={this.loadMoreHandler} />
                )}
            </div>
          )}
          {status === 'rejected' && !loading && (
            <p className="notFound">{error.message}</p>
          )}
          {modal && (
            <Modal
              largeImageURL={this.state.largeImageURL}
              closeModal={this.closeModal}
            />
          )}
        </main>
      </>
    );
  }
}

export default App;
