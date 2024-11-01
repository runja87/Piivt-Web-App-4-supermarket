import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import IPage from '../../../models/IPage.model';
import { api } from '../../../api/api';
import './UserPageList.sass';
import IConfig from '../../../common/IConfig.interface';
import DevConfig from '../../../configs';

const UserPagesList: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const [pages, setPages] = useState<IPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;
  const config: IConfig = DevConfig;

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await api("get", `/api/page`);
        if (response.status === "ok") {
          setPages(response.data || []);
        } else {
          setErrorMessage("No pages found.");
        }
      } catch (error) {
        setErrorMessage("Error fetching pages.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPages();
  }, [id]);

  const totalPages = Math.ceil(pages.length / itemsPerPage);

  const currentPageData = pages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="UserPagesList">
      {isLoading ? (
        <p>Loading pages...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <>
          {currentPageData.length > 0 ? (
            <div className="page-content fade-in">
              <h3 className="page-title">{currentPageData[0].title}</h3>
              {currentPageData[0].photos.length > 0 ? (
                <img
                  className="page-image"
                  alt={currentPageData[0].photos[0]?.altText}
                  src={
                    `${config.domain.name}:${config.domain.port}/assets/` +
                    currentPageData[0].photos[0].filePath.replace(
                      currentPageData[0].photos[0].name,
                      "medium-" + currentPageData[0].photos[0].name
                    )
                  }
                />
              ) : (
                <p>No image</p>
              )}
              <article className="page-text">{currentPageData[0].content}</article>
              <p className="metadata">Published: {new Date(currentPageData[0].createdAt).toLocaleDateString()}</p>
              <p className="metadata">Modified: {new Date(currentPageData[0].modifiedAt).toLocaleDateString()}</p>
              <p className="metadata">Metadata: {currentPageData[0].altText || "No metadata available"}</p>
            </div>
          ) : (
            <p>No pages found in this category.</p>
          )}

          <div className="pagination-container">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-arrow"
            >
              &laquo;
            </button>

            <span className="current-page-number">{currentPage}</span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-arrow"
            >
              &raquo;
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserPagesList;
